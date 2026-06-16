from django.db import models


class PendingPaymentReceipt(models.Model):
    """
    Foydalanuvchi Telegram bot orqali yuborgan to'lov cheki.
    Admin ko'rib chiqib tasdiqlaydi yoki rad etadi.
    """
    STATUS_CHOICES = [
        ('pending',  'Kutilmoqda'),
        ('approved', 'Tasdiqlandi'),
        ('rejected', 'Rad etildi'),
    ]

    user        = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='payment_receipts')
    plan        = models.ForeignKey('payments.SubscriptionPlan', on_delete=models.PROTECT)
    photo_file_id  = models.CharField(max_length=300, help_text='Telegram file_id (rasm)')
    user_chat_id   = models.BigIntegerField(help_text="Foydalanuvchining Telegram chat ID")
    admin_msg_id   = models.IntegerField(null=True, blank=True, help_text="Admin chatdagi xabar ID")
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    note        = models.TextField(blank=True, help_text='Admin izohi (rad etilsa sababi)')
    created_at  = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'To\'lov cheki'
        verbose_name_plural = 'To\'lov cheklari'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} → {self.plan.name} [{self.get_status_display()}]"
