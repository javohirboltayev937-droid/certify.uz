"""
Telegram webhook ni o'rnatish/o'chirish.

Ishlatish:
  # Webhook o'rnatish (public HTTPS URL kerak — prod yoki ngrok):
  python manage.py set_telegram_webhook --url https://certify.uz

  # To'liq URL ko'rsatish:
  python manage.py set_telegram_webhook --url https://abc123.ngrok.io/api/telegram/webhook/

  # Webhook ni o'chirish (lokal polling ga o'tish uchun):
  python manage.py set_telegram_webhook --delete
"""
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from apps.integrations.telegram import set_webhook, delete_webhook, tg_call


class Command(BaseCommand):
    help = "Telegram bot webhook ni o'rnatish yoki o'chirish"

    def add_arguments(self, parser):
        parser.add_argument('--url', type=str, default='',
                            help='Sayt bazaviy URL yoki to\'liq webhook URL')
        parser.add_argument('--delete', action='store_true', help='Webhook ni o\'chirish')

    def handle(self, *args, **opts):
        if not settings.TELEGRAM_BOT_TOKEN:
            raise CommandError('TELEGRAM_BOT_TOKEN .env da sozlanmagan')

        if opts['delete']:
            res = delete_webhook()
            self.stdout.write(self.style.SUCCESS(f'deleteWebhook: {res}'))
            return

        url = opts['url'] or settings.FRONTEND_URL
        if not url:
            raise CommandError('--url ko\'rsating (yoki .env da FRONTEND_URL)')

        # Agar to'liq webhook yo'li berilmagan bo'lsa, qo'shamiz
        if '/api/telegram/webhook' not in url:
            url = url.rstrip('/') + '/api/telegram/webhook/'

        if not url.startswith('https://'):
            self.stdout.write(self.style.WARNING(
                'Diqqat: Telegram webhook faqat HTTPS bilan ishlaydi.'
            ))

        secret = getattr(settings, 'TELEGRAM_WEBHOOK_SECRET', '')
        res = set_webhook(url, secret_token=secret)
        if res.get('ok'):
            self.stdout.write(self.style.SUCCESS(f'Webhook o\'rnatildi: {url}'))
        else:
            self.stdout.write(self.style.ERROR(f'Xatolik: {res}'))

        info = tg_call('getWebhookInfo')
        self.stdout.write(f'getWebhookInfo: {info.get("result", info)}')
