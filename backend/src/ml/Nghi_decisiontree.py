import pyodbc
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text, plot_tree
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
from dotenv import load_dotenv

load_dotenv()

class CustomerClassifier:
    def __init__(self):
        self.conn_str = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={os.getenv('DB_SERVER', os.getenv('DB_HOST'))};"
            f"DATABASE={os.getenv('DB_DATABASE', os.getenv('DB_NAME'))};"
            f"UID={os.getenv('DB_USER')};"
            f"PWD={os.getenv('DB_PASSWORD')}"
        )
        self.dt_model = None
        self.label_mapping = None
    
    def load_segmented_data(self):
        """Load dữ liệu đã được phân khúc từ bước 2"""
        data_path = os.path.join(os.path.dirname(__file__), 'data', 'customer_segments.csv')
        
        if not os.path.exists(data_path):
            raise FileNotFoundError("Chưa có dữ liệu phân khúc. Hãy chạy step2_kmeans.py trước!")
        
        df = pd.read_csv(data_path)
        return df
    
    def prepare_training_data(self):
        """
        Chuẩn bị dữ liệu huấn luyện
        Kết hợp thông tin khách hàng với nhãn phân khúc
        """
        # Load dữ liệu đã phân khúc
        df = self.load_segmented_data()
        
        # Lấy thêm thông tin khách hàng từ database
        query = """
        SELECT 
            u.id as user_id,
            YEAR(GETDATE()) - YEAR(u.created_at) as account_age_years,
            CASE 
                WHEN u.phone IS NOT NULL AND LEN(u.phone) > 0 THEN 1 
                ELSE 0 
            END as has_phone,
            CASE 
                WHEN u.address IS NOT NULL AND LEN(u.address) > 0 THEN 1 
                ELSE 0 
            END as has_address
        FROM Users u
        WHERE u.role = 'customer'
        """
        
        with pyodbc.connect(self.conn_str) as conn:
            user_info = pd.read_sql(query, conn)
        
        # Kết hợp dữ liệu
        df = df.merge(user_info, on='user_id', how='left')
        
        # Tạo thêm các features
        df['rfm_score'] = (
            (df['recency'].max() - df['recency']) / df['recency'].max() * 0.3 +
            df['frequency'] / df['frequency'].max() * 0.3 +
            df['monetary'] / df['monetary'].max() * 0.4
        )
        
        return df
    
    def train_decision_tree(self, max_depth=5):
        """
        Huấn luyện Decision Tree với nhãn từ K-Means
        
        Args:
            max_depth: Độ sâu tối đa của cây (để dễ hiểu)
        """
        print(f"🌳 Đang huấn luyện Decision Tree...")
        
        # Chuẩn bị dữ liệu
        df = self.prepare_training_data()
        
        # Chọn features
        feature_columns = ['recency', 'frequency', 'monetary', 'account_age_years', 
                          'has_phone', 'has_address', 'rfm_score']
        X = df[feature_columns]
        
        # Target là nhãn đã gán từ K-Means
        y = df['label']
        
        # Map label sang số
        self.label_mapping = {label: idx for idx, label in enumerate(y.unique())}
        reverse_mapping = {idx: label for label, idx in self.label_mapping.items()}
        y_encoded = y.map(self.label_mapping)
        
        # Chia train/test
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
        )
        
        # Huấn luyện
        self.dt_model = DecisionTreeClassifier(
            max_depth=max_depth,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42
        )
        self.dt_model.fit(X_train, y_train)
        
        # Đánh giá
        y_pred = self.dt_model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"✅ Độ chính xác: {accuracy:.2%}")
        
        # In báo cáo chi tiết
        print("\n📊 Báo cáo phân loại:")
        target_names = [reverse_mapping[i] for i in sorted(reverse_mapping.keys())]
        print(classification_report(y_test, y_pred, target_names=target_names))
        
        # Lưu model
        self._save_model(feature_columns, reverse_mapping)
        
        # Trích xuất luật
        rules = self._extract_rules(feature_columns, reverse_mapping)
        
        return {
            'accuracy': accuracy,
            'rules': rules,
            'feature_importance': self._get_feature_importance(feature_columns)
        }
    
    def _extract_rules(self, feature_names, label_mapping):
        """Trích xuất luật từ Decision Tree dưới dạng text"""
        tree_rules = export_text(
            self.dt_model, 
            feature_names=feature_names,
            max_depth=5
        )
        
        return tree_rules
    
    def _get_feature_importance(self, feature_names):
        """Lấy độ quan trọng của các features"""
        if self.dt_model is None:
            return []
        
        importances = self.dt_model.feature_importances_  # type: ignore
        
        feature_importance = []
        for name, importance in zip(feature_names, importances):
            feature_importance.append({
                'feature': name,
                'importance': float(importance)
            })
        
        # Sắp xếp theo độ quan trọng
        feature_importance = sorted(
            feature_importance, 
            key=lambda x: x['importance'], 
            reverse=True
        )
        
        return feature_importance
    
    def _save_model(self, feature_columns, label_mapping):
        """Lưu model và metadata"""
        models_dir = os.path.join(os.path.dirname(__file__), 'models')
        os.makedirs(models_dir, exist_ok=True)
        
        joblib.dump(self.dt_model, os.path.join(models_dir, 'decision_tree.pkl'))
        joblib.dump({
            'feature_columns': feature_columns,
            'label_mapping': label_mapping
        }, os.path.join(models_dir, 'dt_metadata.pkl'))
        
        print("💾 Đã lưu Decision Tree model")
    
    def predict_customer_type(self, customer_features):
        """
        Dự đoán loại khách hàng mới
        
        Args:
            customer_features: dict chứa các features
        """
        if self.dt_model is None:
            self._load_model()
        
        if self.dt_model is None:
            raise ValueError("Model chưa được huấn luyện")
        
        # Load metadata
        models_dir = os.path.join(os.path.dirname(__file__), 'models')
        metadata = joblib.load(os.path.join(models_dir, 'dt_metadata.pkl'))
        
        # Chuẩn bị dữ liệu
        X = pd.DataFrame([customer_features])[metadata['feature_columns']]  # type: ignore
        
        # Dự đoán
        prediction = self.dt_model.predict(X)[0]  # type: ignore
        probabilities = self.dt_model.predict_proba(X)[0]  # type: ignore
        
        # Lấy nhãn
        label = metadata['label_mapping'][prediction]  # type: ignore
        
        # Tạo kết quả chi tiết
        result = {
            'label': label,
            'confidence': float(max(probabilities)),
            'probabilities': {
                metadata['label_mapping'][i]: float(prob)  # type: ignore
                for i, prob in enumerate(probabilities)
            }
        }
        
        return result
    
    def _load_model(self):
        """Load model đã lưu"""
        models_dir = os.path.join(os.path.dirname(__file__), 'models')
        self.dt_model = joblib.load(os.path.join(models_dir, 'decision_tree.pkl'))

if __name__ == "__main__":
    classifier = CustomerClassifier()
    
    try:
        results = classifier.train_decision_tree(max_depth=5)
        
        print("\n" + "="*80)
        print("🌳 LUẬT PHÂN LOẠI KHÁCH HÀNG")
        print("="*80)
        print(results['rules'])
        
        print("\n" + "="*80)
        print("📊 ĐỘ QUAN TRỌNG CÁC FEATURES")
        print("="*80)
        for item in results['feature_importance']:
            print(f"  {item['feature']:20s}: {item['importance']:.3f}")
        
    except FileNotFoundError as e:
        print(f"❌ Lỗi: {e}")
        print("💡 Hãy chạy step2_kmeans.py trước để tạo dữ liệu phân khúc!")
