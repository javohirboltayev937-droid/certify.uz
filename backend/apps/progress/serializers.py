from rest_framework import serializers
from .models import TestAttempt, TestAnswer, LessonProgress, Achievement, UserAchievement, DailyStreak
from apps.questions.serializers import QuestionWithAnswerSerializer


class TestAnswerSerializer(serializers.ModelSerializer):
    question = QuestionWithAnswerSerializer(read_only=True)

    class Meta:
        model = TestAnswer
        fields = ['id', 'question', 'selected_answer', 'is_correct', 'time_taken']


class TestAttemptSerializer(serializers.ModelSerializer):
    direction_name = serializers.CharField(source='direction.name', read_only=True)
    subjects_info = serializers.SerializerMethodField()

    class Meta:
        model = TestAttempt
        fields = [
            'id', 'exam_type', 'title', 'direction_name', 'subjects_info',
            'score', 'max_score', 'percentage', 'correct_answers',
            'total_questions', 'time_taken', 'status', 'started_at', 'completed_at'
        ]

    def get_subjects_info(self, obj):
        return [{'id': s.id, 'name': s.name} for s in obj.subjects.all()]


class TestAttemptDetailSerializer(TestAttemptSerializer):
    answers = TestAnswerSerializer(many=True, read_only=True)

    class Meta(TestAttemptSerializer.Meta):
        fields = TestAttemptSerializer.Meta.fields + ['answers']


class SubmitTestSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()
    answers = serializers.ListField(
        child=serializers.DictField()
    )
    time_taken = serializers.IntegerField()


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'achievement_type', 'description', 'icon', 'xp_reward']


class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)

    class Meta:
        model = UserAchievement
        fields = ['id', 'achievement', 'earned_at']


class DailyStreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyStreak
        fields = ['current_streak', 'longest_streak', 'last_activity', 'total_xp']
