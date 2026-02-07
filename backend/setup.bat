@echo off
REM LearnHub Backend Setup Script for Windows

echo ========================================
echo LearnHub Backend Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    exit /b 1
)

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo Please edit .env file with your configuration
)

REM Check if PostgreSQL is accessible
echo.
echo ========================================
echo Database Setup
echo ========================================
echo Please ensure PostgreSQL is running and create a database:
echo   CREATE DATABASE learnhub_db;
echo   CREATE USER postgres WITH PASSWORD 'postgres';
echo   GRANT ALL PRIVILEGES ON DATABASE learnhub_db TO postgres;
echo.
pause

REM Run migrations
echo Running migrations...
python manage.py makemigrations
python manage.py migrate

REM Create superuser
echo.
echo Creating superuser...
python manage.py createsuperuser

REM Collect static files
echo.
echo Collecting static files...
python manage.py collectstatic --no-input

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the development server, run:
echo   python manage.py runserver
echo.
echo API will be available at:
echo   - http://localhost:8000/api/
echo   - Swagger UI: http://localhost:8000/api/docs/
echo   - Admin: http://localhost:8000/admin/
echo.
pause
