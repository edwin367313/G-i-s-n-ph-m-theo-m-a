# 🏪 SIÊU THỊ ABC - Hệ Thống Gợi Ý Sản Phẩm Theo Mùa

Dự án e-commerce với AI/ML recommendations dựa trên phân tích theo mùa và product associations.

---

## 📁 CẤU TRÚC PROJECT

```
SIEUTHIABC/
├── backend/              # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── ml/          # Python ML scripts
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API endpoints
│   │   └── models/      # Database models
│   └── package.json
│
├── Nam_frontend/         # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/       # User & Admin pages
│   │   ├── components/  # Reusable components
│   │   └── services/    # API client
│   └── package.json
│
├── database/            # SQL scripts & migrations
├── Hung_ml-service/     # ML service (optional)
├── Groceries_dataset.csv # Dataset gốc
└── START_ALL.ps1        # Script khởi động tự động
```

---

## 🚀 KHỞI ĐỘNG NHANH

### Cách 1: Tự động (Khuyến nghị)
```powershell
.\START_ALL.ps1
```

### Cách 2: Thủ công
**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd Nam_frontend
npm run dev
```

---

## 🌐 TRUY CẬP

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:3000/admin

---

## 💾 DATABASE

- **Server**: EDWIN (SQL Server)
- **Database**: Order
- **Tables**: Users, Products, Orders, Transactions, SeasonalProducts, ProductAssociations

### Setup Database (lần đầu):
```powershell
cd database
# Chạy các file .sql theo thứ tự
```

---

## 🤖 FEATURES

### 👥 User Features
- ✅ Đăng ký/Đăng nhập (MemberNumber tự động từ 5000)
- ✅ Xem sản phẩm theo 4 mùa (Xuân, Hạ, Thu, Đông)
- ✅ Banner gợi ý sản phẩm hot theo mùa hiện tại
- ✅ Recommendations khi thêm vào giỏ hàng
- ✅ Tạo đơn hàng (tự động sync vào Transactions)

### 🎯 Admin Features
- ✅ Dashboard tổng quan
- ✅ Quản lý sản phẩm, đơn hàng, categories
- ✅ **ML Product Prediction** - Dự đoán sản phẩm liên quan
- ✅ **Seasonal Report** - Báo cáo chi tiết 4 mùa
- ✅ **Quarterly Report** - So sánh hiệu quả theo quý
- ✅ Quản lý themes, notifications

### 🧠 ML/AI Features
- ✅ Seasonal product analysis (653 sản phẩm theo mùa)
- ✅ Apriori association rules (123 rules)
- ✅ Realtime recommendations từ database
- ✅ Tự động đồng bộ Orders → Transactions

---

## 📊 DỮ LIỆU

- **327 sản phẩm** trong Products table
- **653 sản phẩm theo mùa** (163/mùa)
- **123 association rules** (19 general + 104 seasonal)
- **14,963 transactions** từ 3,898 khách hàng

---

## 🛠️ CÔNG NGHỆ

### Backend
- Node.js + Express.js
- SQL Server (mssql)
- Python (ML scripts)
- JWT Authentication

### Frontend
- React + Vite
- Ant Design
- React Router
- Axios

### Machine Learning
- Python pandas
- mlxtend (Apriori)
- scikit-learn
- pyodbc

---

## 📝 YÊU CẦU HỆ THỐNG

- Node.js v18+
- Python 3.12+
- SQL Server
- npm/yarn

---

## 🔧 CÀI ĐẶT (Lần đầu)

### 1. Backend
```powershell
cd backend
npm install
```

### 2. Frontend
```powershell
cd Nam_frontend
npm install
```

### 3. Python Environment
```powershell
# Activate virtual environment
.venv\Scripts\Activate.ps1

# Install dependencies
pip install pandas mlxtend scikit-learn pyodbc
```

### 4. Environment Variables
Tạo file `backend/.env`:
```env
DB_SERVER=EDWIN
DB_DATABASE=Order
DB_USER=sa
DB_PASSWORD=123456
PORT=5000
JWT_SECRET=your-secret-key
```

---

## 🎓 HƯỚNG DẪN SỬ DỤNG

### Đăng ký User mới
1. Truy cập http://localhost:3000/register
2. Điền thông tin
3. MemberNumber sẽ tự động được gán (>= 5000)

### Xem sản phẩm theo mùa
1. Vào trang Products
2. Chọn tab Xuân/Hạ/Thu/Đông
3. Mùa hiện tại được đánh dấu "Hot"

### Sử dụng ML Recommendations (Admin)
1. Đăng nhập admin
2. Vào Admin Dashboard
3. Chọn "Dự đoán Sản phẩm" / "Báo cáo Theo mùa" / "Báo cáo Quý"

### Chạy phân tích ML
```powershell
cd backend\src\ml
python run_daily_analysis.py
```

---

## 🐛 TROUBLESHOOTING

### Port đang bị chiếm
```powershell
# Kill port 5000
Get-NetTCPConnection -LocalPort 5000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Kill port 3000
Get-NetTCPConnection -LocalPort 3000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Database connection error
- Kiểm tra SQL Server đang chạy
- Xác nhận thông tin trong `backend/.env`
- Test connection: `sqlcmd -S EDWIN -d Order -U sa -P 123456`

### Frontend không load được API
- Đảm bảo backend đang chạy trên port 5000
- Kiểm tra proxy config trong `Nam_frontend/vite.config.js`
- Clear cache: `Ctrl + Shift + R` trong browser

---

## 📞 THÔNG TIN

- **Database**: Order (SQL Server EDWIN)
- **Backend Port**: 5000
- **Frontend Port**: 3000
- **Python venv**: `.venv`

---

## 📅 VERSION HISTORY

- **v1.0.0** (Jan 6, 2026) - Initial release with ML recommendations
- ✅ MemberNumber system implemented
- ✅ Seasonal analysis completed
- ✅ Admin ML dashboard added
- ✅ Auto-sync Orders → Transactions

---

## 🎉 HOÀN THÀNH

Project đã được tinh gọn và sẵn sàng sử dụng!

**Quick Start:**
```powershell
.\START_ALL.ps1
```

Enjoy! 🚀
