from django.contrib import admin
from .models import ExamType, ExamSection, MockExam, IELTSTip, NationalCert


@admin.register(ExamType)
class ExamTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'exam_type', 'is_premium', 'is_active', 'duration_minutes']
    list_filter = ['is_premium', 'is_active']
    prepopulated_fields = {'slug': ('exam_type',)}


@admin.register(MockExam)
class MockExamAdmin(admin.ModelAdmin):
    list_display = ['title', 'exam_type', 'level', 'duration_minutes', 'is_premium', 'is_active']
    list_filter = ['exam_type', 'level', 'is_premium']


@admin.register(IELTSTip)
class IELTSTipAdmin(admin.ModelAdmin):
    list_display = ['section', 'title', 'order', 'is_active']
    list_filter = ['section']


@admin.register(NationalCert)
class NationalCertAdmin(admin.ModelAdmin):
    list_display = ['subject', 'level', 'duration_minutes', 'passing_percentage']
    list_filter = ['level', 'subject']
