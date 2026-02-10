from rest_framework.routers import DefaultRouter
from .views import AnalyticsDailyViewSet

router = DefaultRouter()
router.register(r'daily', AnalyticsDailyViewSet, basename='analytics-daily')

urlpatterns = router.urls
