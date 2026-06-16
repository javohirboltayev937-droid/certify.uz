"""
Certify.uz Telegram Bot — asosiy mantiq.

Oqim:
  1. Foydalanuvchi /start yoki /start <token> yuboradi
  2. Akkaunt ulanmagan bo'lsa — saytga yo'llaydi
  3. Akkaunt ulangandan keyin:
       - "Pro sotib olish" → reja tanlash → chek yuborish
       - Admin chekni ko'rib tasdiqlaydi / rad etadi
       - Tasdiqlanganda foydalanuvchi avtomatik Pro oladi
  4. Admin uchun: /stats, /users, /activate <id>, /deactivate <id>
"""
import logging
from django.conf import settings
from django.utils import timezone

from .telegram import (
    send_message, edit_message, answer_callback,
    send_admin_alert, notify_new_receipt, CERTIFY_TAG,
)

logger = logging.getLogger(__name__)

# ─── Konstantalar ─────────────────────────────────────────────────────────────

# Foydalanuvchi holati (Redis o'rniga oddiy in-memory, server restart da tozalanadi)
# Format: {chat_id: {'state': 'awaiting_photo', 'plan_id': 3}}
_USER_STATE: dict = {}

STATE_AWAITING_PHOTO = 'awaiting_photo'


def _site_url():
    return getattr(settings, 'FRONTEND_URL', 'https://certify.uz')


def _bot_username():
    return getattr(settings, 'TELEGRAM_BOT_USERNAME', '')


def _admin_chat():
    return str(getattr(settings, 'TELEGRAM_ADMIN_CHAT_ID', ''))


def _is_admin(chat_id):
    return str(chat_id) == _admin_chat().lstrip('-') or str(chat_id) == _admin_chat()


# ─── DB yordamchilari ─────────────────────────────────────────────────────────

def _get_user(tg_id):
    from apps.accounts.models import User
    return User.objects.filter(telegram_id=tg_id).first()


def _get_plan(plan_id):
    from apps.payments.models import SubscriptionPlan
    return SubscriptionPlan.objects.filter(id=plan_id, is_active=True, price_uzs__gt=0).first()


def _active_plans():
    from apps.payments.models import SubscriptionPlan
    return SubscriptionPlan.objects.filter(is_active=True, price_uzs__gt=0).order_by('price_uzs')


# ─── Klaviaturalar ────────────────────────────────────────────────────────────

def _main_kb(user=None):
    rows = [
        [{'text': '🚀 Pro sotib olish', 'callback_data': 'plans'}],
        [{'text': '📊 Mening holatim', 'callback_data': 'mystatus'}],
        [{'text': '🔗 Certify.uz saytiga o\'tish', 'url': _site_url()}],
    ]
    return {'inline_keyboard': rows}


def _back_kb(target='menu'):
    return {'inline_keyboard': [[{'text': '⬅️ Orqaga', 'callback_data': target}]]}


def _plans_kb(plans):
    rows = []
    for p in plans:
        label = f"{p.name} — {int(p.price_uzs):,} so'm / {p.duration_days} kun"
        rows.append([{'text': label, 'callback_data': f'plan:{p.id}'}])
    rows.append([{'text': '⬅️ Orqaga', 'callback_data': 'menu'}])
    return {'inline_keyboard': rows}


# ─── Kirish nuqtasi ───────────────────────────────────────────────────────────

def handle_update(update: dict):
    try:
        if 'message' in update:
            _handle_message(update['message'])
        elif 'callback_query' in update:
            _handle_callback(update['callback_query'])
    except Exception as e:
        logger.exception(f'handle_update xatolik: {e}')


# ─── Xabarlar ─────────────────────────────────────────────────────────────────

def _handle_message(msg: dict):
    chat_id = msg['chat']['id']
    from_user = msg.get('from', {})
    tg_id = from_user.get('id')
    text = (msg.get('text') or '').strip()

    # Rasm — chek kutilayotgan bo'lsa qabul qil
    if 'photo' in msg:
        _handle_photo(msg, chat_id, tg_id)
        return

    # Admin komandalar
    if _is_admin(chat_id):
        if text.startswith('/activate'):
            _admin_activate(chat_id, text)
            return
        if text.startswith('/deactivate'):
            _admin_deactivate(chat_id, text)
            return
        if text == '/stats':
            _admin_stats(chat_id)
            return
        if text == '/users':
            _admin_recent_users(chat_id)
            return

    # /start
    if text.startswith('/start'):
        parts = text.split(maxsplit=1)
        token = parts[1].strip() if len(parts) == 2 else ''
        if token:
            _link_account(token, from_user, chat_id)
        else:
            _welcome(chat_id, from_user)
        return

    if text in ('/menu', '/help', 'menu'):
        _show_menu(chat_id, tg_id)
        return

    # Holatga qarab
    state = _USER_STATE.get(chat_id, {})
    if state.get('state') == STATE_AWAITING_PHOTO:
        send_message(chat_id,
            "📸 Iltimos, <b>rasm</b> ko'rinishida chekni yuboring.\n"
            "Matn emas, bank ilovasidan screenshot yuborilsin.")
        return

    _show_menu(chat_id, tg_id)


def _handle_photo(msg: dict, chat_id, tg_id):
    state = _USER_STATE.get(chat_id, {})
    if state.get('state') != STATE_AWAITING_PHOTO:
        send_message(chat_id,
            "Rahmat! Lekin hozirda chek kutilmayapti.\n"
            "Pro sotib olish uchun menyudan foydalaning.",
            reply_markup=_main_kb())
        return

    user = _get_user(tg_id)
    if not user:
        send_message(chat_id, "Akkauntingiz ulanmagan. Saytdan ulang.")
        _USER_STATE.pop(chat_id, None)
        return

    plan_id = state.get('plan_id')
    plan = _get_plan(plan_id)
    if not plan:
        send_message(chat_id, "Reja topilmadi. Qaytadan boshlang.", reply_markup=_main_kb())
        _USER_STATE.pop(chat_id, None)
        return

    # Eng katta rasmni olish (sifatli)
    photo = msg['photo'][-1]
    file_id = photo['file_id']

    # Mavjud pending chekni tekshirish
    from .models import PendingPaymentReceipt
    existing = PendingPaymentReceipt.objects.filter(user=user, status='pending').first()
    if existing:
        send_message(chat_id,
            "⏳ Sizning oldingi chekingiz hali ko'rib chiqilmoqda.\n"
            "Iltimos, admin javobini kuting.",
            reply_markup=_main_kb())
        _USER_STATE.pop(chat_id, None)
        return

    receipt = PendingPaymentReceipt.objects.create(
        user=user,
        plan=plan,
        photo_file_id=file_id,
        user_chat_id=chat_id,
    )

    # Admin ga yuborish
    result = notify_new_receipt(receipt, user, plan)
    if result.get('ok'):
        admin_msg_id = result.get('result', {}).get('message_id')
        if admin_msg_id:
            receipt.admin_msg_id = admin_msg_id
            receipt.save(update_fields=['admin_msg_id'])

    _USER_STATE.pop(chat_id, None)

    send_message(
        chat_id,
        f"✅ <b>Chek qabul qilindi!</b>\n\n"
        f"📦 {plan.name}\n"
        f"💰 {int(plan.price_uzs):,} so'm\n\n"
        f"Admin ko'rib chiqib, odatda <b>1–24 soat</b> ichida obunangizni faollashtiradi.\n"
        f"Tasdiqlanganda sizga xabar keladi. 🔔" + CERTIFY_TAG,
        reply_markup=_main_kb(),
    )


# ─── Xush kelibsiz ────────────────────────────────────────────────────────────

def _welcome(chat_id, from_user):
    tg_id = from_user.get('id')
    user = _get_user(tg_id)
    name = from_user.get('first_name', '') or ''

    if user:
        status = "⭐ Pro" if user.has_active_subscription else "Oddiy"
        send_message(
            chat_id,
            f"Assalomu alaykum, <b>{user.get_full_name() or name}</b>! 👋\n\n"
            f"Certify.uz akkauntingiz ulangan.\n"
            f"Holat: {status}\n\n"
            f"Quyidagi menyudan foydalaning:" + CERTIFY_TAG,
            reply_markup=_main_kb(user),
        )
    else:
        bot_un = _bot_username()
        send_message(
            chat_id,
            f"Assalomu alaykum, <b>{name}</b>! 👋\n\n"
            f"Bu <b>Certify.uz</b> rasmiy boti.\n\n"
            f"Bot orqali Pro obuna sotib olish, holatni tekshirish va boshqa xizmatlardan foydalanishingiz mumkin.\n\n"
            f"<b>Boshlash uchun akkauntingizni ulang:</b>\n"
            f"1️⃣ <a href=\"{_site_url()}\">certify.uz</a> ga kiring\n"
            f"2️⃣ Profil → <b>\"Telegramga ulash\"</b> tugmasi\n"
            f"3️⃣ Havolani bosgach akkaunt avtomatik ulanadi ✅" + CERTIFY_TAG,
        )


def _show_menu(chat_id, tg_id):
    user = _get_user(tg_id or chat_id)
    if not user:
        send_message(chat_id,
            "Akkauntingiz ulanmagan.\n\n"
            f"Iltimos, <a href=\"{_site_url()}\">certify.uz</a> saytida profil → \"Telegramga ulash\" tugmasini bosing." + CERTIFY_TAG)
        return
    status = "⭐ Pro" if user.has_active_subscription else "Oddiy"
    send_message(
        chat_id,
        f"<b>Asosiy menyu</b>\n\n"
        f"👤 {user.get_full_name() or user.username}\n"
        f"Holat: {status}" + CERTIFY_TAG,
        reply_markup=_main_kb(user),
    )


# ─── Akkaunt ulash ────────────────────────────────────────────────────────────

def _link_account(token: str, from_user: dict, chat_id):
    from apps.accounts.models import User, TelegramLinkToken

    link = TelegramLinkToken.objects.select_related('user').filter(token=token).first()
    if not link or not link.is_valid:
        send_message(chat_id,
            "❌ Bu ulash havolasi yaroqsiz yoki muddati tugagan.\n\n"
            f"Iltimos, <a href=\"{_site_url()}\">certify.uz</a> profilingizdan qayta urinib ko'ring.")
        return

    tg_id  = from_user.get('id')
    tg_un  = from_user.get('username', '') or ''
    user   = link.user

    User.objects.filter(telegram_id=tg_id).exclude(pk=user.pk).update(
        telegram_id=None, telegram_username='')
    user.telegram_id       = tg_id
    user.telegram_username = tg_un
    user.save(update_fields=['telegram_id', 'telegram_username'])
    link.is_used = True
    link.save(update_fields=['is_used'])

    send_message(
        chat_id,
        f"✅ <b>Akkaunt ulandi!</b>\n\n"
        f"👤 {user.get_full_name() or user.username}\n"
        f"📧 {user.email}\n\n"
        f"Endi bot orqali Pro obuna sotib olishingiz mumkin." + CERTIFY_TAG,
        reply_markup=_main_kb(user),
    )
    try:
        send_admin_alert(
            f"🔗 <b>Telegram ulandi</b>\n"
            f"👤 {user.get_full_name() or user.username}\n"
            f"@{tg_un or '—'} (id: {tg_id})"
        )
    except Exception:
        pass


# ─── Callback query ───────────────────────────────────────────────────────────

def _handle_callback(cb: dict):
    cb_id    = cb['id']
    data     = cb.get('data', '')
    msg      = cb.get('message', {})
    chat_id  = msg.get('chat', {}).get('id')
    msg_id   = msg.get('message_id')
    tg_id    = cb.get('from', {}).get('id')

    # Admin ruxsatlari
    if data.startswith('receipt_'):
        if _is_admin(chat_id):
            answer_callback(cb_id)
            _admin_receipt_action(chat_id, msg_id, data)
        else:
            answer_callback(cb_id, "Ruxsat yo'q.", show_alert=True)
        return

    # Oddiy foydalanuvchi
    user = _get_user(tg_id)
    if not user:
        answer_callback(cb_id, "Akkaunt ulanmagan. Saytdan ulang.", show_alert=True)
        return

    answer_callback(cb_id)

    if data == 'menu':
        status = "⭐ Pro" if user.has_active_subscription else "Oddiy"
        edit_message(chat_id, msg_id,
            f"<b>Asosiy menyu</b>\n\n"
            f"👤 {user.get_full_name() or user.username}\n"
            f"Holat: {status}" + CERTIFY_TAG,
            reply_markup=_main_kb(user))

    elif data == 'plans':
        _show_plans(chat_id, msg_id)

    elif data.startswith('plan:'):
        plan_id = int(data.split(':')[1])
        _show_plan_detail(chat_id, msg_id, tg_id, plan_id)

    elif data.startswith('send_receipt:'):
        plan_id = int(data.split(':')[1])
        plan = _get_plan(plan_id)
        if not plan:
            edit_message(chat_id, msg_id, "Reja topilmadi.", reply_markup=_back_kb('plans'))
            return
        _USER_STATE[chat_id] = {'state': STATE_AWAITING_PHOTO, 'plan_id': plan_id}
        card_num    = getattr(settings, 'PAYMENT_CARD_NUMBER', '') or '—'
        card_holder = getattr(settings, 'PAYMENT_CARD_HOLDER', '') or ''
        card_line   = f"💳 <code>{card_num}</code>" + (f"  ({card_holder})" if card_holder else "")
        edit_message(chat_id, msg_id,
            f"📸 <b>Chek yuborish</b>\n\n"
            f"📦 Reja: {plan.name}\n"
            f"💰 Narxi: {int(plan.price_uzs):,} so'm\n\n"
            f"Quyidagi karta raqamiga pul o'tkazing:\n"
            f"{card_line}\n\n"
            f"So'ng bank ilovasidagi <b>to'lov cheki skrinshotini</b> shu chatga yuboring.\n"
            f"Rasm yuborilgach admin tekshiradi va obunangizni faollashtiradi." + CERTIFY_TAG,
            reply_markup={'inline_keyboard': [[
                {'text': '❌ Bekor qilish', 'callback_data': 'cancel_receipt'}
            ]]}
        )

    elif data == 'mystatus':
        _show_my_status(chat_id, msg_id, user)

    elif data == 'cancel_receipt':
        _USER_STATE.pop(chat_id, None)
        status = "⭐ Pro" if user.has_active_subscription else "Oddiy"
        edit_message(chat_id, msg_id,
            f"Bekor qilindi.\n\n"
            f"👤 {user.get_full_name() or user.username}\n"
            f"Holat: {status}" + CERTIFY_TAG,
            reply_markup=_main_kb(user))


def _show_plans(chat_id, msg_id):
    plans = list(_active_plans())
    if not plans:
        edit_message(chat_id, msg_id,
            "Hozircha obuna rejalari mavjud emas. Keyinroq urinib ko'ring.",
            reply_markup=_back_kb('menu'))
        return
    edit_message(chat_id, msg_id,
        "<b>🚀 Pro obuna rejalari</b>\n\n"
        "Kerakli rejani tanlang:" + CERTIFY_TAG,
        reply_markup=_plans_kb(plans))


def _show_plan_detail(chat_id, msg_id, tg_id, plan_id):
    plan = _get_plan(plan_id)
    if not plan:
        edit_message(chat_id, msg_id, "Reja topilmadi.", reply_markup=_back_kb('plans'))
        return

    feats = plan.features if isinstance(plan.features, list) else []
    feat_text = '\n'.join(f"  ✅ {f}" for f in feats[:8]) if feats else ''
    text = (
        f"<b>{plan.name}</b>\n\n"
        f"💰 <b>{int(plan.price_uzs):,} so'm</b>\n"
        f"📅 {plan.duration_days} kun\n"
    )
    if plan.description:
        text += f"\n{plan.description}\n"
    if feat_text:
        text += f"\n{feat_text}\n"
    _card_num    = getattr(settings, 'PAYMENT_CARD_NUMBER', '') or '—'
    _card_holder = getattr(settings, 'PAYMENT_CARD_HOLDER', '') or ''
    _card_line   = f"   💳 <code>{_card_num}</code>" + (f"  ({_card_holder})" if _card_holder else "")
    text += (
        f"\n<b>To'lov qanday amalga oshiriladi?</b>\n"
        f"1️⃣ Istalgan bank (Payme, Click, UzCard, Humo) orqali pul o'tkazing:\n"
        f"{_card_line}\n\n"
        f"2️⃣ \"Chek yuborish\" tugmasini bosing va bank skrinshotini yuboring\n"
        f"3️⃣ Admin 1-24 soat ichida tekshirib, obunangizni faollashtiradi 🎉"
    )
    kb = {'inline_keyboard': [
        [{'text': '📸 Chek yuborish', 'callback_data': f'send_receipt:{plan.id}'}],
        [{'text': '⬅️ Orqaga', 'callback_data': 'plans'}],
    ]}

    # Agar mavjud chek kutilayotgan bo'lsa
    from .models import PendingPaymentReceipt
    user = _get_user(tg_id)
    if user:
        pending = PendingPaymentReceipt.objects.filter(user=user, status='pending').first()
        if pending:
            text += f"\n\n⏳ <i>Sizning #{pending.id} chekingiz ko'rib chiqilmoqda...</i>"
            kb = {'inline_keyboard': [[{'text': '⬅️ Orqaga', 'callback_data': 'plans'}]]}

    edit_message(chat_id, msg_id, text + CERTIFY_TAG, reply_markup=kb)

    # "send_receipt" callback ni keyingi xabarda emas, shu yerda handle qilish uchun
    # aslida bu tugma bosilganda callback keladi, lekin biz state ni shu yerda ham set qilishimiz mumkin emas
    # Shuning uchun "send_receipt:<plan_id>" callbackni _handle_callback da ham ushlash kerak
    # Qo'shimcha: agar bu edit bo'lmasa, birinchi marta ko'rsatilganda "send_receipt" handle qilamiz


def _show_my_status(chat_id, msg_id, user):
    from apps.payments.models import Subscription
    from .models import PendingPaymentReceipt

    sub = Subscription.objects.filter(
        user=user, status='active'
    ).select_related('plan').order_by('-end_date').first()

    pending = PendingPaymentReceipt.objects.filter(user=user, status='pending').first()

    if sub and sub.end_date and sub.end_date > timezone.now():
        days_left = (sub.end_date - timezone.now()).days
        status_text = (
            f"⭐ <b>Pro obuna faol</b>\n"
            f"📦 {sub.plan.name}\n"
            f"📅 {sub.end_date.strftime('%d.%m.%Y')} gacha\n"
            f"⏰ {days_left} kun qoldi"
        )
    else:
        status_text = "📭 Faol obuna yo'q"

    text = (
        f"<b>Mening holat</b>\n\n"
        f"👤 {user.get_full_name() or user.username}\n"
        f"📧 {user.email or '—'}\n"
        f"📱 {user.phone or '—'}\n\n"
        f"{status_text}"
    )
    if pending:
        text += f"\n\n⏳ <i>#{pending.id} chek ko'rib chiqilmoqda...</i>"

    edit_message(chat_id, msg_id, text + CERTIFY_TAG, reply_markup=_back_kb('menu'))


# ─── Admin: chek tasdiqlash / rad etish ──────────────────────────────────────

def _admin_receipt_action(chat_id, msg_id, data: str):
    from .models import PendingPaymentReceipt
    from apps.accounts.models import User

    parts = data.split(':')
    action     = parts[0]  # receipt_approve yoki receipt_reject
    receipt_id = int(parts[1])

    receipt = PendingPaymentReceipt.objects.select_related('user', 'plan').filter(id=receipt_id).first()
    if not receipt:
        send_message(chat_id, f"❗ #{receipt_id} chek topilmadi.")
        return
    if receipt.status != 'pending':
        send_message(chat_id,
            f"ℹ️ #{receipt_id} chek allaqachon {receipt.get_status_display()}.")
        return

    user = receipt.user
    plan = receipt.plan
    now  = timezone.now()

    if action == 'receipt_approve':
        # Pro ni faollashtirish
        user.is_premium    = True
        user.premium_until = now + timezone.timedelta(days=plan.duration_days)
        user.save(update_fields=['is_premium', 'premium_until'])

        # Subscription yaratish
        from apps.payments.models import Subscription
        Subscription.objects.create(
            user=user, plan=plan, status='active',
            start_date=now,
            end_date=user.premium_until,
        )

        receipt.status      = 'approved'
        receipt.reviewed_at = now
        receipt.save(update_fields=['status', 'reviewed_at'])

        # Foydalanuvchiga xabar
        send_message(
            receipt.user_chat_id,
            f"🎉 <b>Tabriklaymiz! Pro obunangiz faollashtirildi!</b>\n\n"
            f"📦 {plan.name}\n"
            f"📅 {user.premium_until.strftime('%d.%m.%Y')} gacha faol\n\n"
            f"Barcha Premium imkoniyatlar ochildi. Yaxshi o'qishlar! 🚀" + CERTIFY_TAG,
            reply_markup={'inline_keyboard': [[
                {'text': '🌐 Certify.uz ga o\'tish', 'url': settings.FRONTEND_URL or 'https://certify.uz'}
            ]]}
        )

        # Admin xabarni yangilash
        try:
            from .telegram import tg_call
            tg_call('editMessageCaption',
                chat_id=chat_id, message_id=msg_id,
                caption=(
                    f"✅ <b>TASDIQLANDI</b> — #{receipt_id}\n"
                    f"👤 {user.get_full_name() or user.username}\n"
                    f"📦 {plan.name}\n"
                    f"📅 {user.premium_until.strftime('%d.%m.%Y')} gacha" + CERTIFY_TAG
                ),
                parse_mode='HTML',
            )
        except Exception:
            pass

        send_message(chat_id, f"✅ #{receipt_id} tasdiqlandi. Pro faollashtirildi.")

    elif action == 'receipt_reject':
        receipt.status      = 'rejected'
        receipt.reviewed_at = now
        receipt.save(update_fields=['status', 'reviewed_at'])

        # Foydalanuvchiga xabar
        send_message(
            receipt.user_chat_id,
            f"❌ <b>To'lov cheki tasdiqlanmadi.</b>\n\n"
            f"Sabab: To'lov tasdiqlanmadi yoki chek aniq ko'rinmadi.\n\n"
            f"Iltimos, qayta to'lov qilib, aniq chek (bank skrinshot) yuboring." + CERTIFY_TAG,
            reply_markup=_main_kb(),
        )

        try:
            from .telegram import tg_call
            tg_call('editMessageCaption',
                chat_id=chat_id, message_id=msg_id,
                caption=(
                    f"❌ <b>RAD ETILDI</b> — #{receipt_id}\n"
                    f"👤 {user.get_full_name() or user.username}\n"
                    f"📦 {plan.name}" + CERTIFY_TAG
                ),
                parse_mode='HTML',
            )
        except Exception:
            pass

        send_message(chat_id, f"❌ #{receipt_id} rad etildi. Foydalanuvchiga xabar ketdi.")


# ─── Admin komandalar ─────────────────────────────────────────────────────────

def _admin_stats(chat_id):
    from apps.accounts.models import User
    from apps.payments.models import Subscription
    from .models import PendingPaymentReceipt

    total_users   = User.objects.count()
    premium_users = User.objects.filter(is_premium=True).count()
    today_users   = User.objects.filter(
        date_joined__date=timezone.now().date()).count()
    pending_cheks = PendingPaymentReceipt.objects.filter(status='pending').count()
    active_subs   = Subscription.objects.filter(status='active').count()

    text = (
        f"📊 <b>Statistika</b>\n\n"
        f"👥 Jami foydalanuvchilar: <b>{total_users}</b>\n"
        f"⭐ Pro foydalanuvchilar:  <b>{premium_users}</b>\n"
        f"📅 Bugun ro'yxatdan o'tdi: <b>{today_users}</b>\n\n"
        f"💳 Faol obunalar: <b>{active_subs}</b>\n"
        f"⏳ Ko'rib chiqilmagan cheklar: <b>{pending_cheks}</b>"
    )
    send_message(chat_id, text + CERTIFY_TAG)


def _admin_recent_users(chat_id):
    from apps.accounts.models import User
    users = User.objects.order_by('-date_joined')[:10]
    lines = []
    for i, u in enumerate(users, 1):
        pro = '⭐' if u.is_premium else '👤'
        tg  = f'@{u.telegram_username}' if u.telegram_username else '—'
        lines.append(f"{i}. {pro} {u.get_full_name() or u.username} | {tg} | {u.date_joined.strftime('%d.%m.%y')}")
    text = "<b>🕐 So'nggi 10 foydalanuvchi</b>\n\n" + '\n'.join(lines)
    send_message(chat_id, text + CERTIFY_TAG)


def _admin_activate(chat_id, text: str):
    """
    /activate <user_id> [days]
    Masalan: /activate 42 30
    """
    from apps.accounts.models import User
    parts = text.split()
    if len(parts) < 2:
        send_message(chat_id, "Ishlatish: /activate [user_id] [kun_soni]\nMasalan: /activate 42 30")
        return
    try:
        user_id = int(parts[1])
        days    = int(parts[2]) if len(parts) > 2 else 30
    except ValueError:
        send_message(chat_id, "Noto'g'ri format. Masalan: /activate 42 30")
        return

    user = User.objects.filter(id=user_id).first()
    if not user:
        send_message(chat_id, f"#{user_id} foydalanuvchi topilmadi.")
        return

    now = timezone.now()
    user.is_premium    = True
    user.premium_until = now + timezone.timedelta(days=days)
    user.save(update_fields=['is_premium', 'premium_until'])

    send_message(chat_id,
        f"✅ #{user_id} {user.get_full_name() or user.username} Pro faollashtirildi.\n"
        f"📅 {user.premium_until.strftime('%d.%m.%Y')} gacha.")

    if user.telegram_id:
        send_message(user.telegram_id,
            f"🎉 <b>Pro obunangiz faollashtirildi!</b>\n\n"
            f"📅 {user.premium_until.strftime('%d.%m.%Y')} gacha faol." + CERTIFY_TAG)


def _admin_deactivate(chat_id, text: str):
    from apps.accounts.models import User
    parts = text.split()
    if len(parts) < 2:
        send_message(chat_id, "Ishlatish: /deactivate [user_id]")
        return
    try:
        user_id = int(parts[1])
    except ValueError:
        send_message(chat_id, "Noto'g'ri format. Masalan: /deactivate 42")
        return

    user = User.objects.filter(id=user_id).first()
    if not user:
        send_message(chat_id, f"#{user_id} foydalanuvchi topilmadi.")
        return

    user.is_premium    = False
    user.premium_until = None
    user.save(update_fields=['is_premium', 'premium_until'])
    send_message(chat_id, f"🔒 #{user_id} {user.get_full_name() or user.username} Pro o'chirildi.")

    if user.telegram_id:
        send_message(user.telegram_id,
            f"ℹ️ Sizning Pro obunangiz admin tomonidan o'chirildi." + CERTIFY_TAG)
