# 🔄 Application Workflow

## Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        STUDENT JOURNEY                          │
└─────────────────────────────────────────────────────────────────┘

1. REGISTRATION & LOGIN
   ┌──────────────┐
   │   Register   │ → Create account (Student role)
   │    Login     │ → Authenticate with JWT
   └──────────────┘
         ↓
2. CREATE APPLICATION
   ┌──────────────────────────┐
   │  Fill Application Form   │
   │  - Program Name          │
   │  - Academic Year         │
   │  - Personal Statement    │
   └──────────────────────────┘
         ↓
3. UPLOAD DOCUMENTS
   ┌──────────────────────────┐
   │   Upload Required Docs   │
   │  ✓ Transcript            │
   │  ✓ Test Scores           │
   │  ✓ Essays                │
   │  ○ Portfolio (optional)  │
   └──────────────────────────┘
         ↓
4. REQUEST RECOMMENDATION LETTERS
   ┌──────────────────────────┐
   │  Request Rec Letters     │
   │  - Professor Email       │
   │  - Send Secure Link      │
   └──────────────────────────┘
         ↓
5. SUBMIT APPLICATION
   ┌──────────────────────────┐
   │  Review & Submit         │
   │  Status: SUBMITTED       │
   └──────────────────────────┘
         ↓
6. WAIT FOR REVIEW
   ┌──────────────────────────┐
   │  Track Application       │
   │  Status: UNDER_REVIEW    │
   │  Receive Notifications   │
   └──────────────────────────┘
         ↓
7. RECEIVE DECISION
   ┌──────────────────────────┐
   │    Final Decision        │
   │  ✓ PASSED                │
   │  ✗ REJECTED              │
   │  ↻ NEEDS_REVISION        │
   └──────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN JOURNEY                            │
└─────────────────────────────────────────────────────────────────┘

1. VIEW APPLICATIONS
   ┌──────────────────────────┐
   │  All Applications List   │
   │  - Filter by Status      │
   │  - Search by Student     │
   │  - Sort by Date          │
   └──────────────────────────┘
         ↓
2. ASSIGN TO CHECKER
   ┌──────────────────────────┐
   │  Select Checker          │
   │  - View Workload         │
   │  - Assign Application    │
   │  Status: UNDER_REVIEW    │
   └──────────────────────────┘
         ↓
3. MONITOR PROGRESS
   ┌──────────────────────────┐
   │  Track Reviews           │
   │  - Pending Reviews       │
   │  - Completed Reviews     │
   │  - Override if needed    │
   └──────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        CHECKER JOURNEY                          │
└─────────────────────────────────────────────────────────────────┘

1. VIEW ASSIGNED APPLICATIONS
   ┌──────────────────────────┐
   │  My Assigned Apps        │
   │  - Priority Queue        │
   │  - Deadline Tracking     │
   └──────────────────────────┘
         ↓
2. REVIEW APPLICATION
   ┌──────────────────────────┐
   │  Read Documents          │
   │  ✓ Verify Transcript     │
   │  ✓ Check Test Scores     │
   │  ✓ Read Essays           │
   │  ✓ Review Rec Letters    │
   └──────────────────────────┘
         ↓
3. EVALUATE & SCORE
   ┌──────────────────────────┐
   │  Scoring System          │
   │  - Academic: 1-10        │
   │  - Essay: 1-10           │
   │  - Recommendations: 1-10 │
   │  - Overall: 1-10         │
   └──────────────────────────┘
         ↓
4. ADD NOTES & TAGS
   ┌──────────────────────────┐
   │  Internal Notes          │
   │  Tags:                   │
   │  • Strong Candidate      │
   │  • Weak Essay            │
   │  • Missing Documents     │
   └──────────────────────────┘
         ↓
5. MAKE DECISION
   ┌──────────────────────────┐
   │  Decision Options        │
   │  ✓ PASS                  │
   │  ✗ REJECT                │
   │  ↻ REQUEST_CLARIFICATION │
   │  ➜ FORWARD_TO_QS         │
   └──────────────────────────┘
         ↓
6. SUBMIT REVIEW
   ┌──────────────────────────┐
   │  Submit Review           │
   │  - Notify Student        │
   │  - Update Status         │
   └──────────────────────────┘
```

## Status Flow Diagram

```
┌─────────┐
│  DRAFT  │ ← Student creates application
└────┬────┘
     │ Student submits
     ↓
┌───────────┐
│ SUBMITTED │ ← Waiting for assignment
└────┬──────┘
     │ Admin assigns to checker
     ↓
┌──────────────┐
│ UNDER_REVIEW │ ← Checker is reviewing
└──────┬───────┘
       │
       ├─→ Missing docs ─→ ┌──────────────────────┐
       │                   │ DOCUMENTS_INCOMPLETE │
       │                   └──────────────────────┘
       │
       ├─→ Checker passes → ┌────────┐
       │                    │ PASSED │ → Forward to QS
       │                    └────────┘
       │
       ├─→ Checker rejects → ┌──────────┐
       │                     │ REJECTED │
       │                     └──────────┘
       │
       └─→ Needs revision → ┌────────────────┐
                            │ NEEDS_REVISION │
                            └────────────────┘
                                     ↓
                            Student revises & resubmits
                                     ↓
                            Back to UNDER_REVIEW
```

## Document Verification Flow

```
Student Uploads Document
         ↓
┌─────────────┐
│   PENDING   │ ← Awaiting verification
└──────┬──────┘
       │ Checker reviews
       ↓
┌──────────────┐
│  Authentic?  │
│  Complete?   │
└──────┬───────┘
       │
       ├─→ Yes ─→ ┌──────────┐
       │          │ VERIFIED │ ✓
       │          └──────────┘
       │
       ├─→ No ──→ ┌──────────┐
       │          │ REJECTED │ ✗
       │          └──────────┘
       │
       └─→ Issues → ┌────────────────────┐
                    │ NEEDS_RESUBMISSION │ ↻
                    └────────────────────┘
```

## Notification Flow

```
Event Occurs (e.g., Status Change)
         ↓
┌──────────────────────┐
│ Create Notification  │
└──────────┬───────────┘
           │
           ├─→ In-Platform ─→ ┌─────────────┐
           │                  │ Notification │
           │                  │   Center     │
           │                  └─────────────┘
           │
           └─→ Email ────────→ ┌─────────────┐
                               │ Email Queue │
                               └─────────────┘
```

## Role Permissions Matrix

```
┌──────────────────────┬─────────┬─────────┬─────────┐
│      Action          │ Student │ Checker │  Admin  │
├──────────────────────┼─────────┼─────────┼─────────┤
│ Create Application   │    ✓    │    ✗    │    ✗    │
│ Upload Documents     │    ✓    │    ✗    │    ✗    │
│ Submit Application   │    ✓    │    ✗    │    ✗    │
│ View Own Apps        │    ✓    │    ✗    │    ✗    │
├──────────────────────┼─────────┼─────────┼─────────┤
│ View Assigned Apps   │    ✗    │    ✓    │    ✓    │
│ Review Application   │    ✗    │    ✓    │    ✓    │
│ Verify Documents     │    ✗    │    ✓    │    ✓    │
│ Make Decision        │    ✗    │    ✓    │    ✓    │
│ Add Internal Notes   │    ✗    │    ✓    │    ✓    │
├──────────────────────┼─────────┼─────────┼─────────┤
│ Assign Applications  │    ✗    │    ✗    │    ✓    │
│ View All Apps        │    ✗    │    ✗    │    ✓    │
│ Manage Users         │    ✗    │    ✗    │    ✓    │
│ Override Decisions   │    ✗    │    ✗    │    ✓    │
│ System Settings      │    ✗    │    ✗    │    ✓    │
└──────────────────────┴─────────┴─────────┴─────────┘
```

## API Request Flow

```
Client (React)
     │
     │ 1. Request with JWT token
     ↓
┌──────────────┐
│   Axios      │
│  Interceptor │ ← Adds Authorization header
└──────┬───────┘
       │ 2. HTTP Request
       ↓
┌──────────────┐
│   Django     │
│   Middleware │ ← JWT Authentication
└──────┬───────┘
       │ 3. Authenticated Request
       ↓
┌──────────────┐
│   ViewSet    │
│  Permissions │ ← Check role permissions
└──────┬───────┘
       │ 4. Authorized Request
       ↓
┌──────────────┐
│   Database   │ ← Query/Update
└──────┬───────┘
       │ 5. Data
       ↓
┌──────────────┐
│  Serializer  │ ← Format response
└──────┬───────┘
       │ 6. JSON Response
       ↓
Client (React) ← Update UI
```

## Data Flow Example: Creating Application

```
1. Student fills form in React
        ↓
2. Click "Create Application"
        ↓
3. POST /api/applications/
   {
     "program_name": "Master of CS",
     "academic_year": "2026-2027",
     ...
   }
        ↓
4. Backend validates data
        ↓
5. Create Application record
   - student = current_user
   - status = DRAFT
        ↓
6. Create Timeline event
   - event_type = "created"
        ↓
7. Return application data
        ↓
8. React updates UI
   - Show success message
   - Redirect to application detail
```

## File Upload Flow

```
Student selects file
        ↓
File validation (client-side)
- Max size: 10MB
- Allowed types: pdf, doc, docx, jpg, png
        ↓
Create FormData
        ↓
POST /api/documents/
Content-Type: multipart/form-data
        ↓
Backend receives file
        ↓
Save to storage
- Local: media/documents/
- Production: S3 bucket
        ↓
Create Document record
- file_name, file_size, mime_type
- status = PENDING
        ↓
Return document metadata
        ↓
Update UI
- Show uploaded file
- Display status
```

## Real-World Timeline Example

```
Day 1:
  09:00 - Student creates account
  09:30 - Student fills application form
  10:00 - Student uploads transcript
  10:15 - Student uploads test scores
  11:00 - Student writes and uploads essay
  14:00 - Student requests 2 recommendation letters
  14:30 - Student submits application
          Status: SUBMITTED ✓

Day 2:
  09:00 - Admin reviews submitted applications
  09:30 - Admin assigns to Checker #1
          Status: UNDER_REVIEW
  10:00 - Checker receives notification
  10:30 - Checker starts review

Day 3-5:
  Checker reviews documents
  Checker reads essays
  Checker adds internal notes
  
Day 6:
  09:00 - Checker completes review
  09:30 - Checker submits decision: PASSED
  10:00 - Student receives notification
          Status: PASSED ✓
  10:30 - Application forwarded to QS

Total time: 6 days
```

This workflow system ensures:
- ✓ Transparency for students
- ✓ Efficient workflow for checkers
- ✓ Control for administrators
- ✓ Audit trail for compliance
