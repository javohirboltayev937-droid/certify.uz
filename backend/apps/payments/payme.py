"""
Payme (PayCom) Merchant API integratsiyasi.
Hujjat: https://developer.paycom.uz/docs/

Payme JSON-RPC 2.0 protokolida ishlaydi.
Miqdor tiyin da (1 UZS = 100 tiyin).
"""
import base64
import hashlib
from decimal import Decimal
from django.conf import settings
from django.utils import timezone


PAYME_ERRORS = {
    'BALANCE_NOT_ENOUGH': {'code': -31003, 'message': {'uz': 'Balansingiz yetarli emas', 'ru': 'Недостаточно средств', 'en': 'Insufficient balance'}},
    'TRANSACTION_CANCELLED': {'code': -31007, 'message': {'uz': 'To\'lov bekor qilindi', 'ru': 'Платеж отменен', 'en': 'Transaction cancelled'}},
    'CANNOT_PERFORM': {'code': -31008, 'message': {'uz': 'Amalni bajarish mumkin emas', 'ru': 'Невозможно выполнить операцию', 'en': 'Cannot perform this operation'}},
    'ALREADY_DONE': {'code': -31099, 'message': {'uz': 'Allaqachon bajarilgan', 'ru': 'Уже выполнено', 'en': 'Already done'}},
    'ORDER_NOT_FOUND': {'code': -31050, 'message': {'uz': 'Buyurtma topilmadi', 'ru': 'Заказ не найден', 'en': 'Order not found'}},
    'WRONG_AMOUNT': {'code': -31001, 'message': {'uz': 'Noto\'g\'ri miqdor', 'ru': 'Неправильная сумма', 'en': 'Wrong amount'}},
    'TRANSACTION_NOT_FOUND': {'code': -31003, 'message': {'uz': 'Tranzaksiya topilmadi', 'ru': 'Транзакция не найдена', 'en': 'Transaction not found'}},
}

# Payme transaction states
PAYME_STATE_CREATED = 1
PAYME_STATE_COMPLETED = 2
PAYME_STATE_CANCELLED = -1
PAYME_STATE_CANCELLED_AFTER_COMPLETE = -2


def payme_amount_to_uzs(tiyin_amount: int) -> Decimal:
    """Tiyin dan UZS ga o'tkazish"""
    return Decimal(tiyin_amount) / 100


def uzs_to_payme_amount(uzs_amount) -> int:
    """UZS dan tiyin ga o'tkazish"""
    return int(Decimal(str(uzs_amount)) * 100)


def check_payme_auth(authorization_header: str) -> bool:
    """Payme Basic Auth tekshirish"""
    if not authorization_header or not authorization_header.startswith('Basic '):
        return False
    try:
        decoded = base64.b64decode(authorization_header[6:]).decode('utf-8')
        merchant_id, key = decoded.split(':', 1)
        return (
            merchant_id == settings.PAYME_MERCHANT_ID and
            key == settings.PAYME_SECRET_KEY
        )
    except Exception:
        return False


def get_payme_checkout_url(payment_id: int, amount_uzs, return_url: str = None) -> str:
    """Payme to'lov sahifasi URL si"""
    import urllib.parse
    amount_tiyin = uzs_to_payme_amount(amount_uzs)
    merchant_id = settings.PAYME_MERCHANT_ID
    account = base64.b64encode(
        f'm={merchant_id};ac.order={payment_id};a={amount_tiyin}'.encode()
    ).decode()
    url = f'https://checkout.paycom.uz/{account}'
    return url
