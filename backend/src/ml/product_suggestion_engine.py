import pyodbc
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
import json

def get_db_connection():
    return pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};SERVER=EDWIN;DATABASE=Order;Trusted_Connection=yes;'
    )

def get_season_from_date(date):
    """Xác định mùa từ ngày"""
    month = date.month
    if 1 <= month <= 3:
        return 'Xuân'
    elif 4 <= month <= 6:
        return 'Hạ'
    elif 7 <= month <= 9:
        return 'Thu'
    else:
        return 'Đông'

def run_apriori_analysis(min_support=0.01, min_confidence=0.3, season=None):
    """Chạy Apriori để tìm product associations"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Lấy transactions
    if season:
        # Filter theo mùa
        cursor.execute("SELECT TransactionID, TransactionDate, Items FROM Transactions")
        all_trans = cursor.fetchall()
        transactions_data = []
        for row in all_trans:
            if get_season_from_date(row.TransactionDate) == season:
                transactions_data.append({
                    'TransactionID': row.TransactionID,
                    'Items': row.Items.split(', ')
                })
    else:
        # Lấy tất cả
        cursor.execute("SELECT TransactionID, Items FROM Transactions")
        all_trans = cursor.fetchall()
        transactions_data = []
        for row in all_trans:
            transactions_data.append({
                'TransactionID': row.TransactionID,
                'Items': row.Items.split(', ')
            })
    
    if len(transactions_data) < 10:
        conn.close()
        return {
            'status': 'error',
            'message': f'Không đủ dữ liệu cho mùa {season}' if season else 'Không đủ dữ liệu'
        }
    
    # Tạo one-hot encoding
    all_items = set()
    for trans in transactions_data:
        all_items.update([item.strip() for item in trans['Items']])
    
    all_items = sorted(list(all_items))
    
    # Tạo DataFrame one-hot
    rows = []
    for trans in transactions_data:
        row = {}
        items_set = set([item.strip() for item in trans['Items']])
        for item in all_items:
            row[item] = item in items_set
        rows.append(row)
    
    df_encoded = pd.DataFrame(rows)
    
    # Chạy Apriori
    try:
        frequent_itemsets = apriori(df_encoded, min_support=min_support, use_colnames=True)
        
        if len(frequent_itemsets) == 0:
            conn.close()
            return {
                'status': 'error',
                'message': 'Không tìm thấy frequent itemsets'
            }
        
        rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=min_confidence)
        
        if len(rules) == 0:
            conn.close()
            return {
                'status': 'error',
                'message': 'Không tìm thấy association rules'
            }
        
        # Xóa dữ liệu cũ của mùa này
        if season:
            cursor.execute("DELETE FROM ProductAssociations WHERE Season = ?", season)
        else:
            cursor.execute("DELETE FROM ProductAssociations WHERE Season IS NULL")
        
        # Lưu rules vào database
        count = 0
        for idx, rule in rules.iterrows():
            # Chỉ lấy rules có 1 antecedent và 1 consequent
            antecedents = list(rule['antecedents'])
            consequents = list(rule['consequents'])
            
            if len(antecedents) == 1 and len(consequents) == 1:
                cursor.execute("""
                    INSERT INTO ProductAssociations 
                    (ProductA, ProductB, Support, Confidence, Lift, Season)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, antecedents[0], consequents[0], 
                    float(rule['support']), float(rule['confidence']), 
                    float(rule['lift']), season)
                count += 1
        
        conn.commit()
        conn.close()
        
        return {
            'status': 'success',
            'message': f'Đã tạo {count} association rules' + (f' cho mùa {season}' if season else ''),
            'rules_count': count
        }
        
    except Exception as e:
        conn.close()
        return {
            'status': 'error',
            'message': str(e)
        }

def get_product_suggestions(product_name, season=None, top_n=5):
    """Lấy gợi ý sản phẩm dựa trên product đã chọn"""
    conn = get_db_connection()
    
    if season:
        query = f"""
            SELECT TOP {top_n} ProductB, Confidence, Lift
            FROM ProductAssociations
            WHERE ProductA = ? AND Season = ?
            ORDER BY Confidence DESC, Lift DESC
        """
        df = pd.read_sql(query, conn, params=(product_name, season))
    else:
        query = f"""
            SELECT TOP {top_n} ProductB, Confidence, Lift
            FROM ProductAssociations
            WHERE ProductA = ? AND Season IS NULL
            ORDER BY Confidence DESC, Lift DESC
        """
        df = pd.read_sql(query, conn, params=(product_name,))
    
    conn.close()
    return df.to_dict('records')

def get_cheaper_alternatives(product_name, season=None):
    """Tìm sản phẩm thay thế (sản phẩm hay được mua cùng)"""
    return get_product_suggestions(product_name, season, top_n=3)

if __name__ == '__main__':
    # Test
    print("🔍 Bắt đầu phân tích Apriori...")
    
    # Chạy cho tất cả mùa
    for season in ['Xuân', 'Hạ', 'Thu', 'Đông']:
        print(f"\n{season}:")
        result = run_apriori_analysis(min_support=0.01, min_confidence=0.2, season=season)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    
    # Test gợi ý
    print("\n💡 Gợi ý cho 'whole milk' mùa Xuân:")
    suggestions = get_product_suggestions('whole milk', 'Xuân')
    for s in suggestions:
        print(f"  - {s['ProductB']}: {s['Confidence']:.2%} confidence, {s['Lift']:.2f} lift")
