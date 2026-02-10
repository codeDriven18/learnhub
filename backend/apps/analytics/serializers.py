from rest_framework import serializers
from .models import AnalyticsDaily


class AnalyticsDailySerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsDaily
        fields = [
            'id', 'date', 'total_applications', 'new_applicants', 'reviews_completed',
            'documents_verified', 'avg_review_time_minutes'
        ]
