# 🎮 LearnHub - Command Reference

## Quick Command Reference

### 🚀 Setup Commands

#### Windows
```bash
# Backend Setup
cd backend
setup.bat

# Frontend Setup
cd frontend
setup.bat
```

#### Mac/Linux
```bash
# Backend Setup
cd backend
chmod +x setup.sh
./setup.sh

# Frontend Setup
cd frontend
chmod +x setup.sh
./setup.sh
```

---

## 🔧 Backend Commands

### Development

```bash
# Start development server
python manage.py runserver

# Start on different port
python manage.py runserver 8001

# Run with specific settings
python manage.py runserver --settings=learnhub.settings_dev
```

### Database

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create specific app migrations
python manage.py makemigrations accounts

# Show migrations
python manage.py showmigrations

# SQL for migration
python manage.py sqlmigrate accounts 0001

# Reset database (careful!)
python manage.py flush
```

### Users

```bash
# Create superuser
python manage.py createsuperuser

# Change user password
python manage.py changepassword username

# Create custom users (shell)
python manage.py shell
>>> from apps.accounts.models import User, UserRole
>>> User.objects.create_user(email='test@test.com', password='password', role=UserRole.STUDENT)
```

### Static Files

```bash
# Collect static files
python manage.py collectstatic

# Collect without prompting
python manage.py collectstatic --no-input

# Clear static files
python manage.py collectstatic --clear --no-input
```

### Database Shell

```bash
# Django shell
python manage.py shell

# Django shell with iPython
python manage.py shell -i ipython

# Database shell
python manage.py dbshell
```

### Testing

```bash
# Run all tests
pytest

# Run specific app tests
pytest apps/accounts/

# Run with coverage
pytest --cov=apps

# Run specific test file
pytest apps/accounts/tests/test_models.py
```

### Code Quality

```bash
# Format code with Black
black .

# Check with Black (no changes)
black --check .

# Lint with flake8
flake8 .

# Type checking (if using mypy)
mypy apps/
```

### Utilities

```bash
# Check for issues
python manage.py check

# Validate templates
python manage.py validate_templates

# Show installed apps
python manage.py showmigrations

# Create app
python manage.py startapp myapp
```

---

## 🎨 Frontend Commands

### Development

```bash
# Student Portal (Port 3000)
npm run dev:student

# Checker Portal (Port 3001)
npm run dev:checker

# Admin Portal (Port 3002)
npm run dev:admin

# All portals (requires concurrently)
npm run dev:all
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Build with specific mode
npm run build -- --mode production
```

### Code Quality

```bash
# Lint TypeScript/React
npm run lint

# Lint and fix
npm run lint -- --fix

# Format with Prettier
npm run format

# Type check
npx tsc --noEmit
```

### Dependencies

```bash
# Install dependencies
npm install

# Install specific package
npm install package-name

# Install dev dependency
npm install -D package-name

# Update dependencies
npm update

# Check outdated packages
npm outdated

# Audit vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 🗄️ Database Commands

### PostgreSQL

```bash
# Connect to database
psql -U postgres -d learnhub_db

# Create database
createdb -U postgres learnhub_db

# Drop database
dropdb -U postgres learnhub_db

# Dump database
pg_dump -U postgres learnhub_db > backup.sql

# Restore database
psql -U postgres learnhub_db < backup.sql

# Export to CSV
psql -U postgres learnhub_db -c "COPY (SELECT * FROM users) TO '/path/to/file.csv' CSV HEADER"
```

### Inside psql

```sql
-- List databases
\l

-- Connect to database
\c learnhub_db

-- List tables
\dt

-- Describe table
\d users

-- List users
\du

-- Show table size
\dt+

-- Execute SQL file
\i /path/to/file.sql

-- Quit
\q
```

---

## 🐳 Docker Commands (Optional)

### Build and Run

```bash
# Build containers
docker-compose build

# Start containers
docker-compose up

# Start in background
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Execute command in container
docker-compose exec backend python manage.py migrate
```

---

## 🔍 Debugging Commands

### Backend Debugging

```bash
# Run with debug output
python manage.py runserver --verbosity 3

# Check for security issues
python manage.py check --deploy

# Shell with all models imported
python manage.py shell_plus

# Show URLs
python manage.py show_urls

# Profile code
python manage.py runprofileserver
```

### Frontend Debugging

```bash
# Check bundle size
npm run build -- --analyze

# Serve with source maps
npm run dev -- --sourcemap

# Check dependencies
npm list

# Find duplicate packages
npm dedupe
```

---

## 📊 Data Management

### Import/Export

```bash
# Export data to JSON
python manage.py dumpdata apps.accounts > accounts.json

# Export specific model
python manage.py dumpdata apps.accounts.User > users.json

# Import data
python manage.py loaddata accounts.json

# Export with natural keys
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission > backup.json
```

### Fixtures

```bash
# Load fixtures
python manage.py loaddata fixtures/initial_data.json

# Create fixtures
python manage.py dumpdata apps.accounts --indent 2 > fixtures/accounts.json
```

---

## 🔐 Security Commands

### Backend Security

```bash
# Check deployment settings
python manage.py check --deploy

# Generate secret key
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# Check for security issues
pip install safety
safety check

# Update dependencies
pip list --outdated
pip install -U package-name
```

### Frontend Security

```bash
# Audit packages
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (may break)
npm audit fix --force

# Check for updates
npm outdated
```

---

## 🚀 Production Commands

### Backend Production

```bash
# Collect static files
python manage.py collectstatic --no-input

# Migrate database
python manage.py migrate --no-input

# Create cache table
python manage.py createcachetable

# Run with Gunicorn
gunicorn learnhub.wsgi:application --bind 0.0.0.0:8000

# Run with workers
gunicorn learnhub.wsgi:application --workers 4 --bind 0.0.0.0:8000

# Run as daemon
gunicorn learnhub.wsgi:application --daemon --bind 0.0.0.0:8000
```

### Frontend Production

```bash
# Build optimized
npm run build

# Serve with static server
npx serve -s dist

# Upload to S3 (example)
aws s3 sync dist/ s3://your-bucket-name/
```

---

## 🔄 Git Commands (Quick Reference)

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/username/learnhub.git
git branch -M main
git push -u origin main

# Create feature branch
git checkout -b feature/new-feature

# Pull latest changes
git pull origin main

# Merge branch
git checkout main
git merge feature/new-feature
```

---

## 📝 Useful Aliases (Optional)

### Backend Aliases

Add to `.bashrc` or `.zshrc`:

```bash
alias pm='python manage.py'
alias pms='python manage.py runserver'
alias pmm='python manage.py makemigrations'
alias pmmig='python manage.py migrate'
alias pmsh='python manage.py shell'
alias pmsu='python manage.py createsuperuser'
alias pmc='python manage.py collectstatic --no-input'
```

### Frontend Aliases

```bash
alias ns='npm start'
alias nds='npm run dev:student'
alias ndc='npm run dev:checker'
alias nda='npm run dev:admin'
alias nb='npm run build'
alias nt='npm test'
```

---

## 🎯 Common Workflows

### New Feature Development

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes to code

# 3. Backend: Create migrations if needed
python manage.py makemigrations

# 4. Apply migrations
python manage.py migrate

# 5. Test locally
python manage.py runserver  # Backend
npm run dev:student         # Frontend

# 6. Commit changes
git add .
git commit -m "Add new feature"

# 7. Push to remote
git push origin feature/new-feature

# 8. Create pull request on GitHub
```

### Database Reset

```bash
# 1. Backup current data (optional)
python manage.py dumpdata > backup.json

# 2. Drop database
dropdb -U postgres learnhub_db

# 3. Create fresh database
createdb -U postgres learnhub_db

# 4. Run migrations
python manage.py migrate

# 5. Create superuser
python manage.py createsuperuser

# 6. Load fixtures (optional)
python manage.py loaddata fixtures/initial_data.json
```

### Production Deployment

```bash
# 1. Pull latest code
git pull origin main

# 2. Activate virtual environment
source venv/bin/activate

# 3. Install/update dependencies
pip install -r requirements.txt
npm install

# 4. Collect static files
python manage.py collectstatic --no-input

# 5. Run migrations
python manage.py migrate --no-input

# 6. Build frontend
npm run build

# 7. Restart services
sudo systemctl restart learnhub
sudo systemctl restart nginx
```

---

## 💡 Tips

1. **Use virtual environments** - Always activate before running Python commands
2. **Keep dependencies updated** - Regularly check for updates
3. **Commit often** - Small, frequent commits are better
4. **Test before deploy** - Always test locally first
5. **Backup database** - Before major changes
6. **Use .env files** - Never commit secrets to git
7. **Read logs** - Check logs when debugging
8. **Use aliases** - Save time with shortcuts

---

## 🆘 Troubleshooting Commands

```bash
# Backend: Check for errors
python manage.py check

# Backend: Verbose output
python manage.py runserver --verbosity 3

# Frontend: Clear cache
npm cache clean --force

# Frontend: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Database: Check connections
python manage.py dbshell

# View Python packages
pip list

# View Node packages
npm list
```

---

**📚 For more details, see the full documentation in [README.md](README.md)**
