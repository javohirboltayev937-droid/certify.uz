from django.db import models
from django.utils import timezone


class SubscriptionPlan(models.Model):
    PLAN_TYPE_CHOICES = [
        ('free', 'Bepul'),
        ('monthly', 'Oylik'),
        ('quarterly', '3 oylik'),
        ('annual', 'Yillik'),
    ]

    name = models.CharField(max_length=100)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPE_CHOICES, unique=True)
    price_uzs = models.DecimalField(max_digits=12, decimal_places=0, default=0)
    duration_days = models.IntegerField(default=30)
    description = models.TextField(blank=True)
    features = models.JSONField(default=list)
    is_popular = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    discount_percent = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'Obuna reja'
        verbose_name_plural = 'Obuna rejalar'

    def __str__(self):
        return f"{self.name} - {self.price_uzs:,} so'm"

    @property
    def price_per_month(self):
        if self.duration_days > 0:
            return (self.price_uzs * 30) / self.duration_days
        return self.price_uzs


class Subscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'Faol'),
        ('expired', 'Muddati tugagan'),
        ('cancelled', 'Bekor qilingan'),
        ('pending', 'Kutilmoqda'),
    ]

    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    auto_renew = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Obuna'
        verbose_name_plural = 'Obunalar'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.plan.name}"

    def activate(self):
        self.status = 'active'
        self.start_date = timezone.now()
        self.end_date = timezone.now() + timezone.timedelta(days=self.plan.duration_days)
        self.save()
        user = self.user
        user.is_premium = True
        user.premium_until = self.end_date
        user.save()


class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('payme', 'Payme'),
        ('click', 'Click'),
        ('uzcard', 'UzCard'),
        ('humo', 'Humo'),
        ('stripe', 'Stripe (Visa/MC)'),
        ('cash', 'Naqd'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Kutilmoqda'),
        ('processing', 'Jarayonda'),
        ('completed', 'Muvaffaqiyatli'),
        ('failed', 'Muvaffaqiyatsiz'),
        ('cancelled', 'Bekor qilingan'),
        ('refunded', 'Qaytarilgan'),
    ]

    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='payments')
    subscription = models.ForeignKey(Subscription, on_delete=models.SET_NULL, null=True, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=0)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # To'lov tizimi ma'lumotlari
    transaction_id = models.CharField(max_length=200, blank=True, db_index=True)
    provider_transaction_id = models.CharField(max_length=200, blank=True, help_text='Payme/Click tomonidan berilgan ID')
    provider_data = models.JSONField(default=dict, blank=True, help_text='To\'lov tizimidan kelgan to\'liq ma\'lumot')

    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'To\'lov'
        verbose_name_plural = 'To\'lovlar'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.amount:,} so'm - {self.status}"

    def complete(self):
        """To'lovni muvaffaqiyatli deb belgilash"""
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.save(update_fields=['status', 'completed_at'])
        if self.subscription:
            self.subscription.activate()


class PaymeTransaction(models.Model):
    """Payme tranzaksiyalari jurnali (JSON-RPC uchun)"""
    STATE_CREATED = 1
    STATE_COMPLETED = 2
    STATE_CANCELLED = -1
    STATE_CANCELLED_AFTER_COMPLETE = -2

    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='payme_transaction')
    payme_id = models.CharField(max_length=255, unique=True, help_text='Payme tomonidan berilgan _id')
    state = models.IntegerField(default=STATE_CREATED)
    amount = models.BigIntegerField(help_text='Tiyin da')
    created_time = models.BigIntegerField(null=True, blank=True)
    perform_time = models.BigIntegerField(null=True, blank=True, default=0)
    cancel_time = models.BigIntegerField(null=True, blank=True, default=0)
    reason = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Payme tranzaksiya'
        verbose_name_plural = 'Payme tranzaksiyalar'

    def __str__(self):
        return f"Payme: {self.payme_id} - state={self.state}"


class ClickTransaction(models.Model):
    """Click tranzaksiyalari jurnali"""
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='click_transactions')
    click_trans_id = models.CharField(max_length=255, db_index=True)
    service_id = models.CharField(max_length=100)
    click_paydoc_id = models.CharField(max_length=255, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    action = models.IntegerField()  # 0=prepare, 1=complete
    error_code = models.IntegerField(default=0)
    sign_time = models.CharField(max_length=100)
    sign_string = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Click tranzaksiya'
        verbose_name_plural = 'Click tranzaksiyalar'

    def __str__(self):
        return f"Click: {self.click_trans_id}"


class OTPCode(models.Model):
    """Telefon raqamni tasdiqlash uchun OTP"""
    phone = models.CharField(max_length=20, db_index=True)
    code = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        verbose_name = 'OTP kod'
        verbose_name_plural = 'OTP kodlar'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.phone} - {self.code}"

    @property
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expires_at

    @property
    def is_valid(self):
        return not self.is_used and not self.is_expired and self.attempts < 3
