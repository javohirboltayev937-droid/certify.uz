from django.contrib import admin
from .models import DTMDirection, DTMSubjectGroup, DTMPastYear


class DTMSubjectGroupInline(admin.TabularInline):
    model = DTMSubjectGroup
    extra = 1


class DTMPastYearInline(admin.TabularInline):
    model = DTMPastYear
    extra = 1


@admin.register(DTMDirection)
class DTMDirectionAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'category', 'grant_places', 'contract_places', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['code', 'name']
    inlines = [DTMSubjectGroupInline, DTMPastYearInline]
