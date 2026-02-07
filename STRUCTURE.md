# LearnHub Project Structure

```
learnhub/
│
├── backend/                          # Django Backend
│   ├── apps/                        # Django Applications
│   │   ├── accounts/                # User Management & Authentication
│   │   │   ├── migrations/
│   │   │   ├── __init__.py
│   │   │   ├── admin.py            # Admin interface configuration
│   │   │   ├── models.py           # User, StudentProfile, CheckerProfile
│   │   │   ├── serializers.py      # API serializers
│   │   │   ├── urls.py             # URL routing
│   │   │   └── views.py            # API views
│   │   │
│   │   ├── applications/            # Application Management
│   │   │   ├── migrations/
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── models.py           # Application, ApplicationTimeline
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   │
│   │   ├── documents/               # Document Management
│   │   │   ├── migrations/
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── models.py           # Document, RecommendationLetterRequest
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   │
│   │   ├── reviews/                 # Review System
│   │   │   ├── migrations/
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── models.py           # Review, ReviewTag, DocumentReview
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   │
│   │   └── notifications/           # Notification System
│   │       ├── migrations/
│   │       ├── __init__.py
│   │       ├── admin.py
│   │       ├── models.py           # Notification, EmailTemplate
│   │       ├── serializers.py
│   │       ├── urls.py
│   │       ├── utils.py            # Notification utilities
│   │       └── views.py
│   │
│   ├── learnhub/                    # Django Project Settings
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py             # Main settings file
│   │   ├── urls.py                 # Main URL configuration
│   │   └── wsgi.py
│   │
│   ├── media/                       # User-uploaded files (development)
│   ├── staticfiles/                 # Collected static files
│   ├── .env.example                 # Environment variables template
│   ├── .gitignore
│   ├── manage.py                    # Django management script
│   ├── requirements.txt             # Python dependencies
│   ├── setup.bat                    # Windows setup script
│   └── setup.sh                     # Unix setup script
│
├── frontend/                        # React Frontend
│   ├── public/                      # Public assets
│   │   └── vite.svg
│   │
│   ├── src/                         # Source code
│   │   ├── api/                     # API Client
│   │   │   └── client.ts           # Axios configuration & API functions
│   │   │
│   │   ├── components/              # Reusable Components
│   │   │   └── (to be implemented)
│   │   │
│   │   ├── layouts/                 # Layout Components
│   │   │   ├── AdminLayout.tsx     # Admin portal layout
│   │   │   ├── AuthLayout.tsx      # Authentication layout
│   │   │   ├── CheckerLayout.tsx   # Checker portal layout
│   │   │   └── StudentLayout.tsx   # Student portal layout
│   │   │
│   │   ├── pages/                   # Page Components
│   │   │   ├── admin/              # Admin Pages
│   │   │   │   ├── Applications.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   └── Users.tsx
│   │   │   │
│   │   │   ├── auth/               # Authentication Pages
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   │
│   │   │   ├── checker/            # Checker Pages
│   │   │   │   ├── ApplicationReview.tsx
│   │   │   │   ├── Applications.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   └── Profile.tsx
│   │   │   │
│   │   │   └── student/            # Student Pages
│   │   │       ├── ApplicationDetail.tsx
│   │   │       ├── Applications.tsx
│   │   │       ├── Dashboard.tsx
│   │   │       └── Profile.tsx
│   │   │
│   │   ├── store/                   # State Management
│   │   │   └── authStore.ts        # Authentication store
│   │   │
│   │   ├── types/                   # TypeScript Types
│   │   │   └── index.ts            # All type definitions
│   │   │
│   │   ├── App.tsx                  # Main App component
│   │   ├── index.css               # Global styles
│   │   └── main.tsx                # Application entry point
│   │
│   ├── .env.example                 # Environment variables template
│   ├── .gitignore
│   ├── index.html                   # HTML template
│   ├── package.json                 # NPM dependencies & scripts
│   ├── postcss.config.js           # PostCSS configuration
│   ├── setup.bat                    # Windows setup script
│   ├── setup.sh                     # Unix setup script
│   ├── tailwind.config.js          # TailwindCSS configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── tsconfig.node.json          # TypeScript config for Vite
│   └── vite.config.ts              # Vite configuration
│
├── API_DOCUMENTATION.md             # API endpoint documentation
├── DEPLOYMENT.md                    # Deployment guide
├── README.md                        # Main project documentation
└── TODO.md                          # Development roadmap

```

## Key Directories

### Backend
- **apps/**: Modular Django apps following single responsibility principle
- **learnhub/**: Core project configuration
- **media/**: User-uploaded files (documents, images)
- **staticfiles/**: Collected static files for production

### Frontend
- **api/**: Centralized API communication layer
- **layouts/**: Role-specific page layouts with navigation
- **pages/**: Individual page components organized by role
- **store/**: Global state management with Zustand
- **types/**: TypeScript type definitions for type safety

## Architecture Highlights

1. **Backend (Django)**
   - RESTful API design
   - JWT authentication
   - Role-based access control
   - PostgreSQL database
   - File upload handling
   - Email notifications

2. **Frontend (React)**
   - TypeScript for type safety
   - Component-based architecture
   - React Query for data fetching
   - Zustand for state management
   - TailwindCSS for styling
   - Vite for fast development

3. **Communication**
   - REST API with JSON
   - JWT tokens for authentication
   - Axios for HTTP requests
   - Real-time updates via polling (WebSocket future enhancement)

4. **Deployment**
   - Separate subdomains for each role
   - Single backend serving all frontends
   - PostgreSQL for data persistence
   - S3 for file storage (optional)
