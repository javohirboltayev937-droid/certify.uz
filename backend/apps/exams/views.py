from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import ExamType, MockExam, IELTSTip, NationalCert
from .serializers import (
    ExamTypeSerializer, MockExamSerializer, IELTSTipSerializer, NationalCertSerializer
)


class ExamTypeListView(generics.ListAPIView):
    serializer_class = ExamTypeSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return ExamType.objects.filter(is_active=True).prefetch_related('sections')


class ExamTypeDetailView(generics.RetrieveAPIView):
    serializer_class = ExamTypeSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    queryset = ExamType.objects.filter(is_active=True)


class MockExamListView(generics.ListAPIView):
    serializer_class = MockExamSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['exam_type__slug', 'level', 'is_premium']

    def get_queryset(self):
        return MockExam.objects.filter(is_active=True).select_related('exam_type')


class IELTSTipsView(generics.ListAPIView):
    serializer_class = IELTSTipSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['section']

    def get_queryset(self):
        return IELTSTip.objects.filter(is_active=True)


class NationalCertListView(generics.ListAPIView):
    serializer_class = NationalCertSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['subject__slug', 'level']

    def get_queryset(self):
        return NationalCert.objects.filter(is_active=True).select_related('subject')
