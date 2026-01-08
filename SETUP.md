# Hướng dẫn Setup Project

## Yêu cầu hệ thống

- Node.js >= 16.x
- Python >= 3.8
- SQL Server 2019+
- Git

## Bước 1: Clone project

```bash
git clone <repository-url>
cd SIEUTHIABC
```

## Bước 2: Setup Database

1. Mở SQL Server Management Studio
2. Chạy file `database/schema.sql`
3. Chạy file `database/create_ml_tables.sql`
4. Import data: `node database/import_csv.js`

## Bước 3: Setup Backend

```bash
cd backend
npm install
```

Tạo file `.env`:
```
DB_SERVER=your_server
DB_DATABASE=Order
DB_USER=sa
DB_PASSWORD=your_password
PORT=5000
JWT_SECRET=your_secret_key
```

## Bước 4: Setup Frontend

```bash
cd Nam_frontend
npm install
```

## Bước 5: Setup ML Service (Optional)

```bash
cd Hung_ml-service
pip install -r requirements.txt
```

## Bước 6: Chạy phân tích ML

```bash
cd backend/src/ml
python run_daily_analysis.py
```

## Bước 7: Khởi động

Chạy từ root directory:
```bash
.\START_ALL.ps1
```

Hoặc chạy riêng lẻ:
- Backend: `cd backend && npm start`
- Frontend: `cd Nam_frontend && npm run dev`
- ML Service: `cd Hung_ml-service && python src/app.py`

## Truy cập

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- ML Service: http://localhost:8000

## Tài khoản mặc định

- Admin: admin@sieuthiabc.com / admin123
- User: user@sieuthiabc.com / user123
