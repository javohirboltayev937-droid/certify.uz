import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

ESKIZ_TOKEN_URL = 'https://notify.eskiz.uz/api/auth/login'
ESKIZ_SEND_URL  = 'https://notify.eskiz.uz/api/message/sms/send'


def _get_eskiz_token():
    email    = getattr(settings, 'ESKIZ_EMAIL', '')
    password = getattr(settings, 'ESKIZ_PASSWORD', '')
    if not email or not password:
        return None
    try:
        r = requests.post(ESKIZ_TOKEN_URL, json={'email': email, 'password': password}, timeout=10)
        return r.json().get('data', {}).get('token')
    except Exception as e:
        logger.error(f'Eskiz login xatosi: {e}')
        return None


def send_sms(phone: str, message: str) -> bool:
    token = _get_eskiz_token()
    if not token:
        # SMS xizmati sozlanmagan — konsolga chiqar
        logger.warning(f'[SMS stub] {phone}: {message}')
        return False
    try:
        phone_clean = phone.replace('+', '').replace(' ', '').replace('-', '')
        r = requests.post(
            ESKIZ_SEND_URL,
            headers={'Authorization': f'Bearer {token}'},
            json={'mobile_phone': phone_clean, 'message': message, 'from': '4546'},
            timeout=15,
        )
        data = r.json()
        if data.get('status') == 'waiting':
            return True
        logger.error(f'Eskiz xatosi: {data}')
        return False
    except Exception as e:
        logger.error(f'SMS yuborishda xato: {e}')
        return False


def send_otp(phone: str, code: str) -> bool:
    message = f'Certify.uz tasdiqlash kodi: {code}\nKod 10 daqiqa davomida amal qiladi.'
    return send_sms(phone, message)
