# 🚀 SIÊU THỊ ABC - QUICK START GUIDE

## ✅ Hệ thống đã hoàn chỉnh

### 🌐 **Truy cập ngay**
- **Website:** http://localhost
- **Backend API:** http://localhost/api
- **ML API Docs:** http://localhost/ml-api/docs  
- **Database:** localhost:1433

### 📊 **Dữ liệu có sẵn**
- ✅ **12 users** (admin@sieuthiabc.vn / 123456)
- ✅ **7 danh mục** sản phẩm
- ✅ **47 sản phẩm** đa dạng
- ✅ **18 vouchers** khuyến mãi

---

## 🎮 Các lệnh Docker quan trọng

### Khởi động hệ thống
```powershell
cd docker
docker compose up -d
```

### Dừng hệ thống
```powershell
docker compose down
```

### Xem logs
```powershell
# Tất cả services
docker compose logs -f

# Chỉ một service
docker compose logs -f backend
docker compose logs -f ml-service
docker compose logs -f frontend
```

### Kiểm tra trạng thái
```powershell
docker compose ps
```

### Rebuild sau khi sửa code
```powershell
# Rebuild một service
docker compose build backend
docker compose up -d backend

# Rebuild tất cả
docker compose build
docker compose up -d
```

---

## 🔐 Tài khoản mặc định

### Admin
- **Email:** admin@sieuthiabc.vn
- **Password:** 123456

### Nhân viên
- **Email:** staff@sieuthiabc.vn  
- **Password:** 123456

### Khách hàng mẫu
- **Email:** customer1@gmail.com
- **Password:** 123456

---

## 🏗️ Cấu trúc dự án

```
SIEUTHIABC/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── pages/user/HomePage.jsx  (Trang chủ đẹp)
│   │   └── ...
│   └── index.html     (Loading screen + SEO)
│
├── backend/           # Node.js + Express + SQL Server
│   ├── src/
│   │   ├── routes/    (API endpoints)
│   │   ├── controllers/
│   │   └── middlewares/
│   └── tests/         (Jest tests: 23 suites)
│
├── ml-service/        # Python + FastAPI
│   ├── src/
│   │   ├── api/       (ML endpoints)
│   │   ├── services/  (K-Means, Decision Tree)
│   │   └── training/
│   └── tests/         (Pytest: 22 tests)
│
├── database/          # SQL Server
│   ├── schema.sql     (9 tables)
│   ├── migrations/    (9 migration scripts)
│   └── seeds/         (Sample data)
│
└── docker/            # Docker configuration
    ├── docker-compose.yml
    ├── Dockerfile.backend
    ├── Dockerfile.frontend
    └── Dockerfile.ml-service
```

---

## 🧪 Chạy tests

### Backend tests (Jest)
```powershell
cd backend
npm test
```

### ML Service tests (Pytest)
```powershell
cd ml-service
pytest
```

---

## 📝 API Endpoints

### Auth
- POST `/api/auth/register` - Đăng ký
- POST `/api/auth/login` - Đăng nhập

### Products
- GET `/api/products` - Danh sách sản phẩm
- GET `/api/products/:id` - Chi tiết sản phẩm
- POST `/api/products` - Tạo sản phẩm (Admin)

### Cart
- GET `/api/cart` - Giỏ hàng
- POST `/api/cart` - Thêm vào giỏ
- PUT `/api/cart/:id` - Cập nhật số lượng
- DELETE `/api/cart/:id` - Xóa khỏi giỏ

### Orders
- GET `/api/orders` - Đơn hàng của tôi
- POST `/api/orders` - Tạo đơn hàng
- GET `/api/orders/:id` - Chi tiết đơn hàng

### ML Services
- POST `/ml-api/segment` - Phân khúc khách hàng (K-Means)
- POST `/ml-api/predict` - Dự đoán doanh thu (Decision Tree)
- POST `/ml-api/associations` - Gợi ý sản phẩm liên quan

---

## 🛠️ Troubleshooting

### Container restart liên tục
```powershell
# Xem logs chi tiết
docker compose logs [service-name] --tail=50

# Rebuild container
docker compose build [service-name]
docker compose up -d [service-name]
```

### Database connection error
```powershell
# Check database health
docker compose exec database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "SieuThiABC@2024" -C -Q "SELECT @@VERSION"
```

### Port đã được sử dụng
```powershell
# Dừng tất cả containers
docker compose down

# Hoặc thay đổi port trong docker-compose.yml
```

---

## 🎨 Tính năng UI đã hoàn thiện

### Trang chủ (HomePage.jsx)
- ✅ Hero carousel với 3 slides gradient đẹp
- ✅ Stats section: Sản phẩm, khách hàng, đơn hàng
- ✅ Features section: Giao nhanh, chất lượng, khuyến mãi
- ✅ Categories section: 7 danh mục với icon
- ✅ Hot deals section: Sản phẩm nổi bật với filter
- ✅ Newsletter section: Đăng ký nhận tin

### index.html
- ✅ Loading screen với gradient purple
- ✅ Double spinner animation
- ✅ Floating shapes effect
- ✅ SEO meta tags (Open Graph, Twitter Cards)
- ✅ Google Fonts (Inter 300-900)

---

## 📦 Tech Stack

### Frontend
- React 18.2
- Vite 4.4
- React Router DOM
- Axios
- TailwindCSS (future)

### Backend
- Node.js 18
- Express.js
- mssql (SQL Server driver)
- JWT authentication
- Bcrypt password hashing

### ML Service
- Python 3.9
- FastAPI
- Scikit-learn
- Pandas
- NumPy
- NLTK

### Database
- SQL Server 2022 Express
- 9 tables fully normalized
- Foreign keys & indexes

### DevOps
- Docker & Docker Compose
- Nginx reverse proxy
- Multi-stage builds
- Health checks

---

## 📚 Tài liệu chi tiết

Xem thêm tài liệu chi tiết trong:
- `database/README.md` - Hướng dẫn database
- `docker/README.md` - Hướng dẫn Docker
- `backend/README.md` - Backend API docs
- `ml-service/README.md` - ML Service docs

---

## 💡 Tips

1. **Sau khi sửa code frontend:**
   ```powershell
   docker compose build frontend
   docker compose up -d frontend
   ```

2. **Reset database:**
   ```powershell
   docker compose down -v  # Xóa volumes
   docker compose up -d
   # Chạy lại schema và seeds
   ```

3. **Xem logs realtime:**
   ```powershell
   docker compose logs -f --tail=100
   ```

---

## 🎯 Các bước tiếp theo (tuỳ chọn)

- [ ] Cài đặt Cloudinary cho upload ảnh thật
- [ ] Tích hợp MoMo/ZaloPay/PayPal payment
- [ ] Deploy lên VPS/Cloud
- [ ] Thêm unit tests coverage
- [ ] Performance optimization
- [ ] Security hardening

---

## 🤝 Support

Nếu gặp vấn đề:
1. Check logs: `docker compose logs -f`
2. Verify services: `docker compose ps`
3. Rebuild: `docker compose build`
4. Restart: `docker compose restart`

---

**Enjoy coding! 🚀**
