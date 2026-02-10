from rest_framework import viewsets
from apps.accounts.permissions import IsAdminRole
from .models import AnalyticsDaily
from .serializers import AnalyticsDailySerializer


class AnalyticsDailyViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = AnalyticsDaily.objects.all()
	serializer_class = AnalyticsDailySerializer
	permission_classes = [IsAdminRole]
