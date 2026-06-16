"""
Telegram Bot API — past darajali funksiyalar.
Admin bildirishnomalari va foydalanuvchi xabarlari.
"""
import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

TELEGRAM_API = 'https://api.telegram.org/bot{token}/{method}'

# Barcha admin xabarlarining tagi
CERTIFY_TAG = '\n\n🎓 <i>Certify.uz</i>'


def _token():
    return settings.TELEGRAM_BOT_TOKEN or ''


def _admin_chat():
    return settings.TELEGRAM_ADMIN_CHAT_ID or ''


def tg_call(method: str, token: str = '', _http_timeout: int = 15, **payload) -> dict:
    t = token or _token()
    if not t:
        return {}
    try:
        resp = requests.post(
            TELEGRAM_API.format(token=t, method=method),
            json=payload,
            timeout=_http_timeout,
        )
        data = resp.json()
        if not data.get('ok'):
            logger.error(f'tg_call {method} xato: {data}')
        return data
    except Exception as e:
        logger.error(f'tg_call {method} exception: {e}')
        return {}


# ─── Asosiy funksiyalar ───────────────────────────────────────────────────────

def send_message(chat_id, text: str, reply_markup=None, parse_mode='HTML') -> dict:
    payload = dict(chat_id=chat_id, text=text, parse_mode=parse_mode,
                   disable_web_page_preview=True)
    if reply_markup:
        payload['reply_markup'] = reply_markup
    return tg_call('sendMessage', **payload)


def send_photo(chat_id, photo, caption: str = '', reply_markup=None, parse_mode='HTML') -> dict:
    payload = dict(chat_id=chat_id, photo=photo, caption=caption, parse_mode=parse_mode)
    if reply_markup:
        payload['reply_markup'] = reply_markup
    return tg_call('sendPhoto', **payload)


def edit_message(chat_id, message_id, text: str, reply_markup=None, parse_mode='HTML') -> dict:
    payload = dict(chat_id=chat_id, message_id=message_id, text=text,
                   parse_mode=parse_mode, disable_web_page_preview=True)
    if reply_markup:
        payload['reply_markup'] = reply_markup
    return tg_call('editMessageText', **payload)


def answer_callback(callback_query_id, text: str = '', show_alert: bool = False) -> dict:
    return tg_call('answerCallbackQuery',
                   callback_query_id=callback_query_id, text=text, show_alert=show_alert)


def delete_message(chat_id, message_id) -> dict:
    return tg_call('deleteMessage', chat_id=chat_id, message_id=message_id)


# ─── Admin bildirishnomalari ──────────────────────────────────────────────────

def send_admin_alert(text: str) -> bool:
    admin = _admin_chat()
    if not admin:
        return False
    res = send_message(admin, text + CERTIFY_TAG)
    return bool(res.get('ok'))


def send_admin_photo(photo_file_id: str, caption: str, reply_markup=None) -> dict:
    admin = _admin_chat()
    if not admin:
        return {}
    return send_photo(admin, photo_file_id, caption + CERTIFY_TAG, reply_markup)


def notify_new_user(user) -> None:
    """Yangi foydalanuvchi ro'yxatdan o'tganda admin ga xabar."""
    from apps.accounts.models import User
    total = User.objects.count()
    text = (
        f"🆕 <b>Yangi foydalanuvchi!</b>\n\n"
        f"👤 {user.get_full_name() or user.username}\n"
        f"📱 {user.phone or '—'}\n"
        f"📧 {user.email or '—'}\n\n"
        f"📊 Jami foydalanuvchilar: <b>{total}</b>"
    )
    send_admin_alert(text)


def notify_new_receipt(receipt, user, plan) -> dict:
    """Admin ga yangi to'lov cheki (rasm bilan)."""
    from django.utils import timezone
    caption = (
        f"📸 <b>Yangi to'lov cheki #{receipt.id}</b>\n\n"
        f"👤 {user.get_full_name() or user.username}\n"
        f"📱 {user.phone or '—'}\n"
        f"📦 Reja: <b>{plan.name}</b>\n"
        f"💰 Narxi: <b>{int(plan.price_uzs):,} so'm</b>\n"
        f"🕐 {timezone.localtime(receipt.created_at).strftime('%d.%m.%Y %H:%M')}"
    )
    kb = {'inline_keyboard': [[
        {'text': '✅ Tasdiqlash', 'callback_data': f'receipt_approve:{receipt.id}'},
        {'text': '❌ Rad etish',  'callback_data': f'receipt_reject:{receipt.id}'},
    ]]}
    return send_admin_photo(receipt.photo_file_id, caption, kb)
