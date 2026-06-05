from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from .models import DTMDirection, DTMSubjectGroup
from .serializers import DTMDirectionListSerializer, DTMDirectionDetailSerializer
from .data import CATEGORY_NAMES, SUBJECT_TEST_INFO


class DTMDirectionListView(generics.ListAPIView):
    serializer_class = DTMDirectionListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'code']

    def get_queryset(self):
        return DTMDirection.objects.filter(is_active=True).prefetch_related('subject_groups')


class DTMDirectionDetailView(generics.RetrieveAPIView):
    serializer_class = DTMDirectionDetailSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return DTMDirection.objects.filter(is_active=True).prefetch_related(
            'subject_groups__first_subject',
            'subject_groups__second_subject',
            'past_years'
        )


class DTMCategoriesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        categories = []
        for code, name in CATEGORY_NAMES.items():
            count = DTMDirection.objects.filter(category=code, is_active=True).count()
            categories.append({
                'code': code,
                'name': name,
                'count': count,
            })
        return Response(categories)


class DTMSubjectInfoView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, direction_id):
        try:
            direction = DTMDirection.objects.prefetch_related(
                'subject_groups__first_subject',
                'subject_groups__second_subject'
            ).get(id=direction_id, is_active=True)
        except DTMDirection.DoesNotExist:
            return Response({'error': 'Yo\'nalish topilmadi'}, status=404)

        groups = direction.subject_groups.all()
        subjects_info = []

        for group in groups:
            for subj in [group.first_subject, group.second_subject]:
                info = SUBJECT_TEST_INFO.get(subj.subject_type, {})
                subjects_info.append({
                    'id': subj.id,
                    'name': subj.name,
                    'subject_type': subj.subject_type,
                    'icon': subj.icon,
                    'color': subj.color,
                    'total_questions': info.get('total', 30),
                    'time_minutes': info.get('time', 30),
                })

        return Response({
            'direction': DTMDirectionListSerializer(direction).data,
            'subjects': subjects_info,
            'total_questions': sum(s['total_questions'] for s in subjects_info) + 30,
            'total_time': 180,
            'note': 'O\'zbek tili va matematika (30+30 savol) har qanday yo\'nalish uchun majburiy'
        })
