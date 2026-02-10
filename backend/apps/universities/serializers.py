from rest_framework import serializers
from .models import University, Program


class UniversitySerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country.name', read_only=True)

    class Meta:
        model = University
        fields = ['id', 'name', 'country', 'country_name', 'qs_university_id', 'website_url', 'is_active']


class ProgramSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university.name', read_only=True)

    class Meta:
        model = Program
        fields = [
            'id', 'university', 'university_name', 'name', 'level',
            'intake_period', 'duration_months', 'tuition_fee', 'is_active'
        ]
