from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, TelegramLinkToken


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_premium', 'telegram_id', 'created_at']
    list_filter = ['role', 'is_premium', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone', 'telegram_id', 'telegram_username']
    fieldsets = UserAdmin.fieldsets + (
        ('Qo\'shimcha ma\'lumotlar', {
            'fields': ('phone', 'avatar', 'role', 'bio', 'date_of_birth', 'region', 'school')
        }),
        ('Telegram', {
            'fields': ('telegram_id', 'telegram_username')
        }),
        ('Premium', {
            'fields': ('is_premium', 'premium_until', 'email_verified')
        }),
    )


@admin.register(TelegramLinkToken)
class TelegramLinkTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'token', 'is_used', 'created_at', 'expires_at']
    list_filter = ['is_used']
    search_fields = ['user__username', 'user__email', 'token']
    readonly_fields = ['created_at']
