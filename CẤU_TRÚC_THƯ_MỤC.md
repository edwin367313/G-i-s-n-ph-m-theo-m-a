# SƠ ĐỒ CẤU TRÚC THƯ MỤC - SIÊU THỊ ABC

```
SIEUTHIABC/
│
├── 📁 frontend/                          # Giao diện người dùng (React/Vue/Next.js)
│   ├── 📁 public/
│   │   ├── 📁 images/                    # Lưu trữ ảnh tĩnh
│   │   │   ├── 📁 products/              # Ảnh sản phẩm
│   │   │   ├── 📁 themes/                # Ảnh theme (tết, mùa, sự kiện)
│   │   │   ├── 📁 icons/                 # Icon hiệu ứng rơi
│   │   │   └── 📁 banners/               # Banner quảng cáo
│   │   ├── favicon.ico
│   │   └── index.html
│   │
│   ├── 📁 src/
│   │   ├── 📁 components/                # Các component tái sử dụng
│   │   │   ├── 📁 common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── FilterPanel.jsx
│   │   │   │   └── Loading.jsx
│   │   │   │
│   │   │   ├── 📁 product/
│   │   │   │   ├── ProductCard.jsx       # Card hiển thị sản phẩm
│   │   │   │   ├── ProductList.jsx       # Danh sách sản phẩm
│   │   │   │   ├── ProductDetail.jsx     # Chi tiết sản phẩm
│   │   │   │   └── ProductFilter.jsx     # Bộ lọc sản phẩm
│   │   │   │
│   │   │   ├── 📁 cart/
│   │   │   │   ├── CartItem.jsx          # Item trong giỏ hàng
│   │   │   │   ├── CartSummary.jsx       # Tổng kết giỏ hàng
│   │   │   │   └── VoucherInput.jsx      # Nhập mã voucher
│   │   │   │
│   │   │   ├── 📁 payment/
│   │   │   │   ├── PaymentMethod.jsx     # Chọn phương thức thanh toán
│   │   │   │   ├── MomoPayment.jsx       # Giao diện thanh toán Momo
│   │   │   │   ├── ZaloPayPayment.jsx    # Giao diện thanh toán ZaloPay
│   │   │   │   ├── PaypalPayment.jsx     # Giao diện thanh toán Paypal
│   │   │   │   ├── PaymentLoading.jsx    # Loading 20s
│   │   │   │   └── PaymentSuccess.jsx    # Màn hình thành công
│   │   │   │
│   │   │   ├── 📁 theme/
│   │   │   │   ├── ThemeEffects.jsx      # Component hiệu ứng theme
│   │   │   │   ├── TetEffect.jsx         # Pháo hoa, hoa đào rơi
│   │   │   │   ├── SpringEffect.jsx      # Cây non, hoa nở
│   │   │   │   ├── SummerEffect.jsx      # Mặt trời chiếu sáng
│   │   │   │   ├── AutumnEffect.jsx      # Lá vàng rơi
│   │   │   │   ├── WinterEffect.jsx      # Tuyết rơi
│   │   │   │   └── CustomEffect.jsx      # Hiệu ứng tùy chỉnh
│   │   │   │
│   │   │   └── 📁 admin/
│   │   │       ├── AdminSidebar.jsx
│   │   │       ├── ProductManagement.jsx # Quản lý sản phẩm
│   │   │       ├── RevenueChart.jsx      # Biểu đồ doanh thu
│   │   │       ├── ThemeManager.jsx      # Quản lý theme
│   │   │       ├── ImageUploader.jsx     # Upload ảnh
│   │   │       └── PaymentAPIConfig.jsx  # Cấu hình API thanh toán
│   │   │
│   │   ├── 📁 pages/                     # Các trang chính
│   │   │   ├── 📁 user/
│   │   │   │   ├── HomePage.jsx          # Trang chủ siêu thị
│   │   │   │   ├── CartPage.jsx          # Trang giỏ hàng
│   │   │   │   ├── CheckoutPage.jsx      # Trang thanh toán
│   │   │   │   └── ProductDetailPage.jsx # Chi tiết sản phẩm
│   │   │   │
│   │   │   ├── 📁 admin/
│   │   │   │   ├── Dashboard.jsx         # Tổng quan admin
│   │   │   │   ├── ProductsPage.jsx      # Quản lý sản phẩm
│   │   │   │   ├── RevenuePage.jsx       # Phân tích doanh thu
│   │   │   │   ├── ThemeSettingsPage.jsx # Cài đặt theme
│   │   │   │   ├── ImageLibraryPage.jsx  # Thư viện ảnh
│   │   │   │   └── PaymentSettingsPage.jsx # Cài đặt thanh toán
│   │   │   │
│   │   │   ├── 📁 auth/
│   │   │   │   ├── LoginPage.jsx         # Đăng nhập
│   │   │   │   └── RegisterPage.jsx      # Đăng ký
│   │   │   │
│   │   │   └── NotFoundPage.jsx          # 404
│   │   │
│   │   ├── 📁 services/                  # API services
│   │   │   ├── authService.js            # API đăng nhập, đăng ký
│   │   │   ├── productService.js         # API sản phẩm
│   │   │   ├── cartService.js            # API giỏ hàng
│   │   │   ├── paymentService.js         # API thanh toán (giả lập)
│   │   │   ├── themeService.js           # API theme
│   │   │   ├── revenueService.js         # API doanh thu
│   │   │   └── mlService.js              # API Machine Learning
│   │   │
│   │   ├── 📁 hooks/                     # Custom React Hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   ├── useTheme.js
│   │   │   └── usePayment.js
│   │   │
│   │   ├── 📁 context/                   # Context API
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── AppContext.jsx
│   │   │
│   │   ├── 📁 utils/                     # Utilities
│   │   │   ├── api.js                    # Axios config
│   │   │   ├── helpers.js                # Helper functions
│   │   │   ├── validation.js             # Validation functions
│   │   │   └── constants.js              # Constants
│   │   │
│   │   ├── 📁 styles/                    # CSS/SCSS
│   │   │   ├── global.css
│   │   │   ├── themes.css                # Theme styles
│   │   │   ├── animations.css            # Animations cho hiệu ứng
│   │   │   └── responsive.css
│   │   │
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── routes.jsx                    # Route configuration
│   │
│   ├── .env                              # Environment variables
│   ├── package.json
│   └── vite.config.js / next.config.js
│
├── 📁 backend/                           # Server backend (Node.js/Express hoặc ASP.NET Core)
│   ├── 📁 src/
│   │   ├── 📁 controllers/               # Controllers xử lý request
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js      # Controller thanh toán giả lập
│   │   │   ├── themeController.js
│   │   │   ├── revenueController.js
│   │   │   ├── voucherController.js
│   │   │   └── uploadController.js       # Upload ảnh
│   │   │
│   │   ├── 📁 models/                    # Models (ORM/Sequelize hoặc Entity Framework)
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Category.js
│   │   │   ├── Cart.js
│   │   │   ├── CartItem.js
│   │   │   ├── Order.js
│   │   │   ├── OrderItem.js
│   │   │   ├── Payment.js
│   │   │   ├── Voucher.js
│   │   │   ├── Theme.js
│   │   │   ├── PaymentConfig.js
│   │   │   └── Image.js
│   │   │
│   │   ├── 📁 routes/                    # API Routes
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── themeRoutes.js
│   │   │   ├── revenueRoutes.js
│   │   │   ├── voucherRoutes.js
│   │   │   ├── uploadRoutes.js
│   │   │   └── index.js
│   │   │
│   │   ├── 📁 middlewares/               # Middlewares
│   │   │   ├── authMiddleware.js         # Xác thực JWT
│   │   │   ├── roleMiddleware.js         # Phân quyền admin/user
│   │   │   ├── uploadMiddleware.js       # Xử lý upload file
│   │   │   ├── errorMiddleware.js
│   │   │   └── validationMiddleware.js
│   │   │
│   │   ├── 📁 services/                  # Business Logic
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── cartService.js
│   │   │   ├── orderService.js
│   │   │   ├── paymentService.js         # Logic thanh toán giả lập
│   │   │   ├── themeService.js
│   │   │   ├── revenueService.js
│   │   │   ├── voucherService.js
│   │   │   └── emailService.js
│   │   │
│   │   ├── 📁 payment-gateways/          # API Thanh toán giả lập
│   │   │   ├── momoGateway.js            # Giả lập API Momo
│   │   │   ├── zaloPayGateway.js         # Giả lập API ZaloPay
│   │   │   ├── paypalGateway.js          # Giả lập API Paypal
│   │   │   └── paymentUtils.js           # Utilities (signature, hash,...)
│   │   │
│   │   ├── 📁 utils/                     # Utilities
│   │   │   ├── database.js               # Kết nối SQL Server
│   │   │   ├── jwt.js                    # JWT utilities
│   │   │   ├── encryption.js             # Mã hóa
│   │   │   ├── fileUpload.js             # Upload file utilities
│   │   │   └── helpers.js
│   │   │
│   │   ├── 📁 config/                    # Configuration
│   │   │   ├── database.js               # Config SQL Server
│   │   │   ├── jwt.js
│   │   │   ├── payment.js                # Config payment APIs
│   │   │   └── upload.js                 # Config upload (Cloudinary/S3)
│   │   │
│   │   └── server.js                     # Entry point
│   │
│   ├── .env                              # Environment variables
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── 📁 ml-service/                        # Service Machine Learning (Python)
│   ├── 📁 models/                        # Trained models
│   │   ├── kmeans_model.pkl              # Model phân loại khách hàng
│   │   ├── decision_tree_model.pkl       # Model dự đoán doanh thu
│   │   ├── apriori_rules.pkl             # Rules sản phẩm mua cùng nhau
│   │   └── image_classifier_model.h5     # Model phân loại ảnh sản phẩm
│   │
│   ├── 📁 src/
│   │   ├── 📁 api/                       # Flask/FastAPI endpoints
│   │   │   ├── __init__.py
│   │   │   ├── customer_segmentation.py  # API phân loại khách hàng
│   │   │   ├── revenue_prediction.py     # API dự đoán doanh thu
│   │   │   ├── product_association.py    # API phân tích sản phẩm
│   │   │   ├── product_classifier.py     # API phân loại sản phẩm
│   │   │   └── image_classification.py   # API phân loại ảnh
│   │   │
│   │   ├── 📁 services/                  # ML Logic
│   │   │   ├── kmeans_service.py         # K-Means clustering
│   │   │   ├── decision_tree_service.py  # Decision Tree
│   │   │   ├── apriori_service.py        # Apriori algorithm
│   │   │   ├── nlp_service.py            # NLP phân loại tên sản phẩm
│   │   │   └── image_service.py          # Computer Vision
│   │   │
│   │   ├── 📁 training/                  # Scripts training models
│   │   │   ├── train_kmeans.py
│   │   │   ├── train_decision_tree.py
│   │   │   ├── train_apriori.py
│   │   │   └── train_image_classifier.py
│   │   │
│   │   ├── 📁 preprocessing/             # Data preprocessing
│   │   │   ├── data_cleaner.py
│   │   │   ├── feature_engineering.py
│   │   │   └── data_loader.py
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── database.py               # Kết nối SQL Server từ Python
│   │   │   ├── model_loader.py
│   │   │   └── helpers.py
│   │   │
│   │   └── app.py                        # Flask/FastAPI app
│   │
│   ├── requirements.txt                  # Python dependencies
│   ├── .env
│   └── README.md
│
├── 📁 database/                          # SQL Server Database
│   ├── 📁 migrations/                    # Database migrations
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_create_products_table.sql
│   │   ├── 003_create_orders_table.sql
│   │   └── ...
│   │
│   ├── 📁 seeds/                         # Seed data
│   │   ├── seed_users.sql
│   │   ├── seed_products.sql
│   │   └── seed_categories.sql
│   │
│   ├── 📁 stored-procedures/             # Stored procedures
│   │   ├── sp_get_revenue_report.sql
│   │   ├── sp_get_customer_analytics.sql
│   │   └── sp_get_product_associations.sql
│   │
│   ├── 📁 views/                         # Database views
│   │   ├── view_revenue_monthly.sql
│   │   ├── view_revenue_quarterly.sql
│   │   └── view_revenue_yearly.sql
│   │
│   ├── schema.sql                        # Database schema
│   └── README.md
│
├── 📁 uploads/                           # Thư mục lưu file upload
│   ├── 📁 products/                      # Ảnh sản phẩm
│   ├── 📁 themes/                        # Ảnh theme
│   ├── 📁 icons/                         # Icon hiệu ứng
│   └── 📁 temp/                          # Temporary files
│
├── 📁 docs/                              # Tài liệu dự án
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── ML_MODELS_GUIDE.md
│   └── USER_MANUAL.md
│
├── 📁 tests/                             # Tests
│   ├── 📁 backend/
│   │   ├── auth.test.js
│   │   ├── product.test.js
│   │   └── payment.test.js
│   │
│   └── 📁 ml-service/
│       ├── test_kmeans.py
│       └── test_decision_tree.py
│
├── 📁 docker/                            # Docker configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── Dockerfile.ml-service
│   └── docker-compose.yml
│
├── 📁 nginx/                             # Nginx config (cho deployment)
│   ├── nginx.conf
│   └── ssl/                              # SSL certificates
│
├── .gitignore
├── README.md                             # Tài liệu chính
└── LICENSE

```

---

## 📋 MÔ TẢ CHI TIẾT CÁC THƯ MỤC CHÍNH

### 🎨 **Frontend** 
- Framework đề xuất: **React.js** hoặc **Next.js**
- Quản lý state: **Context API** hoặc **Redux**
- UI Library: **Material-UI**, **Ant Design**, hoặc **TailwindCSS**
- Xử lý hiệu ứng theme: **React Spring**, **Framer Motion**

### 🔧 **Backend**
- Framework đề xuất: **Node.js + Express** hoặc **ASP.NET Core**
- Database: **SQL Server** (MSSQL)
- ORM: **Sequelize** (Node.js) hoặc **Entity Framework** (.NET)
- Authentication: **JWT (JSON Web Tokens)**
- File Upload: **Multer** + **Cloudinary/AWS S3**

### 🤖 **ML Service**
- Framework: **Flask** hoặc **FastAPI**
- Libraries:
  - **scikit-learn**: K-Means, Decision Tree
  - **mlxtend**: Apriori algorithm
  - **TensorFlow/PyTorch**: Image classification
  - **NLTK/spaCy**: NLP cho phân loại tên sản phẩm
  - **OpenCV**: Xử lý ảnh

### 💾 **Database (SQL Server)**
- Bảng chính:
  - Users (id, username, email, password, role)
  - Products (id, name, price, image, category_id, discount)
  - Orders (id, user_id, total, status, payment_method)
  - OrderItems (order_id, product_id, quantity, price)
  - Themes (id, name, type, config_json, is_active)
  - Vouchers (id, code, discount_percent, valid_from, valid_to)

---

## 🚀 CÔNG NGHỆ ĐỀ XUẤT

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | React.js / Next.js |
| Backend | Node.js + Express / ASP.NET Core |
| Database | SQL Server (MSSQL) |
| ML Service | Python (Flask/FastAPI) |
| Authentication | JWT |
| File Storage | Cloudinary / AWS S3 |
| Deployment | Docker + Nginx + VPS/Azure |
| Domain | Namecheap / GoDaddy |

---

## 📦 CÁC PACKAGE CHÍNH

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-router-dom": "^6.x",
    "axios": "^1.x",
    "react-spring": "^9.x",
    "framer-motion": "^10.x",
    "antd": "^5.x",
    "recharts": "^2.x"
  }
}
```

### Backend (package.json)
```json
{
  "dependencies": {
    "express": "^4.x",
    "mssql": "^10.x",
    "sequelize": "^6.x",
    "jsonwebtoken": "^9.x",
    "bcryptjs": "^2.x",
    "multer": "^1.x",
    "cloudinary": "^1.x",
    "dotenv": "^16.x"
  }
}
```

### ML Service (requirements.txt)
```
flask==3.0.0
fastapi==0.104.0
scikit-learn==1.3.0
mlxtend==0.23.0
tensorflow==2.15.0
opencv-python==4.8.0
nltk==3.8.1
pandas==2.1.0
numpy==1.24.0
pymssql==2.2.8
```

---

## 🌐 DEPLOYMENT

1. **Đưa lên Internet:**
   - Thuê VPS (DigitalOcean, Vultr, Azure, AWS)
   - Cài đặt Docker + Docker Compose
   - Deploy với Nginx reverse proxy
   
2. **Tên miền:**
   - Mua domain từ Namecheap/GoDaddy
   - Cấu hình DNS trỏ về VPS
   - Cài SSL certificate (Let's Encrypt)

3. **Cấu trúc deployment:**
   ```
   Domain: sieuthiabc.com
   Frontend: https://sieuthiabc.com
   Backend API: https://api.sieuthiabc.com
   ML Service: https://ml.sieuthiabc.com
   ```

---

**Lưu ý:** Đây là cấu trúc đầy đủ cho một hệ thống phức tạp. Bạn có thể bắt đầu từng phần một theo thứ tự ưu tiên.
