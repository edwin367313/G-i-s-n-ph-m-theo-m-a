import React, { useState, useEffect } from 'react';
import { Card, Tag, Spin, Alert } from 'antd';
import { FireOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { getCurrentSeasonInfo, getCurrentSeasonProducts } from '../../services/recommendationService';
import './SeasonalBanner.css';

const SeasonalBanner = ({ limit = 8, showTitle = true }) => {
  const [loading, setLoading] = useState(true);
  const [seasonInfo, setSeasonInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSeasonalData();
  }, []);

  const fetchSeasonalData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lấy thông tin mùa và sản phẩm song song
      const [seasonResponse, productsResponse] = await Promise.all([
        getCurrentSeasonInfo(),
        getCurrentSeasonProducts(limit)
      ]);

      if (seasonResponse.success) {
        setSeasonInfo(seasonResponse.data);
      }

      if (productsResponse.success) {
        setProducts(productsResponse.data.products || []);
      }
    } catch (err) {
      console.error('Error fetching seasonal data:', err);
      setError('Không thể tải sản phẩm theo mùa');
    } finally {
      setLoading(false);
    }
  };

  const getSeasonEmoji = (season) => {
    const emojis = {
      'Xuân': '🌸',
      'Hạ': '☀️',
      'Thu': '🍂',
      'Đông': '❄️'
    };
    return emojis[season] || '🌟';
  };

  const getSeasonColor = (season) => {
    const colors = {
      'Xuân': '#52c41a',
      'Hạ': '#faad14',
      'Thu': '#fa8c16',
      'Đông': '#1890ff'
    };
    return colors[season] || '#1890ff';
  };

  if (loading) {
    return (
      <div className="seasonal-banner-loading">
        <Spin size="large" tip="Đang tải sản phẩm theo mùa..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        closable
      />
    );
  }

  if (!seasonInfo || products.length === 0) {
    return null;
  }

  const { currentSeason, info } = seasonInfo;

  return (
    <div className="seasonal-banner">
      {showTitle && (
        <div className="seasonal-banner-header">
          <h2 className="seasonal-banner-title">
            <span className="season-emoji">{getSeasonEmoji(currentSeason)}</span>
            Sản phẩm hot mùa {currentSeason}
            <Tag color={getSeasonColor(currentSeason)} style={{ marginLeft: 12 }}>
              Tháng {info.months}
            </Tag>
          </h2>
          <p className="seasonal-banner-subtitle">
            <ThunderboltOutlined /> Những sản phẩm bán chạy nhất trong {info.description}
          </p>
        </div>
      )}

      <div className="seasonal-products-grid">
        {products.map((product, index) => (
          <Card
            key={index}
            className="seasonal-product-card"
            hoverable
            cover={
              <div className="product-rank-badge">
                {index < 3 && <FireOutlined style={{ color: '#ff4d4f' }} />}
                <span>#{index + 1}</span>
              </div>
            }
          >
            <Card.Meta
              title={
                <div className="product-name-truncate">
                  {product.ProductName}
                </div>
              }
              description={
                <div className="product-stats">
                  <div className="stat-item">
                    <span className="stat-label">Lượt mua:</span>
                    <span className="stat-value">{product.PurchaseCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Khách hàng:</span>
                    <span className="stat-value">{product.CustomerCount}</span>
                  </div>
                  <div className="popularity-score">
                    <span className="score-label">Độ phổ biến:</span>
                    <span className="score-value">{product.PopularityScore.toFixed(1)}</span>
                  </div>
                </div>
              }
            />
          </Card>
        ))}
      </div>

      <div className="seasonal-banner-footer">
        <Tag color={getSeasonColor(currentSeason)}>
          Cập nhật: {new Date(products[0]?.LastUpdated).toLocaleDateString('vi-VN')}
        </Tag>
      </div>
    </div>
  );
};

export default SeasonalBanner;
