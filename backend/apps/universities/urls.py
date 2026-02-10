from rest_framework.routers import DefaultRouter
from .views import UniversityViewSet, ProgramViewSet

router = DefaultRouter()
router.register(r'universities', UniversityViewSet, basename='universities')
router.register(r'programs', ProgramViewSet, basename='programs')

urlpatterns = router.urls
