from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Avg, Count, Max
from .models import TestAttempt, TestAnswer, LessonProgress, UserAchievement, DailyStreak, Achievement
from .serializers import (
    TestAttemptSerializer, TestAttemptDetailSerializer, SubmitTestSerializer,
    UserAchievementSerializer, DailyStreakSerializer
)
from apps.questions.models import Question, Answer


class StartTestView(APIView):
    def post(self, request):
        exam_type = request.data.get('exam_type', 'dtm')
        title = request.data.get('title', 'Test')
        direction_id = request.data.get('direction_id')
        subject_ids = request.data.get('subjects', [])

        attempt = TestAttempt.objects.create(
            user=request.user,
            exam_type=exam_type,
            title=title,
            direction_id=direction_id if direction_id else None,
            status='in_progress'
        )
        if subject_ids:
            from apps.courses.models import Subject
            attempt.subjects.set(Subject.objects.filter(id__in=subject_ids))

        return Response({
            'attempt_id': attempt.id,
            'started_at': attempt.started_at,
        }, status=status.HTTP_201_CREATED)


class SubmitTestView(APIView):
    def post(self, request):
        serializer = SubmitTestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            attempt = TestAttempt.objects.get(
                id=serializer.validated_data['attempt_id'],
                user=request.user,
                status='in_progress'
            )
        except TestAttempt.DoesNotExist:
            return Response({'error': 'Test topilmadi'}, status=status.HTTP_404_NOT_FOUND)

        answers_data = serializer.validated_data['answers']
        correct = 0
        total = len(answers_data)
        test_answers = []

        for ans in answers_data:
            question_id = ans.get('question_id')
            answer_id = ans.get('answer_id')
            time_taken = ans.get('time_taken', 0)

            try:
                question = Question.objects.get(id=question_id)
                selected = Answer.objects.get(id=answer_id, question=question) if answer_id else None
                is_correct = selected.is_correct if selected else False
                if is_correct:
                    correct += 1
                test_answers.append(TestAnswer(
                    attempt=attempt,
                    question=question,
                    selected_answer=selected,
                    is_correct=is_correct,
                    time_taken=time_taken,
                ))
            except (Question.DoesNotExist, Answer.DoesNotExist):
                pass

        TestAnswer.objects.bulk_create(test_answers)

        percentage = (correct / total * 100) if total > 0 else 0
        attempt.correct_answers = correct
        attempt.total_questions = total
        attempt.score = correct
        attempt.max_score = total
        attempt.percentage = round(percentage, 1)
        attempt.time_taken = serializer.validated_data['time_taken']
        attempt.status = 'completed'
        attempt.completed_at = timezone.now()
        attempt.save()

        self._update_streak(request.user)
        self._check_achievements(request.user, attempt)

        return Response({
            'attempt_id': attempt.id,
            'score': attempt.score,
            'percentage': attempt.percentage,
            'correct_answers': correct,
            'total_questions': total,
            'message': 'Test muvaffaqiyatli yakunlandi!'
        })

    def _update_streak(self, user):
        today = timezone.now().date()
        streak, _ = DailyStreak.objects.get_or_create(user=user)
        if streak.last_activity == today:
            return
        if streak.last_activity and (today - streak.last_activity).days == 1:
            streak.current_streak += 1
        else:
            streak.current_streak = 1
        streak.longest_streak = max(streak.longest_streak, streak.current_streak)
        streak.last_activity = today
        streak.total_xp += 10
        streak.save()

    def _check_achievements(self, user, attempt):
        completed = TestAttempt.objects.filter(user=user, status='completed').count()
        milestones = [(1, 'first_test'), (10, 'tests_10'), (50, 'tests_50'), (100, 'tests_100')]
        for count, atype in milestones:
            if completed == count:
                try:
                    ach = Achievement.objects.get(achievement_type=atype)
                    UserAchievement.objects.get_or_create(user=user, achievement=ach)
                except Achievement.DoesNotExist:
                    pass

        if attempt.percentage == 100:
            try:
                ach = Achievement.objects.get(achievement_type='perfect_score')
                UserAchievement.objects.get_or_create(user=user, achievement=ach)
            except Achievement.DoesNotExist:
                pass


class TestHistoryView(generics.ListAPIView):
    serializer_class = TestAttemptSerializer

    def get_queryset(self):
        return TestAttempt.objects.filter(
            user=self.request.user, status='completed'
        ).select_related('direction').prefetch_related('subjects')


class TestResultView(generics.RetrieveAPIView):
    serializer_class = TestAttemptDetailSerializer

    def get_queryset(self):
        return TestAttempt.objects.filter(user=self.request.user)


class UserProgressView(APIView):
    def get(self, request):
        user = request.user
        attempts = TestAttempt.objects.filter(user=user, status='completed')

        stats = attempts.aggregate(
            total=Count('id'),
            avg_score=Avg('percentage'),
            best_score=Max('percentage'),
        )

        by_type = attempts.values('exam_type').annotate(
            count=Count('id'),
            avg=Avg('percentage')
        )

        streak, _ = DailyStreak.objects.get_or_create(user=user)
        achievements = UserAchievement.objects.filter(user=user).select_related('achievement')

        return Response({
            'stats': stats,
            'by_type': list(by_type),
            'streak': DailyStreakSerializer(streak).data,
            'achievements': UserAchievementSerializer(achievements, many=True).data,
            'recent_tests': TestAttemptSerializer(attempts[:5], many=True).data,
        })


class UpdateLessonProgressView(APIView):
    def post(self, request):
        lesson_id = request.data.get('lesson_id')
        watch_time = request.data.get('watch_time', 0)
        completed = request.data.get('completed', False)
        last_position = request.data.get('last_position', 0)

        progress, _ = LessonProgress.objects.get_or_create(
            user=request.user,
            lesson_id=lesson_id,
        )
        progress.watch_time = watch_time
        progress.completed = completed
        progress.last_position = last_position
        progress.save()

        return Response({'message': 'Progress saqlandi'})
