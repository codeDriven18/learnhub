from rest_framework.routers import DefaultRouter
from .views import LogViewSet, SystemEventViewSet, FeatureFlagViewSet, SystemSettingViewSet

router = DefaultRouter()
router.register(r'logs', LogViewSet, basename='audit-logs')
router.register(r'events', SystemEventViewSet, basename='system-events')
router.register(r'features', FeatureFlagViewSet, basename='feature-flags')
router.register(r'settings', SystemSettingViewSet, basename='system-settings')

urlpatterns = router.urls
