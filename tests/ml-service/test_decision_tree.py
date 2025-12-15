import pytest
import sys
import os
import numpy as np
import pandas as pd
from unittest.mock import Mock, patch

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../ml-service/src'))

from services.decision_tree_service import DecisionTreeService

class TestDecisionTreeService:
    """Test Decision Tree revenue prediction service"""
    
    @pytest.fixture
    def dt_service(self):
        """Create DecisionTreeService instance"""
        return DecisionTreeService()
    
    @pytest.fixture
    def sample_order_data(self):
        """Create sample order data for testing"""
        np.random.seed(42)
        n_samples = 100
        
        return pd.DataFrame({
            'user_id': range(1, n_samples + 1),
            'total_orders': np.random.randint(1, 50, n_samples),
            'avg_order_value': np.random.uniform(100000, 5000000, n_samples),
            'days_since_last_order': np.random.randint(1, 365, n_samples),
            'product_categories': np.random.randint(1, 8, n_samples),
            'payment_method': np.random.choice(['momo', 'zalopay', 'cod', 'paypal'], n_samples),
            'total_revenue': np.random.uniform(500000, 20000000, n_samples)
        })
    
    def test_train_model_success(self, dt_service, sample_order_data):
        """Test successful model training"""
        X = sample_order_data[['total_orders', 'avg_order_value', 'days_since_last_order', 'product_categories']]
        y = sample_order_data['total_revenue']
        
        result = dt_service.train(X, y)
        
        assert 'mse' in result
        assert 'rmse' in result
        assert 'r2_score' in result
        assert 'mae' in result
        assert result['mse'] >= 0
        assert result['r2_score'] <= 1
    
    def test_train_with_insufficient_data(self, dt_service):
        """Test training with insufficient data"""
        X = pd.DataFrame({'feature': [1, 2]})
        y = pd.Series([100, 200])
        
        with pytest.raises(ValueError):
            dt_service.train(X, y)
    
    def test_predict_revenue(self, dt_service, sample_order_data):
        """Test revenue prediction"""
        X = sample_order_data[['total_orders', 'avg_order_value', 'days_since_last_order', 'product_categories']]
        y = sample_order_data['total_revenue']
        
        # Train model
        dt_service.train(X, y)
        
        # Predict on first 10 samples
        test_X = X.iloc[:10]
        predictions = dt_service.predict(test_X)
        
        assert len(predictions) == 10
        assert all(pred > 0 for pred in predictions)
    
    def test_predict_without_training(self, dt_service, sample_order_data):
        """Test prediction without training model first"""
        X = sample_order_data[['total_orders', 'avg_order_value']].iloc[:5]
        
        with pytest.raises(ValueError):
            dt_service.predict(X)
    
    def test_feature_importance(self, dt_service, sample_order_data):
        """Test feature importance extraction"""
        X = sample_order_data[['total_orders', 'avg_order_value', 'days_since_last_order', 'product_categories']]
        y = sample_order_data['total_revenue']
        
        dt_service.train(X, y)
        importances = dt_service.get_feature_importance()
        
        assert len(importances) == 4
        assert all(0 <= imp <= 1 for imp in importances.values())
        assert abs(sum(importances.values()) - 1.0) < 0.01  # Sum should be ~1
    
    def test_cross_validation(self, dt_service, sample_order_data):
        """Test cross-validation scoring"""
        X = sample_order_data[['total_orders', 'avg_order_value', 'days_since_last_order', 'product_categories']]
        y = sample_order_data['total_revenue']
        
        cv_scores = dt_service.cross_validate(X, y, cv=5)
        
        assert 'mean_score' in cv_scores
        assert 'std_score' in cv_scores
        assert 'scores' in cv_scores
        assert len(cv_scores['scores']) == 5
    
    def test_model_persistence(self, dt_service, sample_order_data, tmp_path):
        """Test model can be saved and loaded"""
        X = sample_order_data[['total_orders', 'avg_order_value', 'days_since_last_order', 'product_categories']]
        y = sample_order_data['total_revenue']
        
        # Train and save
        dt_service.train(X, y)
        model_path = tmp_path / "dt_model.pkl"
        dt_service.save_model(str(model_path))
        
        assert model_path.exists()
        
        # Load and predict
        new_service = DecisionTreeService()
        new_service.load_model(str(model_path))
        
        predictions = new_service.predict(X.iloc[:5])
        assert len(predictions) == 5
    
    def test_hyperparameter_tuning(self, dt_service, sample_order_data):
        """Test hyperparameter tuning"""
        X = sample_order_data[['total_orders', 'avg_order_value', 'days_since_last_order', 'product_categories']]
        y = sample_order_data['total_revenue']
        
        param_grid = {
            'max_depth': [3, 5, 7],
            'min_samples_split': [2, 5, 10]
        }
        
        best_params = dt_service.tune_hyperparameters(X, y, param_grid)
        
        assert 'max_depth' in best_params
        assert 'min_samples_split' in best_params
        assert best_params['max_depth'] in [3, 5, 7]
    
    def test_prediction_intervals(self, dt_service, sample_order_data):
        """Test prediction with confidence intervals"""
        X = sample_order_data[['total_orders', 'avg_order_value', 'days_since_last_order', 'product_categories']]
        y = sample_order_data['total_revenue']
        
        dt_service.train(X, y)
        
        test_X = X.iloc[:5]
        predictions = dt_service.predict_with_interval(test_X, confidence=0.95)
        
        assert len(predictions) == 5
        for pred in predictions:
            assert 'prediction' in pred
            assert 'lower_bound' in pred
            assert 'upper_bound' in pred
            assert pred['lower_bound'] <= pred['prediction'] <= pred['upper_bound']
    
    def test_categorical_encoding(self, dt_service, sample_order_data):
        """Test handling of categorical features"""
        X = sample_order_data[['total_orders', 'payment_method']]
        y = sample_order_data['total_revenue']
        
        # Should handle categorical encoding internally
        result = dt_service.train(X, y)
        assert result['r2_score'] <= 1
    
    def test_outlier_handling(self, dt_service, sample_order_data):
        """Test model handles outliers"""
        X = sample_order_data[['total_orders', 'avg_order_value', 'days_since_last_order']]
        y = sample_order_data['total_revenue']
        
        # Add outliers
        X.iloc[0, 1] = 99999999  # Extreme value
        y.iloc[0] = 99999999
        
        result = dt_service.train(X, y)
        assert result['rmse'] < float('inf')
    
    def test_batch_prediction(self, dt_service, sample_order_data):
        """Test batch prediction performance"""
        X = sample_order_data[['total_orders', 'avg_order_value', 'days_since_last_order', 'product_categories']]
        y = sample_order_data['total_revenue']
        
        dt_service.train(X, y)
        
        # Large batch
        large_batch = pd.concat([X] * 10, ignore_index=True)
        predictions = dt_service.predict(large_batch)
        
        assert len(predictions) == len(large_batch)

if __name__ == '__main__':
    pytest.main([__file__, '-v'])
