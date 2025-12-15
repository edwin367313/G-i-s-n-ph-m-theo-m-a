# 🛒 SIÊU THỊ ABC - Website Thương Mại Điện Tử

Website thương mại điện tử đầy đủ tính năng với Backend (Node.js), Frontend (React), ML Service (Python) cho chuỗi siêu thị ABC.

## 📋 Tổng quan

**Siêu Thị ABC** là nền tảng thương mại điện tử hiện đại với:
- 🎯 Quản lý sản phẩm, đơn hàng
- 💳 Thanh toán đa dạng (Momo, ZaloPay, PayPal, COD) với **xử lý 20 giây**
- 🎨 Giao diện theo mùa với hiệu ứng động (Tết, Xuân, Hạ, Thu, Đông)
- 🤖 ML Analytics (K-Means, Decision Tree, Apriori)
- 📊 Báo cáo doanh thu chi tiết
- 🔐 Phân quyền Admin/User
- 🌐 Ngôn ngữ: Tiếng Việt

## 🏗️ Kiến trúc Hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│                   React 18 + Vite                        │
│              Ant Design + Recharts                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/REST API
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│   Backend API    │    │   ML Service     │
│   Node.js        │    │   Python/Flask   │
│   Express        │    │   scikit-learn   │
│   Port: 5000     │    │   Port: 8000     │
└────────┬─────────┘    └──────────────────┘
         │
         │ JDBC/ODBC
         │
         ▼
┌──────────────────┐
│   SQL Server     │
│   Database       │
│   Port: 1433     │
└──────────────────┘
```

## 📦 Cấu trúc Thư mục

```
SIEUTHIABC/
├── backend/                    # Node.js Backend
│   ├── src/
│   │   ├── config/            # Database, JWT, Payment, Upload configs
│   │   ├── models/            # User, Product, Cart, Order models
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middlewares/       # Auth, error handling
│   │   ├── payment-gateways/  # Momo, ZaloPay, PayPal (20s delay)
│   │   └── utils/             # Helpers
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── common/       # Header, Footer, Loading
│   │   │   ├── product/      # ProductCard, ProductList
│   │   │   ├── cart/         # Cart components
│   │   │   ├── payment/      # PaymentModal (20s countdown)
│   │   │   ├── theme/        # ThemeEffects (seasonal)
│   │   │   └── admin/        # Admin components
│   │   ├── pages/            # Page components
│   │   │   ├── user/         # User pages
│   │   │   ├── admin/        # Admin pages
│   │   │   └── auth/         # Login, Register
│   │   ├── context/          # React Context
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API services
│   │   ├── utils/            # Utilities
│   │   └── styles/           # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── ml-service/                 # Python ML Service
│   ├── app/
│   │   ├── models/            # ML models
│   │   ├── services/          # ML services
│   │   │   ├── clustering.py  # K-Means
│   │   │   ├── prediction.py  # Decision Tree
│   │   │   └── association.py # Apriori
│   │   └── routes/            # API routes
│   ├── requirements.txt
│   └── main.py
│
├── database/                   # SQL Server
│   ├── migrations/            # Schema migrations
│   ├── seeds/                 # Sample data
│   ├── stored-procedures/     # Revenue reports
│   └── views/                 # Database views
│
├── uploads/                    # File uploads
│   ├── products/
│   ├── themes/
│   └── icons/
│
├── docs/                       # Documentation
├── tests/                      # Tests
├── docker/                     # Docker configs
└── nginx/                      # Nginx configs
```

## ⚡ Công nghệ Sử dụng

### Backend
- **Node.js 18+** - Runtime
- **Express 4.18** - Web framework
- **SQL Server** - Database (mssql, tedious)
- **Sequelize 6.35** - ORM
- **JWT** - Authentication
- **Multer + Cloudinary** - File upload
- **Bcrypt** - Password hashing

### Frontend
- **React 18.2** - UI library
- **Vite 5.0** - Build tool
- **React Router 6.20** - Routing
- **Ant Design 5.12** - UI components
- **Axios** - HTTP client
- **React Query** - Data fetching
- **Recharts** - Charts
- **React Spring + Framer Motion** - Animations
- **React Hot Toast** - Notifications

### ML Service
- **Python 3.9+**
- **Flask/FastAPI** - Web framework
- **scikit-learn** - K-Means, Decision Tree
- **mlxtend** - Apriori algorithm
- **Pandas, NumPy** - Data processing
- **TensorFlow/PyTorch** - Deep learning (optional)

### Database
- **SQL Server 2019+**
- Stored procedures cho revenue reports
- Views cho analytics
- Triggers cho audit logs

## 🚀 Cài đặt & Chạy

### 1. Clone Repository
```bash
git clone <repo-url>
cd SIEUTHIABC
```

### 2. Backend Setup
```bash
cd backend
npm install

# Tạo file .env
cp .env.example .env
# Cấu hình database, JWT secret, payment keys

# Chạy migrations
npm run migrate

# Seed data mẫu
npm run seed

# Start server
npm run dev
# Server chạy: http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Tạo file .env
echo "VITE_API_URL=http://localhost:5000/api" > .env
echo "VITE_ML_SERVICE_URL=http://localhost:8000" >> .env

# Start dev server
npm run dev
# Frontend chạy: http://localhost:3000
```

### 4. ML Service Setup
```bash
cd ml-service
pip install -r requirements.txt

# Start ML service
python main.py
# ML Service chạy: http://localhost:8000
```

### 5. Database Setup
```sql
-- Tạo database
CREATE DATABASE SieuThiABC;

-- Chạy migrations từ database/migrations/
-- Import sample data từ database/seeds/
```

## 🎯 Tính năng Chính

### 1. Xác thực & Phân quyền ✅
- [x] Đăng ký/Đăng nhập
- [x] JWT authentication
- [x] Role-based access (Admin/User)
- [x] Protected routes

### 2. Quản lý Sản phẩm 📦
- [x] CRUD sản phẩm (Admin)
- [x] Danh mục sản phẩm
- [x] Lọc, tìm kiếm, sắp xếp
- [x] Giảm giá sản phẩm
- [x] Upload ảnh (Cloudinary)
- [x] Quản lý tồn kho

### 3. Giỏ hàng 🛒
- [x] Thêm/Xóa/Cập nhật sản phẩm
- [x] Đồng bộ local/server
- [x] Mã giảm giá (voucher)
- [x] Tính tổng tự động

### 4. Thanh toán 💳 (20 giây xử lý)
- [x] **Momo** - Ví điện tử
- [x] **ZaloPay** - Ví điện tử
- [x] **PayPal** - Thẻ quốc tế
- [x] **COD** - Thanh toán khi nhận
- [x] **Progress bar 20 giây**
- [x] Mock payment processing
- [x] Payment callbacks

### 5. Đơn hàng 📋
- [x] Tạo đơn hàng từ giỏ hàng
- [x] Quản lý trạng thái đơn hàng
- [x] Lịch sử đơn hàng
- [x] Hủy đơn hàng
- [x] Admin quản lý tất cả đơn

### 6. Giao diện Theo Mùa 🎨
- [x] **Tết**: Pháo hoa 🎆
- [x] **Xuân**: Hoa bay 🌸
- [x] **Hè**: Mặt trời ☀️
- [x] **Thu**: Lá rơi 🍂
- [x] **Đông**: Tuyết rơi ❄️
- [x] Toggle on/off effects
- [x] Admin quản lý themes

### 7. Báo cáo Doanh thu 📊
- [x] Báo cáo theo ngày/tháng/quý/năm
- [x] Biểu đồ Line/Bar/Pie
- [x] Top sản phẩm bán chạy
- [x] Doanh thu theo danh mục
- [x] Export Excel/PDF

### 8. ML Analytics 🤖
- [x] **K-Means Clustering** - Phân khúc khách hàng
- [x] **Decision Tree** - Dự đoán doanh thu
- [x] **Apriori** - Phân tích giỏ hàng
- [x] Product recommendations
- [x] Shopping behavior analysis
- [x] Trending products

## 🔐 Bảo mật

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation (Joi)
- ✅ SQL injection prevention (Sequelize)
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Helmet.js security headers

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# ML Service tests
cd ml-service
pytest
```

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tablet optimization
- ✅ Desktop full features
- ✅ Touch-friendly UI

## 🌐 Deployment

### Docker Compose
```bash
docker-compose up -d
```

### Manual Deployment
```bash
# Backend
cd backend
npm run build
pm2 start server.js

# Frontend
cd frontend
npm run build
# Deploy dist/ to hosting

# ML Service
cd ml-service
gunicorn main:app
```

## 📚 API Documentation

API docs available at: `http://localhost:5000/api-docs` (Swagger)

### Key Endpoints

**Auth:**
- POST `/api/auth/register` - Đăng ký
- POST `/api/auth/login` - Đăng nhập
- GET `/api/auth/profile` - Thông tin user

**Products:**
- GET `/api/products` - Danh sách sản phẩm
- GET `/api/products/:id` - Chi tiết sản phẩm
- POST `/api/products` - Tạo sản phẩm (Admin)

**Cart:**
- GET `/api/cart` - Lấy giỏ hàng
- POST `/api/cart/items` - Thêm sản phẩm

**Orders:**
- POST `/api/orders` - Tạo đơn hàng
- GET `/api/orders/my-orders` - Đơn hàng của tôi

**Payment:**
- POST `/api/payment/momo/create` - Tạo thanh toán Momo
- POST `/api/payment/momo/process` - Xử lý thanh toán (20s)

## 🎓 Hướng dẫn Sử dụng

### User Flow
1. Đăng ký/Đăng nhập
2. Duyệt sản phẩm
3. Thêm vào giỏ hàng
4. Áp dụng mã giảm giá
5. Thanh toán (**20 giây xử lý**)
6. Xem đơn hàng

### Admin Flow
1. Đăng nhập admin
2. Quản lý sản phẩm (CRUD)
3. Xem đơn hàng
4. Xem báo cáo doanh thu
5. Quản lý theme mùa
6. Xem ML analytics

## 🐛 Known Issues

- Payment gateway là mock (không kết nối thật)
- ML models cần training với data thật
- Search optimization cần improve
- Real-time notifications chưa có

## 🚧 Roadmap

- [ ] Real payment gateway integration
- [ ] Real-time order tracking
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced search (Elasticsearch)
- [ ] Live chat support
- [ ] Product reviews & ratings

## 👥 Team

- **Backend Developer** - Node.js, SQL Server
- **Frontend Developer** - React, UI/UX
- **ML Engineer** - Python, ML algorithms
- **DevOps** - Docker, Deployment

## 📄 License

MIT License

## 📞 Contact

- Email: contact@sieuthiabc.vn
- Website: https://sieuthiabc.vn
- Phone: 1900 1234

---

**⚠️ Lưu ý quan trọng:**
- Payment processing **luôn mất 20 giây** (PAYMENT_PROCESSING_DELAY = 20000ms)
- Tất cả payment gateways là **mock implementation**
- Frontend ngôn ngữ **100% tiếng Việt**
- Theme effects có thể toggle on/off
- ML Service cần training trước khi sử dụng

**🎯 Entry Points:**
- Frontend: `src/main.jsx`
- Backend: `src/server.js`
- ML Service: `main.py`

**🔧 Default Ports:**
- Frontend: 3000
- Backend: 5000
- ML Service: 8000
- Database: 1433
