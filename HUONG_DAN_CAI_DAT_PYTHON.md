# Hướng Dẫn Cài Đặt Python và Chạy Thuật Toán ML

## ⚠️ Yêu Cầu

Để chạy các thuật toán Machine Learning (Apriori, K-Means, Decision Tree), bạn cần:
1. Python 3.8 trở lên
2. ODBC Driver 17 for SQL Server
3. Các thư viện Python (pandas, numpy, scikit-learn, mlxtend, pyodbc)

## 🔧 Bước 1: Cài Đặt Python

### Cách 1: Tải từ Python.org (Khuyến nghị)
1. Truy cập: https://www.python.org/downloads/
2. Tải **Python 3.11** (bản mới nhất stable)
3. Chạy file installer
4. **QUAN TRỌNG**: Tick vào ô **"Add Python to PATH"**
5. Click **"Install Now"**

### Cách 2: Cài qua Microsoft Store
1. Mở **Microsoft Store**
2. Tìm kiếm **"Python 3.11"**
3. Click **"Get"** để cài đặt

### Kiểm tra cài đặt thành công:
```powershell
python --version
# Hoặc
py --version
```

Kết quả mong đợi: `Python 3.11.x`

## 🗄️ Bước 2: Cài ODBC Driver for SQL Server

1. Tải về: https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server
2. Chọn **ODBC Driver 17 for SQL Server**
3. Tải bản Windows x64
4. Chạy file installer và làm theo hướng dẫn

## 📦 Bước 3: Cài Đặt Python Dependencies

Mở PowerShell **với quyền Administrator** và chạy:

```powershell
# Di chuyển vào thư mục backend
cd "c:\tailieuhoc\Kho dữ liệu và khai phá\SIEUTHIABC\backend"

# Cài đặt tất cả dependencies
pip install -r requirements.txt
```

Nếu gặp lỗi, cài từng package:

```powershell
pip install pandas==2.1.4
pip install numpy==1.26.2
pip install scikit-learn==1.3.2
pip install mlxtend==0.23.0
pip install pyodbc==5.0.1
pip install python-dotenv==1.0.0
pip install matplotlib==3.8.2
pip install seaborn==0.13.0
pip install joblib==1.3.2
```

## ✅ Bước 4: Kiểm Tra Cài Đặt

Chạy lệnh sau để kiểm tra:

```powershell
python -c "import pandas; import numpy; import sklearn; import mlxtend; import pyodbc; print('✅ Tất cả packages đã được cài đặt!')"
```

## 🚀 Bước 5: Chạy Thuật Toán

### Chạy từng bước:

```powershell
cd "c:\tailieuhoc\Kho dữ liệu và khai phá\SIEUTHIABC\backend"

# Bước 1: Apriori - Phân tích giỏ hàng
python src/ml/Nghi_apriori.py

# Bước 2: K-Means - Phân khúc khách hàng
python src/ml/Nghi_kmeans.py

# Bước 3: Decision Tree - Học quy luật
python src/ml/Nghi_decisiontree.py
```

### Hoặc chạy qua API:

1. Đảm bảo backend đang chạy (`npm run dev`)
2. Login với tài khoản admin
3. Gọi API:

```http
POST http://localhost:5000/api/ml/run-pipeline
Authorization: Bearer {admin_token}
```

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi: "Python was not found"
**Nguyên nhân**: Python chưa được thêm vào PATH

**Giải pháp**:
1. Gỡ cài đặt Python
2. Cài lại và nhớ tick "Add Python to PATH"
3. Hoặc thêm thủ công vào PATH:
   - Mở System Properties → Environment Variables
   - Thêm `C:\Users\{YourName}\AppData\Local\Programs\Python\Python311` vào PATH

### Lỗi: "No module named 'pandas'"
**Nguyên nhân**: Chưa cài thư viện

**Giải pháp**:
```powershell
pip install pandas numpy scikit-learn mlxtend pyodbc
```

### Lỗi: "ODBC Driver not found"
**Nguyên nhân**: Chưa cài ODBC Driver 17

**Giải pháp**: Cài đặt theo Bước 2

### Lỗi: "Connection failed"
**Nguyên nhân**: Không kết nối được SQL Server

**Giải pháp**:
1. Kiểm tra file `.env` có đúng thông tin DB không
2. Đảm bảo SQL Server đang chạy
3. Kiểm tra firewall

### Lỗi: "Not enough data"
**Nguyên nhân**: Database không đủ dữ liệu

**Giải pháp**:
- Apriori cần ít nhất 50 đơn hàng
- K-Means cần ít nhất 20 khách hàng
- Decision Tree cần ít nhất 30 khách hàng

## 📊 Kiểm Tra Kết Quả

Sau khi chạy thành công, file kết quả sẽ được lưu tại:

- **K-Means**: `backend/src/ml/data/customer_segments.csv`
- **Models**: `backend/src/ml/models/` (kmeans_model.pkl, decision_tree.pkl)

## 🎓 Tài Liệu Tham Khảo

- [Python Documentation](https://docs.python.org/3/)
- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [Scikit-learn Documentation](https://scikit-learn.org/stable/)
- [ML_README.md](backend/ML_README.md) - Chi tiết về các thuật toán

## 💡 Lưu Ý

1. **Chạy với quyền Admin**: Một số thư viện cần quyền admin để cài
2. **Python 32-bit vs 64-bit**: Nên dùng 64-bit để xử lý dữ liệu lớn
3. **Virtual Environment**: Nên tạo venv riêng cho project
4. **Update pip**: `python -m pip install --upgrade pip`

## 🔄 Cập Nhật Dependencies

Khi có phiên bản mới:

```powershell
pip install --upgrade pandas numpy scikit-learn mlxtend
```

---

**Nếu vẫn gặp vấn đề, hãy kiểm tra log lỗi chi tiết và liên hệ để được hỗ trợ!** 🚀
