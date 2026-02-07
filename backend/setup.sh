#!/bin/bash
# LearnHub Backend Setup Script for Linux/Mac

set -e

echo "========================================"
echo "LearnHub Backend Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please edit .env file with your configuration"
fi

# Database setup instructions
echo ""
echo "========================================"
echo "Database Setup"
echo "========================================"
echo "Please ensure PostgreSQL is running and create a database:"
echo "  CREATE DATABASE learnhub_db;"
echo "  CREATE USER postgres WITH PASSWORD 'postgres';"
echo "  GRANT ALL PRIVILEGES ON DATABASE learnhub_db TO postgres;"
echo ""
read -p "Press enter when database is ready..."

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser
echo ""
echo "Creating superuser..."
python manage.py createsuperuser

# Collect static files
echo ""
echo "Collecting static files..."
python manage.py collectstatic --no-input

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the development server, run:"
echo "  python manage.py runserver"
echo ""
echo "API will be available at:"
echo "  - http://localhost:8000/api/"
echo "  - Swagger UI: http://localhost:8000/api/docs/"
echo "  - Admin: http://localhost:8000/admin/"
echo ""
