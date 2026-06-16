import json
import logging
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .bot import handle_update
from .telegram import send_message

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class TelegramWebhookView(APIView):
    """
    Telegram bot webhook qabul nuqtasi.
    POST /api/telegram/webhook/

    Telegram setWebhook da o'rnatilgan secret_token
    har bir so'rovda X-Telegram-Bot-Api-Secret-Token sarlavhasida keladi.
    """
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        secret = getattr(settings, 'TELEGRAM_WEBHOOK_SECRET', '')
        if secret:
            received = request.META.get('HTTP_X_TELEGRAM_BOT_API_SECRET_TOKEN', '')
            if received != secret:
                logger.warning('Telegram webhook: noto\'g\'ri secret token')
                return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            update = request.data if isinstance(request.data, dict) else json.loads(request.body)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        handle_update(update)
        # Telegram faqat 200 OK kutadi
        return Response({'ok': True})


class SendCertificateView(APIView):
    """
    CEFR Mock test yakunida soxta sertifikat Telegram'ga yuborish.
    POST /api/telegram/send-certificate/
    Body: { level, score, correct, total }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        if not user.telegram_id:
            return Response(
                {'error': 'Telegram boglanmagan. Avval botdan /start yuboring.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        level   = request.data.get('level', '?')
        score   = request.data.get('score', 0)
        correct = request.data.get('correct', 0)
        total   = request.data.get('total', 40)
        name    = user.get_full_name() or user.username

        LEVEL_EMOJIS = {
            'A1':'🌱', 'A2':'📗', 'B1':'📘', 'B2':'📙', 'C1':'📕', 'C2':'👑'
        }
        emoji = LEVEL_EMOJIS.get(level, '🎓')

        cert_text = (
            f"🏆 <b>CERTIFY.UZ — CEFR Sertifikati</b>\n"
            f"{'═' * 30}\n\n"
            f"Hurmatli <b>{name}</b>,\n\n"
            f"Siz CEFR Mock Test'ini muvaffaqiyatli yakunladingiz!\n\n"
            f"{emoji} <b>Darajangiz: {level}</b>\n"
            f"📊 Ball: <b>{score}%</b>  ({correct}/{total} to'g'ri)\n\n"
            f"📋 <b>Sertifikat tafsilotlari</b>\n"
            f"• Test: CEFR International Mock Exam\n"
            f"• Bo'limlar: Listening · Reading · Writing · Speaking\n"
            f"• Natija: <b>{level} — {_level_name(level)}</b>\n\n"
            f"🌐 certify.uz platformasida to'liq sertifikat oling!\n"
            f"\n<i>Bu sertifikat Certify.uz tomonidan berilgan tayyorgarlik testi natijasidir.</i>\n\n"
            f"🎓 <i>Certify.uz</i>"
        )

        res = send_message(user.telegram_id, cert_text)
        if res.get('ok'):
            return Response({'ok': True, 'message': "Sertifikat yuborildi!"})
        return Response({'error': 'Telegram ga yuborishda xatolik'}, status=status.HTTP_502_BAD_GATEWAY)


def _level_name(level):
    return {
        'A1': 'Beginner', 'A2': 'Elementary',
        'B1': 'Intermediate', 'B2': 'Upper Intermediate',
        'C1': 'Advanced', 'C2': 'Proficiency',
    }.get(level, level)
