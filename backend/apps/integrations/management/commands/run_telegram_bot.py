"""
Telegram botni long polling rejimida ishga tushirish.
Railway worker yoki lokal ishlab chiqish uchun.

Ishlatish:
  python manage.py run_telegram_bot
"""
import time
import logging
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Telegram botni long polling rejimida ishga tushirish"

    def add_arguments(self, parser):
        parser.add_argument('--no-delete-webhook', action='store_true',
                            help='Webhookni o\'chirmay polling boshlash')

    def handle(self, *args, **opts):
        if not settings.TELEGRAM_BOT_TOKEN:
            raise CommandError('TELEGRAM_BOT_TOKEN .env da sozlanmagan')

        from apps.integrations.telegram import tg_call

        if not opts.get('no_delete_webhook'):
            res = tg_call('deleteWebhook', drop_pending_updates=False)
            if res.get('ok'):
                self.stdout.write(self.style.SUCCESS('Webhook o\'chirildi.'))

        self.stdout.write(self.style.SUCCESS(
            f'Bot polling rejimida ishga tushdi. '
            f'(@{settings.TELEGRAM_BOT_USERNAME or "bot"})\n'
            f'To\'xtatish: Ctrl+C'
        ))

        from apps.integrations.bot import handle_update

        offset = None
        while True:
            try:
                params = {
                    'timeout': 30,
                    'allowed_updates': ['message', 'callback_query'],
                }
                if offset is not None:
                    params['offset'] = offset

                resp = tg_call('getUpdates', _http_timeout=40, **params)
                updates = resp.get('result', [])

                for update in updates:
                    offset = update['update_id'] + 1
                    try:
                        handle_update(update)
                    except Exception as e:
                        logger.error(f'Update xatolik (id={update.get("update_id")}): {e}')

            except KeyboardInterrupt:
                self.stdout.write('\nBot to\'xtatildi.')
                break
            except Exception as e:
                logger.error(f'Polling xatolik: {e}')
                time.sleep(5)
