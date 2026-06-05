from django.contrib import admin
from .models import Subject, Course, Lesson, StudyMaterial, Enrollment


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'subject_type', 'is_active', 'order']
    list_filter = ['is_active']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('subject_type',)}


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'level', 'is_premium', 'is_active', 'total_lessons']
    list_filter = ['subject', 'level', 'is_premium', 'is_active']
    search_fields = ['title']
    prepopulated_fields = {'slug': ('title',)}


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'lesson_type', 'duration', 'is_free', 'order']
    list_filter = ['lesson_type', 'is_free']
    search_fields = ['title']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'enrolled_at', 'completed']
    list_filter = ['completed']
