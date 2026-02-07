# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Login
```http
POST /auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Register
```http
POST /auth/register/
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "password_confirm": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Refresh Token
```http
POST /auth/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## Applications

### List Applications
```http
GET /applications/
Authorization: Bearer <token>

Response:
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "student": 1,
      "student_name": "John Doe",
      "program_name": "Master of Computer Science",
      "academic_year": "2026-2027",
      "status": "SUBMITTED",
      "status_display": "Submitted",
      ...
    }
  ]
}
```

### Create Application
```http
POST /applications/
Authorization: Bearer <token>
Content-Type: application/json

{
  "program_name": "Master of Computer Science",
  "academic_year": "2026-2027",
  "intake_period": "Fall 2026",
  "personal_statement": "I am passionate about..."
}
```

### Submit Application
```http
POST /applications/{id}/submit/
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "status": "SUBMITTED",
  ...
}
```

## Documents

### Upload Document
```http
POST /documents/
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "application": 1,
  "document_type": "TRANSCRIPT",
  "title": "University Transcript",
  "file": <file>
}
```

### Verify Document (Checker/Admin)
```http
POST /documents/{id}/verify/
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "VERIFIED",
  "verification_notes": "Document is authentic and complete."
}
```

## Reviews

### Create Review
```http
POST /reviews/
Authorization: Bearer <token>
Content-Type: application/json

{
  "application": 1,
  "overall_score": 8,
  "academic_score": 9,
  "essay_score": 7,
  "recommendation_score": 8,
  "internal_notes": "Strong candidate",
  "decision": "PASS"
}
```

### Submit Review
```http
POST /reviews/{id}/submit/
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "is_complete": true,
  "submitted_at": "2026-02-07T10:30:00Z",
  ...
}
```

## Notifications

### List Notifications
```http
GET /notifications/
Authorization: Bearer <token>

Query Parameters:
- is_read: boolean (filter by read status)
- type: string (filter by notification type)
```

### Mark as Read
```http
POST /notifications/mark-read/
Authorization: Bearer <token>
Content-Type: application/json

{
  "notification_ids": [1, 2, 3]
}
```

### Get Unread Count
```http
GET /notifications/unread-count/
Authorization: Bearer <token>

Response:
{
  "unread_count": 5
}
```

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Error Response Format

```json
{
  "detail": "Error message",
  "field_name": ["Error for specific field"]
}
```
