# 🐳 Docker Configuration - Siêu Thị ABC

Docker configuration cho hệ thống Siêu Thị ABC với 4 services.

## 📋 Services

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| **database** | mssql/server:2022 | 1433 | SQL Server database |
| **backend** | Custom Node.js | 5000 | Express API server |
| **ml-service** | Custom Python | 8000 | FastAPI ML service |
| **frontend** | Custom Nginx | 80, 443 | React app + reverse proxy |

## 🚀 Quick Start

### 1. Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB+ RAM available
- 10GB+ disk space

### 2. Environment Setup

```bash
# Copy environment file
cd docker
cp .env.example .env

# Edit .env with your credentials
notepad .env  # Windows
nano .env     # Linux/Mac
```

### 3. Build and Start

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 4. Initialize Database

```bash
# Wait for database to be ready
docker-compose logs -f database

# Run migrations (after database is healthy)
docker-compose exec backend npm run migrate

# Seed data
docker-compose exec database /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "SieuThiABC@2024" \
  -d SieuThiABC -i /docker-entrypoint-initdb.d/schema.sql
```

### 5. Access Services

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **ML Service**: http://localhost/ml-api
- **API Docs**: http://localhost/ml-api/docs

## 📦 Docker Commands

### Build

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend

# Build without cache
docker-compose build --no-cache
```

### Start/Stop

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose stop

# Restart service
docker-compose restart backend

# Remove containers
docker-compose down

# Remove containers + volumes
docker-compose down -v
```

### Logs

```bash
# All logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 ml-service
```

### Execute Commands

```bash
# Backend shell
docker-compose exec backend sh

# Database query
docker-compose exec database /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "SieuThiABC@2024" -Q "SELECT @@VERSION"

# ML Service Python shell
docker-compose exec ml-service python
```

## 🔧 Configuration

### Environment Variables

**Database:**
- `DB_NAME` - Database name (default: SieuThiABC)
- `DB_USER` - Database user (default: sa)
- `DB_PASSWORD` - Database password

**Backend:**
- `NODE_ENV` - Environment (production/development)
- `JWT_SECRET` - Secret key for JWT
- `CLOUDINARY_*` - Image upload credentials
- `MOMO_*` - MoMo payment gateway
- `ZALOPAY_*` - ZaloPay payment gateway

### Ports

Modify ports in `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change 80 to 8080
```

### Volumes

```yaml
volumes:
  sqlserver_data:   # Database data persistence
  ml_models:        # ML models storage
  uploads:          # File uploads
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              Frontend (Nginx)                │
│         React App + Reverse Proxy            │
│              Port: 80, 443                   │
└─────────────┬───────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼──────┐    ┌───────▼────────┐
│ Backend  │    │   ML Service   │
│ Node.js  │    │    Python      │
│ Port:5000│    │   Port: 8000   │
└────┬─────┘    └────────┬───────┘
     │                   │
     └─────────┬─────────┘
               │
      ┌────────▼────────┐
      │    Database     │
      │   SQL Server    │
      │   Port: 1433    │
      └─────────────────┘
```

## 🔍 Health Checks

All services have health checks:

```yaml
healthcheck:
  interval: 30s    # Check every 30 seconds
  timeout: 10s     # Timeout after 10 seconds
  retries: 3       # Retry 3 times
  start_period: 60s # Wait 60s before first check
```

Check health status:

```bash
docker-compose ps
```

## 🛠️ Troubleshooting

### Database Connection Failed

```bash
# Check database logs
docker-compose logs database

# Verify database is running
docker-compose exec database /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "SieuThiABC@2024" -Q "SELECT 1"
```

### Backend Not Starting

```bash
# Check backend logs
docker-compose logs backend

# Verify environment variables
docker-compose exec backend env | grep DB_
```

### Frontend 502 Error

```bash
# Check nginx logs
docker-compose logs frontend

# Verify backend is running
docker-compose ps backend
```

### ML Service Import Errors

```bash
# Rebuild ML service
docker-compose build --no-cache ml-service

# Check Python dependencies
docker-compose exec ml-service pip list
```

### Port Already in Use

```bash
# Check what's using port 80
netstat -ano | findstr :80  # Windows
lsof -i :80                 # Linux/Mac

# Use different port
# Edit docker-compose.yml:
ports:
  - "8080:80"
```

## 📊 Resource Limits

Set resource limits in `docker-compose.yml`:

```yaml
services:
  database:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## 🔐 Production Deployment

### 1. Security

```bash
# Generate strong passwords
openssl rand -base64 32

# Update .env with production credentials
```

### 2. SSL/TLS

```bash
# Generate SSL certificate
cd nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout private.key -out certificate.crt

# Update nginx config for HTTPS
```

### 3. Backup

```bash
# Backup database
docker-compose exec database /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "password" \
  -Q "BACKUP DATABASE SieuThiABC TO DISK='/var/opt/mssql/backup/db.bak'"

# Copy backup to host
docker cp sieuthiabc-database:/var/opt/mssql/backup/db.bak ./backup/
```

## 📈 Monitoring

### View Metrics

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Network inspect
docker network inspect sieuthiabc-network
```

## 🔄 Updates

### Update Services

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Remove old images
docker image prune -f
```

## 🧹 Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [SQL Server Docker](https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker)

---

**Developed with ❤️ for Siêu Thị ABC**
