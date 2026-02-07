from django.urls import path
from .views import (
    NotificationListView, NotificationDetailView,
    NotificationMarkReadView, NotificationMarkAllReadView,
    NotificationUnreadCountView, EmailTemplateListView,
    EmailTemplateDetailView
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/', NotificationDetailView.as_view(), name='notification-detail'),
    path('mark-read/', NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('mark-all-read/', NotificationMarkAllReadView.as_view(), name='notification-mark-all-read'),
    path('unread-count/', NotificationUnreadCountView.as_view(), name='notification-unread-count'),
    
    path('templates/', EmailTemplateListView.as_view(), name='email-template-list'),
    path('templates/<int:pk>/', EmailTemplateDetailView.as_view(), name='email-template-detail'),
]
