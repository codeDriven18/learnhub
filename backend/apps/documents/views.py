from rest_framework import generics, status, permissions, parsers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Document, RecommendationLetterRequest, DocumentStatus
from .serializers import (
    DocumentSerializer, DocumentUploadSerializer, DocumentVerificationSerializer,
    RecommendationLetterRequestSerializer, RecommendationLetterRequestCreateSerializer
)
from apps.applications.models import Application
from apps.notifications.utils import create_notification
from apps.notifications.models import NotificationType


class DocumentListCreateView(generics.ListCreateAPIView):
    """List and upload documents"""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    
    def get_queryset(self):
        user = self.request.user
        application_id = self.request.query_params.get('application_id')
        
        if user.is_student():
            queryset = Document.objects.filter(application__student=user)
        elif user.is_checker():
            queryset = Document.objects.filter(application__assigned_checker=user)
        elif user.is_admin():
            queryset = Document.objects.all()
        else:
            queryset = Document.objects.none()
        
        if application_id:
            queryset = queryset.filter(application_id=application_id)
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DocumentUploadSerializer
        return DocumentSerializer
    
    def perform_create(self, serializer):
        document = serializer.save(uploaded_by=self.request.user)
        
        # Notify assigned checker if exists
        if document.application.assigned_checker:
            create_notification(
                user=document.application.assigned_checker,
                notification_type=NotificationType.APPLICATION_UPDATED,
                title='New Document Uploaded',
                message=f'A new document has been uploaded for Application #{document.application.id}',
                application_id=document.application.id,
                document_id=document.id
            )


class DocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, and delete document"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DocumentSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        if user.is_student():
            return Document.objects.filter(application__student=user)
        elif user.is_checker():
            return Document.objects.filter(application__assigned_checker=user)
        elif user.is_admin():
            return Document.objects.all()
        
        return Document.objects.none()


class DocumentVerifyView(APIView):
    """Verify or reject document (checker/admin only)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        if not (request.user.is_checker() or request.user.is_admin()):
            return Response(
                {'error': 'Only checkers and admins can verify documents'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        document = get_object_or_404(Document, pk=pk)
        serializer = DocumentVerificationSerializer(document, data=request.data, partial=True)
        
        if serializer.is_valid():
            document = serializer.save(
                verified_by=request.user,
                verified_at=timezone.now()
            )
            
            # Notify student
            notification_type = (
                NotificationType.DOCUMENT_VERIFIED
                if document.status == DocumentStatus.VERIFIED
                else NotificationType.DOCUMENT_REJECTED
            )
            
            create_notification(
                user=document.application.student,
                notification_type=notification_type,
                title=f'Document {document.get_status_display()}',
                message=f'Your {document.get_document_type_display()} has been {document.get_status_display().lower()}.',
                application_id=document.application.id,
                document_id=document.id
            )
            
            return Response(DocumentSerializer(document).data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RecommendationLetterRequestListCreateView(generics.ListCreateAPIView):
    """List and create recommendation letter requests"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        application_id = self.request.query_params.get('application_id')
        
        if user.is_student():
            queryset = RecommendationLetterRequest.objects.filter(application__student=user)
        elif user.is_checker():
            queryset = RecommendationLetterRequest.objects.filter(application__assigned_checker=user)
        elif user.is_admin():
            queryset = RecommendationLetterRequest.objects.all()
        else:
            queryset = RecommendationLetterRequest.objects.none()
        
        if application_id:
            queryset = queryset.filter(application_id=application_id)
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RecommendationLetterRequestCreateSerializer
        return RecommendationLetterRequestSerializer
    
    def perform_create(self, serializer):
        import secrets
        from datetime import timedelta
        
        # Generate secure token
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(days=30)
        
        request_obj = serializer.save(
            request_token=token,
            expires_at=expires_at
        )
        
        # TODO: Send email to recommender with upload link
        # send_recommendation_request_email(request_obj)


class RecommendationLetterRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, and delete recommendation letter request"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RecommendationLetterRequestSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        if user.is_student():
            return RecommendationLetterRequest.objects.filter(application__student=user)
        elif user.is_admin():
            return RecommendationLetterRequest.objects.all()
        
        return RecommendationLetterRequest.objects.none()
