from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.utils import timezone
from .models import Application, ApplicationTimeline, ApplicationStatus, ApplicationStatusHistory
from .serializers import (
    ApplicationListSerializer, ApplicationDetailSerializer,
    ApplicationCreateSerializer, ApplicationUpdateSerializer,
    ApplicationStatusUpdateSerializer, ApplicationTimelineSerializer
)
from apps.notifications.utils import create_notification
from apps.notifications.models import NotificationType


class ApplicationListCreateView(generics.ListCreateAPIView):
    """List and create applications"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.is_student():
            return Application.objects.filter(student=user)
        elif user.is_checker():
            return Application.objects.filter(assigned_checker=user)
        elif user.is_admin():
            return Application.objects.all()
        
        return Application.objects.none()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ApplicationCreateSerializer
        return ApplicationListSerializer
    
    def perform_create(self, serializer):
        application = serializer.save()
        
        # Create timeline event
        ApplicationTimeline.objects.create(
            application=application,
            event_type='created',
            description='Application created',
            new_status=application.status,
            user=self.request.user
        )


class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, and delete application"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.is_student():
            return Application.objects.filter(student=user)
        elif user.is_checker():
            return Application.objects.filter(assigned_checker=user)
        elif user.is_admin():
            return Application.objects.all()
        
        return Application.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ApplicationUpdateSerializer
        return ApplicationDetailSerializer


class ApplicationSubmitView(APIView):
    """Submit application"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            application = Application.objects.get(pk=pk, student=request.user)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if application.status != ApplicationStatus.DRAFT:
            return Response(
                {'error': 'Application has already been submitted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if required documents are uploaded
        required_docs = ['TRANSCRIPT', 'TEST_SCORE', 'ESSAY']
        uploaded_docs = application.documents.values_list('document_type', flat=True)
        
        missing_docs = [doc for doc in required_docs if doc not in uploaded_docs]
        if missing_docs:
            return Response(
                {'error': f'Missing required documents: {", ".join(missing_docs)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update application status
        old_status = application.status
        application.status = ApplicationStatus.SUBMITTED
        application.submitted_at = timezone.now()
        application.save()

        ApplicationStatusHistory.objects.create(
            application=application,
            from_status=old_status,
            to_status=application.status,
            changed_by=request.user,
            note='Application submitted'
        )
        
        # Create timeline event
        ApplicationTimeline.objects.create(
            application=application,
            event_type='submitted',
            description='Application submitted for review',
            previous_status=old_status,
            new_status=application.status,
            user=request.user
        )
        
        # Create notification
        create_notification(
            user=request.user,
            notification_type=NotificationType.APPLICATION_SUBMITTED,
            title='Application Submitted',
            message=f'Your application for {application.program_name} has been submitted successfully.',
            application_id=application.id
        )
        
        serializer = ApplicationDetailSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ApplicationAssignView(APIView):
    """Assign application to checker (admin only)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        if not request.user.is_admin():
            return Response(
                {'error': 'Only admins can assign applications'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        
        checker_id = request.data.get('checker_id')
        if not checker_id:
            return Response({'error': 'checker_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        from apps.accounts.models import User, UserRole
        try:
            checker = User.objects.get(pk=checker_id, role__code=UserRole.CHECKER)
        except User.DoesNotExist:
            return Response({'error': 'Checker not found'}, status=status.HTTP_404_NOT_FOUND)
        
        application.assigned_checker = checker
        application.status = ApplicationStatus.UNDER_REVIEW
        application.review_started_at = timezone.now()
        application.save()

        ApplicationStatusHistory.objects.create(
            application=application,
            from_status=ApplicationStatus.SUBMITTED,
            to_status=application.status,
            changed_by=request.user,
            note='Application assigned to checker'
        )
        
        # Create timeline event
        ApplicationTimeline.objects.create(
            application=application,
            event_type='assigned',
            description=f'Application assigned to {checker.full_name}',
            new_status=application.status,
            user=request.user
        )
        
        # Notify checker
        create_notification(
            user=checker,
            notification_type=NotificationType.REVIEW_ASSIGNED,
            title='New Application Assigned',
            message=f'Application #{application.id} for {application.program_name} has been assigned to you.',
            application_id=application.id
        )
        
        serializer = ApplicationDetailSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ApplicationStatusView(APIView):
    """Update application status (checker/admin only)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request, pk):
        if not (request.user.is_checker() or request.user.is_admin()):
            return Response(
                {'error': 'Only checkers and admins can update application status'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ApplicationStatusUpdateSerializer(application, data=request.data, partial=True)
        if serializer.is_valid():
            old_status = application.status
            application = serializer.save()

            ApplicationStatusHistory.objects.create(
                application=application,
                from_status=old_status,
                to_status=application.status,
                changed_by=request.user,
                note='Status updated'
            )
            
            # Create timeline event
            ApplicationTimeline.objects.create(
                application=application,
                event_type='status_updated',
                description=f'Status changed from {old_status} to {application.status}',
                previous_status=old_status,
                new_status=application.status,
                user=request.user
            )
            
            # Notify student
            create_notification(
                user=application.student,
                notification_type=NotificationType.STATUS_CHANGED,
                title='Application Status Updated',
                message=f'Your application status has been updated to: {application.get_status_display()}',
                application_id=application.id
            )
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
