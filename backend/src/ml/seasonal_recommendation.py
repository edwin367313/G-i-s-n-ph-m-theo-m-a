import pyodbc
import pandas as pd
from datetime import datetime
import json

def get_db_connection():
    return pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};SERVER=EDWIN;DATABASE=Order;Trusted_Connection=yes;'
    )

def get_season_from_date(date):
    """Xác định mùa từ ngày (theo Việt Nam)"""
    month = date.month
    if 1 <= month <= 3:
        return 'Xuân'
    elif 4 <= month <= 6:
        return 'Hạ'
    elif 7 <= month <= 9:
        return 'Thu'
    else:
        return 'Đông'

def analyze_seasonal_products():
    """Phân tích sản phẩm hot theo mùa (Xuân, Hạ, Thu, Đông)"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Lấy tất cả transactions
    cursor.execute("SELECT MemberNumber, TransactionDate, Items FROM Transactions")
    transactions = cursor.fetchall()
    
    # Tạo danh sách sản phẩm theo mùa
    seasonal_data = []
    
    for row in transactions:
        member_num = row.MemberNumber
        trans_date = row.TransactionDate
        items = row.Items.split(', ')
        
        season = get_season_from_date(trans_date)
        
        for item in items:
            item = item.strip()
            seasonal_data.append({
                'Season': season,
                'ProductName': item,
                'MemberNumber': member_num
            })
    
    # Chuyển thành DataFrame
    df = pd.DataFrame(seasonal_data)
    
    # Tính toán metrics
    results = []
    for season in ['Xuân', 'Hạ', 'Thu', 'Đông']:
        season_df = df[df['Season'] == season]
        
        # Đếm số lần mua và số khách hàng unique
        product_stats = season_df.groupby('ProductName').agg({
            'MemberNumber': ['count', 'nunique']
        }).reset_index()
        
        product_stats.columns = ['ProductName', 'PurchaseCount', 'CustomerCount']
        
        # Tính PopularityScore = PurchaseCount * 0.7 + CustomerCount * 0.3
        product_stats['PopularityScore'] = (
            product_stats['PurchaseCount'] * 0.7 + 
            product_stats['CustomerCount'] * 0.3
        )
        
        # Sắp xếp theo PopularityScore
        product_stats = product_stats.sort_values('PopularityScore', ascending=False)
        product_stats['Season'] = season
        
        results.append(product_stats)
    
    # Gộp tất cả mùa
    final_df = pd.concat(results, ignore_index=True)
    
    # Xóa dữ liệu cũ và insert mới
    cursor.execute("TRUNCATE TABLE SeasonalProducts")
    
    # Insert vào database
    for idx, row in final_df.iterrows():
        cursor.execute("""
            INSERT INTO SeasonalProducts 
            (Season, ProductName, PurchaseCount, CustomerCount, PopularityScore)
            VALUES (?, ?, ?, ?, ?)
        """, row['Season'], row['ProductName'], int(row['PurchaseCount']), 
            int(row['CustomerCount']), float(row['PopularityScore']))
    
    conn.commit()
    conn.close()
    
    return {
        'status': 'success',
        'message': f'Đã phân tích {len(final_df)} sản phẩm theo mùa',
        'seasons': {season: len(final_df[final_df['Season'] == season]) 
                   for season in ['Xuân', 'Hạ', 'Thu', 'Đông']}
    }

def get_seasonal_products(season, top_n=20):
    """Lấy top N sản phẩm hot của một mùa"""
    conn = get_db_connection()
    
    query = f"""
        SELECT TOP {top_n} ProductName, PurchaseCount, CustomerCount, PopularityScore
        FROM SeasonalProducts
        WHERE Season = ?
        ORDER BY PopularityScore DESC
    """
    
    df = pd.read_sql(query, conn, params=(season,))
    conn.close()
    
    return df.to_dict('records')

def get_quarterly_report():
    """Báo cáo tổng hợp theo 4 mùa"""
    conn = get_db_connection()
    
    result = {}
    for season in ['Xuân', 'Hạ', 'Thu', 'Đông']:
        query = """
            SELECT TOP 10 ProductName, PurchaseCount, CustomerCount, PopularityScore
            FROM SeasonalProducts
            WHERE Season = ?
            ORDER BY PopularityScore DESC
        """
        
        df = pd.read_sql(query, conn, params=(season,))
        result[season] = df.to_dict('records')
    
    conn.close()
    return result

if __name__ == '__main__':
    # Test
    print("🌺 Bắt đầu phân tích sản phẩm theo mùa...")
    result = analyze_seasonal_products()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    
    print("\n🌸 Top 5 sản phẩm mùa Xuân:")
    spring_products = get_seasonal_products('Xuân', 5)
    for p in spring_products:
        print(f"  - {p['ProductName']}: {p['PurchaseCount']} lần mua, {p['CustomerCount']} khách")
