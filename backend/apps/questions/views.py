from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
import random
import json
import logging
from .models import Question, Answer
from .serializers import QuestionSerializer, QuestionWithAnswerSerializer

logger = logging.getLogger(__name__)


class QuestionListView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['subject__slug', 'exam_type', 'difficulty']

    def get_queryset(self):
        return Question.objects.filter(is_active=True).prefetch_related('answers')


class GenerateTestView(APIView):
    """Test uchun tasodifiy savollar generatsiya qilish"""

    def post(self, request):
        subject_ids = request.data.get('subjects', [])
        count_per_subject = request.data.get('count', 30)
        exam_type = request.data.get('exam_type', 'dtm')
        difficulty = request.data.get('difficulty', None)

        all_questions = []
        for subject_id in subject_ids:
            qs = Question.objects.filter(
                subject_id=subject_id,
                exam_type=exam_type,
                is_active=True
            ).prefetch_related('answers')
            if difficulty:
                qs = qs.filter(difficulty=difficulty)
            questions = list(qs)
            random.shuffle(questions)
            all_questions.extend(questions[:count_per_subject])

        random.shuffle(all_questions)
        serializer = QuestionSerializer(all_questions, many=True)
        return Response({
            'questions': serializer.data,
            'total': len(all_questions),
        })


class AIGenerateTestView(APIView):
    """Claude AI yordamida yangi, har xil test savollarini generatsiya qilish"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from apps.courses.models import Subject
        from decouple import config

        subject_ids = request.data.get('subjects', [])
        direction_name = request.data.get('direction_name', '')
        count_per_subject = min(int(request.data.get('count', 20)), 30)
        exam_type = request.data.get('exam_type', 'dtm')

        api_key = config('ANTHROPIC_API_KEY', default='')
        all_questions = []

        for subject_id in subject_ids:
            try:
                subject = Subject.objects.get(id=subject_id)
            except Subject.DoesNotExist:
                continue

            if api_key:
                try:
                    questions = self._generate_with_claude(
                        subject, direction_name, count_per_subject, api_key
                    )
                    all_questions.extend(questions)
                    continue
                except Exception as e:
                    logger.warning(f"AI generation failed for {subject.name}: {e}")

            # Fallback: DB dan tasodifiy savollar
            qs = list(Question.objects.filter(
                subject=subject, exam_type=exam_type, is_active=True
            ).prefetch_related('answers'))
            random.shuffle(qs)
            all_questions.extend(qs[:count_per_subject])

        random.shuffle(all_questions)
        serializer = QuestionWithAnswerSerializer(all_questions, many=True)
        return Response({'questions': serializer.data, 'total': len(serializer.data)})

    def _generate_with_claude(self, subject, direction_name, count, api_key):
        import anthropic

        client = anthropic.Anthropic(api_key=api_key)
        context = f"{direction_name} yo'nalishi uchun " if direction_name else ""

        prompt = f"""Sen O'zbekiston DTM imtihon savollarini yozuvchi mutaxassissan.

{context}{subject.name} fani bo'yicha {count} ta test savoli yarat.
Savollar o'zbek tilida bo'lsin. Turli mavzularni qamrab olsin. Real DTM uslubida bo'lsin.

FAQAT JSON format, boshqa hech narsa yozma:
{{"questions":[{{"question_text":"savol","difficulty":"medium","topic":"mavzu","explanation":"tushuntirish","answers":[{{"order":"A","answer_text":"...","is_correct":false}},{{"order":"B","answer_text":"...","is_correct":true}},{{"order":"C","answer_text":"...","is_correct":false}},{{"order":"D","answer_text":"...","is_correct":false}}]}}]}}"""

        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=8192,
            messages=[{"role": "user", "content": prompt}]
        )

        text = message.content[0].text.strip()
        if "```" in text:
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]

        data = json.loads(text)
        raw_questions = data.get('questions', [])[:count]

        saved = []
        for q_data in raw_questions:
            answers_data = q_data.get('answers', [])
            if len(answers_data) != 4:
                continue
            if not any(a.get('is_correct') for a in answers_data):
                continue

            q = Question.objects.create(
                subject=subject,
                exam_type='dtm',
                difficulty=q_data.get('difficulty', 'medium'),
                question_text=q_data.get('question_text', ''),
                explanation=q_data.get('explanation', ''),
                topic=q_data.get('topic', ''),
                is_ai_generated=True,
            )
            for a_data in answers_data:
                Answer.objects.create(
                    question=q,
                    order=a_data.get('order', 'A'),
                    answer_text=a_data.get('answer_text', ''),
                    is_correct=a_data.get('is_correct', False),
                )
            q.refresh_from_db()
            # prefetch answers
            q.answers_list = list(q.answers.all())
            saved.append(q)

        return saved
