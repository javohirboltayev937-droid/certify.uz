from django.contrib import admin
from .models import Question, Answer


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 4
    max_num = 4


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['subject', 'exam_type', 'difficulty', 'topic', 'year', 'is_active']
    list_filter = ['subject', 'exam_type', 'difficulty', 'is_active']
    search_fields = ['question_text', 'topic']
    inlines = [AnswerInline]
