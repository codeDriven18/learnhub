// User and Authentication Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'STUDENT' | 'CHECKER' | 'ADMIN';
  profile_photo?: string | null;
  profile_photo_url?: string | null;
  is_verified: boolean;
  date_joined: string;
  student_profile?: StudentProfile;
  checker_profile?: CheckerProfile;
  preferences?: UserPreference;
}

export interface StudentProfile {
  id: number;
  user: number;
  date_of_birth?: string;
  phone_number?: string;
  nationality?: string;
  street_address?: string;
  city?: string;
  state_province?: string;
  country?: string;
  postal_code?: string;
  current_education_level?: string;
  institution?: string;
  field_of_study?: string;
  gpa?: number;
  profile_completed: boolean;
}

export interface CheckerProfile {
  id: number;
  user: number;
  department?: string;
  specialization?: string;
  bio?: string;
  total_reviews: number;
  active_reviews: number;
  is_available: boolean;
}

export interface UserPreference {
  language: string;
  timezone: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  marketing_notifications: boolean;
  updated_at: string;
}

export interface UserSession {
  id: string;
  ip_address: string;
  user_agent: string;
  device_label?: string;
  created_at: string;
  last_seen_at: string;
  revoked_at?: string | null;
  is_active: boolean;
}

// Application Types
export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'DOCUMENTS_INCOMPLETE'
  | 'PASSED'
  | 'REJECTED'
  | 'NEEDS_REVISION'
  | 'FORWARDED_TO_QS';

export type ApplicationStage =
  | 'INITIAL_SUBMISSION'
  | 'DOCUMENT_VERIFICATION'
  | 'ESSAY_REVIEW'
  | 'FINAL_REVIEW'
  | 'COMPLETED';

export interface Application {
  id: number;
  student: number;
  student_name: string;
  program_name: string;
  academic_year: string;
  intake_period: string;
  status: ApplicationStatus;
  status_display: string;
  current_stage: ApplicationStage;
  stage_display: string;
  assigned_checker?: number;
  checker_name?: string;
  personal_statement?: string;
  additional_info?: string;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  is_complete: boolean;
  requires_attention: boolean;
}

// Document Types
export type DocumentType =
  | 'TRANSCRIPT'
  | 'TEST_SCORE'
  | 'ESSAY'
  | 'RECOMMENDATION_LETTER'
  | 'PORTFOLIO'
  | 'CERTIFICATE'
  | 'ID_DOCUMENT'
  | 'OTHER';

export type DocumentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_RESUBMISSION';

export interface Document {
  id: number;
  application: number;
  document_type: DocumentType;
  document_type_display: string;
  file: string;
  file_name: string;
  file_size: number;
  title: string;
  description?: string;
  status: DocumentStatus;
  status_display: string;
  verified_by?: number;
  verified_by_name?: string;
  verified_at?: string;
  verification_notes?: string;
  uploaded_at: string;
  is_verified: boolean;
}

// Review Types
export type ReviewDecision = 'PENDING' | 'PASS' | 'REJECT' | 'REQUEST_CLARIFICATION' | 'FORWARD_TO_QS';

export interface Review {
  id: number;
  application: number;
  application_id: number;
  student_name: string;
  checker: number;
  checker_name: string;
  overall_score?: number;
  academic_score?: number;
  essay_score?: number;
  recommendation_score?: number;
  extracurricular_score?: number;
  internal_notes?: string;
  feedback_to_student?: string;
  decision: ReviewDecision;
  decision_display: string;
  is_complete: boolean;
  requires_attention: boolean;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
}

// Notification Types
export type NotificationType =
  | 'APPLICATION_SUBMITTED'
  | 'APPLICATION_UPDATED'
  | 'DOCUMENT_VERIFIED'
  | 'DOCUMENT_REJECTED'
  | 'REVIEW_ASSIGNED'
  | 'REVIEW_COMPLETED'
  | 'STATUS_CHANGED'
  | 'RECOMMENDATION_REQUEST'
  | 'PASSED'
  | 'REJECTED'
  | 'NEEDS_REVISION'
  | 'GENERAL';

export interface Notification {
  id: number;
  user: number;
  notification_type: NotificationType;
  notification_type_display: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  application_id?: number;
  document_id?: number;
  review_id?: number;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  session_id?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  role?: 'STUDENT';
}
