from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Talaba'),
        ('teacher', 'O\'qituvchi'),
        ('admin', 'Admin'),
    ]

    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    telegram_id = models.BigIntegerField(null=True, blank=True, unique=True, db_index=True,
                                         help_text='Telegram chat/user ID — bot orqali bog\'langan')
    telegram_username = models.CharField(max_length=64, blank=True)
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    region = models.CharField(max_length=100, blank=True)
    school = models.CharField(max_length=200, blank=True)
    is_premium = models.BooleanField(default=False)
    premium_until = models.DateTimeField(null=True, blank=True)
    email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Foydalanuvchi'
        verbose_name_plural = 'Foydalanuvchilar'

    def __str__(self):
        return f"{self.get_full_name() or self.username}"

    @property
    def has_active_subscription(self):
        from django.utils import timezone
        return self.is_premium and self.premium_until and self.premium_until > timezone.now()

    @property
    def telegram_linked(self):
        return self.telegram_id is not None


class TelegramLinkToken(models.Model):
    """Saytdan Telegram botga ulash uchun bir martalik deep-link token.

    Sayt token yaratadi -> foydalanuvchi t.me/<bot>?start=<token> ni bosadi ->
    bot /start <token> ni qabul qilib telegram_id ni shu user ga bog'laydi.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='telegram_tokens')
    token = models.CharField(max_length=48, unique=True, db_index=True)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        verbose_name = 'Telegram ulash token'
        verbose_name_plural = 'Telegram ulash tokenlar'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.token[:8]}…"

    @property
    def is_valid(self):
        from django.utils import timezone
        return not self.is_used and timezone.now() < self.expires_at


class EmailVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='email_verifications')
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Email tasdiqlash'
        verbose_name_plural = 'Email tasdiqlashlar'


class PasswordReset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_resets')
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Parol tiklash'
        verbose_name_plural = 'Parol tiklashlar'
