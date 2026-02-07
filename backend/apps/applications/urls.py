from django.urls import path
from .views import (
    ApplicationListCreateView, ApplicationDetailView,
    ApplicationSubmitView, ApplicationAssignView, ApplicationStatusView
)

urlpatterns = [
    path('', ApplicationListCreateView.as_view(), name='application-list-create'),
    path('<int:pk>/', ApplicationDetailView.as_view(), name='application-detail'),
    path('<int:pk>/submit/', ApplicationSubmitView.as_view(), name='application-submit'),
    path('<int:pk>/assign/', ApplicationAssignView.as_view(), name='application-assign'),
    path('<int:pk>/status/', ApplicationStatusView.as_view(), name='application-status'),
]
