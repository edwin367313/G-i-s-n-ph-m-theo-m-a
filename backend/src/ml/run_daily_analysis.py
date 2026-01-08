"""
Batch job chạy mỗi ngày để update recommendations
Có thể schedule với Windows Task Scheduler hoặc cron
"""
import seasonal_recommendation
import product_suggestion_engine
import json
from datetime import datetime

def run_daily_analysis():
    print(f"🚀 Bắt đầu phân tích hàng ngày: {datetime.now()}")
    print("=" * 60)
    
    # 1. Phân tích sản phẩm theo mùa
    print("\n📊 Phân tích sản phẩm theo mùa...")
    result1 = seasonal_recommendation.analyze_seasonal_products()
    print(json.dumps(result1, ensure_ascii=False, indent=2))
    
    # 2. Chạy Apriori cho toàn bộ dữ liệu
    print("\n🔗 Phân tích associations (toàn bộ)...")
    result2 = product_suggestion_engine.run_apriori_analysis(min_support=0.005, min_confidence=0.1)
    print(json.dumps(result2, ensure_ascii=False, indent=2))
    
    # 3. Chạy Apriori cho từng mùa
    for season in ['Xuân', 'Hạ', 'Thu', 'Đông']:
        print(f"\n🌿 Phân tích associations mùa {season}...")
        result = product_suggestion_engine.run_apriori_analysis(
            min_support=0.005, 
            min_confidence=0.1, 
            season=season
        )
        print(json.dumps(result, ensure_ascii=False, indent=2))
    
    print("\n" + "=" * 60)
    print("✅ Hoàn thành phân tích hàng ngày!")
    print(f"⏰ Thời gian: {datetime.now()}")

if __name__ == '__main__':
    run_daily_analysis()