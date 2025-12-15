# Frontend - Siêu Thị ABC

Frontend của website thương mại điện tử Siêu Thị ABC được xây dựng với React, Vite, và Ant Design.

## 🚀 Công nghệ sử dụng

- **React 18.2** - UI Library
- **Vite 5.0** - Build tool
- **React Router 6.20** - Routing
- **Ant Design 5.12** - UI Components
- **Axios** - HTTP Client
- **React Query** - Data fetching & caching
- **Zustand** - State management (nếu cần)
- **React Hot Toast** - Notifications
- **Recharts** - Charts & Analytics
- **React Spring & Framer Motion** - Animations
- **Moment.js** - Date formatting

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 🎯 Tính năng chính

### 1. Xác thực & Phân quyền
- Đăng nhập/Đăng ký
- JWT Authentication
- Role-based access (User/Admin)
- Protected routes

### 2. Quản lý Sản phẩm
- Danh sách sản phẩm với pagination
- Lọc theo danh mục, giá
- Tìm kiếm sản phẩm
- Chi tiết sản phẩm

### 3. Giỏ hàng
- Thêm/Xóa/Cập nhật sản phẩm
- Đồng bộ localStorage khi chưa đăng nhập
- Áp dụng mã giảm giá
- Tính tổng tự động

### 4. Thanh toán (20 giây xử lý)
- **Momo** - Ví điện tử
- **ZaloPay** - Ví điện tử
- **PayPal** - Thẻ quốc tế
- **COD** - Thanh toán khi nhận hàng
- Progress bar 20 giây mô phỏng xử lý

### 5. Hiệu ứng Mùa
- **Tết**: Pháo hoa 🎆
- **Xuân**: Hoa bay 🌸
- **Hè**: Mặt trời ☀️
- **Thu**: Lá rơi 🍂
- **Đông**: Tuyết rơi ❄️

### 6. Admin Panel
- Dashboard thống kê
- Quản lý sản phẩm (CRUD)
- Quản lý đơn hàng
- Báo cáo doanh thu với biểu đồ
- Quản lý theme mùa

## 📁 Cấu trúc thư mục

```
src/
├── components/         # React components
│   ├── common/        # Header, Footer, Loading, FilterPanel
│   ├── product/       # ProductCard, ProductList
│   ├── cart/          # CartItem, CartSummary, VoucherInput
│   ├── payment/       # PaymentModal
│   ├── theme/         # ThemeEffects (seasonal animations)
│   └── admin/         # Admin components
├── pages/             # Page components
│   ├── user/          # HomePage, CartPage, CheckoutPage, etc.
│   ├── admin/         # Dashboard, ProductsPage, RevenuePage, etc.
│   └── auth/          # LoginPage, RegisterPage
├── context/           # React Context providers
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   ├── ThemeContext.jsx
│   └── AppProvider.jsx
├── hooks/             # Custom hooks
│   ├── useCommon.js   # useFetch, usePagination, useDebounce
│   ├── usePayment.js  # Payment with 20s countdown
│   └── useProduct.js  # Product operations
├── services/          # API services
│   ├── authService.js
│   ├── productService.js
│   ├── cartService.js
│   ├── paymentService.js  # 20s processing delay
│   ├── themeService.js
│   ├── revenueService.js
│   └── mlService.js       # ML analytics
├── utils/             # Utilities
│   ├── constants.js   # Constants (20s delay constant)
│   ├── api.js         # Axios config
│   ├── validation.js  # Form validation
│   └── helpers.js     # Helper functions
├── styles/            # Global styles
│   └── animations.css
├── App.jsx            # Main app with routes
└── main.jsx           # Entry point
```

## 🔧 Cấu hình

### Environment Variables (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_ML_SERVICE_URL=http://localhost:8000
```

### Vite Config

- Proxy API calls từ `/api` đến backend `http://localhost:5000`
- Path aliases: `@`, `@components`, `@pages`, `@services`, etc.

## 🎨 Theme System

Theme mùa được quản lý qua CSS Variables:

```css
:root {
  --primary-color: #1890ff;
  --secondary-color: #52c41a;
  --background-color: #f0f2f5;
  --text-color: #333;
}
```

Khi thay đổi theme, các biến này được cập nhật động.

## 💳 Payment Flow (20 giây)

1. User chọn phương thức thanh toán
2. Tạo payment request
3. **Xử lý 20 giây** với progress bar & countdown
4. Hiển thị kết quả (success/failed)

```javascript
// constants.js
export const PAYMENT_PROCESSING_DELAY = 20000; // 20 seconds

// usePayment.js
const processMomoPayment = async (paymentData) => {
  // Start countdown
  let timeLeft = 20;
  const interval = setInterval(() => {
    timeLeft -= 1;
    setCountdown(timeLeft);
  }, 1000);
  
  // Wait 20 seconds
  await new Promise(resolve => setTimeout(resolve, 20000));
  
  // Process payment
  const result = await paymentService.processMomoPayment(paymentData);
  return result;
};
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 768px (tablet), 992px (desktop)
- Ant Design Grid system

## 🚀 Deployment

```bash
# Build for production
npm run build

# Output: dist/
# Deploy dist folder to hosting service
```

## 🔗 API Integration

Tất cả API calls đi qua Axios instance trong `utils/api.js`:

- Auto inject JWT token
- Handle 401 (auto logout)
- Handle errors with Vietnamese messages
- 30s timeout

## 🎯 Vietnamese Language

Toàn bộ UI/UX sử dụng tiếng Việt:
- Thông báo
- Validation messages
- Button labels
- Error messages

## 📊 ML Integration

Frontend tích hợp với ML Service cho:
- Customer segmentation (K-Means)
- Revenue prediction (Decision Tree)
- Product recommendations (Apriori)
- Shopping behavior analysis

## 🔐 Security

- JWT stored in localStorage
- Auto logout on token expiration
- Protected routes with role checking
- XSS protection
- CSRF protection

## 📝 Notes

- Entry point: `src/main.jsx` (NOT index.jsx)
- Backend API: `http://localhost:5000/api`
- ML Service: `http://localhost:8000/api`
- Payment processing: **Always 20 seconds**
- Theme effects can be toggled on/off

## 🐛 Troubleshooting

**Lỗi module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Lỗi port đã sử dụng:**
```bash
# Change port in vite.config.js
server: {
  port: 3001
}
```

**API không kết nối:**
- Kiểm tra backend đang chạy
- Kiểm tra VITE_API_URL trong .env
- Kiểm tra CORS settings ở backend
