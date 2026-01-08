# 📁 Cấu Trúc Project - Siêu Thị ABC

## 🌳 Thư Mục Chính

```
SIEUTHIABC/
├── 📂 backend/              # Backend Node.js + Express + ML
├── 📂 Nam_frontend/         # Frontend React + Vite
├── 📂 database/             # SQL scripts & setup
├── 📂 Hung_ml-service/      # ML Service (Image Classification - tách riêng)
├── 📄 Groceries_dataset.csv # Dataset gốc (14,963 transactions)
├── 📄 START_ALL.ps1         # Script khởi động toàn bộ hệ thống
├── 📄 restart-backend.ps1   # Script restart backend
└── 📄 README.md             # Tài liệu project
```

---

## 🔧 Backend (Node.js + Express)

### Cấu trúc thư mục:
```
backend/
├── src/
│   ├── server.js                    # Entry point
│   ├── config/                      # Cấu hình database, JWT, payment
│   │   ├── database.js
│   │   ├── jwt.js
│   │   ├── payment.js
│   │   └── upload.js
│   ├── controllers/                 # Business logic
│   │   ├── categoryController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── Khanh_authController.js
│   │   ├── Minh_cartController.js
│   │   ├── Minh_paymentController.js
│   │   ├── Nghi_mlController.js
│   │   ├── Nghi_revenueController.js
│   │   ├── Nghi_themeController.js
│   │   ├── Hung_analyticsController.js
│   │   ├── notificationController.js
│   │   ├── uploadController.js
│   │   └── voucherController.js
│   ├── models/                      # Database models
│   │   ├── Category.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── Khanh_User.js
│   │   ├── Minh_Cart.js
│   │   ├── Minh_CartItem.js
│   │   ├── Minh_Payment.js
│   │   ├── Minh_PaymentConfig.js
│   │   ├── Nghi_Theme.js
│   │   ├── Notification.js
│   │   ├── Voucher.js
│   │   └── Image.js
│   ├── routes/                      # API routes
│   │   ├── index.js                 # Main router
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── Khanh_authRoutes.js
│   │   ├── Minh_cartRoutes.js
│   │   ├── Minh_paymentRoutes.js
│   │   ├── mlRoutes.js
│   │   ├── Nghi_revenueRoutes.js
│   │   ├── Nghi_themeRoutes.js
│   │   ├── Hung_analytics.js
│   │   ├── notificationRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── voucherRoutes.js
│   ├── services/                    # Service layer
│   │   ├── analyticsService.js
│   │   ├── authService.js
│   │   ├── cartService.js
│   │   ├── emailService.js
│   │   ├── recommendationService.js  # ⭐ Seasonal ML recommendations
│   │   └── ...
│   ├── middlewares/                 # Express middlewares
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── validationMiddleware.js
│   ├── ml/                          # 🤖 Machine Learning Engine
│   │   ├── seasonal_recommendation.py    # ⭐ Main ML script
│   │   ├── product_suggestion_engine.py  # Apriori algorithm
│   │   ├── run_daily_analysis.py         # Scheduled ML tasks
│   │   ├── Nghi_apriori.py
│   │   ├── Nghi_decisiontree.py
│   │   ├── Nghi_kmeans.py
│   │   ├── data/                         # ML data files
│   │   └── models/                       # Trained ML models
│   ├── payment-gateways/            # Payment integrations
│   │   └── paymentUtils.js
│   └── utils/                       # Utility functions
├── scripts/                         # Utility scripts
│   ├── hashPassword.js              # Password hashing utility
│   └── hashPasswords.js             # Batch password hashing
├── public/                          # Static files
│   └── qr-codes/                    # QR code images
├── package.json                     # Dependencies
├── requirements.txt                 # Python dependencies
└── .env                             # Environment variables
```

### Key Features:
- **RESTful API** với Express.js
- **SQL Server** integration (EDWIN server)
- **JWT Authentication** (authMiddleware)
- **Role-based Access Control** (roleMiddleware)
- **Payment Gateway** integration
- **File Upload** (multer)
- **ML Integration** (Python scripts)

---

## 🎨 Frontend (React + Vite)

### Cấu trúc thư mục:
```
Nam_frontend/
├── src/
│   ├── main.jsx                     # Entry point
│   ├── App.jsx                      # Root component
│   ├── routes.jsx                   # React Router config
│   ├── pages/                       # Page components
│   │   ├── admin/                   # Admin pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProductPredictionPage.jsx    # ⭐ ML Product Associations
│   │   │   ├── SeasonalReportPage.jsx       # ⭐ Seasonal Analytics
│   │   │   ├── QuarterlyReportPage.jsx      # ⭐ Quarterly Report
│   │   │   ├── ProductManagement.jsx
│   │   │   ├── OrderManagement.jsx
│   │   │   └── ...
│   │   └── user/                    # User pages
│   │       ├── HomePage.jsx
│   │       ├── ProductsPage.jsx
│   │       ├── CartPage.jsx
│   │       ├── CheckoutPage.jsx
│   │       └── ...
│   ├── components/                  # Reusable components
│   │   ├── Layout/
│   │   ├── ProductCard.jsx
│   │   ├── CategoryFilter.jsx
│   │   └── ...
│   ├── services/                    # API services
│   │   ├── recommendationService.js  # ⭐ ML API calls
│   │   ├── productService.js
│   │   ├── authService.js
│   │   └── ...
│   ├── context/                     # React Context
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── hooks/                       # Custom React hooks
│   ├── utils/                       # Utility functions
│   │   ├── api.js                   # Axios instance
│   │   └── constants.js
│   └── styles/                      # CSS files
├── public/                          # Static assets
├── index.html                       # HTML template
├── package.json                     # Dependencies
└── vite.config.js                   # Vite configuration
```

### Key Features:
- **React 18** với Hooks
- **React Router v6** (routing)
- **Ant Design** (UI components)
- **Axios** (HTTP client)
- **Context API** (state management)
- **Vite** (build tool - fast HMR)

---

## 🗄️ Database (SQL Server)

### Cấu trúc thư mục:
```
database/
├── schema.sql                       # ⭐ Main database schema (All tables)
├── setup.sql                        # ⭐ Complete database setup script
├── setup.ps1                        # ⭐ PowerShell setup automation
├── create_ml_tables.sql             # ⭐ ML tables (Associations, SeasonalProducts)
└── import_csv.js                    # ⭐ CSV import script (Node.js)
```

**Note:** Chỉ giữ lại 5 files quan trọng nhất. Đã xóa các files duplicate và temporary.

### Database: `Order` on `EDWIN`

### Main Tables:
#### E-commerce Tables:
- **Users** - User accounts (MemberNumber, Email, Password)
- **Categories** - Product categories
- **Products** - Products (ProductID, ProductName, Price, Stock)
- **Orders** - Orders (OrderID, UserID, TotalAmount, Status)
- **OrderItems** - Order line items
- **Carts** - Shopping carts
- **CartItems** - Cart items
- **Payments** - Payment records
- **Vouchers** - Discount vouchers
- **Notifications** - User notifications

#### Transaction Data:
- **Transactions** - Transaction records (TransactionID, TransactionDate, Items, MemberNumber)

#### ⭐ ML Tables (Core Feature):
- **ProductAssociations** - Association rules từ Apriori
  - Columns: ProductA, ProductB, Support, Confidence, Lift, Season
  - 123 rules (19 general + 104 seasonal)
- **SeasonalProducts** - Top products theo mùa
  - Columns: ProductName, Season, PurchaseCount, CustomerCount, PopularityScore
  - 653 products across 4 seasons

---

## 🤖 ML Service (Hung - Image Classification)

```
Hung_ml-service/
├── src/
│   ├── app.py                       # Flask API
│   ├── api/                         # API endpoints
│   ├── preprocessing/               # Image preprocessing
│   ├── services/                    # ML services
│   ├── training/                    # Model training
│   └── utils/                       # Utilities
├── models/
│   └── image_classifier_model.h5    # Trained model
└── requirements.txt                 # Python dependencies
```

**Note:** Service này tách riêng, không phải core feature của seasonal recommendation.

---

## 🚀 Startup Scripts

### `START_ALL.ps1` - Khởi động toàn bộ hệ thống
```powershell
# Kills existing processes
# Starts backend (port 5000)
# Starts frontend (port 3000)
# Opens browser
```

### `restart-backend.ps1` - Restart backend
```powershell
# Kills port 5000 processes
# Starts backend server
```

---

## 📊 Core Features - Seasonal Product Recommendation System

### 1. **ML Engine** (Backend/src/ml/)
- **seasonal_recommendation.py** - Main ML logic
  - Apriori algorithm (mlxtend)
  - Season detection (Xuân/Hạ/Thu/Đông)
  - Generate association rules
  - Store to ProductAssociations table

- **product_suggestion_engine.py** - Suggestion API
  - Get product suggestions based on basket
  - Season-aware recommendations
  - Confidence & Lift scoring

### 2. **Backend APIs** (Backend/src/services/)
- **recommendationService.js**
  - `/api/recommendations/suggest/:product` - Product suggestions
  - `/api/recommendations/current-season` - Current season products
  - `/api/recommendations/seasonal/:season` - Season-specific products
  - `/api/recommendations/quarterly-report` - Analytics report
  - `/api/recommendations/associations` - Association rules

### 3. **Frontend Pages** (Nam_frontend/src/pages/admin/)
- **ProductPredictionPage.jsx** - Product association viewer
  - AutoComplete search
  - Display confidence & lift
  - Season tags
  
- **SeasonalReportPage.jsx** - Seasonal analytics
  - 4 season tabs (Xuân/Hạ/Thu/Đông)
  - Top products per season
  - Statistics cards

- **QuarterlyReportPage.jsx** - Quarterly analytics
  - Summary statistics
  - Product rankings
  - Revenue analysis

### 4. **Database** (ProductAssociations table)
```sql
CREATE TABLE ProductAssociations (
    AssociationID INT IDENTITY(1,1) PRIMARY KEY,
    ProductA NVARCHAR(255) NOT NULL,
    ProductB NVARCHAR(255) NOT NULL,
    Support FLOAT NOT NULL,
    Confidence FLOAT NOT NULL,
    Lift FLOAT NOT NULL,
    Season NVARCHAR(50) NULL,  -- Xuân/Hạ/Thu/Đông or NULL for general
    CreatedAt DATETIME DEFAULT GETDATE()
)
```

---

## 🔑 Key Accounts

### Admin Account:
- **Username:** admin
- **Password:** admin123
- **MemberNumber:** 5000

### Test User Account:
- **Username:** user1
- **Password:** 123456
- **MemberNumber:** 5001

---

## 📦 Dependencies

### Backend:
- **express** - Web framework
- **mssql** - SQL Server client
- **jsonwebtoken** - JWT auth
- **bcryptjs** - Password hashing
- **multer** - File upload
- **cors** - CORS middleware

### Frontend:
- **react** - UI library
- **react-router-dom** - Routing
- **antd** - UI components
- **axios** - HTTP client
- **react-hot-toast** - Notifications

### Python (ML):
- **pandas** - Data manipulation
- **mlxtend** - Apriori algorithm
- **pyodbc** - SQL Server connection

---

## 🏃 Running the Project

### Method 1: All-in-one
```powershell
.\START_ALL.ps1
```

### Method 2: Manual
```powershell
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd Nam_frontend
npm run dev

# Terminal 3: ML Analysis (if needed)
cd backend/src/ml
python seasonal_recommendation.py
```

### URLs:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Database:** EDWIN (SQL Server)

---

## 📈 Data Flow

```
1. CSV Import (Groceries_dataset.csv)
   ↓
2. Transactions Table (14,963 records)
   ↓
3. ML Analysis (seasonal_recommendation.py)
   ↓
4. ProductAssociations Table (123 rules)
   ↓
5. API (recommendationService.js)
   ↓
6. Frontend (ProductPredictionPage.jsx)
   ↓
7. User sees recommendations
```

---

## 🎯 Project Goals

✅ Import 14,963 transactions from CSV
✅ Implement Apriori algorithm for association rules
✅ Season-based product recommendations (4 seasons)
✅ Admin dashboard for ML analytics
✅ User cart recommendations
✅ REST API for all features
✅ Responsive React frontend

---

## 📝 Notes

- **Database:** EDWIN server, database "Order"
- **167 products** synced with ProductAssociations
- **123 association rules** (19 general + 104 seasonal)
- **653 seasonal products** across 4 seasons
- **Frontend running on Vite** (fast HMR)
- **Backend uses Job for background tasks**

---

## 🔧 Maintenance Tasks

### Daily:
- ML analysis runs automatically (can be triggered manually)

### Weekly:
- Check database performance
- Review association rules accuracy

### Monthly:
- Backup database
- Update ML models with new transactions

---

**Last Updated:** January 6, 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
