import pyodbc
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder
import json
import os
from dotenv import load_dotenv

load_dotenv()

class MarketBasketAnalyzer:
    def __init__(self):
        self.conn_str = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={os.getenv('DB_SERVER', os.getenv('DB_HOST'))};"
            f"DATABASE={os.getenv('DB_NAME')};"
            f"UID={os.getenv('DB_USER')};"
            f"PWD={os.getenv('DB_PASSWORD')}"
        )
    
    def get_transactions(self):
        """Lấy dữ liệu giao dịch từ database"""
        query = """
        SELECT 
            o.id as order_id,
            p.name as product_name
        FROM Orders o
        JOIN OrderItems oi ON o.id = oi.order_id
        JOIN Products p ON oi.product_id = p.id
        WHERE o.status IN ('DELIVERED', 'paid', 'delivery')
        ORDER BY o.id
        """
        
        with pyodbc.connect(self.conn_str) as conn:
            df = pd.read_sql(query, conn)
        
        # Chuyển đổi thành danh sách transactions
        transactions = df.groupby('order_id')['product_name'].apply(list).values.tolist()
        return transactions
    
    def run_apriori(self, min_support=0.01, min_confidence=0.3, min_lift=1.0):
        """
        Chạy thuật toán Apriori
        
        Args:
            min_support: Độ hỗ trợ tối thiểu (0.01 = 1% đơn hàng)
            min_confidence: Độ tin cậy tối thiểu (0.3 = 30%)
            min_lift: Lift tối thiểu (1.0 = không ảnh hưởng)
        """
        print(f"🔍 Đang phân tích giỏ hàng...")
        
        # Lấy dữ liệu
        transactions = self.get_transactions()
        print(f"📊 Tổng số đơn hàng: {len(transactions)}")
        
        # Chuyển đổi sang định dạng one-hot encoding
        te = TransactionEncoder()
        te_ary = te.fit(transactions).transform(transactions)
        df = pd.DataFrame(te_ary, columns=te.columns_)
        
        # Tìm itemsets phổ biến
        frequent_itemsets = apriori(df, min_support=min_support, use_colnames=True)
        print(f"✅ Tìm thấy {len(frequent_itemsets)} itemsets phổ biến")
        
        # Tạo luật kết hợp
        if len(frequent_itemsets) > 0:
            rules = association_rules(
                frequent_itemsets, 
                metric="confidence", 
                min_threshold=min_confidence
            )
            
            # Lọc theo lift
            rules = rules[rules['lift'] >= min_lift]
            
            # Sắp xếp theo lift giảm dần
            rules = rules.sort_values('lift', ascending=False)
            
            print(f"✅ Tìm thấy {len(rules)} luật kết hợp")
            
            return self._format_results(rules)
        else:
            return {
                'frequent_itemsets': [],
                'rules': [],
                'summary': {
                    'total_transactions': len(transactions),
                    'total_rules': 0
                }
            }
    
    def _format_results(self, rules):
        """Format kết quả để trả về API"""
        formatted_rules = []
        
        for _, rule in rules.iterrows():
            formatted_rules.append({
                'antecedents': list(rule['antecedents']),
                'consequents': list(rule['consequents']),
                'support': float(rule['support']),
                'confidence': float(rule['confidence']),
                'lift': float(rule['lift']),
                'description': f"{', '.join(rule['antecedents'])} → {', '.join(rule['consequents'])}"
            })
        
        return {
            'rules': formatted_rules,
            'summary': {
                'total_rules': len(formatted_rules),
                'avg_confidence': float(rules['confidence'].mean()),
                'avg_lift': float(rules['lift'].mean())
            }
        }
    
    def get_top_combos(self, limit=10):
        """Lấy top N gói hàng được mua cùng nhau nhiều nhất"""
        results = self.run_apriori(min_support=0.01, min_confidence=0.3, min_lift=1.2)
        
        if results['rules']:
            return results['rules'][:limit]
        return []

if __name__ == "__main__":
    analyzer = MarketBasketAnalyzer()
    results = analyzer.run_apriori(min_support=0.01, min_confidence=0.3)
    
    print("\n" + "="*80)
    print("📦 TOP 10 GÓI HÀNG THƯỜNG MUA CÙNG NHAU")
    print("="*80)
    
    for i, rule in enumerate(results['rules'][:10], 1):
        print(f"\n{i}. {rule['description']}")
        print(f"   - Độ hỗ trợ: {rule['support']:.2%}")
        print(f"   - Độ tin cậy: {rule['confidence']:.2%}")
        print(f"   - Lift: {rule['lift']:.2f}")
