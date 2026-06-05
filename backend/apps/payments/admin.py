from django.contrib import admin
from django.utils.html import format_html
from .models import SubscriptionPlan, Subscription, Payment, PaymeTransaction, ClickTransaction, OTPCode


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'plan_type', 'price_uzs', 'duration_days', 'is_popular', 'is_active']
    list_filter = ['is_active', 'is_popular']


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'plan', 'status', 'start_date', 'end_date', 'auto_renew']
    list_filter = ['status', 'plan']
    search_fields = ['user__username', 'user__email', 'user__phone']
    readonly_fields = ['created_at']

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user_info', 'amount_display', 'payment_method', 'status_badge', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['user__username', 'user__email', 'transaction_id', 'provider_transaction_id']
    readonly_fields = ['created_at', 'completed_at', 'provider_data']

    @admin.display(description='Foydalanuvchi')
    def user_info(self, obj):
        return f'{obj.user.get_full_name() or obj.user.username} ({obj.user.email})'

    @admin.display(description='Miqdor')
    def amount_display(self, obj):
        return f'{int(obj.amount):,} so\'m'

    @admin.display(description='Holat')
    def status_badge(self, obj):
        colors = {
            'completed': 'green',
            'pending': 'orange',
            'processing': 'blue',
            'failed': 'red',
            'cancelled': 'gray',
            'refunded': 'purple',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="color:{}; font-weight:bold">{}</span>',
            color, obj.get_status_display()
        )


@admin.register(PaymeTransaction)
class PaymeTransactionAdmin(admin.ModelAdmin):
    list_display = ['payme_id', 'payment', 'state', 'amount_display', 'created_at']
    list_filter = ['state']
    search_fields = ['payme_id']
    readonly_fields = ['created_at']

    @admin.display(description='Miqdor (tiyin)')
    def amount_display(self, obj):
        return f'{obj.amount // 100:,} so\'m ({obj.amount:,} tiyin)'


@admin.register(ClickTransaction)
class ClickTransactionAdmin(admin.ModelAdmin):
    list_display = ['click_trans_id', 'payment', 'amount', 'action', 'error_code', 'created_at']
    list_filter = ['action', 'error_code']
    search_fields = ['click_trans_id']


@admin.register(OTPCode)
class OTPCodeAdmin(admin.ModelAdmin):
    list_display = ['phone', 'code', 'is_used', 'attempts', 'created_at', 'expires_at']
    list_filter = ['is_used']
    search_fields = ['phone']
    readonly_fields = ['created_at']
