from rest_framework import serializers
from .models import DTMDirection, DTMSubjectGroup, DTMPastYear
from apps.courses.serializers import SubjectSerializer


class DTMPastYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = DTMPastYear
        fields = ['year', 'grant_score', 'contract_score', 'total_applicants']


class DTMSubjectGroupSerializer(serializers.ModelSerializer):
    first_subject = SubjectSerializer(read_only=True)
    second_subject = SubjectSerializer(read_only=True)

    class Meta:
        model = DTMSubjectGroup
        fields = ['id', 'first_subject', 'second_subject', 'note']


class DTMDirectionListSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = DTMDirection
        fields = ['id', 'code', 'name', 'category', 'category_display', 'grant_places', 'contract_places']


class DTMDirectionDetailSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    subject_groups = DTMSubjectGroupSerializer(many=True, read_only=True)
    past_years = DTMPastYearSerializer(many=True, read_only=True)

    class Meta:
        model = DTMDirection
        fields = [
            'id', 'code', 'name', 'category', 'category_display',
            'university_type', 'description', 'grant_places', 'contract_places',
            'subject_groups', 'past_years'
        ]
