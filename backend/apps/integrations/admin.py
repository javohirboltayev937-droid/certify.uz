from django.contrib import admin
from django.utils.html import format_html
from .models import PendingPaymentReceipt


@admin.register(PendingPaymentReceipt)
class PendingPaymentReceiptAdmin(admin.ModelAdmin):
    list_display  = ('id', 'user', 'plan', 'status_badge', 'created_at', 'reviewed_at')
    list_filter   = ('status',)
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'plan__name')
    readonly_fields = ('user', 'plan', 'photo_file_id', 'user_chat_id',
                       'admin_msg_id', 'created_at', 'reviewed_at')
    ordering      = ('-created_at',)

    def status_badge(self, obj):
        colors = {'pending': '#f59e0b', 'approved': '#10b981', 'rejected': '#ef4444'}
        labels = {'pending': '⏳ Kutilmoqda', 'approved': '✅ Tasdiqlandi', 'rejected': '❌ Rad etildi'}
        color  = colors.get(obj.status, '#6b7280')
        label  = labels.get(obj.status, obj.status)
        return format_html(
            '<span style="color:{};font-weight:bold">{}</span>', color, label
        )
    status_badge.short_description = 'Holat'
