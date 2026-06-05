"""
Eskiz.uz SMS API integratsiyasi.
Hujjat: https://documenter.getpostman.com/view/663428/2s93JqTRWN

OTP, bildirishnomalar va xabarlar yuborish uchun.
"""
import requests
import logging
from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)

ESKIZ_BASE_URL = 'https://notify.eskiz.uz/api'
ESKIZ_TOKEN_CACHE_KEY = 'eskiz_token'
ESKIZ_TOKEN_TTL = 25 * 24 * 3600  # 25 kun (29 kundan oldin yangilash)


def get_eskiz_token() -> str | None:
    """Eskiz token olish yoki yangilash"""
    token = cache.get(ESKIZ_TOKEN_CACHE_KEY)
    if token:
        return token

    try:
        resp = requests.post(
            f'{ESKIZ_BASE_URL}/auth/login',
            data={
                'email': settings.ESKIZ_EMAIL,
                'password': settings.ESKIZ_PASSWORD,
            },
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        token = data.get('data', {}).get('token')
        if token:
            cache.set(ESKIZ_TOKEN_CACHE_KEY, token, ESKIZ_TOKEN_TTL)
        return token
    except Exception as e:
        logger.error(f'Eskiz login xatolik: {e}')
        return None


def refresh_eskiz_token() -> str | None:
    """Tokenni yangilash"""
    old_token = cache.get(ESKIZ_TOKEN_CACHE_KEY)
    if not old_token:
        return get_eskiz_token()

    try:
        resp = requests.patch(
            f'{ESKIZ_BASE_URL}/auth/refresh',
            headers={'Authorization': f'Bearer {old_token}'},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        new_token = data.get('data', {}).get('token')
        if new_token:
            cache.set(ESKIZ_TOKEN_CACHE_KEY, new_token, ESKIZ_TOKEN_TTL)
        return new_token
    except Exception as e:
        logger.error(f'Eskiz token yangilash xatolik: {e}')
        return None


def send_sms(phone: str, message: str) -> dict:
    """
    SMS yuborish.

    phone: +998901234567 yoki 998901234567 formatda
    Qaytadi: {'success': bool, 'message_id': str, 'error': str}
    """
    # Telefon raqamni normallashtirish
    phone = phone.replace('+', '').replace(' ', '').replace('-', '')
    if not phone.startswith('998'):
        phone = '998' + phone

    token = get_eskiz_token()
    if not token:
        logger.error('Eskiz token yo\'q, SMS yuborilmadi')
        return {'success': False, 'error': 'Token olishda xatolik'}

    try:
        resp = requests.post(
            f'{ESKIZ_BASE_URL}/message/sms/send',
            headers={'Authorization': f'Bearer {token}'},
            data={
                'mobile_phone': phone,
                'message': message,
                'from': settings.ESKIZ_SENDER,
                'callback_url': '',
            },
            timeout=15,
        )

        if resp.status_code == 401:
            # Token eskirgan, yangilash
            token = refresh_eskiz_token()
            if token:
                resp = requests.post(
                    f'{ESKIZ_BASE_URL}/message/sms/send',
                    headers={'Authorization': f'Bearer {token}'},
                    data={
                        'mobile_phone': phone,
                        'message': message,
                        'from': settings.ESKIZ_SENDER,
                    },
                    timeout=15,
                )

        resp.raise_for_status()
        data = resp.json()
        msg_id = data.get('id') or data.get('data', {}).get('id', '')
        logger.info(f'SMS yuborildi: {phone}, id={msg_id}')
        return {'success': True, 'message_id': str(msg_id)}

    except requests.exceptions.Timeout:
        logger.error(f'SMS yuborishda timeout: {phone}')
        return {'success': False, 'error': 'Timeout'}
    except Exception as e:
        logger.error(f'SMS xatolik {phone}: {e}')
        return {'success': False, 'error': str(e)}


def send_otp(phone: str, otp_code: str) -> dict:
    """OTP kodi yuborish"""
    message = f'Certify.uz\nTasdiqlash kodi: {otp_code}\nKod 5 daqiqa amal qiladi.'
    return send_sms(phone, message)


def send_payment_success(phone: str, plan_name: str, end_date: str) -> dict:
    """Muvaffaqiyatli to'lov xabarnomasi"""
    message = (
        f'Certify.uz\n'
        f'To\'lov qabul qilindi!\n'
        f'Reja: {plan_name}\n'
        f'Muddati: {end_date} gacha'
    )
    return send_sms(phone, message)


def send_test_result(phone: str, score: float, total: int) -> dict:
    """Test natijasi xabarnomasi"""
    message = (
        f'Certify.uz\n'
        f'Test natijangiz: {score}/{total}\n'
        f'({round(score/total*100)}%)\n'
        f'Batafsil: certify.uz/progress'
    )
    return send_sms(phone, message)


def get_sms_balance() -> dict:
    """Eskiz hisobidagi qoldiqni ko'rish"""
    token = get_eskiz_token()
    if not token:
        return {'success': False}

    try:
        resp = requests.get(
            f'{ESKIZ_BASE_URL}/auth/user',
            headers={'Authorization': f'Bearer {token}'},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        return {'success': True, 'balance': data.get('data', {}).get('balance', 0)}
    except Exception as e:
        return {'success': False, 'error': str(e)}
