# LearnHub - Admissions Platform

A comprehensive admissions management system with role-based dashboards for students, admission checkers, and administrators.

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.2+-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-316192.svg)](https://www.postgresql.org/)

## 📚 Documentation

### Getting Started
- **[🚀 Quick Start Guide](QUICKSTART.md)** - Get up and running in 5 minutes
- **[📋 Project Summary](PROJECT_SUMMARY.md)** - What's included and how it works
- **[🔄 Workflow Guide](WORKFLOW.md)** - Complete workflow diagrams and examples

### Technical Documentation
- **[📖 API Documentation](API_DOCUMENTATION.md)** - Complete API reference with examples
- **[📁 Project Structure](STRUCTURE.md)** - Detailed architecture overview
- **[🚢 Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions

### Development
- **[✅ Development TODO](TODO.md)** - Roadmap and feature backlog

## 🚀 Features

### Student Dashboard
- Secure account creation and authentication
- Upload documents (transcripts, test scores, essays)
- Track application status in real-time
- Receive notifications via email and in-platform
- Request recommendation letters

### Admission Checker Dashboard
- View assigned applications
- Validate document authenticity
- Review essays and recommendation letters
- Add internal notes and evaluation tags
- Make decisions (Pass/Reject/Request Clarification)
- Batch actions and filtering

### Admin Dashboard
- User management (students, checkers)
- Application assignment to checkers
- Override decisions
- Audit logs
- System configuration
- CRM integration management

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Django 4.2+ with Django REST Framework
- PostgreSQL database
- JWT authentication
- Role-based access control (RBAC)

**Frontend:**
- React 18+ with TypeScript
- Vite build tool
- TailwindCSS for styling
- React Query for data fetching
- Zustand for state management

**Deployment:**
- Separate subdomains for each role
  - students.learnhub.com
  - checkers.learnhub.com
  - admin.learnhub.com

### Project Structure

```
learnhub/
├── backend/                 # Django backend
│   ├── apps/               # Django apps
│   │   ├── accounts/       # User authentication & profiles
│   │   ├── applications/   # Application management
│   │   ├── documents/      # Document uploads
│   │   ├── reviews/        # Review system
│   │   └── notifications/  # Notification system
│   ├── learnhub/          # Django project settings
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # Reusable components
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   └── types/         # TypeScript types
│   └── package.json
│
└── README.md
```

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Git

## 🛠️ Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE learnhub_db;
   CREATE USER postgres WITH PASSWORD 'postgres';
   GRANT ALL PRIVILEGES ON DATABASE learnhub_db TO postgres;
   ```

6. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

8. **Run development server:**
   ```bash
   python manage.py runserver
   ```

Backend will be available at: http://localhost:8000

**API Documentation:**
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

4. **Run development servers:**

   For **Student Dashboard:**
   ```bash
   npm run dev:student
   ```
   Available at: http://localhost:3000

   For **Checker Dashboard:**
   ```bash
   npm run dev:checker
   ```
   Available at: http://localhost:3001

   For **Admin Dashboard:**
   ```bash
   npm run dev:admin
   ```
   Available at: http://localhost:3002

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login and get JWT tokens
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/profile/` - Get user profile
- `PATCH /api/auth/profile/` - Update user profile

### Applications
- `GET /api/applications/` - List applications
- `POST /api/applications/` - Create application
- `GET /api/applications/{id}/` - Get application detail
- `PATCH /api/applications/{id}/` - Update application
- `POST /api/applications/{id}/submit/` - Submit application
- `POST /api/applications/{id}/assign/` - Assign to checker (admin)
- `PATCH /api/applications/{id}/status/` - Update status (checker/admin)

### Documents
- `GET /api/documents/` - List documents
- `POST /api/documents/` - Upload document
- `GET /api/documents/{id}/` - Get document
- `DELETE /api/documents/{id}/` - Delete document
- `POST /api/documents/{id}/verify/` - Verify document (checker/admin)

### Reviews
- `GET /api/reviews/` - List reviews
- `POST /api/reviews/` - Create review
- `GET /api/reviews/{id}/` - Get review
- `PATCH /api/reviews/{id}/` - Update review
- `POST /api/reviews/{id}/submit/` - Submit review

### Notifications
- `GET /api/notifications/` - List notifications
- `POST /api/notifications/mark-read/` - Mark as read
- `POST /api/notifications/mark-all-read/` - Mark all as read
- `GET /api/notifications/unread-count/` - Get unread count

## 🔐 User Roles

### Student
- Create and manage applications
- Upload documents
- View application status
- Request recommendation letters

### Checker
- View assigned applications
- Review documents and essays
- Add notes and tags
- Make decisions on applications

### Admin
- Full system access
- User management
- Application assignment
- System configuration

## 🎨 Frontend Components

The frontend is structured with:
- **Layouts:** Role-specific layouts with navigation
- **Pages:** Individual page components for each route
- **API Client:** Axios-based client with authentication
- **State Management:** Zustand for global state
- **Type Safety:** Full TypeScript coverage

## 🚢 Deployment

### Backend Deployment
1. Set `DEBUG=False` in production
2. Configure proper `SECRET_KEY`
3. Set up PostgreSQL database
4. Configure email settings
5. Set up static file serving
6. Use Gunicorn or uWSGI
7. Configure reverse proxy (Nginx)

### Frontend Deployment
1. Build for production: `npm run build`
2. Serve static files via CDN or web server
3. Configure environment variables
4. Set up subdomain routing

## 📝 Development Workflow

1. **Backend First:** Define models, serializers, and views
2. **API Documentation:** Use Swagger for API testing
3. **Frontend Development:** Build UI components
4. **Integration Testing:** Test end-to-end workflows
5. **Deployment:** Deploy to production servers

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📖 Additional Resources

- Django Documentation: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- React Documentation: https://react.dev/
- TypeScript: https://www.typescriptlang.org/

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License

## 👥 Support

For support, email support@learnhub.com or open an issue on GitHub.

---

**Built with ❤️ for seamless admissions management**
