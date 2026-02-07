# 🚀 Quick Start Guide

Get LearnHub up and running in minutes!

## Prerequisites Check

✅ **Required Software:**
- Python 3.10 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Git

**Verify installations:**
```bash
python --version     # Should show 3.10+
node --version       # Should show 18+
psql --version       # Should show 14+
```

## Option 1: Automated Setup (Recommended)

### Windows

1. **Setup Backend:**
```cmd
cd backend
setup.bat
```

2. **Setup Frontend:**
```cmd
cd frontend
setup.bat
```

### Mac/Linux

1. **Setup Backend:**
```bash
cd backend
chmod +x setup.sh
./setup.sh
```

2. **Setup Frontend:**
```bash
cd frontend
chmod +x setup.sh
./setup.sh
```

## Option 2: Manual Setup

### Step 1: Database Setup

```bash
# Start PostgreSQL (if not running)
# Windows: Start via Services
# Mac: brew services start postgresql
# Linux: sudo service postgresql start

# Create database
psql -U postgres
```

```sql
CREATE DATABASE learnhub_db;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE learnhub_db TO postgres;
\q
```

### Step 2: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your settings (use default for development)

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
# Email: admin@learnhub.com
# Password: (your choice)

# Collect static files
python manage.py collectstatic --no-input

# Start backend server
python manage.py runserver
```

✅ **Backend running at:** http://localhost:8000

### Step 3: Frontend Setup

Open a **new terminal window:**

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env (default values work for local development)

# Start development server
# For Student Portal:
npm run dev:student

# For Checker Portal (new terminal):
npm run dev:checker

# For Admin Portal (new terminal):
npm run dev:admin
```

✅ **Frontend running at:**
- Student Portal: http://localhost:3000
- Checker Portal: http://localhost:3001
- Admin Portal: http://localhost:3002

## Step 4: Access the Application

### API & Admin Panel
- **API Root:** http://localhost:8000/api/
- **Swagger Docs:** http://localhost:8000/api/docs/
- **Django Admin:** http://localhost:8000/admin/
  - Login with superuser credentials

### Create Test Users

**Option A: Via Django Admin**
1. Go to http://localhost:8000/admin/
2. Navigate to Users
3. Add new users with different roles:
   - Student: role = STUDENT
   - Checker: role = CHECKER
   - Admin: role = ADMIN

**Option B: Via API (register as student)**
1. Go to http://localhost:3000
2. Click "Register"
3. Fill in details
4. Login

**Option C: Via Django Shell**
```bash
cd backend
python manage.py shell
```

```python
from apps.accounts.models import User, UserRole

# Create student
student = User.objects.create_user(
    email='student@test.com',
    password='student123',
    first_name='John',
    last_name='Doe',
    role=UserRole.STUDENT
)

# Create checker
checker = User.objects.create_user(
    email='checker@test.com',
    password='checker123',
    first_name='Jane',
    last_name='Smith',
    role=UserRole.CHECKER
)

# Create admin
admin = User.objects.create_user(
    email='admin@test.com',
    password='admin123',
    first_name='Admin',
    last_name='User',
    role=UserRole.ADMIN
)
```

## Step 5: Test the Workflow

### As Student (http://localhost:3000)
1. Login with student credentials
2. Create a new application
3. Upload documents (transcript, test scores, essay)
4. Submit application

### As Admin (http://localhost:3002)
1. Login with admin credentials
2. View all applications
3. Assign application to checker

### As Checker (http://localhost:3001)
1. Login with checker credentials
2. View assigned applications
3. Review documents
4. Add review notes
5. Make decision (Pass/Reject)

## Common Issues & Solutions

### Issue: Database connection failed
**Solution:** Ensure PostgreSQL is running and credentials in `.env` are correct

```bash
# Check if PostgreSQL is running
# Windows: Check Services
# Mac: brew services list
# Linux: sudo service postgresql status
```

### Issue: Port already in use
**Solution:** Kill process or use different port

```bash
# Windows: Find and kill process
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux: Find and kill process
lsof -ti:8000 | xargs kill -9
```

### Issue: Module not found
**Solution:** Ensure virtual environment is activated and dependencies installed

```bash
# Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Issue: CORS errors
**Solution:** Ensure backend CORS settings include frontend URL

In `backend/learnhub/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
]
```

### Issue: Static files not loading
**Solution:** Run collectstatic

```bash
cd backend
python manage.py collectstatic --no-input
```

## Development Tips

### Hot Reload
Both backend and frontend support hot reload:
- **Backend:** Automatically reloads on file changes
- **Frontend:** Vite provides instant HMR (Hot Module Replacement)

### API Testing
Use the built-in Swagger UI for testing API endpoints:
- http://localhost:8000/api/docs/

### Database Browser
Install a PostgreSQL GUI tool:
- **pgAdmin:** https://www.pgadmin.org/
- **DBeaver:** https://dbeaver.io/
- **TablePlus:** https://tableplus.com/

### Code Quality
Run linters and formatters:

```bash
# Backend
cd backend
black .
flake8 .

# Frontend
cd frontend
npm run lint
npm run format
```

## Next Steps

1. ✅ Read [README.md](README.md) for full documentation
2. ✅ Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
3. ✅ Check [TODO.md](TODO.md) for development roadmap
4. ✅ See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## Need Help?

- 📧 Email: support@learnhub.com
- 📖 Documentation: [README.md](README.md)
- 🐛 Issues: Open an issue on GitHub

---

**Happy Coding! 🎉**
