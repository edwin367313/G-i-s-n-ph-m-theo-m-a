import React, { useState, useEffect } from 'react';
import { Table, Button, InputNumber, Popconfirm, Card, Row, Col, Typography, Space, Tag, Spin, Alert } from 'antd';
import { DeleteOutlined, ShoppingOutlined, HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import { getCartRecommendations } from '../../services/recommendationService';

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    if (cart?.items && cart.items.length > 0) {
      fetchRecommendations();
    }
  }, [cart?.items]);

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const cartItems = cart.items.map(item => ({
        productName: item.product?.name || item.name,
        quantity: item.quantity
      }));
      
      const response = await getCartRecommendations(cartItems, 6);
      if (response.success) {
        setRecommendations(response.data.recommendations || []);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const columns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_, record) => {
        // Handle both flat structure (from backend) and nested structure (from local storage)
        const productInfo = record.product || record;
        const imageUrl = productInfo.image_url || productInfo.images || '/placeholder.png';
        
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={imageUrl} 
              alt={productInfo.name} 
              style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }} 
            />
            <span>{productInfo.name}</span>
          </div>
        );
      }
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      render: (price) => formatCurrency(price)
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => updateQuantity(record.productId, value)}
        />
      )
    },
    {
      title: 'Thành tiền',
      render: (_, record) => formatCurrency(record.price * record.quantity)
    },
    {
      title: '',
      render: (_, record) => (
        <Popconfirm
          title="Xóa sản phẩm?"
          onConfirm={() => removeFromCart(record.productId)}
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>
        <ShoppingOutlined /> Giỏ hàng của bạn
      </Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <Table
              dataSource={cart?.items || []}
              columns={columns}
              rowKey="productId"
              pagination={false}
            />
            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <Space direction="vertical" size="small" style={{ width: '100%', alignItems: 'flex-end' }}>
                <Text strong style={{ fontSize: 18 }}>
                  Tổng: {formatCurrency(cart?.total || 0)}
                </Text>
                <Space>
                  <Popconfirm
                    title="Xóa tất cả sản phẩm?"
                    onConfirm={clearCart}
                  >
                    <Button danger>Xóa tất cả</Button>
                  </Popconfirm>
                  <Button 
                    type="primary" 
                    size="large" 
                    onClick={() => navigate('/checkout')}
                    disabled={!cart?.items || cart.items.length === 0}
                  >
                    Thanh toán
                  </Button>
                </Space>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* Recommendations Section */}
          <Card 
            title={
              <Space>
                <HeartOutlined style={{ color: '#ff4d4f' }} />
                <span>Bạn có thể thích</span>
              </Space>
            }
            bordered={false}
          >
            {loadingRecommendations ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin tip="Đang tải gợi ý..." />
              </div>
            ) : recommendations.length > 0 ? (
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {recommendations.map((item, index) => (
                  <Card 
                    key={index}
                    size="small" 
                    hoverable
                    bodyStyle={{ padding: '12px' }}
                  >
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text strong style={{ fontSize: 15 }}>
                        {item.ProductName}
                      </Text>
                      <Space split="|" size="small">
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Độ phù hợp: {(item.AvgConfidence * 100).toFixed(1)}%
                        </Text>
                        {item.MatchCount && (
                          <Tag color="blue" style={{ fontSize: 11 }}>
                            {item.MatchCount} khớp
                          </Tag>
                        )}
                      </Space>
                      <Button 
                        type="primary" 
                        size="small" 
                        block
                        onClick={() => {
                          // TODO: Add to cart functionality
                          console.log('Add to cart:', item.ProductName);
                        }}
                      >
                        Thêm vào giỏ
                      </Button>
                    </Space>
                  </Card>
                ))}
              </Space>
            ) : cart?.items && cart.items.length > 0 ? (
              <Alert
                message="Chưa có gợi ý"
                description="Thêm nhiều sản phẩm hơn để nhận gợi ý tốt hơn!"
                type="info"
                showIcon
              />
            ) : (
              <Alert
                message="Giỏ hàng trống"
                description="Thêm sản phẩm vào giỏ để nhận gợi ý!"
                type="warning"
                showIcon
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
