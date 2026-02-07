from rest_framework import serializers
from .models import Review, ReviewTagAssignment, DocumentReview, ReviewDecision


class ReviewTagSerializer(serializers.ModelSerializer):
    """Review tag serializer"""
    tag_display = serializers.CharField(source='get_tag_display', read_only=True)
    added_by_name = serializers.CharField(source='added_by.full_name', read_only=True, allow_null=True)
    
    class Meta:
        model = ReviewTagAssignment
        fields = '__all__'
        read_only_fields = ['created_at']


class DocumentReviewSerializer(serializers.ModelSerializer):
    """Document review serializer"""
    document_name = serializers.CharField(source='document.file_name', read_only=True)
    
    class Meta:
        model = DocumentReview
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ReviewListSerializer(serializers.ModelSerializer):
    """List view for reviews"""
    checker_name = serializers.CharField(source='checker.full_name', read_only=True)
    application_id = serializers.IntegerField(source='application.id', read_only=True)
    student_name = serializers.CharField(source='application.student.full_name', read_only=True)
    decision_display = serializers.CharField(source='get_decision_display', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'application', 'application_id', 'student_name', 'checker',
            'checker_name', 'overall_score', 'decision', 'decision_display',
            'is_complete', 'requires_attention', 'created_at', 'updated_at', 'submitted_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ReviewDetailSerializer(serializers.ModelSerializer):
    """Detailed review serializer"""
    checker_name = serializers.CharField(source='checker.full_name', read_only=True)
    application_id = serializers.IntegerField(source='application.id', read_only=True)
    student_name = serializers.CharField(source='application.student.full_name', read_only=True)
    decision_display = serializers.CharField(source='get_decision_display', read_only=True)
    tags = ReviewTagSerializer(many=True, read_only=True)
    document_reviews = DocumentReviewSerializer(many=True, read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['checker', 'created_at', 'updated_at', 'submitted_at']


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Create review serializer"""
    
    class Meta:
        model = Review
        fields = [
            'application', 'overall_score', 'academic_score', 'essay_score',
            'recommendation_score', 'extracurricular_score', 'internal_notes',
            'feedback_to_student', 'decision', 'is_complete', 'requires_attention'
        ]
    
    def create(self, validated_data):
        validated_data['checker'] = self.context['request'].user
        return super().create(validated_data)


class ReviewUpdateSerializer(serializers.ModelSerializer):
    """Update review serializer"""
    
    class Meta:
        model = Review
        fields = [
            'overall_score', 'academic_score', 'essay_score',
            'recommendation_score', 'extracurricular_score', 'internal_notes',
            'feedback_to_student', 'decision', 'is_complete', 'requires_attention'
        ]
