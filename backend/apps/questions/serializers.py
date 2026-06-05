from rest_framework import serializers
from .models import Question, Answer


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'answer_image', 'order']


class AnswerWithCorrectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'answer_image', 'order', 'is_correct']


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = Question
        fields = [
            'id', 'question_text', 'question_image', 'difficulty',
            'exam_type', 'points', 'answers', 'subject_name', 'topic', 'year'
        ]


class QuestionWithAnswerSerializer(serializers.ModelSerializer):
    answers = AnswerWithCorrectSerializer(many=True, read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = Question
        fields = [
            'id', 'question_text', 'question_image', 'difficulty',
            'exam_type', 'points', 'answers', 'subject_name', 'explanation',
            'explanation_image', 'topic', 'year'
        ]
