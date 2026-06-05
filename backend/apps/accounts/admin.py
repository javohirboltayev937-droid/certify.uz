from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_premium', 'created_at']
    list_filter = ['role', 'is_premium', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']
    fieldsets = UserAdmin.fieldsets + (
        ('Qo\'shimcha ma\'lumotlar', {
            'fields': ('phone', 'avatar', 'role', 'bio', 'date_of_birth', 'region', 'school')
        }),
        ('Premium', {
            'fields': ('is_premium', 'premium_until', 'email_verified')
        }),
    )
