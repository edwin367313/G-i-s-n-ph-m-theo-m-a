import pyodbc
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from datetime import datetime
import joblib
import os
from dotenv import load_dotenv

load_dotenv()

class CustomerSegmentation:
    def __init__(self):
        self.conn_str = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={os.getenv('DB_SERVER', os.getenv('DB_HOST'))};"
            f"DATABASE={os.getenv('DB_NAME')};"
            f"UID={os.getenv('DB_USER')};"
            f"PWD={os.getenv('DB_PASSWORD')}"
        )
        self.scaler = StandardScaler()
        self.kmeans = None
    
    def calculate_rfm(self):
        """Tính toán chỉ số RFM cho từng khách hàng"""
        query = """
        WITH CustomerOrders AS (
            SELECT 
                user_id,
                MAX(created_at) as last_order_date,
                COUNT(DISTINCT id) as frequency,
                SUM(total_amount) as monetary
            FROM Orders
            WHERE status IN ('DELIVERED', 'paid', 'delivery')
                AND user_id IS NOT NULL
            GROUP BY user_id
        )
        SELECT 
            co.user_id,
            u.full_name,
            u.email,
            u.phone,
            DATEDIFF(day, co.last_order_date, GETDATE()) as recency,
            co.frequency,
            co.monetary,
            co.last_order_date
        FROM CustomerOrders co
        JOIN Users u ON co.user_id = u.id
        WHERE u.role = 'customer'
        """
        
        with pyodbc.connect(self.conn_str) as conn:
            df = pd.read_sql(query, conn)
        
        print(f"📊 Tổng số khách hàng: {len(df)}")
        return df
    
    def segment_customers(self, n_clusters=3):
        """
        Phân cụm khách hàng bằng K-Means
        
        Args:
            n_clusters: Số cụm (mặc định 3: VIP, Thường xuyên, Vãng lai)
        """
        print(f"🔍 Đang phân cụm khách hàng thành {n_clusters} nhóm...")
        
        # Tính RFM
        df = self.calculate_rfm()
        
        if len(df) == 0:
            return None
        
        # Chuẩn bị dữ liệu cho clustering
        rfm_data = df[['recency', 'frequency', 'monetary']].copy()
        
        # Chuẩn hóa dữ liệu
        rfm_scaled = self.scaler.fit_transform(rfm_data)
        
        # Chạy K-Means
        self.kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        df['cluster'] = self.kmeans.fit_predict(rfm_scaled)
        
        # Phân tích từng cụm
        cluster_analysis = self._analyze_clusters(df)
        
        # Gán nhãn tự động
        df = self._auto_label_clusters(df, cluster_analysis)
        
        # Lưu model
        self._save_model()
        
        print(f"✅ Đã phân cụm thành công!")
        
        return df, cluster_analysis
    
    def _analyze_clusters(self, df):
        """Phân tích đặc điểm của từng cụm"""
        analysis = []
        
        for cluster_id in sorted(df['cluster'].unique()):
            cluster_df = df[df['cluster'] == cluster_id]
            
            analysis.append({
                'cluster_id': int(cluster_id),
                'size': len(cluster_df),
                'avg_recency': float(cluster_df['recency'].mean()),
                'avg_frequency': float(cluster_df['frequency'].mean()),
                'avg_monetary': float(cluster_df['monetary'].mean()),
                'total_revenue': float(cluster_df['monetary'].sum())
            })
        
        return analysis
    
    def _auto_label_clusters(self, df, cluster_analysis):
        """
        Tự động gán nhãn cho các cụm dựa trên đặc điểm RFM
        
        Logic:
        - VIP: Frequency cao, Monetary cao, Recency thấp
        - Thường xuyên: Frequency trung bình, Monetary trung bình
        - Vãng lai: Frequency thấp hoặc Recency cao
        """
        # Tính điểm cho mỗi cụm
        cluster_scores = []
        
        for analysis in cluster_analysis:
            # Điểm càng cao = khách hàng càng tốt
            score = (
                analysis['avg_frequency'] * 0.4 +  # Tần suất mua hàng quan trọng
                (analysis['avg_monetary'] / 1000000) * 0.4 +  # Tổng chi tiêu
                (1 / (analysis['avg_recency'] + 1)) * 100 * 0.2  # Gần đây (đảo ngược)
            )
            cluster_scores.append({
                'cluster_id': analysis['cluster_id'],
                'score': score
            })
        
        # Sắp xếp theo điểm
        cluster_scores = sorted(cluster_scores, key=lambda x: x['score'], reverse=True)
        
        # Gán nhãn
        labels = {
            cluster_scores[0]['cluster_id']: 'VIP',
        }
        
        if len(cluster_scores) == 2:
            labels[cluster_scores[1]['cluster_id']] = 'Vãng lai'
        elif len(cluster_scores) >= 3:
            labels[cluster_scores[1]['cluster_id']] = 'Thường xuyên'
            labels[cluster_scores[2]['cluster_id']] = 'Vãng lai'
            
            # Nếu có thêm cụm, gọi là "Cần chăm sóc"
            for i in range(3, len(cluster_scores)):
                labels[cluster_scores[i]['cluster_id']] = 'Cần chăm sóc'
        
        # Áp dụng nhãn vào dataframe
        df['label'] = df['cluster'].map(labels)
        
        return df
    
    def _save_model(self):
        """Lưu model và scaler để sử dụng sau"""
        models_dir = os.path.join(os.path.dirname(__file__), 'models')
        os.makedirs(models_dir, exist_ok=True)
        
        joblib.dump(self.kmeans, os.path.join(models_dir, 'kmeans_model.pkl'))
        joblib.dump(self.scaler, os.path.join(models_dir, 'scaler.pkl'))
        print("💾 Đã lưu model vào models/")
    
    def predict_customer_segment(self, recency, frequency, monetary):
        """Dự đoán phân khúc cho khách hàng mới"""
        if self.kmeans is None:
            self._load_model()
        
        # Chuẩn hóa dữ liệu
        data = np.array([[recency, frequency, monetary]])
        data_scaled = self.scaler.transform(data)
        
        # Dự đoán
        cluster = self.kmeans.predict(data_scaled)[0]
        
        return int(cluster)
    
    def _load_model(self):
        """Load model đã lưu"""
        models_dir = os.path.join(os.path.dirname(__file__), 'models')
        
        self.kmeans = joblib.load(os.path.join(models_dir, 'kmeans_model.pkl'))
        self.scaler = joblib.load(os.path.join(models_dir, 'scaler.pkl'))

if __name__ == "__main__":
    segmenter = CustomerSegmentation()
    df, analysis = segmenter.segment_customers(n_clusters=3)
    
    if df is not None:
        print("\n" + "="*80)
        print("👥 PHÂN TÍCH PHÂN KHÚC KHÁCH HÀNG")
        print("="*80)
        
        for cluster in analysis:
            label = df[df['cluster'] == cluster['cluster_id']]['label'].iloc[0]
            print(f"\n📊 Nhóm {cluster['cluster_id']}: {label}")
            print(f"   - Số lượng: {cluster['size']} khách hàng")
            print(f"   - Recency TB: {cluster['avg_recency']:.0f} ngày")
            print(f"   - Frequency TB: {cluster['avg_frequency']:.1f} đơn")
            print(f"   - Monetary TB: {cluster['avg_monetary']:,.0f} đ")
            print(f"   - Tổng doanh thu: {cluster['total_revenue']:,.0f} đ")
        
        # Lưu kết quả
        output_path = os.path.join(os.path.dirname(__file__), 'data', 'customer_segments.csv')
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        df.to_csv(output_path, index=False, encoding='utf-8-sig')
        print(f"\n💾 Đã lưu kết quả vào {output_path}")
