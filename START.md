# 🚀 Hướng Dẫn Chạy Web - Siêu Thị ABC

## Phương Pháp 1: Chạy với Docker (KHUYẾN NGHỊ)

### Bước 1: Chuẩn bị môi trường

```powershell
# Di chuyển đến thư mục docker
cd "c:\tailieuhoc\Kho dữ liệu và khai phá\SIEUTHIABC\docker"

# Copy file .env
Copy-Item .env.example .env

# Sửa file .env với credentials của bạn (nếu cần)
notepad .env
```

### Bước 2: Build và start services

```powershell
# Build tất cả services
docker-compose build

# Start tất cả services (chạy ngầm)
docker-compose up -d

# Xem logs
docker-compose logs -f
```

### Bước 3: Khởi tạo database

```powershell
# Chờ database ready (khoảng 30-60 giây)
Start-Sleep -Seconds 60

# Chạy schema và migrations
docker-compose exec database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "SieuThiABC@2024" -d master -i /docker-entrypoint-initdb.d/schema.sql

# Chạy seed data
docker-compose exec database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "SieuThiABC@2024" -d SieuThiABC -i /docker-entrypoint-initdb.d/seeds/seed_users.sql
docker-compose exec database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "SieuThiABC@2024" -d SieuThiABC -i /docker-entrypoint-initdb.d/seeds/seed_categories.sql
docker-compose exec database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "SieuThiABC@2024" -d SieuThiABC -i /docker-entrypoint-initdb.d/seeds/seed_products.sql
docker-compose exec database /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "SieuThiABC@2024" -d SieuThiABC -i /docker-entrypoint-initdb.d/seeds/seed_vouchers.sql
```

### Bước 4: Truy cập web

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **ML Service**: http://localhost/ml-api/docs

---

## Phương Pháp 2: Chạy Development Mode (Không Docker)

### A. Chạy Database (SQL Server)

```powershell
# Cài đặt SQL Server 2022 Express hoặc sử dụng Docker cho database
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=SieuThiABC@2024" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest

# Chạy schema
sqlcmd -S localhost -U sa -P "SieuThiABC@2024" -d master -i "database\schema.sql"

# Chạy seeds
sqlcmd -S localhost -U sa -P "SieuThiABC@2024" -d SieuThiABC -i "database\seeds\seed_users.sql"
sqlcmd -S localhost -U sa -P "SieuThiABC@2024" -d SieuThiABC -i "database\seeds\seed_categories.sql"
sqlcmd -S localhost -U sa -P "SieuThiABC@2024" -d SieuThiABC -i "database\seeds\seed_products.sql"
sqlcmd -S localhost -U sa -P "SieuThiABC@2024" -d SieuThiABC -i "database\seeds\seed_vouchers.sql"
```

### B. Chạy Backend (Terminal 1)

```powershell
# Di chuyển đến thư mục backend
cd "c:\tailieuhoc\Kho dữ liệu và khai phá\SIEUTHIABC\backend"

# Cài đặt dependencies (lần đầu)
npm install

# Tạo file .env
Copy-Item .env.example .env

# Chỉnh sửa .env với credentials database
notepad .env

# Chạy development server
npm run dev
```

Backend chạy tại: http://localhost:5000

### C. Chạy ML Service (Terminal 2)

```powershell
# Di chuyển đến thư mục ml-service
cd "c:\tailieuhoc\Kho dữ liệu và khai phá\SIEUTHIABC\ml-service"

# Tạo virtual environment (lần đầu)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Cài đặt dependencies (lần đầu)
pip install -r requirements.txt

# Download NLTK data (lần đầu)
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"

# Tạo file .env
Copy-Item .env .env

# Chạy FastAPI server
uvicorn src.app:app --host 0.0.0.0 --port 8000 --reload
```

ML Service chạy tại: http://localhost:8000

### D. Chạy Frontend (Terminal 3)

```powershell
# Di chuyển đến thư mục frontend
cd "c:\tailieuhoc\Kho dữ liệu và khai phá\SIEUTHIABC\frontend"

# Cài đặt dependencies (lần đầu)
npm install

# Tạo file .env
Copy-Item .env .env

# Chỉnh sửa .env để trỏ đến backend và ml-service
notepad .env

# Chạy development server
npm run dev
```

Frontend chạy tại: http://localhost:5173

---

## 🔑 Default Accounts

### Admin
- Email: `admin@sieuthiabc.vn`
- Password: `123456`

### Manager
- Email: `manager@sieuthiabc.vn`
- Password: `123456`

### Customer
- Email: `nguyenvanan@gmail.com`
- Password: `123456`

---

## 🛠️ Kiểm Tra Services

### Kiểm tra Backend
```powershell
curl http://localhost:5000/api/health
```

### Kiểm tra ML Service
```powershell
curl http://localhost:8000/health
```

### Kiểm tra Database
```powershell
sqlcmd -S localhost -U sa -P "SieuThiABC@2024" -Q "SELECT @@VERSION"
```

---

## 🐛 Troubleshooting

### Lỗi: Port đã được sử dụng

```powershell
# Kiểm tra port đang sử dụng
netstat -ano | findstr :5000
netstat -ano | findstr :8000
netstat -ano | findstr :1433

# Kill process (thay PID bằng số từ lệnh trên)
taskkill /PID <PID> /F
```

### Lỗi: Database connection failed

```powershell
# Kiểm tra SQL Server đang chạy
docker ps | findstr mssql

# Restart database
docker restart sieuthiabc-database
```

### Lỗi: Module not found (Backend)

```powershell
cd backend
npm install
```

### Lỗi: Module not found (ML Service)

```powershell
cd ml-service
pip install -r requirements.txt
```

### Lỗi: CORS (Frontend không kết nối được Backend)

Kiểm tra file `backend/.env`:
```
FRONTEND_URL=http://localhost:5173
```

---

## 📊 Testing

### Backend Tests
```powershell
cd backend
npm test
```

### ML Service Tests
```powershell
cd ml-service
pytest
```

---

## 🔄 Stop Services

### Docker
```powershell
cd docker
docker-compose down
```

### Development Mode
- Nhấn `Ctrl + C` trong mỗi terminal đang chạy

---

**Chúc bạn phát triển thành công! 🎉**
