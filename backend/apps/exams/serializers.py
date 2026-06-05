from rest_framework import serializers
from .models import ExamType, ExamSection, MockExam, IELTSTip, NationalCert


class ExamSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamSection
        fields = ['id', 'name', 'section_type', 'description', 'duration_minutes', 'max_score', 'order']


class ExamTypeSerializer(serializers.ModelSerializer):
    sections = ExamSectionSerializer(many=True, read_only=True)
    mock_exam_count = serializers.SerializerMethodField()

    class Meta:
        model = ExamType
        fields = [
            'id', 'name', 'slug', 'exam_type', 'description', 'logo', 'color',
            'is_premium', 'duration_minutes', 'total_sections', 'passing_score',
            'validity_years', 'fee_usd', 'official_website', 'sections', 'mock_exam_count'
        ]

    def get_mock_exam_count(self, obj):
        return obj.mock_exams.filter(is_active=True).count()


class MockExamSerializer(serializers.ModelSerializer):
    exam_type_name = serializers.CharField(source='exam_type.name', read_only=True)

    class Meta:
        model = MockExam
        fields = [
            'id', 'title', 'description', 'level', 'duration_minutes',
            'total_questions', 'is_premium', 'order', 'exam_type_name'
        ]


class IELTSTipSerializer(serializers.ModelSerializer):
    class Meta:
        model = IELTSTip
        fields = ['id', 'section', 'title', 'content', 'order']


class NationalCertSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    subject_icon = serializers.CharField(source='subject.icon', read_only=True)

    class Meta:
        model = NationalCert
        fields = [
            'id', 'subject_name', 'subject_icon', 'level', 'title',
            'description', 'requirements', 'duration_minutes',
            'total_questions', 'passing_percentage', 'fee_uzs'
        ]
