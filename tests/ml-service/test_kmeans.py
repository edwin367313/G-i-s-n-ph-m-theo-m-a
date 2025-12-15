import pytest
import sys
import os
import numpy as np
import pandas as pd
from unittest.mock import Mock, patch

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../ml-service/src'))

from services.kmeans_service import KMeansService

class TestKMeansService:
    """Test K-Means customer segmentation service"""
    
    @pytest.fixture
    def kmeans_service(self):
        """Create KMeansService instance"""
        return KMeansService()
    
    @pytest.fixture
    def sample_rfm_data(self):
        """Create sample RFM data for testing"""
        return pd.DataFrame({
            'user_id': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            'recency': [10, 50, 100, 20, 80, 30, 120, 15, 90, 40],
            'frequency': [50, 20, 5, 40, 10, 35, 3, 45, 8, 30],
            'monetary': [5000000, 2000000, 500000, 4000000, 1000000, 3500000, 300000, 4500000, 800000, 3000000]
        })
    
    def test_segment_customers_success(self, kmeans_service, sample_rfm_data):
        """Test successful customer segmentation"""
        result = kmeans_service.segment_customers(sample_rfm_data, n_clusters=3)
        
        assert 'segments' in result
        assert 'cluster_stats' in result
        assert len(result['segments']) == len(sample_rfm_data)
        assert all(0 <= cluster < 3 for cluster in result['segments']['cluster'])
    
    def test_segment_with_invalid_clusters(self, kmeans_service, sample_rfm_data):
        """Test segmentation with invalid number of clusters"""
        with pytest.raises(ValueError):
            kmeans_service.segment_customers(sample_rfm_data, n_clusters=0)
        
        with pytest.raises(ValueError):
            kmeans_service.segment_customers(sample_rfm_data, n_clusters=15)
    
    def test_segment_empty_data(self, kmeans_service):
        """Test segmentation with empty data"""
        empty_df = pd.DataFrame(columns=['user_id', 'recency', 'frequency', 'monetary'])
        
        with pytest.raises(ValueError):
            kmeans_service.segment_customers(empty_df)
    
    def test_cluster_stats_calculation(self, kmeans_service, sample_rfm_data):
        """Test cluster statistics calculation"""
        result = kmeans_service.segment_customers(sample_rfm_data, n_clusters=3)
        stats = result['cluster_stats']
        
        assert len(stats) == 3
        for cluster_stat in stats:
            assert 'cluster' in cluster_stat
            assert 'size' in cluster_stat
            assert 'avg_recency' in cluster_stat
            assert 'avg_frequency' in cluster_stat
            assert 'avg_monetary' in cluster_stat
            assert cluster_stat['size'] > 0
    
    def test_customer_labels(self, kmeans_service, sample_rfm_data):
        """Test customer segment labels"""
        result = kmeans_service.segment_customers(sample_rfm_data, n_clusters=3)
        
        valid_labels = ['VIP', 'Regular', 'At Risk', 'Lost', 'New']
        for segment in result['segments']['segment_label']:
            assert any(label in segment for label in valid_labels)
    
    def test_rfm_scoring(self, kmeans_service, sample_rfm_data):
        """Test RFM score calculation"""
        result = kmeans_service.segment_customers(sample_rfm_data)
        
        assert 'rfm_score' in result['segments'].columns
        assert all(1 <= score <= 5 for score in result['segments']['rfm_score'])
    
    def test_segment_distribution(self, kmeans_service, sample_rfm_data):
        """Test segment distribution is reasonable"""
        result = kmeans_service.segment_customers(sample_rfm_data, n_clusters=3)
        
        total_customers = len(sample_rfm_data)
        cluster_sizes = [stat['size'] for stat in result['cluster_stats']]
        
        assert sum(cluster_sizes) == total_customers
        assert all(size > 0 for size in cluster_sizes)
    
    def test_model_persistence(self, kmeans_service, sample_rfm_data, tmp_path):
        """Test model can be saved and loaded"""
        result = kmeans_service.segment_customers(sample_rfm_data)
        
        model_path = tmp_path / "kmeans_model.pkl"
        kmeans_service.save_model(str(model_path))
        
        assert model_path.exists()
        
        new_service = KMeansService()
        new_service.load_model(str(model_path))
        
        predictions = new_service.predict(sample_rfm_data.iloc[:2])
        assert len(predictions) == 2
    
    def test_predict_new_customers(self, kmeans_service, sample_rfm_data):
        """Test prediction on new customer data"""
        # Train model
        kmeans_service.segment_customers(sample_rfm_data)
        
        # New customer data
        new_data = pd.DataFrame({
            'user_id': [11, 12],
            'recency': [25, 70],
            'frequency': [35, 15],
            'monetary': [3200000, 1500000]
        })
        
        predictions = kmeans_service.predict(new_data)
        assert len(predictions) == 2
        assert all(isinstance(p, (int, np.integer)) for p in predictions)

if __name__ == '__main__':
    pytest.main([__file__, '-v'])
