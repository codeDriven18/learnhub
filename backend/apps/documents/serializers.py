from rest_framework import serializers
from .models import Document, RecommendationLetterRequest, DocumentStatus


class DocumentSerializer(serializers.ModelSerializer):
    """Document serializer"""
    document_type_display = serializers.CharField(source='get_document_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    verified_by_name = serializers.CharField(source='verified_by.full_name', read_only=True, allow_null=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.full_name', read_only=True, allow_null=True)
    file_url = serializers.SerializerMethodField()
    file_extension = serializers.CharField(read_only=True)
    is_verified = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = [
            'file_name', 'file_size', 'mime_type', 'uploaded_at', 'updated_at',
            'status', 'verified_by', 'verified_at', 'verification_notes', 'uploaded_by'
        ]

    def get_file_url(self, obj):
        request = self.context.get('request')
        if not obj.file:
            return None
        url = obj.file.url
        return request.build_absolute_uri(url) if request else url
    
    def create(self, validated_data):
        # Extract file metadata
        file_obj = validated_data.get('file')
        if file_obj:
            validated_data['file_name'] = file_obj.name
            validated_data['file_size'] = file_obj.size
            validated_data['mime_type'] = file_obj.content_type
        
        return super().create(validated_data)


class DocumentUploadSerializer(serializers.ModelSerializer):
    """Simplified serializer for document upload"""
    
    class Meta:
        model = Document
        fields = ['application', 'document_type', 'file', 'title', 'description']
    
    def create(self, validated_data):
        file_obj = validated_data.get('file')
        if file_obj:
            validated_data['file_name'] = file_obj.name
            validated_data['file_size'] = file_obj.size
            validated_data['mime_type'] = file_obj.content_type
        
        validated_data['status'] = DocumentStatus.PENDING
        return super().create(validated_data)


class DocumentVerificationSerializer(serializers.ModelSerializer):
    """Serializer for document verification"""
    
    class Meta:
        model = Document
        fields = ['status', 'verification_notes']


class RecommendationLetterRequestSerializer(serializers.ModelSerializer):
    """Recommendation letter request serializer"""
    
    class Meta:
        model = RecommendationLetterRequest
        fields = '__all__'
        read_only_fields = [
            'request_token', 'sent_at', 'is_submitted', 'submitted_at',
            'document', 'reminder_count', 'last_reminder_sent'
        ]


class RecommendationLetterRequestCreateSerializer(serializers.ModelSerializer):
    """Create recommendation letter request"""
    
    class Meta:
        model = RecommendationLetterRequest
        fields = [
            'application', 'recommender_name', 'recommender_email',
            'recommender_title', 'recommender_institution', 'relationship'
        ]
