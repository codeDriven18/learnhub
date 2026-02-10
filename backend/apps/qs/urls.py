from rest_framework.routers import DefaultRouter
from .views import QSRankingViewSet

router = DefaultRouter()
router.register(r'', QSRankingViewSet, basename='qs-rankings')

urlpatterns = router.urls
