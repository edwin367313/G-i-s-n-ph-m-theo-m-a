# Hệ Thống Phân Tích Dữ Liệu Khách Hàng

Hệ thống Machine Learning để phân tích giỏ hàng và phân khúc khách hàng cho Siêu Thị ABC.

## 🎯 Các Bước Phân Tích

### Bước 1: Apriori - Phân Tích Giỏ Hàng
**Mục đích**: Tìm các sản phẩm thường được mua cùng nhau

**Input**: Danh sách sản phẩm trong mỗi hóa đơn

**Output**: Các luật kết hợp dạng `{Sản phẩm A, B} → {Sản phẩm C}`

**Ý nghĩa**: 
- Sắp xếp sản phẩm gần nhau trên quầy kệ
- Tạo combo khuyến mãi
- Gợi ý sản phẩm khi khách mua hàng

### Bước 2: K-Means - Phân Khúc Khách Hàng
**Mục đích**: Phân nhóm khách hàng dựa trên hành vi mua sắm

**Input**: Chỉ số RFM của từng khách hàng
- **R** (Recency): Số ngày từ lần mua cuối
- **F** (Frequency): Số lần mua hàng
- **M** (Monetary): Tổng tiền chi tiêu

**Output**: Các cụm khách hàng (VIP, Thường xuyên, Vãng lai)

**Ý nghĩa**:
- Nhận diện khách hàng thân thiết
- Tìm khách hàng có nguy cơ rời bỏ
- Cá nhân hóa chiến lược marketing

### Bước 3: Gán Nhãn (Labeling)
**Mục đích**: Đặt tên có ý nghĩa cho các cụm

**Cách gán**:
- Cụm có F cao, M lớn, R thấp → **"VIP"**
- Cụm có F trung bình → **"Thường xuyên"**
- Cụm có F thấp hoặc R cao → **"Vãng lai"**

### Bước 4: Decision Tree - Học Quy Luật
**Mục đích**: Tạo quy tắc dễ hiểu để giải thích và dự đoán

**Input**: Thông tin khách hàng + Nhãn từ bước 3

**Output**: Cây quyết định với các quy luật như:
```
Nếu (Tuổi tài khoản > 1 năm) và (Tổng chi tiêu > 1 triệu)
  → 85% là khách VIP
```

**Ý nghĩa**:
- Giải thích tại sao khách được phân loại như vậy
- Dự đoán phân khúc cho khách hàng mới
- Đưa ra chiến lược marketing cụ thể

### Bước 5: Dự Đoán (Prediction)
**Mục đích**: Áp dụng model để dự đoán khách hàng mới

**Input**: Thông tin khách hàng mới

**Output**: Phân khúc + Độ tin cậy

## 📦 Cài Đặt

### 1. Cài đặt Python dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Cài đặt ODBC Driver cho SQL Server
Download và cài đặt: [ODBC Driver 17 for SQL Server](https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server)

## 🚀 Sử Dụng

### Chạy Từng Bước (Standalone)

```bash
# Bước 1: Phân tích giỏ hàng
python src/ml/Nghi_apriori.py

# Bước 2: Phân khúc khách hàng
python src/ml/Nghi_kmeans.py

# Bước 3 & 4: Huấn luyện Decision Tree
python src/ml/Nghi_decisiontree.py
```

### Sử Dụng Qua API

#### 1. Phân tích giỏ hàng
```http
GET /api/ml/market-basket?minSupport=0.01&minConfidence=0.3&limit=10
Authorization: Bearer {admin_token}
```

#### 2. Phân khúc khách hàng
```http
POST /api/ml/segment-customers
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "nClusters": 3
}
```

#### 3. Huấn luyện Decision Tree
```http
POST /api/ml/train-classifier
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "maxDepth": 5
}
```

#### 4. Dự đoán khách hàng mới
```http
POST /api/ml/predict-customer
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "recency": 10,
  "frequency": 5,
  "monetary": 1500000,
  "accountAge": 2,
  "hasPhone": true,
  "hasAddress": true
}
```

#### 5. Chạy toàn bộ pipeline
```http
POST /api/ml/run-pipeline
Authorization: Bearer {admin_token}
```

## 📊 Kết Quả

### Market Basket Analysis
- **Support**: Tỷ lệ đơn hàng chứa itemset (ví dụ: 0.05 = 5% đơn hàng)
- **Confidence**: Xác suất mua B khi đã mua A (ví dụ: 0.7 = 70%)
- **Lift**: Mức độ ảnh hưởng (> 1 = có liên quan)

### Customer Segmentation
- **Cluster 0**: VIP - Khách hàng thân thiết
- **Cluster 1**: Thường xuyên - Khách hàng trung thành
- **Cluster 2**: Vãng lai - Khách hàng mới/không thường xuyên

### Decision Tree
- **Accuracy**: Độ chính xác của model
- **Rules**: Các quy tắc phân loại dạng text
- **Feature Importance**: Độ quan trọng của từng yếu tố

## 📁 Cấu Trúc Thư Mục

```
backend/src/ml/
├── Nghi_apriori.py            # Phân tích giỏ hàng
├── Nghi_kmeans.py             # Phân khúc khách hàng
├── Nghi_decisiontree.py       # Huấn luyện Decision Tree
├── models/                    # Lưu models đã train
│   ├── kmeans_model.pkl
│   ├── scaler.pkl
│   ├── decision_tree.pkl
│   └── dt_metadata.pkl
└── data/                      # Dữ liệu tạm thời
    └── customer_segments.csv
```

## 🎓 Ứng Dụng Thực Tế

### 1. Sắp Xếp Quầy Kệ
Dựa vào luật Apriori, đặt các sản phẩm thường mua cùng nhau gần nhau.

### 2. Tạo Combo Khuyến Mãi
Ví dụ: Nếu `{Bia, Lạc} → {Khăn giấy}` có confidence cao, tạo combo "Bia + Lạc + Khăn giấy" giảm 10%.

### 3. Marketing Cá Nhân Hóa
- **VIP**: Gửi ưu đãi độc quyền, chương trình tích điểm cao
- **Thường xuyên**: Khuyến khích mua nhiều hơn bằng voucher
- **Vãng lai**: Thu hút quay lại bằng giảm giá mạnh

### 4. Dự Đoán Khách Hàng Mới
Khi có khách đăng ký mới, dự đoán ngay phân khúc để áp dụng chiến lược phù hợp.

## ⚠️ Lưu Ý

1. **Dữ liệu tối thiểu**: Cần ít nhất 50 đơn hàng để Apriori có kết quả tốt
2. **Chạy định kỳ**: Nên chạy lại pipeline mỗi tháng để cập nhật model
3. **Tune parameters**: Điều chỉnh min_support, min_confidence, n_clusters tùy dữ liệu
4. **Bảo mật**: Các API cần token admin, không public cho user

## 🔧 Troubleshooting

### Lỗi: Module not found
```bash
pip install pandas numpy scikit-learn mlxtend pyodbc
```

### Lỗi: ODBC Driver not found
Cài đặt ODBC Driver 17 for SQL Server từ Microsoft.

### Lỗi: Không đủ dữ liệu
Đảm bảo có ít nhất 50 đơn hàng và 20 khách hàng trong database.

## 📚 Tài Liệu Tham Khảo

- [Apriori Algorithm](https://en.wikipedia.org/wiki/Apriori_algorithm)
- [K-Means Clustering](https://scikit-learn.org/stable/modules/clustering.html#k-means)
- [Decision Trees](https://scikit-learn.org/stable/modules/tree.html)
- [RFM Analysis](https://en.wikipedia.org/wiki/RFM_(market_research))
