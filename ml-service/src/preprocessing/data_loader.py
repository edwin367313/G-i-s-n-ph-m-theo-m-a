"""
Data Loader for ML Service
"""

import pandas as pd
from typing import Dict, List, Any
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from utils.database import db

class DataLoader:
    """Load data from database for ML models"""
    
    @staticmethod
    def load_customers() -> pd.DataFrame:
        """Load customer data for segmentation"""
        data = db.get_customers_data()
        
        if not data:
            return pd.DataFrame()
        
        df = pd.DataFrame(data)
        print(f"✅ Loaded {len(df)} customers")
        return df
    
    @staticmethod
    def load_orders() -> pd.DataFrame:
        """Load orders data for revenue prediction"""
        data = db.get_orders_data()
        
        if not data:
            return pd.DataFrame()
        
        df = pd.DataFrame(data)
        df['created_at'] = pd.to_datetime(df['created_at'])
        print(f"✅ Loaded {len(df)} orders")
        return df
    
    @staticmethod
    def load_transactions() -> pd.DataFrame:
        """Load transaction data for Apriori"""
        data = db.get_transactions_data()
        
        if not data:
            return pd.DataFrame()
        
        df = pd.DataFrame(data)
        df['created_at'] = pd.to_datetime(df['created_at'])
        print(f"✅ Loaded {len(df)} transactions")
        return df
    
    @staticmethod
    def load_products() -> pd.DataFrame:
        """Load products data"""
        data = db.get_products_data()
        
        if not data:
            return pd.DataFrame()
        
        df = pd.DataFrame(data)
        print(f"✅ Loaded {len(df)} products")
        return df
    
    @staticmethod
    def load_all() -> Dict[str, pd.DataFrame]:
        """Load all data"""
        return {
            'customers': DataLoader.load_customers(),
            'orders': DataLoader.load_orders(),
            'transactions': DataLoader.load_transactions(),
            'products': DataLoader.load_products()
        }

# Singleton instance
data_loader = DataLoader()
