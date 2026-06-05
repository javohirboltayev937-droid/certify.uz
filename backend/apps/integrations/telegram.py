"""
Telegram Bot API integratsiyasi.
Admin xabarnomalar va foydalanuvchi bildirnomalari uchun.

Ishlatish:
  from apps.integrations.telegram import send_admin_alert, send_user_message
"""
import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

TELEGRAM_API = 'https://api.telegram.org/bot{token}/{method}'


def _send(token: str, chat_id: str | int, text: str, parse_mode: str = 'HTML') -> bool:
    """Telegram xabar yuborish (ichki funksiya)"""
    if not token or not chat_id:
        return False

    try:
        resp = requests.post(
            TELEGRAM_API.format(token=token, method='sendMessage'),
            json={
                'chat_id': chat_id,
                'text': text,
                'parse_mode': parse_mode,
                'disable_web_page_preview': True,
            },
            timeout=10,
        )
        resp.raise_for_status()
        return resp.json().get('ok', False)
    except Exception as e:
        logger.error(f'Telegram xabar xatolik: {e}')
        return False


def send_admin_alert(message: str) -> bool:
    """Admin kanaliga xabar yuborish"""
    return _send(
        token=settings.TELEGRAM_BOT_TOKEN,
        chat_id=settings.TELEGRAM_ADMIN_CHAT_ID,
        text=message,
    )


def send_user_message(chat_id: str | int, message: str) -> bool:
    """Foydalanuvchiga xabar yuborish (agar Telegram ulangan bo'lsa)"""
    return _send(
        token=settings.TELEGRAM_BOT_TOKEN,
        chat_id=chat_id,
        text=message,
    )


# ─── Admin xabarnoma shablonlari ─────────────────────────────────────────────

def notify_new_user(user) -> None:
    """Yangi ro'yxatdan o'tgan foydalanuvchi haqida"""
    text = (
        f'🆕 <b>Yangi foydalanuvchi</b>\n\n'
        f'👤 {user.get_full_name() or user.username}\n'
        f'📧 {user.email}\n'
        f'📱 {user.phone or "ko\'rsatilmagan"}\n'
        f'🗓 {user.created_at.strftime("%d.%m.%Y %H:%M")}'
    )
    send_admin_alert(text)


def notify_new_payment(payment, user, plan) -> None:
    """Yangi to'lov haqida"""
    text = (
        f'💳 <b>Yangi to\'lov</b>\n\n'
        f'👤 {user.get_full_name() or user.username}\n'
        f'📱 {user.phone or user.email}\n'
        f'📦 {plan.name}\n'
        f'💰 {int(payment.amount):,} so\'m\n'
        f'🏦 {payment.get_payment_method_display()}\n'
        f'🆔 #{payment.id}'
    )
    send_admin_alert(text)


def notify_payment_success(payment, user, subscription) -> None:
    """To'lov muvaffaqiyatli haqida"""
    text = (
        f'✅ <b>To\'lov tasdiqlandi</b>\n\n'
        f'👤 {user.get_full_name() or user.username}\n'
        f'📦 {subscription.plan.name}\n'
        f'💰 {int(payment.amount):,} so\'m\n'
        f'📅 {subscription.end_date.strftime("%d.%m.%Y")} gacha\n'
        f'🏦 {payment.get_payment_method_display()}'
    )
    send_admin_alert(text)


def notify_payment_failed(payment, user, error: str = '') -> None:
    """To'lov muvaffaqiyatsiz haqida"""
    text = (
        f'❌ <b>To\'lov rad etildi</b>\n\n'
        f'👤 {user.get_full_name() or user.username}\n'
        f'💰 {int(payment.amount):,} so\'m\n'
        f'🏦 {payment.get_payment_method_display()}\n'
        f'⚠️ {error or "Noma\'lum xatolik"}'
    )
    send_admin_alert(text)


def notify_new_test_result(attempt, user) -> None:
    """Yuqori ball olgan foydalanuvchi haqida (gamification)"""
    if attempt.percentage < 90:
        return
    text = (
        f'🏆 <b>A\'lo natija!</b>\n\n'
        f'👤 {user.get_full_name() or user.username}\n'
        f'📝 {attempt.title}\n'
        f'🎯 {attempt.percentage}% ({attempt.correct_answers}/{attempt.total_questions})'
    )
    send_admin_alert(text)


def notify_daily_stats(total_users: int, new_users: int, total_tests: int, revenue: int) -> None:
    """Kunlik statistika (scheduler tomonidan chaqiriladi)"""
    text = (
        f'📊 <b>Kunlik hisobot</b>\n\n'
        f'👥 Jami foydalanuvchi: {total_users:,}\n'
        f'🆕 Bugungi yangi: {new_users}\n'
        f'📝 Jami testlar: {total_tests:,}\n'
        f'💰 Bugungi daromad: {revenue:,} so\'m'
    )
    send_admin_alert(text)
