from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Subject, Course, Enrollment
from .serializers import (
    SubjectSerializer, CourseListSerializer, CourseDetailSerializer, EnrollmentSerializer
)


class SubjectListView(generics.ListAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Subject.objects.filter(is_active=True)


class CourseListView(generics.ListAPIView):
    serializer_class = CourseListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['subject__slug', 'level', 'is_premium']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']

    def get_queryset(self):
        return Course.objects.filter(is_active=True).select_related('subject')


class CourseDetailView(generics.RetrieveAPIView):
    serializer_class = CourseDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    queryset = Course.objects.filter(is_active=True)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class EnrollView(APIView):
    def post(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id, is_active=True)
        except Course.DoesNotExist:
            return Response({'error': 'Kurs topilmadi'}, status=status.HTTP_404_NOT_FOUND)

        if course.is_premium and not request.user.has_active_subscription:
            return Response(
                {'error': 'Bu kurs premium foydalanuvchilar uchun'},
                status=status.HTTP_403_FORBIDDEN
            )

        enrollment, created = Enrollment.objects.get_or_create(user=request.user, course=course)
        if created:
            return Response({'message': 'Kursga muvaffaqiyatli yozildingiz'}, status=status.HTTP_201_CREATED)
        return Response({'message': 'Siz allaqachon bu kursga yozilgansiz'})


class MyCoursesView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user).select_related('course__subject')
