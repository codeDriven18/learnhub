# Deployment Guide

## Production Deployment Checklist

### Backend (Django)

#### 1. Environment Configuration
```bash
# .env (Production)
DEBUG=False
SECRET_KEY=<generate-strong-secret-key>
ALLOWED_HOSTS=api.learnhub.com,students.learnhub.com,checkers.learnhub.com,admin.learnhub.com

# Database
DB_NAME=learnhub_production
DB_USER=learnhub_user
DB_PASSWORD=<strong-password>
DB_HOST=db.yourhost.com
DB_PORT=5432

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=noreply@learnhub.com
EMAIL_HOST_PASSWORD=<app-password>

# S3 Storage
USE_S3=True
AWS_ACCESS_KEY_ID=<aws-key>
AWS_SECRET_ACCESS_KEY=<aws-secret>
AWS_STORAGE_BUCKET_NAME=learnhub-documents
AWS_S3_REGION_NAME=us-east-1
```

#### 2. Install Production Dependencies
```bash
pip install gunicorn
pip install psycopg2-binary
pip install boto3 django-storages  # if using S3
```

#### 3. Collect Static Files
```bash
python manage.py collectstatic --no-input
```

#### 4. Run Migrations
```bash
python manage.py migrate
```

#### 5. Create Superuser
```bash
python manage.py createsuperuser
```

#### 6. Gunicorn Configuration
Create `gunicorn_config.py`:
```python
bind = "0.0.0.0:8000"
workers = 4
worker_class = "sync"
timeout = 120
accesslog = "/var/log/gunicorn/access.log"
errorlog = "/var/log/gunicorn/error.log"
loglevel = "info"
```

#### 7. Systemd Service
Create `/etc/systemd/system/learnhub.service`:
```ini
[Unit]
Description=LearnHub Django Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/learnhub/backend
Environment="PATH=/var/www/learnhub/backend/venv/bin"
ExecStart=/var/www/learnhub/backend/venv/bin/gunicorn \
    --config gunicorn_config.py \
    learnhub.wsgi:application

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable learnhub
sudo systemctl start learnhub
```

#### 8. Nginx Configuration
Create `/etc/nginx/sites-available/learnhub`:
```nginx
upstream learnhub_backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name api.learnhub.com;

    client_max_body_size 10M;

    location /static/ {
        alias /var/www/learnhub/backend/staticfiles/;
    }

    location /media/ {
        alias /var/www/learnhub/backend/media/;
    }

    location / {
        proxy_pass http://learnhub_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/learnhub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Frontend (React)

#### 1. Build for Production
```bash
cd frontend
npm run build
```

#### 2. Environment Variables
Create `.env.production`:
```
VITE_API_URL=https://api.learnhub.com
```

#### 3. Deploy Static Files

**Option A: Nginx**
```nginx
# Student Portal
server {
    listen 80;
    server_name students.learnhub.com;
    root /var/www/learnhub/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Checker Portal
server {
    listen 80;
    server_name checkers.learnhub.com;
    root /var/www/learnhub/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Admin Portal
server {
    listen 80;
    server_name admin.learnhub.com;
    root /var/www/learnhub/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Option B: CDN (Recommended)**
- Upload build files to S3
- Configure CloudFront distribution
- Set up SSL certificates

#### 4. SSL Configuration
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificates
sudo certbot --nginx -d api.learnhub.com
sudo certbot --nginx -d students.learnhub.com
sudo certbot --nginx -d checkers.learnhub.com
sudo certbot --nginx -d admin.learnhub.com
```

### Database

#### PostgreSQL Production Setup
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql

CREATE DATABASE learnhub_production;
CREATE USER learnhub_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE learnhub_production TO learnhub_user;
ALTER USER learnhub_user CREATEDB;
\q
```

#### Database Backup
```bash
# Create backup
pg_dump -U learnhub_user learnhub_production > backup.sql

# Restore backup
psql -U learnhub_user learnhub_production < backup.sql

# Automated backups (cron)
0 2 * * * pg_dump -U learnhub_user learnhub_production > /backups/learnhub_$(date +\%Y\%m\%d).sql
```

### Monitoring

#### Application Monitoring
- Set up Sentry for error tracking
- Configure logging
- Monitor server resources

#### Database Monitoring
- Enable query logging
- Monitor connection pool
- Set up alerts

### Security Checklist

- [ ] Set DEBUG=False
- [ ] Use strong SECRET_KEY
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Database backups
- [ ] File upload validation
- [ ] SQL injection prevention (Django ORM)
- [ ] XSS prevention (React)
- [ ] CSRF protection enabled

### Performance Optimization

- [ ] Enable caching (Redis)
- [ ] Optimize database queries
- [ ] CDN for static files
- [ ] Image optimization
- [ ] Gzip compression
- [ ] Database indexing
- [ ] Connection pooling

### Scaling Considerations

#### Horizontal Scaling
- Load balancer (Nginx/HAProxy)
- Multiple application servers
- Database replication
- Session storage (Redis)

#### Vertical Scaling
- Increase server resources
- Optimize database
- Query optimization

## Docker Deployment (Alternative)

### docker-compose.yml
```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=learnhub_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres

  backend:
    build: ./backend
    command: gunicorn learnhub.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./backend:/app
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/learnhub_db

  frontend:
    build: ./frontend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - static_volume:/static
      - media_volume:/media
    ports:
      - "80:80"
    depends_on:
      - backend
      - frontend

volumes:
  postgres_data:
  static_volume:
  media_volume:
```

### Deploy with Docker
```bash
docker-compose up -d
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py collectstatic --no-input
```
