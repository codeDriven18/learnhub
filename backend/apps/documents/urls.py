from django.urls import path
from .views import (
    DocumentListCreateView, DocumentDetailView, DocumentVerifyView,
    RecommendationLetterRequestListCreateView, RecommendationLetterRequestDetailView
)

urlpatterns = [
    path('', DocumentListCreateView.as_view(), name='document-list-create'),
    path('<int:pk>/', DocumentDetailView.as_view(), name='document-detail'),
    path('<int:pk>/verify/', DocumentVerifyView.as_view(), name='document-verify'),
    
    path('recommendations/', RecommendationLetterRequestListCreateView.as_view(), name='recommendation-list-create'),
    path('recommendations/<int:pk>/', RecommendationLetterRequestDetailView.as_view(), name='recommendation-detail'),
]
