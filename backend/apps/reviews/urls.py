from django.urls import path
from .views import (
    ReviewListCreateView, ReviewDetailView, ReviewSubmitView,
    ReviewTagListCreateView, DocumentReviewListCreateView
)

urlpatterns = [
    path('', ReviewListCreateView.as_view(), name='review-list-create'),
    path('<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    path('<int:pk>/submit/', ReviewSubmitView.as_view(), name='review-submit'),
    path('tags/', ReviewTagListCreateView.as_view(), name='review-tag-list-create'),
    path('document-reviews/', DocumentReviewListCreateView.as_view(), name='document-review-list-create'),
]
