import logging
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, EmailVerification, PasswordReset
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

        # Email tasdiqlash xati
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
