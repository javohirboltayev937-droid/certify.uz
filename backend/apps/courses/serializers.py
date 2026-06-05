from rest_framework import serializers
from .models import Subject, Course, Lesson, StudyMaterial, Enrollment


class SubjectSerializer(serializers.ModelSerializer):
    course_count = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = ['id', 'name', 'slug', 'subject_type', 'icon', 'color', 'description', 'course_count']

    def get_course_count(self, obj):
        return obj.courses.filter(is_active=True).count()


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'lesson_type', 'video_url', 'content', 'duration', 'is_free', 'order']


class StudyMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyMaterial
        fields = ['id', 'title', 'material_type', 'file', 'url']


class CourseListSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    subject_icon = serializers.CharField(source='subject.icon', read_only=True)
    subject_color = serializers.CharField(source='subject.color', read_only=True)
    enrolled_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description', 'thumbnail', 'level',
            'is_premium', 'total_lessons', 'total_duration',
            'subject_name', 'subject_icon', 'subject_color', 'enrolled_count'
        ]

    def get_enrolled_count(self, obj):
        return obj.enrollments.count()


class CourseDetailSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    materials = StudyMaterialSerializer(many=True, read_only=True)
    enrolled_count = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description', 'thumbnail', 'level',
            'is_premium', 'total_lessons', 'total_duration', 'subject',
            'lessons', 'materials', 'enrolled_count', 'is_enrolled', 'created_at'
        ]

    def get_enrolled_count(self, obj):
        return obj.enrollments.count()

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.enrollments.filter(user=request.user).exists()
        return False


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'enrolled_at', 'completed', 'completed_at']
