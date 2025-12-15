# 🤖 ML Service - Siêu Thị ABC

Machine Learning Service cho hệ thống Siêu Thị ABC, cung cấp các tính năng phân tích và dự đoán thông minh.

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tech Stack](#tech-stack)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Các mô hình ML](#các-mô-hình-ml)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy dịch vụ](#chạy-dịch-vụ)
- [API Endpoints](#api-endpoints)
- [Training Models](#training-models)
- [Development](#development)

## 🎯 Giới thiệu

ML Service cung cấp 5 mô hình Machine Learning chính:

1. **Customer Segmentation** - Phân khúc khách hàng (K-Means)
2. **Revenue Prediction** - Dự đoán doanh thu (Decision Tree)
3. **Product Association** - Gợi ý sản phẩm (Apriori)
4. **Product Classifier** - Phân loại sản phẩm (NLP)
5. **Image Classification** - Nhận diện ảnh sản phẩm (CNN)

## 🛠️ Tech Stack

### Framework & Core
- **FastAPI** 0.109.0 - Web framework
- **Uvicorn** 0.27.0 - ASGI server
- **Python** 3.9+

### Machine Learning
- **scikit-learn** 1.4.0 - ML algorithms
- **mlxtend** 0.23.0 - Apriori algorithm
- **NumPy** 1.26.3 - Numerical computing
- **Pandas** 2.2.0 - Data manipulation

### NLP & Image
- **NLTK** 3.8.1 - Natural Language Processing
- **Pillow** 10.2.0 - Image processing
- (Optional) TensorFlow/PyTorch - Deep learning

### Database
- **pymssql** 2.2.11 - SQL Server connector

## 📁 Cấu trúc thư mục

```
ml-service/
├── src/
│   ├── app.py                      # FastAPI entry point
│   ├── api/                        # API endpoints
│   │   ├── customer_segmentation.py
│   │   ├── revenue_prediction.py
│   │   ├── product_association.py
│   │   ├── product_classifier.py
│   │   └── image_classification.py
│   ├── services/                   # ML services
│   │   ├── kmeans_service.py       # K-Means clustering
│   │   ├── decision_tree_service.py # Decision Tree
│   │   ├── apriori_service.py      # Apriori algorithm
│   │   ├── nlp_service.py          # NLP classifier
│   │   └── image_service.py        # Image classifier
│   ├── preprocessing/              # Data preprocessing
│   │   ├── data_loader.py          # Load data from DB
│   │   ├── data_cleaner.py         # Clean data
│   │   └── feature_engineering.py  # Create features
│   ├── training/                   # Training scripts
│   │   ├── train_kmeans.py
│   │   ├── train_decision_tree.py
│   │   ├── train_apriori.py
│   │   └── train_image_classifier.py
│   └── utils/                      # Utilities
│       ├── database.py             # DB connection
│       ├── helpers.py              # Helper functions
│       └── model_loader.py         # Model I/O
├── models/                         # Trained models (.pkl)
├── .env                           # Environment variables
├── requirements.txt               # Dependencies
└── README.md

```

## 🤖 Các mô hình ML

### 1. Customer Segmentation (K-Means)

**Mục đích**: Phân khúc khách hàng dựa trên RFM (Recency, Frequency, Monetary)

**Thuật toán**: K-Means Clustering (5 clusters)

**Features**:
- `recency`: Số ngày kể từ lần mua cuối
- `frequency`: Tổng số đơn hàng
- `monetary`: Tổng tiền đã chi tiêu

**Segments**:
- **VIP** - Khách hàng quan trọng nhất
- **Trung thành** - Mua thường xuyên
- **Tiềm năng** - Có khả năng phát triển
- **Mới** - Khách hàng mới
- **Ngủ đông** - Lâu không mua

### 2. Revenue Prediction (Decision Tree)

**Mục đích**: Dự đoán doanh thu theo ngày/tháng

**Thuật toán**: Decision Tree Regressor

**Features**:
- Thông tin ngày tháng (month, weekday)
- Số lượng sản phẩm trung bình
- Doanh thu trung bình 7/30 ngày

**Metrics**:
- MAE (Mean Absolute Error)
- RMSE (Root Mean Squared Error)

### 3. Product Association (Apriori)

**Mục đích**: Tìm mối liên kết giữa sản phẩm, gợi ý sản phẩm

**Thuật toán**: Apriori Algorithm

**Parameters**:
- `min_support`: 0.01 (1%)
- `min_confidence`: 0.3 (30%)

**Outputs**:
- Frequent itemsets
- Association rules (A → B)
- Metrics: Support, Confidence, Lift

### 4. Product Classifier (NLP)

**Mục đích**: Phân loại sản phẩm từ tên và mô tả

**Thuật toán**: TF-IDF + Multinomial Naive Bayes

**Pipeline**:
1. Text preprocessing (lowercase, remove punctuation)
2. TF-IDF vectorization
3. Naive Bayes classification

**Categories**: Dựa trên dữ liệu trong database

### 5. Image Classification (CNN)

**Mục đích**: Nhận diện danh mục từ ảnh sản phẩm

**Thuật toán**: CNN (Mock implementation)

**Categories**:
- Thực phẩm tươi sống
- Đồ uống
- Bánh kẹo
- Gia vị
- Đồ gia dụng
- Chăm sóc cá nhân
- Khác

**Note**: Cần TensorFlow/PyTorch cho training thực tế

## 🔧 Cài đặt

### 1. Clone repository

```bash
cd ml-service
```

### 2. Tạo virtual environment

```bash
python -m venv venv
```

### 3. Activate virtual environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 4. Cài đặt dependencies

```bash
pip install -r requirements.txt
```

### 5. Download NLTK data (nếu sử dụng NLP)

```python
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

## ⚙️ Cấu hình

Tạo file `.env`:

```env
# Server
HOST=0.0.0.0
PORT=8000
ENV=development

# Database
DB_HOST=localhost
DB_PORT=1433
DB_NAME=SieuThiABC
DB_USER=sa
DB_PASSWORD=your_password

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# ML Settings
MODEL_PATH=./models
```

## 🚀 Chạy dịch vụ

### Development

```bash
cd src
python app.py
```

Hoặc:

```bash
uvicorn src.app:app --reload --host 0.0.0.0 --port 8000
```

### Production

```bash
uvicorn src.app:app --host 0.0.0.0 --port 8000 --workers 4
```

Service sẽ chạy tại: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

## 📡 API Endpoints

### Health Check

```http
GET /
GET /health
```

### Customer Segmentation

```http
POST /api/ml/customer-segmentation/train
POST /api/ml/customer-segmentation/predict
GET  /api/ml/customer-segmentation/segments
GET  /api/ml/customer-segmentation/status
```

**Example Request:**

```json
POST /api/ml/customer-segmentation/predict
{
  "recency": 15,
  "frequency": 10,
  "monetary": 2500000
}
```

**Example Response:**

```json
{
  "success": true,
  "cluster": 0,
  "segment": "VIP",
  "rfm_score": 5
}
```

### Revenue Prediction

```http
POST /api/ml/revenue-prediction/train
POST /api/ml/revenue-prediction/predict
POST /api/ml/revenue-prediction/forecast
GET  /api/ml/revenue-prediction/status
```

**Example Request:**

```json
POST /api/ml/revenue-prediction/forecast
{
  "days": 7
}
```

**Example Response:**

```json
{
  "success": true,
  "forecast_period": "7 ngày",
  "total_predicted_revenue": 10500000,
  "avg_daily_revenue": 1500000,
  "daily_forecasts": [...]
}
```

### Product Association

```http
POST /api/ml/product-association/train
POST /api/ml/product-association/recommendations
GET  /api/ml/product-association/rules
GET  /api/ml/product-association/frequent-itemsets
GET  /api/ml/product-association/status
```

**Example Request:**

```json
POST /api/ml/product-association/recommendations
{
  "product_names": ["Gạo ST25", "Dầu ăn"],
  "top_n": 5
}
```

**Example Response:**

```json
{
  "success": true,
  "recommendations": [
    {
      "product_name": "Nước mắm",
      "confidence": 0.85,
      "lift": 2.3,
      "support": 0.12
    }
  ]
}
```

### Product Classifier

```http
POST /api/ml/product-classifier/train
POST /api/ml/product-classifier/classify
POST /api/ml/product-classifier/batch-classify
GET  /api/ml/product-classifier/categories
GET  /api/ml/product-classifier/status
```

**Example Request:**

```json
POST /api/ml/product-classifier/classify
{
  "text": "Gạo ST25 thơm ngon cao cấp"
}
```

**Example Response:**

```json
{
  "success": true,
  "predicted_category": "Thực phẩm khô",
  "confidence": 0.92,
  "top_predictions": [...]
}
```

### Image Classification

```http
POST /api/ml/image-classification/train
POST /api/ml/image-classification/classify (multipart/form-data)
POST /api/ml/image-classification/classify-base64
POST /api/ml/image-classification/classify-url
GET  /api/ml/image-classification/categories
GET  /api/ml/image-classification/status
```

**Example Request:**

```json
POST /api/ml/image-classification/classify-url
{
  "image_url": "https://example.com/product.jpg"
}
```

## 🎓 Training Models

### Train tất cả models

```bash
cd src/training

# Customer Segmentation
python train_kmeans.py

# Revenue Prediction
python train_decision_tree.py

# Product Association
python train_apriori.py

# Image Classification (mock)
python train_image_classifier.py
```

### Train qua API

```bash
# Train K-Means
curl -X POST http://localhost:8000/api/ml/customer-segmentation/train \
  -H "Content-Type: application/json" \
  -d '{"retrain": true}'

# Train Decision Tree
curl -X POST http://localhost:8000/api/ml/revenue-prediction/train \
  -H "Content-Type: application/json" \
  -d '{"retrain": true}'

# Train Apriori
curl -X POST http://localhost:8000/api/ml/product-association/train \
  -H "Content-Type: application/json" \
  -d '{"retrain": true, "min_support": 0.01, "min_confidence": 0.3}'
```

### Model files

Models được lưu tại `models/` dưới dạng `.pkl`:

```
models/
├── customer_segmentation_kmeans.pkl
├── revenue_prediction_dt.pkl
├── product_association_apriori.pkl
├── product_classifier_nlp.pkl
└── image_classification_cnn.pkl
```

## 💻 Development

### Code Structure

```python
# Service pattern
class MLService:
    def train(self, retrain: bool) -> Dict
    def load_model(self) -> bool
    def predict(...) -> Dict

# API pattern
@router.post("/endpoint")
async def endpoint(request: RequestModel):
    result = service.method()
    if not result['success']:
        raise HTTPException(...)
    return result
```

### Testing

```bash
# Run tests
pytest tests/

# Test specific model
pytest tests/ml-service/test_kmeans.py
```

### Code Quality

```bash
# Format code
black src/

# Lint
flake8 src/
```

## 📊 Performance Tips

### 1. Model Caching

Models được load 1 lần và cache trong memory:

```python
if not self.model:
    if not self.load_model():
        raise Exception("Model not trained")
```

### 2. Batch Processing

Sử dụng batch API cho multiple predictions:

```python
POST /api/ml/product-classifier/batch-classify
{
  "texts": ["text1", "text2", "text3"]
}
```

### 3. Database Connection Pool

Database connections được quản lý qua context manager:

```python
with db.get_connection() as conn:
    # Use connection
    pass
```

## 🔒 Security

- API không có authentication (cần thêm JWT)
- CORS được cấu hình trong `.env`
- Database credentials trong `.env`
- Model files không nên commit vào git

## 🐛 Troubleshooting

### Import errors

```bash
# Cài đặt lại dependencies
pip install -r requirements.txt --force-reinstall
```

### Model not found

```bash
# Train models trước khi sử dụng
cd src/training
python train_kmeans.py
python train_decision_tree.py
python train_apriori.py
```

### Database connection error

```bash
# Kiểm tra .env
DB_HOST=localhost
DB_PORT=1433
DB_NAME=SieuThiABC

# Test connection
python -c "from src.utils.database import db; print(db.get_customers_data())"
```

### Port already in use

```bash
# Thay đổi port trong .env
PORT=8001

# Hoặc kill process
# Windows
netstat -ano | findstr :8000
taskkill /PID <pid> /F

# Linux
lsof -ti:8000 | xargs kill -9
```

## 📝 Notes

### Image Classification

Current implementation sử dụng **mock model** cho demo.

Để implement real CNN:

1. Collect dataset ảnh sản phẩm có label
2. Install TensorFlow/PyTorch:
   ```bash
   pip install tensorflow
   # hoặc
   pip install torch torchvision
   ```
3. Implement CNN architecture (ResNet, MobileNet, EfficientNet)
4. Train với data augmentation
5. Save trained weights

### NLP Classifier

Hiện tại sử dụng TF-IDF + Naive Bayes (lightweight).

Có thể nâng cấp lên:
- BERT-based models
- spaCy với custom NER
- Word2Vec/FastText embeddings

### Apriori Performance

Với dataset lớn, có thể:
- Tăng `min_support` để giảm số itemsets
- Sử dụng FP-Growth thay vì Apriori
- Parallel processing với Dask

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html)
- [mlxtend Documentation](http://rasbt.github.io/mlxtend/)
- [NLTK Book](https://www.nltk.org/book/)

## 🤝 Contributing

1. Code phải follow PEP 8
2. Add docstrings cho functions/classes
3. Write tests cho new features
4. Update README khi thay đổi API

## 📄 License

MIT License

---

**Developed with ❤️ for Siêu Thị ABC**
