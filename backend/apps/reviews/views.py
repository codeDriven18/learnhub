from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Review, ReviewTagAssignment, DocumentReview, ReviewDecision
from .serializers import (
    ReviewListSerializer, ReviewDetailSerializer,
    ReviewCreateSerializer, ReviewUpdateSerializer,
    ReviewTagSerializer, DocumentReviewSerializer
)
from apps.applications.models import Application, ApplicationStatus, ApplicationStatusHistory
from apps.notifications.utils import create_notification
from apps.notifications.models import NotificationType


class ReviewListCreateView(generics.ListCreateAPIView):
    """List and create reviews"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        application_id = self.request.query_params.get('application_id')
        
        if user.is_checker():
            queryset = Review.objects.filter(checker=user)
        elif user.is_admin():
            queryset = Review.objects.all()
        elif user.is_student():
            # Students can only see reviews for their applications
            queryset = Review.objects.filter(application__student=user)
        else:
            queryset = Review.objects.none()
        
        if application_id:
            queryset = queryset.filter(application_id=application_id)
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReviewCreateSerializer
        return ReviewListSerializer
    
    def perform_create(self, serializer):
        review = serializer.save()
        
        # Update checker's active reviews count
        if hasattr(self.request.user, 'checker_profile'):
            profile = self.request.user.checker_profile
            profile.active_reviews += 1
            profile.save()


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, and delete review"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.is_checker():
            return Review.objects.filter(checker=user)
        elif user.is_admin():
            return Review.objects.all()
        elif user.is_student():
            return Review.objects.filter(application__student=user)
        
        return Review.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ReviewUpdateSerializer
        return ReviewDetailSerializer


class ReviewSubmitView(APIView):
    """Submit review and update application status"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        if not request.user.is_checker():
            return Response(
                {'error': 'Only checkers can submit reviews'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            review = Review.objects.get(pk=pk, checker=request.user)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if review.is_complete:
            return Response(
                {'error': 'Review has already been submitted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mark review as complete
        review.is_complete = True
        review.submitted_at = timezone.now()
        review.save()
        
        # Update application based on decision
        application = review.application
        
        if review.decision == ReviewDecision.PASS:
            application.status = ApplicationStatus.PASSED
        elif review.decision == ReviewDecision.REJECT:
            application.status = ApplicationStatus.REJECTED
        elif review.decision == ReviewDecision.REQUEST_CLARIFICATION:
            application.status = ApplicationStatus.NEEDS_REVISION
        elif review.decision == ReviewDecision.FORWARD_TO_QS:
            application.status = ApplicationStatus.FORWARDED_TO_QS
        
        application.review_completed_at = timezone.now()
        application.save()

        ApplicationStatusHistory.objects.create(
            application=application,
            from_status=ApplicationStatus.UNDER_REVIEW,
            to_status=application.status,
            changed_by=request.user,
            note='Review submitted'
        )
        
        # Update checker stats
        if hasattr(request.user, 'checker_profile'):
            profile = request.user.checker_profile
            profile.total_reviews += 1
            profile.active_reviews = max(0, profile.active_reviews - 1)
            profile.save()
        
        # Notify student
        create_notification(
            user=application.student,
            notification_type=NotificationType.REVIEW_COMPLETED,
            title='Application Review Completed',
            message=f'Your application for {application.program_name} has been reviewed.',
            application_id=application.id,
            review_id=review.id
        )
        
        serializer = ReviewDetailSerializer(review)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReviewTagListCreateView(generics.ListCreateAPIView):
    """List and create review tags"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReviewTagSerializer
    
    def get_queryset(self):
        review_id = self.request.query_params.get('review_id')
        queryset = ReviewTagAssignment.objects.all()
        
        if review_id:
            queryset = queryset.filter(review_id=review_id)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)


class DocumentReviewListCreateView(generics.ListCreateAPIView):
    """List and create document reviews"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DocumentReviewSerializer
    
    def get_queryset(self):
        review_id = self.request.query_params.get('review_id')
        queryset = DocumentReview.objects.all()
        
        if review_id:
            queryset = queryset.filter(review_id=review_id)
        
        return queryset
