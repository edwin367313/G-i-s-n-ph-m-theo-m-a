import React, { useState, useEffect } from 'react';
import { Card, AutoComplete, Button, Table, Tag, Space, Typography, Alert, Spin } from 'antd';
import { SearchOutlined, ThunderboltOutlined, FireOutlined } from '@ant-design/icons';
import { getProductSuggestions } from '../../services/recommendationService';
import api from '../../utils/api';
import './ProductPredictionPage.css';

const { Title, Text, Paragraph } = Typography;

const ProductPredictionPage = () => {
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Load all products for autocomplete
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products', { params: { limit: 1000 } });
      if (response.data.success) {
        const products = response.data.data.products.map(p => ({
          value: p.ProductName,
          label: p.ProductName
        }));
        setAllProducts(products);
        setProductOptions(products.slice(0, 10)); // Show first 10
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSearch = (value) => {
    if (!value) {
      setProductOptions(allProducts.slice(0, 10));
    } else {
      const filtered = allProducts
        .filter(p => p.value.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10);
      setProductOptions(filtered);
    }
  };

  const handleSearchClick = async () => {
    if (!productName || !productName.trim()) {
      return;
    }

    setLoading(true);
    setSearchPerformed(true);

    try {
      console.log('🔍 Searching for:', productName);
      const response = await getProductSuggestions(productName.trim(), null, 50);
      console.log('📦 API Response:', response);
      
      if (response.success && response.data.suggestions) {
        setPredictions(response.data.suggestions);
        console.log('✅ Set predictions:', response.data.suggestions.length);
      } else {
        setPredictions([]);
        console.log('❌ No suggestions found');
      }
    } catch (error) {
      console.error('❌ Error fetching predictions:', error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Rank',
      key: 'rank',
      width: '10%',
      render: (_, __, index) => {
        const icons = ['🥇', '🥈', '🥉'];
        return index < 3 ? icons[index] : `#${index + 1}`;
      }
    },
    {
      title: 'Sản phẩm được đề xuất',
      dataIndex: 'SuggestedProduct',
      key: 'SuggestedProduct',
      width: '40%',
      render: (product) => (
        <Space>
          <FireOutlined style={{ color: '#ff4d4f' }} />
          <Text strong>{product}</Text>
        </Space>
      )
    },
    {
      title: 'Confidence',
      dataIndex: 'Confidence',
      key: 'Confidence',
      width: '20%',
      sorter: (a, b) => a.Confidence - b.Confidence,
      defaultSortOrder: 'descend',
      render: (confidence) => (
        <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
          {(confidence * 100).toFixed(1)}%
        </Tag>
      )
    },
    {
      title: 'Lift',
      dataIndex: 'Lift',
      key: 'Lift',
      width: '15%',
      sorter: (a, b) => a.Lift - b.Lift,
      defaultSortOrder: 'descend',
      render: (lift) => (
        <Tag color={lift > 1.5 ? 'green' : lift > 1.0 ? 'orange' : 'default'}>
          {lift.toFixed(2)}x
        </Tag>
      )
    },
    {
      title: 'Mùa',
      dataIndex: 'Season',
      key: 'Season',
      width: '15%',
      render: (season) => {
        const seasonEmoji = {
          'Xuân': '🌸',
          'Hạ': '☀️',
          'Thu': '🍂',
          'Đông': '❄️'
        };
        return season ? (
          <Tag color="purple">
            {seasonEmoji[season] || ''} {season}
          </Tag>
        ) : (
          <Tag>Tất cả</Tag>
        );
      }
    }
  ];

  return (
    <div className="product-prediction-page">
      <div className="page-header">
        <Title level={2}>
          <ThunderboltOutlined /> Dự đoán sản phẩm liên quan
        </Title>
        <Paragraph type="secondary">
          Nhập tên sản phẩm để xem các sản phẩm thường được mua cùng (Apriori Association Rules)
        </Paragraph>
      </div>

      <Card className="search-card">
        <Space.Compact style={{ width: '100%' }} size="large">
          <AutoComplete
            style={{ width: '100%' }}
            options={productOptions}
            value={productName}
            onChange={setProductName}
            onSearch={handleSearch}
            placeholder="Nhập tên sản phẩm (vd: whole milk, soda, yogurt...)"
            filterOption={false}
          />
          <Button 
            type="primary" 
            icon={<SearchOutlined />} 
            loading={loading}
            onClick={handleSearchClick}
          >
            Dự đoán
          </Button>
        </Space.Compact>
      </Card>

      {loading && (
        <Card style={{ textAlign: 'center', marginTop: 24 }}>
          <Spin size="large" tip="Đang phân tích association rules..." />
        </Card>
      )}

      {!loading && searchPerformed && (
        <>
          {predictions.length > 0 ? (
            <Card 
              title={
                <Space>
                  <FireOutlined />
                  <span>Sản phẩm gợi ý khi mua: <Text mark>{productName}</Text></span>
                </Space>
              }
              className="results-card"
            >
              <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                Danh sách sản phẩm thường được mua cùng, sắp xếp theo Confidence và Lift
              </Paragraph>
              <Table
                dataSource={predictions}
                columns={columns}
                rowKey={(record, index) => `prediction-${index}`}
                pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `Tổng ${total} gợi ý` }}
              />
            </Card>
          ) : (
            <Alert
              message="Không tìm thấy dự đoán"
              description={`Không có association rules nào cho sản phẩm "${productName}". Thử sản phẩm khác hoặc kiểm tra tên sản phẩm.`}
              type="warning"
              showIcon
              style={{ marginTop: 24 }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProductPredictionPage;
