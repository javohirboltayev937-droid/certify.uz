from django.contrib import admin
from .models import TestAttempt, Achievement, UserAchievement, DailyStreak


@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'exam_type', 'title', 'score', 'percentage', 'status', 'started_at']
    list_filter = ['exam_type', 'status']
    search_fields = ['user__username']


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['name', 'achievement_type', 'icon', 'xp_reward']


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ['user', 'achievement', 'earned_at']
