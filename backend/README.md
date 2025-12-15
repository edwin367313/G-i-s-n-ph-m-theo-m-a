# Backend - Siêu Thị ABC

Backend API cho website thương mại điện tử Siêu Thị ABC.

## 🚀 Tech Stack

- **Node.js 18+** - JavaScript runtime
- **Express 4.18** - Web framework
- **SQL Server** - Database
- **Sequelize 6.35** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer + Cloudinary** - File upload
- **Nodemailer** - Email service

## 📁 Cấu trúc Thư mục

```
backend/src/
├── config/              # Cấu hình
│   ├── database.js     # SQL Server config
│   ├── jwt.js          # JWT config
│   ├── payment.js      # Payment gateway config
│   └── upload.js       # Cloudinary config
│
├── models/             # Database models
│   ├── User.js         # User model
│   ├── Product.js      # Product model
│   ├── Cart.js         # Cart model
│   ├── CartItem.js     # Cart item model
│   ├── Order.js        # Order model
│   ├── OrderItem.js    # Order item model
│   ├── Payment.js      # Payment model
│   ├── Theme.js        # Theme model
│   ├── Voucher.js      # Voucher model
│   └── Category.js     # Category model
│
├── controllers/        # Request handlers
│   ├── authController.js       # Auth: register, login
│   ├── productController.js    # Products CRUD
│   ├── cartController.js       # Cart operations
│   ├── orderController.js      # Orders management
│   ├── paymentController.js    # Payment processing (20s)
│   ├── voucherController.js    # Voucher management
│   ├── themeController.js      # Theme management
│   ├── revenueController.js    # Revenue reports
│   └── uploadController.js     # File upload
│
├── services/           # Business logic
│   ├── authService.js          # Auth logic
│   ├── productService.js       # Product logic
│   ├── cartService.js          # Cart logic
│   ├── orderService.js         # Order logic
│   ├── paymentService.js       # Payment logic (20s delay)
│   ├── voucherService.js       # Voucher logic
│   ├── themeService.js         # Theme logic
│   ├── revenueService.js       # Revenue logic
│   └── emailService.js         # Email sending
│
├── middlewares/        # Middleware functions
│   ├── authMiddleware.js       # JWT verification
│   ├── roleMiddleware.js       # Role checking
│   ├── uploadMiddleware.js     # File upload handling
│   ├── validationMiddleware.js # Request validation
│   └── errorMiddleware.js      # Error handling
│
├── routes/             # API routes
│   ├── authRoutes.js           # /api/auth
│   ├── productRoutes.js        # /api/products
│   ├── cartRoutes.js           # /api/cart
│   ├── orderRoutes.js          # /api/orders
│   ├── paymentRoutes.js        # /api/payment
│   ├── voucherRoutes.js        # /api/vouchers
│   ├── themeRoutes.js          # /api/themes
│   ├── revenueRoutes.js        # /api/revenue
│   ├── uploadRoutes.js         # /api/upload
│   └── index.js                # Route mounting
│
├── payment-gateways/   # Payment gateway implementations
│   ├── momoGateway.js          # Momo payment (mock)
│   ├── zaloPayGateway.js       # ZaloPay payment (mock)
│   └── paypalGateway.js        # PayPal payment (mock)
│
├── utils/              # Utility functions
│   ├── helpers.js              # Helper functions
│   ├── jwt.js                  # JWT utilities
│   └── fileUpload.js           # File upload utilities
│
└── server.js           # Entry point
```

## 🔧 Cài đặt

### 1. Clone và cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình Environment Variables

Tạo file `.env`:

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=1433
DB_NAME=SieuThiABC
DB_USER=sa
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payment Gateways (Mock - for development)
MOMO_PARTNER_CODE=MOMOXXX
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
MOMO_REDIRECT_URL=http://localhost:3000/payment/callback

ZALOPAY_APP_ID=2553
ZALOPAY_KEY1=your_key1
ZALOPAY_KEY2=your_key2
ZALOPAY_REDIRECT_URL=http://localhost:3000/payment/callback

PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_MODE=sandbox
PAYPAL_RETURN_URL=http://localhost:3000/payment/callback
```

### 3. Khởi tạo Database

```bash
# Chạy SQL Server và tạo database
CREATE DATABASE SieuThiABC;

# Sync models (chỉ development)
# Sequelize sẽ tự động tạo tables khi start server
```

### 4. Chạy Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: **http://localhost:5000**

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Đăng ký user mới | Public |
| POST | `/login` | Đăng nhập | Public |
| GET | `/profile` | Lấy thông tin user | Private |
| PUT | `/profile` | Cập nhật profile | Private |
| PUT | `/change-password` | Đổi mật khẩu | Private |
| GET | `/users` | Lấy danh sách users | Admin |
| PUT | `/users/:id` | Cập nhật user | Admin |
| DELETE | `/users/:id` | Xóa user | Admin |

### Products (`/api/products`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Lấy danh sách sản phẩm | Public |
| GET | `/featured` | Lấy sản phẩm nổi bật | Public |
| GET | `/search` | Tìm kiếm sản phẩm | Public |
| GET | `/:id` | Lấy chi tiết sản phẩm | Public |
| POST | `/` | Tạo sản phẩm | Admin |
| PUT | `/:id` | Cập nhật sản phẩm | Admin |
| DELETE | `/:id` | Xóa sản phẩm | Admin |

### Cart (`/api/cart`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Lấy giỏ hàng | Private |
| POST | `/items` | Thêm sản phẩm | Private |
| PUT | `/items` | Cập nhật số lượng | Private |
| DELETE | `/items/:productId` | Xóa sản phẩm | Private |
| DELETE | `/` | Xóa toàn bộ giỏ | Private |
| POST | `/voucher` | Áp dụng voucher | Private |

### Orders (`/api/orders`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Tạo đơn hàng | Private |
| GET | `/my-orders` | Đơn hàng của tôi | Private |
| GET | `/:id` | Chi tiết đơn hàng | Private |
| PUT | `/:id/cancel` | Hủy đơn hàng | Private |
| GET | `/` | Tất cả đơn hàng | Admin |
| PUT | `/:id/status` | Cập nhật trạng thái | Admin |
| GET | `/statistics/overview` | Thống kê đơn hàng | Admin |

### Payment (`/api/payment`)

⚠️ **Payment processing mất 20 giây** (PAYMENT_PROCESSING_DELAY = 20000ms)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/create` | Tạo thanh toán | Private |
| POST | `/momo/process` | Xử lý Momo (20s) | Private |
| POST | `/zalopay/process` | Xử lý ZaloPay (20s) | Private |
| POST | `/paypal/process` | Xử lý PayPal (20s) | Private |
| POST | `/momo/callback` | Momo callback | Public |
| POST | `/zalopay/callback` | ZaloPay callback | Public |
| POST | `/paypal/callback` | PayPal callback | Public |
| GET | `/:paymentCode/status` | Trạng thái thanh toán | Private |
| POST | `/:paymentCode/refund` | Hoàn tiền | Admin |

### Vouchers (`/api/vouchers`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/available` | Vouchers khả dụng | Public |
| POST | `/validate` | Validate voucher | Private |
| POST | `/` | Tạo voucher | Admin |
| PUT | `/:id` | Cập nhật voucher | Admin |
| DELETE | `/:id` | Xóa voucher | Admin |

### Themes (`/api/themes`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/active` | Theme đang active | Public |
| GET | `/` | Tất cả themes | Admin |
| POST | `/` | Tạo theme | Admin |
| PUT | `/:id` | Cập nhật theme | Admin |
| DELETE | `/:id` | Xóa theme | Admin |
| PUT | `/:id/activate` | Set theme active | Admin |

### Revenue (`/api/revenue`) - Admin Only

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/overview` | Tổng quan doanh thu |
| GET | `/period` | Doanh thu theo khoảng thời gian |
| GET | `/monthly` | Doanh thu theo tháng |
| GET | `/top-products` | Sản phẩm bán chạy |
| GET | `/by-category` | Doanh thu theo danh mục |
| GET | `/export` | Export báo cáo |

### Upload (`/api/upload`) - Admin Only

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/single` | Upload 1 ảnh |
| POST | `/multiple` | Upload nhiều ảnh |

## 🔒 Authentication

Backend sử dụng JWT (JSON Web Token) cho authentication.

### Request Header

```
Authorization: Bearer <access_token>
```

### Token Expiration

- Access Token: 7 ngày
- Refresh Token: 30 ngày

## 📝 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Thành công",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Có lỗi xảy ra",
  "errors": [
    {
      "field": "email",
      "message": "Email không hợp lệ"
    }
  ]
}
```

## 💳 Payment Flow (20 giây)

1. **Client**: Tạo payment → POST `/api/payment/create`
2. **Server**: Trả về `paymentCode` và `paymentUrl`
3. **Client**: Gọi process payment → POST `/api/payment/{gateway}/process`
4. **Server**: Xử lý thanh toán **trong 20 giây** (PAYMENT_PROCESSING_DELAY)
5. **Server**: Trả kết quả success/failed (90% success rate)
6. **Client**: Nhận kết quả và hiển thị

⚠️ **Lưu ý**: Payment gateways là **mock implementation**, không kết nối thật.

## 🗄️ Database Models

### User
- id, username, email, password, fullName, phone, address, role, status, avatar

### Product
- id, name, slug, description, price, discountPercent, stock, categoryId, images, unit, status

### Cart
- id, userId, total, discount, voucherCode

### CartItem
- id, cartId, productId, quantity, price, discountPercent

### Order
- id, userId, orderCode, subtotal, shippingFee, discount, total, shippingAddress, shippingPhone, shippingName, paymentMethod, paymentStatus, orderStatus, voucherCode, note

### OrderItem
- id, orderId, productId, quantity, price, discountPercent

### Payment
- id, orderId, paymentCode, paymentMethod, amount, status, transactionId, responseData

### Voucher
- id, code, name, discountType, discountValue, minOrderValue, maxDiscountAmount, startDate, endDate, usageLimit, usedCount, status

### Theme
- id, name, type, primaryColor, secondaryColor, effectsEnabled, isActive

### Category
- id, name, slug, description, parentId

## 🛠️ Development

### Scripts

```bash
npm run dev      # Chạy với nodemon (auto-restart)
npm start        # Chạy production
npm test         # Chạy tests
npm run lint     # Check code style
```

### Database Sync

Development mode tự động sync models:

```javascript
// server.js
if (process.env.NODE_ENV === 'development') {
  await sequelize.sync({ alter: false });
}
```

### Error Handling

Global error handler trong `errorMiddleware.js` xử lý:
- Sequelize validation errors
- JWT errors
- Multer upload errors
- Custom errors

## 📊 Logging

Morgan logging:
- Development: `dev` format (colored, concise)
- Production: `combined` format (Apache standard)

## 🚀 Deployment

### Production Build

```bash
npm install --production
NODE_ENV=production npm start
```

### PM2 (Process Manager)

```bash
pm2 start src/server.js --name "sieuthiabc-api"
pm2 logs sieuthiabc-api
pm2 restart sieuthiabc-api
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

## 📈 Performance

- Connection pooling với Sequelize
- JWT token caching
- Static file serving với Express
- Gzip compression middleware

## 🔍 Testing

```bash
npm test                    # Chạy tất cả tests
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:coverage      # Coverage report
```

## 📄 License

MIT

## 👥 Contributors

- Backend Developer - Node.js, SQL Server, API Development

---

**Backend API Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Total Files**: 59 JavaScript files  
**Payment Delay**: ⏱️ 20 seconds (PAYMENT_PROCESSING_DELAY)
