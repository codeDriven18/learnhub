from rest_framework import viewsets
from apps.accounts.permissions import IsAdminRole
from .models import Log, SystemEvent, FeatureFlag, SystemSetting
from .serializers import LogSerializer, SystemEventSerializer, FeatureFlagSerializer, SystemSettingSerializer


class LogViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = Log.objects.select_related('actor_user').all()
	serializer_class = LogSerializer
	permission_classes = [IsAdminRole]


class SystemEventViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = SystemEvent.objects.all()
	serializer_class = SystemEventSerializer
	permission_classes = [IsAdminRole]


class FeatureFlagViewSet(viewsets.ModelViewSet):
	queryset = FeatureFlag.objects.all()
	serializer_class = FeatureFlagSerializer
	permission_classes = [IsAdminRole]


class SystemSettingViewSet(viewsets.ModelViewSet):
	queryset = SystemSetting.objects.all()
	serializer_class = SystemSettingSerializer
	permission_classes = [IsAdminRole]
