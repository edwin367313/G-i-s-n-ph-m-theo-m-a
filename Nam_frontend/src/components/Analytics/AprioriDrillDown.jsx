import React, { useState } from 'react';
import {
  Modal,
  Table,
  Tabs,
  Badge,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Spin,
  message,
  Empty
} from 'antd';
import { ShoppingCartOutlined, LinkOutlined, FireOutlined } from '@ant-design/icons';
import api from '../../utils/api';

const { TabPane } = Tabs;

const AprioriDrillDown = ({ visible, product, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [associations, setAssociations] = useState(null);

  React.useEffect(() => {
    if (visible && product) {
      fetchAssociations();
    }
  }, [visible, product]);

  const fetchAssociations = async () => {
    try {
      setLoading(true);
      const url = `/ml/product-associations/${product.id}`;
      
      console.log('Fetching Apriori associations for product:', product.id);
      
      const response = await api.get(url);
      console.log('Apriori response:', response);
      setAssociations(response.data);
    } catch (error) {
      message.error('Không thể tải dữ liệu liên kết sản phẩm');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricColor = (value, type) => {
    if (type === 'support') {
      if (value >= 0.1) return 'success';
      if (value >= 0.05) return 'warning';
      return 'default';
    } else if (type === 'confidence') {
      if (value >= 0.7) return 'success';
      if (value >= 0.5) return 'warning';
      return 'default';
    } else if (type === 'lift') {
      if (value >= 2) return 'success';
      if (value >= 1.5) return 'warning';
      return 'default';
    }
  };

  const MetricCard = ({ title, value, description, type }) => (
    <Card size="small" style={{ textAlign: 'center' }}>
      <Statistic
        title={title}
        value={value?.toFixed(4) || 0}
        valueStyle={{
          color: 
            type === 'lift' && value >= 2 ? '#3f8600' :
            type === 'confidence' && value >= 0.7 ? '#3f8600' :
            type === 'support' && value >= 0.1 ? '#3f8600' : '#666'
        }}
        suffix={description}
      />
    </Card>
  );

  const renderItemsetTable = (itemsets, size) => {
    if (!itemsets || itemsets.length === 0) {
      return <Empty description={`Không có nhóm ${size} sản phẩm liên quan`} />;
    }

    const columns = [
      {
        title: 'Nhóm sản phẩm',
        dataIndex: 'products',
        key: 'products',
        render: (products) => (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {products.map((p, idx) => (
              <Tag 
                key={idx} 
                color={p === associations?.productName ? 'blue' : 'default'}
                icon={p === associations?.productName ? <FireOutlined /> : <ShoppingCartOutlined />}
              >
                {p}
              </Tag>
            ))}
          </div>
        ),
      },
      {
        title: 'Support',
        dataIndex: 'support',
        key: 'support',
        width: 120,
        sorter: (a, b) => a.support - b.support,
        render: (val) => (
          <Tag color={getMetricColor(val, 'support')}>
            {(val * 100).toFixed(2)}%
          </Tag>
        ),
      },
      {
        title: 'Confidence',
        dataIndex: 'confidence',
        key: 'confidence',
        width: 120,
        sorter: (a, b) => a.confidence - b.confidence,
        render: (val) => (
          <Tag color={getMetricColor(val, 'confidence')}>
            {(val * 100).toFixed(2)}%
          </Tag>
        ),
      },
      {
        title: 'Lift',
        dataIndex: 'lift',
        key: 'lift',
        width: 100,
        sorter: (a, b) => a.lift - b.lift,
        render: (val) => (
          <Tag color={getMetricColor(val, 'lift')}>
            {val.toFixed(2)}x
          </Tag>
        ),
      },
    ];

    return (
      <Table
        dataSource={itemsets.map((item, idx) => ({ ...item, key: idx }))}
        columns={columns}
        pagination={{ pageSize: 10 }}
        size="small"
      />
    );
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LinkOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Phân tích Apriori - Sản phẩm liên kết
            </div>
            <div style={{ fontSize: '14px', fontWeight: 'normal', color: '#666' }}>
              {associations?.productName}
            </div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={null}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {associations && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '16px' }}>Chỉ số Apriori</h4>
              <Row gutter={16}>
                <Col span={8}>
                  <MetricCard
                    title="Support"
                    value={0}
                    description="Tần suất xuất hiện"
                    type="support"
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
                    % đơn hàng có sản phẩm này
                  </div>
                </Col>
                <Col span={8}>
                  <MetricCard
                    title="Confidence"
                    value={0}
                    description="Độ tin cậy"
                    type="confidence"
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
                    P(B|A) - Xác suất mua B khi đã mua A
                  </div>
                </Col>
                <Col span={8}>
                  <MetricCard
                    title="Lift"
                    value={0}
                    description="Mức độ liên kết"
                    type="lift"
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
                    Lift &gt; 1: Sản phẩm có liên kết tích cực
                  </div>
                </Col>
              </Row>
            </div>

            <Tabs defaultActiveKey="2">
              <TabPane
                tab={
                  <span>
                    <ShoppingCartOutlined />
                    Nhóm 2 sản phẩm ({associations.itemsets_2?.length || 0})
                  </span>
                }
                key="2"
              >
                {renderItemsetTable(associations.itemsets_2, 2)}
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <ShoppingCartOutlined />
                    Nhóm 3 sản phẩm ({associations.itemsets_3?.length || 0})
                  </span>
                }
                key="3"
              >
                {renderItemsetTable(associations.itemsets_3, 3)}
              </TabPane>
            </Tabs>
          </>
        )}
      </Spin>
    </Modal>
  );
};

export default AprioriDrillDown;
