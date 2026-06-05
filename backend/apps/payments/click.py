"""
Click to'lov tizimi integratsiyasi.
Hujjat: https://docs.click.uz/

Click REST API orqali ishlaydi.
Imzo (sign) MD5 hash bilan tekshiriladi.
"""
import hashlib
from django.conf import settings


CLICK_ERRORS = {
    0:   'Success',
    -1:  'SIGN CHECK FAILED',
    -2:  'Incorrect parameter amount',
    -3:  'Action not found',
    -4:  'Already paid',
    -5:  'User does not exist',
    -6:  'Transaction does not exist',
    -7:  'Failed to update user',
    -8:  'Error in request from click',
    -9:  'Transaction cancelled',
}


def verify_click_sign(
    click_trans_id: str,
    service_id: str,
    secret_key: str,
    merchant_trans_id: str,
    amount: str,
    action: str,
    sign_time: str,
) -> str:
    """Click imzosini hisoblash"""
    sign_string = (
        f"{click_trans_id}{service_id}{secret_key}"
        f"{merchant_trans_id}{amount}{action}{sign_time}"
    )
    return hashlib.md5(sign_string.encode('utf-8')).hexdigest()


def get_click_checkout_url(payment_id: int, amount_uzs) -> str:
    """Click to'lov sahifasi URL si"""
    service_id = settings.CLICK_SERVICE_ID
    merchant_id = settings.CLICK_MERCHANT_ID
    return (
        f"https://my.click.uz/services/pay"
        f"?service_id={service_id}"
        f"&merchant_id={merchant_id}"
        f"&amount={amount_uzs}"
        f"&transaction_param={payment_id}"
        f"&return_url={settings.FRONTEND_URL}/payment/success"
    )
