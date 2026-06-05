import json
import logging
import random
from decimal import Decimal
from django.conf import settings
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import SubscriptionPlan, Subscription, Payment, PaymeTransaction, ClickTransaction, OTPCode
from .serializers import (
    SubscriptionPlanSerializer, SubscriptionSerializer,
    PaymentSerializer, CreateSubscriptionSerializer
)
from .payme import (
    check_payme_auth, payme_amount_to_uzs, uzs_to_payme_amount,
    get_payme_checkout_url, PAYME_ERRORS,
    PAYME_STATE_CREATED, PAYME_STATE_COMPLETED,
    PAYME_STATE_CANCELLED, PAYME_STATE_CANCELLED_AFTER_COMPLETE,
)
from .click import verify_click_sign, get_click_checkout_url

logger = logging.getLogger(__name__)


# ─── Obuna rejalari ────────────────────────────────────────────────────────────

class SubscriptionPlanListView(generics.ListAPIView):
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return SubscriptionPlan.objects.filter(is_active=True).order_by('duration_days')


# ─── Obuna yaratish ────────────────────────────────────────────────────────────

class CreateSubscriptionView(APIView):
    def post(self, request):
        serializer = CreateSubscriptionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            plan = SubscriptionPlan.objects.get(
                id=serializer.validated_data['plan_id'], is_active=True
            )
        except SubscriptionPlan.DoesNotExist:
            return Response({'error': 'Reja topilmadi'}, status=status.HTTP_404_NOT_FOUND)

        subscription = Subscription.objects.create(
            user=request.user, plan=plan, status='pending'
        )
        payment = Payment.objects.create(
            user=request.user,
            subscription=subscription,
            amount=plan.price_uzs,
            payment_method=serializer.validated_data['payment_method'],
            status='pending',
        )

        method = serializer.validated_data['payment_method']

        if method == 'payme':
            checkout_url = get_payme_checkout_url(payment.id, plan.price_uzs)
            return Response({
                'payment_id': payment.id,
                'checkout_url': checkout_url,
                'method': 'payme',
                'amount': str(plan.price_uzs),
            }, status=status.HTTP_201_CREATED)

        elif method == 'click':
            checkout_url = get_click_checkout_url(payment.id, plan.price_uzs)
            return Response({
                'payment_id': payment.id,
                'checkout_url': checkout_url,
                'method': 'click',
                'amount': str(plan.price_uzs),
            }, status=status.HTTP_201_CREATED)

        # Demo rejim (uzcard, humo yoki cash)
        payment.complete()
        self._send_notifications(payment, request.user, subscription, plan)
        return Response({
            'message': 'Obuna muvaffaqiyatli faollashtirildi!',
            'subscription': SubscriptionSerializer(subscription).data,
        }, status=status.HTTP_201_CREATED)

    @staticmethod
    def _send_notifications(payment, user, subscription, plan):
        try:
            from apps.integrations.telegram import notify_payment_success
            notify_payment_success(payment, user, subscription)
        except Exception:
            pass

        try:
            if user.phone:
                from apps.integrations.sms import send_payment_success
                end_str = subscription.end_date.strftime('%d.%m.%Y')
                send_payment_success(user.phone, plan.name, end_str)
        except Exception:
            pass


# ─── Payme Merchant API ────────────────────────────────────────────────────────

@method_decorator(csrf_exempt, name='dispatch')
class PaymeWebhookView(APIView):
    """
    Payme Merchant API - JSON-RPC 2.0
    POST /api/payments/payme/
    Basic Auth: merchant_id:key (base64)
    """
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        auth = request.META.get('HTTP_AUTHORIZATION', '')
        if not check_payme_auth(auth):
            return Response(
                self._error(-32504, 'Insufficient privilege to perform this method', request_id=None),
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            body = request.data if isinstance(request.data, dict) else json.loads(request.body)
        except Exception:
            return Response(self._error(-32700, 'Parse error', None))

        method = body.get('method', '')
        params = body.get('params', {})
        rpc_id = body.get('id')

        handler = getattr(self, f'_handle_{method}', None)
        if not handler:
            return Response(self._error(-32601, 'Method not found', rpc_id))

        try:
            result = handler(params, rpc_id)
            return Response(result)
        except Exception as e:
            logger.exception(f'Payme {method} xatolik: {e}')
            return Response(self._error(-32400, 'System error', rpc_id))

    # ── CheckPerformTransaction ──────────────────────────────────────────────
    def _handle_CheckPerformTransaction(self, params, rpc_id):
        payment = self._get_payment(params)
        if payment is None:
            return self._error(**PAYME_ERRORS['ORDER_NOT_FOUND'], id=rpc_id)

        amount = payme_amount_to_uzs(params['amount'])
        if abs(amount - payment.amount) > 1:
            return self._error(**PAYME_ERRORS['WRONG_AMOUNT'], id=rpc_id)

        return {'result': {'allow': True}, 'id': rpc_id}

    # ── CreateTransaction ────────────────────────────────────────────────────
    def _handle_CreateTransaction(self, params, rpc_id):
        payme_id = params['id']
        payment = self._get_payment(params)
        if payment is None:
            return self._error(**PAYME_ERRORS['ORDER_NOT_FOUND'], id=rpc_id)

        amount = payme_amount_to_uzs(params['amount'])
        if abs(amount - payment.amount) > 1:
            return self._error(**PAYME_ERRORS['WRONG_AMOUNT'], id=rpc_id)

        now_ms = int(timezone.now().timestamp() * 1000)

        # Mavjud tranzaksiya bor-yo'qligini tekshirish
        existing = PaymeTransaction.objects.filter(payme_id=payme_id).first()
        if existing:
            if existing.state != PAYME_STATE_CREATED:
                return self._error(**PAYME_ERRORS['CANNOT_PERFORM'], id=rpc_id)
            return {
                'result': {
                    'create_time': existing.created_time,
                    'transaction': str(existing.payment_id),
                    'state': existing.state,
                },
                'id': rpc_id,
            }

        # Yangi tranzaksiya yaratish
        ptxn = PaymeTransaction.objects.create(
            payment=payment,
            payme_id=payme_id,
            state=PAYME_STATE_CREATED,
            amount=params['amount'],
            created_time=params.get('time', now_ms),
        )
        payment.status = 'processing'
        payment.provider_transaction_id = payme_id
        payment.save(update_fields=['status', 'provider_transaction_id'])

        return {
            'result': {
                'create_time': ptxn.created_time,
                'transaction': str(payment.id),
                'state': PAYME_STATE_CREATED,
            },
            'id': rpc_id,
        }

    # ── PerformTransaction ───────────────────────────────────────────────────
    def _handle_PerformTransaction(self, params, rpc_id):
        payme_id = params['id']
        try:
            ptxn = PaymeTransaction.objects.select_related('payment__subscription__plan').get(payme_id=payme_id)
        except PaymeTransaction.DoesNotExist:
            return self._error(**PAYME_ERRORS['TRANSACTION_NOT_FOUND'], id=rpc_id)

        if ptxn.state == PAYME_STATE_COMPLETED:
            return {
                'result': {
                    'transaction': str(ptxn.payment_id),
                    'perform_time': ptxn.perform_time,
                    'state': PAYME_STATE_COMPLETED,
                },
                'id': rpc_id,
            }

        if ptxn.state != PAYME_STATE_CREATED:
            return self._error(**PAYME_ERRORS['CANNOT_PERFORM'], id=rpc_id)

        now_ms = int(timezone.now().timestamp() * 1000)
        ptxn.state = PAYME_STATE_COMPLETED
        ptxn.perform_time = now_ms
        ptxn.save(update_fields=['state', 'perform_time'])

        ptxn.payment.complete()

        try:
            from apps.integrations.telegram import notify_payment_success
            notify_payment_success(ptxn.payment, ptxn.payment.user, ptxn.payment.subscription)
        except Exception:
            pass

        logger.info(f'Payme to\'lov tasdiqlandi: payment_id={ptxn.payment_id}')

        return {
            'result': {
                'transaction': str(ptxn.payment_id),
                'perform_time': now_ms,
                'state': PAYME_STATE_COMPLETED,
            },
            'id': rpc_id,
        }

    # ── CancelTransaction ────────────────────────────────────────────────────
    def _handle_CancelTransaction(self, params, rpc_id):
        payme_id = params['id']
        reason = params.get('reason', 10)

        try:
            ptxn = PaymeTransaction.objects.select_related('payment').get(payme_id=payme_id)
        except PaymeTransaction.DoesNotExist:
            return self._error(**PAYME_ERRORS['TRANSACTION_NOT_FOUND'], id=rpc_id)

        if ptxn.state == PAYME_STATE_COMPLETED:
            new_state = PAYME_STATE_CANCELLED_AFTER_COMPLETE
        elif ptxn.state == PAYME_STATE_CREATED:
            new_state = PAYME_STATE_CANCELLED
        else:
            return {
                'result': {
                    'transaction': str(ptxn.payment_id),
                    'cancel_time': ptxn.cancel_time,
                    'state': ptxn.state,
                },
                'id': rpc_id,
            }

        now_ms = int(timezone.now().timestamp() * 1000)
        ptxn.state = new_state
        ptxn.cancel_time = now_ms
        ptxn.reason = reason
        ptxn.save(update_fields=['state', 'cancel_time', 'reason'])

        ptxn.payment.status = 'cancelled'
        ptxn.payment.save(update_fields=['status'])

        return {
            'result': {
                'transaction': str(ptxn.payment_id),
                'cancel_time': now_ms,
                'state': new_state,
            },
            'id': rpc_id,
        }

    # ── CheckTransaction ─────────────────────────────────────────────────────
    def _handle_CheckTransaction(self, params, rpc_id):
        payme_id = params['id']
        try:
            ptxn = PaymeTransaction.objects.get(payme_id=payme_id)
        except PaymeTransaction.DoesNotExist:
            return self._error(**PAYME_ERRORS['TRANSACTION_NOT_FOUND'], id=rpc_id)

        return {
            'result': {
                'create_time': ptxn.created_time,
                'perform_time': ptxn.perform_time or 0,
                'cancel_time': ptxn.cancel_time or 0,
                'transaction': str(ptxn.payment_id),
                'state': ptxn.state,
                'reason': ptxn.reason,
            },
            'id': rpc_id,
        }

    # ── GetStatement ─────────────────────────────────────────────────────────
    def _handle_GetStatement(self, params, rpc_id):
        from_time = params.get('from', 0)
        to_time = params.get('to', int(timezone.now().timestamp() * 1000))

        txns = PaymeTransaction.objects.filter(
            created_time__gte=from_time,
            created_time__lte=to_time,
            state=PAYME_STATE_COMPLETED,
        ).select_related('payment')

        transactions = []
        for t in txns:
            transactions.append({
                'id': t.payme_id,
                'time': t.created_time,
                'amount': t.amount,
                'account': {'order': str(t.payment_id)},
                'create_time': t.created_time,
                'perform_time': t.perform_time or 0,
                'cancel_time': t.cancel_time or 0,
                'transaction': str(t.payment_id),
                'state': t.state,
                'reason': t.reason,
            })

        return {'result': {'transactions': transactions}, 'id': rpc_id}

    # ── Yordamchi funksiyalar ────────────────────────────────────────────────
    @staticmethod
    def _get_payment(params):
        account = params.get('account', {})
        payment_id = account.get('order')
        try:
            return Payment.objects.select_related('subscription__plan', 'user').get(id=payment_id)
        except (Payment.DoesNotExist, ValueError, TypeError):
            return None

    @staticmethod
    def _error(code, message, id=None, **kwargs):
        if isinstance(message, dict):
            msg = message
        else:
            msg = {'uz': message, 'ru': message, 'en': message}
        return {'error': {'code': code, 'message': msg}, 'id': id}


# ─── Click Merchant API ────────────────────────────────────────────────────────

@method_decorator(csrf_exempt, name='dispatch')
class ClickPrepareView(APIView):
    """
    Click Prepare endpoint (action=0)
    POST /api/payments/click/prepare/
    """
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        data = request.data
        click_trans_id = str(data.get('click_trans_id', ''))
        service_id = str(data.get('service_id', ''))
        merchant_trans_id = str(data.get('merchant_trans_id', ''))
        amount = str(data.get('amount', ''))
        action = str(data.get('action', '0'))
        sign_time = str(data.get('sign_time', ''))
        sign_string_received = str(data.get('sign_string', ''))

        expected_sign = verify_click_sign(
            click_trans_id, service_id, settings.CLICK_SECRET_KEY,
            merchant_trans_id, amount, action, sign_time,
        )
        if expected_sign != sign_string_received:
            return Response({'error': -1, 'error_note': 'SIGN CHECK FAILED'})

        try:
            payment = Payment.objects.select_related('subscription__plan').get(
                id=merchant_trans_id
            )
        except (Payment.DoesNotExist, ValueError):
            return Response({'error': -5, 'error_note': 'User does not exist'})

        if abs(Decimal(amount) - payment.amount) > 1:
            return Response({'error': -2, 'error_note': 'Incorrect parameter amount'})

        if payment.status == 'completed':
            return Response({'error': -4, 'error_note': 'Already paid'})

        if payment.status not in ('pending', 'processing'):
            return Response({'error': -9, 'error_note': 'Transaction cancelled'})

        ClickTransaction.objects.create(
            payment=payment,
            click_trans_id=click_trans_id,
            service_id=service_id,
            amount=Decimal(amount),
            action=0,
            sign_time=sign_time,
            sign_string=sign_string_received,
        )

        payment.status = 'processing'
        payment.provider_transaction_id = click_trans_id
        payment.save(update_fields=['status', 'provider_transaction_id'])

        return Response({
            'click_trans_id': int(click_trans_id),
            'merchant_trans_id': merchant_trans_id,
            'merchant_prepare_id': payment.id,
            'error': 0,
            'error_note': 'Success',
        })


@method_decorator(csrf_exempt, name='dispatch')
class ClickCompleteView(APIView):
    """
    Click Complete endpoint (action=1)
    POST /api/payments/click/complete/
    """
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        data = request.data
        click_trans_id = str(data.get('click_trans_id', ''))
        service_id = str(data.get('service_id', ''))
        merchant_trans_id = str(data.get('merchant_trans_id', ''))
        merchant_prepare_id = str(data.get('merchant_prepare_id', ''))
        amount = str(data.get('amount', ''))
        action = str(data.get('action', '1'))
        error = int(data.get('error', 0))
        sign_time = str(data.get('sign_time', ''))
        sign_string_received = str(data.get('sign_string', ''))

        expected_sign = verify_click_sign(
            click_trans_id, service_id, settings.CLICK_SECRET_KEY,
            merchant_trans_id, amount, action, sign_time,
        )
        if expected_sign != sign_string_received:
            return Response({'error': -1, 'error_note': 'SIGN CHECK FAILED'})

        try:
            payment = Payment.objects.select_related(
                'subscription__plan', 'user'
            ).get(id=merchant_trans_id)
        except (Payment.DoesNotExist, ValueError):
            return Response({'error': -6, 'error_note': 'Transaction does not exist'})

        if payment.status == 'completed':
            return Response({'error': -4, 'error_note': 'Already paid'})

        if error < 0:
            payment.status = 'failed'
            payment.save(update_fields=['status'])
            return Response({'error': error, 'error_note': 'Transaction cancelled by user'})

        ClickTransaction.objects.create(
            payment=payment,
            click_trans_id=click_trans_id,
            service_id=service_id,
            click_paydoc_id=str(data.get('click_paydoc_id', '')),
            amount=Decimal(amount),
            action=1,
            error_code=error,
            sign_time=sign_time,
            sign_string=sign_string_received,
        )

        payment.complete()

        try:
            from apps.integrations.telegram import notify_payment_success
            notify_payment_success(payment, payment.user, payment.subscription)
        except Exception:
            pass

        try:
            if payment.user.phone:
                from apps.integrations.sms import send_payment_success
                end_str = payment.subscription.end_date.strftime('%d.%m.%Y')
                send_payment_success(payment.user.phone, payment.subscription.plan.name, end_str)
        except Exception:
            pass

        logger.info(f'Click to\'lov tasdiqlandi: payment_id={payment.id}')

        return Response({
            'click_trans_id': int(click_trans_id),
            'merchant_trans_id': merchant_trans_id,
            'merchant_confirm_id': payment.id,
            'error': 0,
            'error_note': 'Success',
        })


# ─── OTP (SMS tasdiqlash) ──────────────────────────────────────────────────────

class SendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get('phone', '').strip()
        if not phone:
            return Response({'error': 'Telefon raqam kiriting'}, status=status.HTTP_400_BAD_REQUEST)

        # Normalizatsiya
        phone = phone.replace(' ', '').replace('-', '')
        if not phone.startswith('+'):
            phone = '+' + phone

        # 1 daqiqada bir marta cheklash
        recent = OTPCode.objects.filter(
            phone=phone,
            created_at__gte=timezone.now() - timezone.timedelta(minutes=1),
        ).exists()
        if recent:
            return Response(
                {'error': 'Iltimos, 1 daqiqa kuting'},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        code = str(random.randint(100000, 999999))
        OTPCode.objects.create(
            phone=phone,
            code=code,
            expires_at=timezone.now() + timezone.timedelta(minutes=5),
        )

        from apps.integrations.sms import send_otp
        result = send_otp(phone, code)

        if not result['success']:
            logger.error(f'OTP yuborishda xatolik: {phone} — {result.get("error")}')
            return Response({'error': 'SMS yuborishda xatolik'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response({'message': 'SMS yuborildi', 'phone': phone})


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get('phone', '').strip()
        code = request.data.get('code', '').strip()

        if not phone or not code:
            return Response({'error': 'Telefon va kod kiriting'}, status=status.HTTP_400_BAD_REQUEST)

        otp = OTPCode.objects.filter(
            phone=phone, is_used=False
        ).order_by('-created_at').first()

        if not otp:
            return Response({'error': 'OTP topilmadi'}, status=status.HTTP_400_BAD_REQUEST)

        otp.attempts += 1
        otp.save(update_fields=['attempts'])

        if not otp.is_valid:
            return Response({'error': 'Kod eskirgan yoki urinishlar soni tugadi'}, status=status.HTTP_400_BAD_REQUEST)

        if otp.code != code:
            return Response({'error': 'Noto\'g\'ri kod'}, status=status.HTTP_400_BAD_REQUEST)

        otp.is_used = True
        otp.save(update_fields=['is_used'])

        # Agar foydalanuvchi login bo'lgan bo'lsa, telefonni tasdiqlash
        if request.user.is_authenticated:
            request.user.phone = phone
            request.user.save(update_fields=['phone'])

        return Response({'message': 'Telefon tasdiqlandi', 'verified': True})


# ─── Boshqa ────────────────────────────────────────────────────────────────────

class MySubscriptionView(APIView):
    def get(self, request):
        subscription = Subscription.objects.filter(
            user=request.user, status='active'
        ).select_related('plan').first()

        if not subscription:
            return Response({'subscription': None, 'is_premium': False})

        return Response({
            'subscription': SubscriptionSerializer(subscription).data,
            'is_premium': True,
        })


class PaymentHistoryView(generics.ListAPIView):
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user).order_by('-created_at')


class PaymentStatusView(APIView):
    """To'lov holatini tekshirish (frontend polling uchun)"""

    def get(self, request, payment_id):
        try:
            payment = Payment.objects.get(id=payment_id, user=request.user)
        except Payment.DoesNotExist:
            return Response({'error': 'Topilmadi'}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'id': payment.id,
            'status': payment.status,
            'amount': str(payment.amount),
            'method': payment.payment_method,
            'is_completed': payment.status == 'completed',
        })
