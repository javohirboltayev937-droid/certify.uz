import logging
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, EmailVerification, PasswordReset, TelegramLinkToken, OTPCode
from .sms import send_otp
from .serializers import normalize_phone
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    UserUpdateSerializer, ChangePasswordSerializer
)

logger = logging.getLogger(__name__)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class SendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        first_name = request.data.get('first_name', '').strip()
        last_name  = request.data.get('last_name', '').strip()
        phone_raw  = request.data.get('phone', '').strip()

        if not first_name:
            return Response({'error': 'Ism kiriting'}, status=400)
        if not last_name:
            return Response({'error': 'Familiya kiriting'}, status=400)
        if not phone_raw:
            return Response({'error': 'Telefon raqam kiriting'}, status=400)

        phone = normalize_phone(phone_raw)

        # Agar user allaqachon ro'yxatdan o'tgan bo'lsa
        if User.objects.filter(phone=phone).exists():
            return Response({'error': 'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan'}, status=400)

        # Eski kodlarni o'chirish
        OTPCode.objects.filter(phone=phone, is_used=False).delete()

        code = OTPCode.generate_code()
        OTPCode.objects.create(
            phone=phone, code=code,
            first_name=first_name, last_name=last_name,
        )

        sms_sent = send_otp(phone, code)

        resp = {'message': f'{phone} raqamiga SMS kod yuborildi', 'phone': phone}
        if not sms_sent:
            # SMS xizmati sozlanmagan bo'lsa kodni qaytaramiz (test rejimi)
            resp['code'] = code
            resp['note'] = 'SMS xizmati sozlanmagan — kod test uchun ko\'rsatildi'

        return Response(resp)


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone_raw = request.data.get('phone', '').strip()
        code      = request.data.get('code', '').strip()

        if not phone_raw or not code:
            return Response({'error': 'Telefon va kod kiriting'}, status=400)

        phone = normalize_phone(phone_raw)
        otp   = OTPCode.objects.filter(phone=phone, is_used=False).order_by('-created_at').first()

        if not otp:
            return Response({'error': 'Kod topilmadi. Qayta SMS yuborish tugmasini bosing'}, status=400)

        otp.attempts += 1
        otp.save(update_fields=['attempts'])

        if not otp.is_valid():
            return Response({'error': 'Kod muddati tugagan yoki urinishlar soni oshdi. Qayta yuboring'}, status=400)

        if otp.code != code:
            remaining = 5 - otp.attempts
            return Response({'error': f'Kod noto\'g\'ri. {remaining} ta urinish qoldi'}, status=400)

        otp.is_used = True
        otp.save(update_fields=['is_used'])

        # Foydalanuvchi yaratish
        import secrets
        user = User.objects.create_user(
            username=phone,
            phone=phone,
            first_name=otp.first_name,
            last_name=otp.last_name,
            password=secrets.token_hex(16),
        )

        try:
            from apps.integrations.telegram import notify_new_user
            notify_new_user(user)
        except Exception:
            pass

        tokens = get_tokens_for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens,
            'message': 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz!',
        })


class SendLoginOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone_raw = request.data.get('phone', '').strip()
        if not phone_raw:
            return Response({'error': 'Telefon raqam kiriting'}, status=400)

        phone = normalize_phone(phone_raw)

        if not User.objects.filter(phone=phone).exists():
            return Response({'error': 'Bu telefon raqam ro\'yxatdan o\'tmagan'}, status=400)

        OTPCode.objects.filter(phone=phone, is_used=False).delete()
        code = OTPCode.generate_code()
        OTPCode.objects.create(phone=phone, code=code)

        sms_sent = send_otp(phone, code)

        resp = {'message': f'{phone} raqamiga SMS kod yuborildi', 'phone': phone}
        if not sms_sent:
            resp['code'] = code
            resp['note'] = 'SMS xizmati sozlanmagan — kod test uchun ko\'rsatildi'
        return Response(resp)


class VerifyLoginOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone_raw = request.data.get('phone', '').strip()
        code      = request.data.get('code', '').strip()

        if not phone_raw or not code:
            return Response({'error': 'Telefon va kod kiriting'}, status=400)

        phone = normalize_phone(phone_raw)
        otp   = OTPCode.objects.filter(phone=phone, is_used=False).order_by('-created_at').first()

        if not otp:
            return Response({'error': 'Kod topilmadi. Qayta SMS yuborish tugmasini bosing'}, status=400)

        otp.attempts += 1
        otp.save(update_fields=['attempts'])

        if not otp.is_valid():
            return Response({'error': 'Kod muddati tugagan. Qayta yuboring'}, status=400)

        if otp.code != code:
            remaining = 5 - otp.attempts
            return Response({'error': f'Kod noto\'g\'ri. {remaining} ta urinish qoldi'}, status=400)

        otp.is_used = True
        otp.save(update_fields=['is_used'])

        user = User.objects.filter(phone=phone).first()
        if not user:
            return Response({'error': 'Foydalanuvchi topilmadi'}, status=400)

        tokens = get_tokens_for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens,
            'message': 'Muvaffaqiyatli kirdingiz!',
        })


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)

        # Yangi foydalanuvchi Telegram bildirishnomasi
        try:
            from apps.integrations.telegram import notify_new_user
            notify_new_user(user)
        except Exception:
            pass

        # Email tasdiqlash xati (faqat email kiritilgan bo'lsa)
        if user.email:
            try:
                _send_verification_email(user)
            except Exception:
                pass

        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens,
            'message': 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz!',
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens,
            'message': 'Muvaffaqiyatli kirildi!',
        })


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Muvaffaqiyatli chiqildi'})
        except Exception:
            return Response({'error': 'Noto\'g\'ri token'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserSerializer

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


class ChangePasswordView(APIView):
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({'message': 'Parol muvaffaqiyatli o\'zgartirildi'})


class UserStatsView(APIView):
    def get(self, request):
        from apps.progress.models import TestAttempt
        from django.db.models import Avg
        user = request.user
        attempts = TestAttempt.objects.filter(user=user)
        total_tests = attempts.count()
        completed_tests = attempts.filter(status='completed').count()
        avg_score = attempts.filter(status='completed').aggregate(avg=Avg('percentage'))['avg'] or 0

        return Response({
            'total_tests': total_tests,
            'completed_tests': completed_tests,
            'avg_score': round(avg_score, 1),
            'is_premium': user.is_premium,
            'premium_until': user.premium_until,
        })


# ─── Telegram bog'lash ─────────────────────────────────────────────────────────

class TelegramLinkTokenView(APIView):
    """Joriy foydalanuvchi uchun bir martalik deep-link token yaratadi.

    Frontend natijadagi `deep_link` ni yangi oynada ochadi -> foydalanuvchi
    botda /start <token> ni yuboradi -> akkaunt avtomatik ulanadi.
    """

    def post(self, request):
        user = request.user

        if user.telegram_id:
            return Response({
                'already_linked': True,
                'telegram_username': user.telegram_username,
                'message': 'Telegram allaqachon ulangan',
            })

        # Eski foydalanilmagan tokenlarni tozalaymiz
        TelegramLinkToken.objects.filter(user=user, is_used=False).delete()

        token = get_random_string(40)
        TelegramLinkToken.objects.create(
            user=user,
            token=token,
            expires_at=timezone.now() + timezone.timedelta(minutes=10),
        )

        bot_username = settings.TELEGRAM_BOT_USERNAME
        deep_link = f"https://t.me/{bot_username}?start={token}" if bot_username else ''

        return Response({
            'token': token,
            'deep_link': deep_link,
            'bot_username': bot_username,
            'expires_in': 600,
        }, status=status.HTTP_201_CREATED)


class TelegramUnlinkView(APIView):
    """Telegram akkauntini uzish."""

    def post(self, request):
        user = request.user
        user.telegram_id = None
        user.telegram_username = ''
        user.save(update_fields=['telegram_id', 'telegram_username'])
        return Response({'message': 'Telegram uzildi', 'telegram_linked': False})


# ─── Email tasdiqlash ──────────────────────────────────────────────────────────

def _send_verification_email(user):
    token = get_random_string(64)
    EmailVerification.objects.create(user=user, token=token)
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    send_mail(
        subject='Certify.uz - Email manzilini tasdiqlang',
        message=(
            f"Salom {user.get_full_name() or user.username}!\n\n"
            f"Quyidagi havolani bosib email manzilingizni tasdiqlang:\n"
            f"{verify_url}\n\n"
            f"Havola 24 soat amal qiladi.\n\n"
            f"Certify.uz jamoasi"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=True,
    )


class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token kiritilmadi'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            verification = EmailVerification.objects.get(
                token=token, is_used=False
            )
        except EmailVerification.DoesNotExist:
            return Response({'error': 'Noto\'g\'ri yoki eskirgan token'}, status=status.HTTP_400_BAD_REQUEST)

        # 24 soatdan oshib ketganini tekshirish
        if (timezone.now() - verification.created_at).total_seconds() > 86400:
            return Response({'error': 'Token eskirgan'}, status=status.HTTP_400_BAD_REQUEST)

        verification.is_used = True
        verification.save(update_fields=['is_used'])
        verification.user.email_verified = True
        verification.user.save(update_fields=['email_verified'])

        return Response({'message': 'Email muvaffaqiyatli tasdiqlandi!'})


class ResendVerificationView(APIView):
    def post(self, request):
        if request.user.email_verified:
            return Response({'message': 'Email allaqachon tasdiqlangan'})
        try:
            _send_verification_email(request.user)
        except Exception as e:
            logger.error(f'Email yuborishda xatolik: {e}')
            return Response({'error': 'Email yuborishda xatolik'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response({'message': 'Tasdiqlash xati yuborildi'})


# ─── Parol tiklash ────────────────────────────────────────────────────────────

class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({'error': 'Email kiriting'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            # Xavfsizlik uchun har doim muvaffaqiyat qaytaramiz
            return Response({'message': 'Agar email mavjud bo\'lsa, ko\'rsatma yuborildi'})

        token = get_random_string(64)
        PasswordReset.objects.create(user=user, token=token)
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"

        send_mail(
            subject='Certify.uz - Parolni tiklash',
            message=(
                f"Salom {user.get_full_name() or user.username}!\n\n"
                f"Parolingizni tiklash uchun quyidagi havolani bosing:\n"
                f"{reset_url}\n\n"
                f"Havola 1 soat amal qiladi.\n"
                f"Agar siz so'rov bermagan bo'lsangiz, ushbu xatni e'tiborsiz qoldiring.\n\n"
                f"Certify.uz jamoasi"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )

        return Response({'message': 'Agar email mavjud bo\'lsa, ko\'rsatma yuborildi'})


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('password')

        if not token or not new_password:
            return Response({'error': 'Token va yangi parol kiriting'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({'error': 'Parol kamida 8 ta belgi bo\'lishi kerak'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reset = PasswordReset.objects.get(token=token, is_used=False)
        except PasswordReset.DoesNotExist:
            return Response({'error': 'Noto\'g\'ri yoki eskirgan token'}, status=status.HTTP_400_BAD_REQUEST)

        if (timezone.now() - reset.created_at).total_seconds() > 3600:
            return Response({'error': 'Token eskirgan (1 soat)'}, status=status.HTTP_400_BAD_REQUEST)

        reset.user.set_password(new_password)
        reset.user.save()
        reset.is_used = True
        reset.save(update_fields=['is_used'])

        return Response({'message': 'Parol muvaffaqiyatli tiklandi!'})
