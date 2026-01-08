import pyodbc
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder
import json
import os
import sys
from dotenv import load_dotenv

try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')  # type: ignore
except:
    pass

load_dotenv()

class MarketBasketAnalyzer:
    def __init__(self):
        self.conn_str = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={os.getenv('DB_SERVER', os.getenv('DB_HOST'))};"
            f"DATABASE={os.getenv('DB_DATABASE', os.getenv('DB_NAME'))};"
            f"UID={os.getenv('DB_USER')};"
            f"PWD={os.getenv('DB_PASSWORD')}"
        )
    
    def get_transactions(self, month=None, year=None):
        """Lấy dữ liệu giao dịch từ database"""
        query = """
        SELECT 
            o.id as order_id,
            p.name as product_name
        FROM Orders o
        JOIN OrderItems oi ON o.id = oi.order_id
        JOIN Products p ON oi.product_id = p.id
        WHERE o.status IN (N'Đã giao', N'Đá giao', 'DELIVERED')
        """
        
        # Thêm filter theo tháng 
        if month and year:
            query += f" AND MONTH(o.created_at) = {month} AND YEAR(o.created_at) = {year}"
            print(f"[Apriori] Filtering by month={month}, year={year}", file=sys.stderr)
        else:
            print(f"[Apriori] No date filter - using all orders", file=sys.stderr)
        
        query += " ORDER BY o.id"
        
        with pyodbc.connect(self.conn_str) as conn:
            df = pd.read_sql(query, conn)
        
        print(f"[Apriori] Found {len(df)} order items", file=sys.stderr)
        
        # Chuyển đổi thành danh sách transactions
        transactions = df.groupby('order_id')['product_name'].apply(list).values.tolist()
        print(f"[Apriori] {len(transactions)} transactions", file=sys.stderr)
        return transactions
    
    def run_apriori(self, min_support=0.01, min_confidence=0.3, min_lift=1.0):
        
        # Lấy dữ liệu
        transactions = self.get_transactions()
        
        # Chuyển đổi sang định dạng one-hot encoding
        te = TransactionEncoder()
        te_ary = te.fit(transactions).transform(transactions)
        df = pd.DataFrame(te_ary, columns=te.columns_)  # type: ignore
        
        # Tìm itemsets phổ biến
        frequent_itemsets = apriori(df, min_support=min_support, use_colnames=True)  # type: ignore
        print(f"Tim thay {len(frequent_itemsets)} itemsets pho bien")
        
        # Tạo luật kết hợp
        if len(frequent_itemsets) > 0:
            rules = association_rules(  # type: ignore
                frequent_itemsets, 
                metric="confidence", 
                min_threshold=min_confidence
            )
            
            # Lọc theo lift
            rules = rules[rules['lift'] >= min_lift]
            
            # Sắp xếp theo lift giảm dần
            rules = rules.sort_values('lift', ascending=False)
            
            print(f"Tim thay {len(rules)} luat ket hop")
            
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
        """trả về API"""
        formatted_rules = []
        
        for _, rule in rules.iterrows():  # type: ignore
            formatted_rules.append({
                'antecedents': list(rule['antecedents']),  # type: ignore
                'consequents': list(rule['consequents']),  # type: ignore
                'support': float(rule['support']),
                'confidence': float(rule['confidence']),
                'lift': float(rule['lift']),
                'description': f"{', '.join(rule['antecedents'])} → {', '.join(rule['consequents'])}"  # type: ignore
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
        
        results = self.run_apriori(min_support=0.01, min_confidence=0.3, min_lift=1.2)
        
        if results['rules']:
            return results['rules'][:limit]
        return []
    
    def get_product_associations(self, product_name, min_support=0.01, min_confidence=0.3, month=None, year=None):
        # Chạy Apriori để lấy tất cả rules
        transactions = self.get_transactions(month, year)
        
        if not transactions:
            return {'itemsets_2': [], 'itemsets_3': []}
        
        te = TransactionEncoder()
        te_ary = te.fit(transactions).transform(transactions)
        # Convert sparse matrix to dense array for pandas
        if hasattr(te_ary, 'toarray'):
            te_ary = te_ary.toarray()  # type: ignore
        df = pd.DataFrame(te_ary, columns=te.columns_)  # type: ignore
        
        # Tìm frequent itemsets
        frequent_itemsets = apriori(df, min_support=min_support, use_colnames=True)
        
        if len(frequent_itemsets) == 0:
            return {'itemsets_2': [], 'itemsets_3': []}
        
        # Tạo association rules
        rules = association_rules(
            frequent_itemsets,
            metric="confidence",
            min_threshold=min_confidence
        )
        
        itemsets_2_dict = {}
        itemsets_3_dict = {}
        
        # Lọc rules có chứa product_name
        for _, rule in rules.iterrows():
            antecedents = list(rule['antecedents'])
            consequents = list(rule['consequents'])
            all_products = antecedents + consequents
            
            # Chỉ lấy rules có chứa product_name
            if product_name in all_products:
                products_key = frozenset(all_products)
                
                rule_data = {
                    'products': sorted(all_products),  # Sort để consistent
                    'support': float(rule['support']),
                    'confidence': float(rule['confidence']),
                    'lift': float(rule['lift'])
                }
                
                if len(all_products) == 2:
                    if products_key not in itemsets_2_dict or rule_data['lift'] > itemsets_2_dict[products_key]['lift']:
                        itemsets_2_dict[products_key] = rule_data
                        
                elif len(all_products) == 3:
                    if products_key not in itemsets_3_dict or rule_data['lift'] > itemsets_3_dict[products_key]['lift']:
                        itemsets_3_dict[products_key] = rule_data
        
        itemsets_2_sorted = sorted(itemsets_2_dict.values(), key=lambda x: x['lift'], reverse=True)
        itemsets_3_sorted = sorted(itemsets_3_dict.values(), key=lambda x: x['lift'], reverse=True)
        
        return {
            'itemsets_2': itemsets_2_sorted[:800],  
            'itemsets_3': itemsets_3_sorted[:200]   
        }

if __name__ == "__main__":
    import sys
    
    analyzer = MarketBasketAnalyzer()
    
    if len(sys.argv) >= 4:
        product_name = sys.argv[1]
        min_support = float(sys.argv[2])
        min_confidence = float(sys.argv[3])
        
        month = int(sys.argv[4]) if len(sys.argv) >= 5 else None
        year = int(sys.argv[5]) if len(sys.argv) >= 6 else None
        
        results = analyzer.get_product_associations(product_name, min_support, min_confidence, month, year)
        print(json.dumps(results, ensure_ascii=False))
    else:
        # Chạy full apriori
        results = analyzer.run_apriori(min_support=0.01, min_confidence=0.3)
        print(json.dumps(results, ensure_ascii=False))
