"""
Data Cleaner for ML Service
"""

import pandas as pd
import numpy as np
from typing import List, Any

class DataCleaner:
    """Clean and preprocess data"""
    
    @staticmethod
    def remove_nulls(df: pd.DataFrame, columns: List[str] = None) -> pd.DataFrame:
        """Remove rows with null values"""
        if columns:
            df = df.dropna(subset=columns)
        else:
            df = df.dropna()
        
        print(f"✅ Cleaned data: {len(df)} rows remaining")
        return df
    
    @staticmethod
    def fill_nulls(df: pd.DataFrame, strategy: str = 'mean', columns: List[str] = None) -> pd.DataFrame:
        """Fill null values with strategy (mean, median, mode, zero)"""
        if columns is None:
            columns = df.select_dtypes(include=[np.number]).columns.tolist()
        
        for col in columns:
            if col not in df.columns:
                continue
            
            if strategy == 'mean':
                df[col].fillna(df[col].mean(), inplace=True)
            elif strategy == 'median':
                df[col].fillna(df[col].median(), inplace=True)
            elif strategy == 'mode':
                df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else 0, inplace=True)
            elif strategy == 'zero':
                df[col].fillna(0, inplace=True)
        
        print(f"✅ Filled nulls using {strategy} strategy")
        return df
    
    @staticmethod
    def remove_outliers(df: pd.DataFrame, columns: List[str], method: str = 'iqr') -> pd.DataFrame:
        """Remove outliers using IQR or Z-score method"""
        original_len = len(df)
        
        for col in columns:
            if col not in df.columns:
                continue
            
            if method == 'iqr':
                Q1 = df[col].quantile(0.25)
                Q3 = df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                df = df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]
            
            elif method == 'zscore':
                mean = df[col].mean()
                std = df[col].std()
                df = df[np.abs((df[col] - mean) / std) <= 3]
        
        print(f"✅ Removed {original_len - len(df)} outliers using {method}")
        return df
    
    @staticmethod
    def normalize_columns(df: pd.DataFrame, columns: List[str]) -> pd.DataFrame:
        """Normalize columns to [0, 1] range"""
        for col in columns:
            if col in df.columns:
                min_val = df[col].min()
                max_val = df[col].max()
                
                if max_val != min_val:
                    df[col] = (df[col] - min_val) / (max_val - min_val)
        
        print(f"✅ Normalized {len(columns)} columns")
        return df
    
    @staticmethod
    def standardize_columns(df: pd.DataFrame, columns: List[str]) -> pd.DataFrame:
        """Standardize columns using z-score"""
        for col in columns:
            if col in df.columns:
                mean = df[col].mean()
                std = df[col].std()
                
                if std != 0:
                    df[col] = (df[col] - mean) / std
        
        print(f"✅ Standardized {len(columns)} columns")
        return df
    
    @staticmethod
    def remove_duplicates(df: pd.DataFrame, subset: List[str] = None) -> pd.DataFrame:
        """Remove duplicate rows"""
        original_len = len(df)
        df = df.drop_duplicates(subset=subset)
        
        print(f"✅ Removed {original_len - len(df)} duplicates")
        return df
    
    @staticmethod
    def convert_to_numeric(df: pd.DataFrame, columns: List[str]) -> pd.DataFrame:
        """Convert columns to numeric, coercing errors"""
        for col in columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        print(f"✅ Converted {len(columns)} columns to numeric")
        return df
    
    @staticmethod
    def clean_customer_data(df: pd.DataFrame) -> pd.DataFrame:
        """Clean customer data specifically"""
        # Remove nulls
        df = DataCleaner.remove_nulls(df, columns=['user_id', 'total_orders', 'total_spent'])
        
        # Remove negative values
        df = df[df['total_orders'] > 0]
        df = df[df['total_spent'] > 0]
        
        # Remove outliers
        df = DataCleaner.remove_outliers(df, columns=['total_spent'], method='iqr')
        
        return df
    
    @staticmethod
    def clean_order_data(df: pd.DataFrame) -> pd.DataFrame:
        """Clean order data specifically"""
        # Remove nulls
        df = DataCleaner.remove_nulls(df, columns=['id', 'total', 'created_at'])
        
        # Remove negative values
        df = df[df['total'] > 0]
        
        # Remove outliers
        df = DataCleaner.remove_outliers(df, columns=['total'], method='iqr')
        
        return df

# Singleton instance
data_cleaner = DataCleaner()
