import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Modal,
  Collapse,
  Row,
  Col,
  Statistic,
  Tag,
  Spin,
  message,
  Empty,
  Typography,
  Space,
  DatePicker
} from 'antd';
import {
  UserOutlined,
  CrownOutlined,
  TeamOutlined,
  ShoppingOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../../utils/api';

const { Panel } = Collapse;
const { Title, Text } = Typography;

const SEGMENT_COLORS = {
  'VIP': '#ff4d4f',
  'Thường xuyên': '#1890ff',
  'Vãng lai': '#52c41a'
};

const SEGMENT_ICONS = {
  'VIP': <CrownOutlined />,
  'Thường xuyên': <TeamOutlined />,
  'Vãng lai': <UserOutlined />
};

const CustomerSegmentation = ({ dateFilter, onDateChange }) => {
  const [loading, setLoading] = useState(false);
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchSegments();
  }, [dateFilter]);

  const fetchSegments = async () => {
    try {
      setLoading(true);
      let url = '/ml/customer-segments';
      
      // Thêm date filter nếu có
      if (dateFilter) {
        const month = dateFilter.month() + 1;
        const year = dateFilter.year();
        url += `?month=${month}&year=${year}`;
        console.log('Fetching segments with date filter:', { month, year, url });
      } else {
        console.log('Fetching segments without date filter');
      }
      
      const response = await api.get(url);
      console.log('Segments response:', response);
      // API trả về { success: true, data: [...] }
      // api.js interceptor đã unwrap response.data
      setSegments(response.data || []);
    } catch (error) {
      message.error('Không thể tải dữ liệu phân khúc khách hàng');
      console.error('Segments error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSegmentCustomers = async (segmentName) => {
    try {
      setLoading(true);
      let url = `/ml/segment/${encodeURIComponent(segmentName)}/customers`;
      
      // Thêm date filter nếu có
      if (dateFilter) {
        const month = dateFilter.month() + 1;
        const year = dateFilter.year();
        url += `?month=${month}&year=${year}`;
      }
      
      const response = await api.get(url);
      setCustomers(response.data || []);
      setSelectedSegment(segmentName);
      setModalVisible(true);
    } catch (error) {
      message.error('Không thể tải danh sách khách hàng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchaseHistory = async (customerId) => {
    try {
      setHistoryLoading(true);
      const response = await api.get(`/ml/customer/${customerId}/purchase-history`);
      setPurchaseHistory(response.data);
    } catch (error) {
      message.error('Không thể tải lịch sử mua hàng');
      console.error(error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handlePieClick = (entry) => {
    fetchSegmentCustomers(entry.segment);
  };

  const handleCustomerExpand = (expanded, record) => {
    if (expanded) {
      setExpandedCustomer(record.user_id);
      fetchPurchaseHistory(record.user_id);
    } else {
      setExpandedCustomer(null);
      setPurchaseHistory(null);
    }
  };

  const customerColumns = [
    {
      title: 'Khách hàng',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
        </div>
      ),
    },
    {
      title: 'Recency (ngày)',
      dataIndex: 'recency',
      key: 'recency',
      width: 140,
      sorter: (a, b) => a.recency - b.recency,
      render: (val) => (
        <Tag color={val <= 30 ? 'green' : val <= 90 ? 'orange' : 'red'}>
          {val} ngày
        </Tag>
      ),
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 120,
      sorter: (a, b) => a.frequency - b.frequency,
      render: (val) => (
        <Tag color={val >= 5 ? 'green' : val >= 2 ? 'orange' : 'default'}>
          {val} đơn
        </Tag>
      ),
    },
    {
      title: 'Monetary',
      dataIndex: 'monetary',
      key: 'monetary',
      width: 150,
      sorter: (a, b) => a.monetary - b.monetary,
      render: (val) => (
        <Text strong style={{ color: '#1890ff' }}>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(val)}
        </Text>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    if (expandedCustomer !== record.user_id) return null;

    if (historyLoading) {
      return <Spin />;
    }

    if (!purchaseHistory) {
      return <Empty description="Không có dữ liệu" />;
    }

    return (
      <div style={{ padding: '16px', background: '#fafafa' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={5}>
              <ShoppingOutlined /> Lịch sử mua hàng - {purchaseHistory.customer.full_name}
            </Title>
          </Col>
          
          <Col span={24}>
            <Card size="small" title="Phân bổ theo danh mục">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={purchaseHistory.categories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category_name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'total_quantity') return [value, 'Số lượng'];
                      if (name === 'total_amount') return [
                        new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(value),
                        'Tổng tiền'
                      ];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="total_quantity" fill="#1890ff" name="Số lượng" />
                  <Bar dataKey="total_amount" fill="#52c41a" name="Tổng tiền" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col span={24}>
            <Card size="small" title="Top 10 sản phẩm yêu thích">
              <Table
                dataSource={purchaseHistory.top_products}
                columns={[
                  {
                    title: 'Sản phẩm',
                    dataIndex: 'product_name',
                    key: 'product_name',
                  },
                  {
                    title: 'Danh mục',
                    dataIndex: 'category_name',
                    key: 'category_name',
                    render: (text) => <Tag>{text}</Tag>
                  },
                  {
                    title: 'Số lần mua',
                    dataIndex: 'order_count',
                    key: 'order_count',
                    width: 120,
                    sorter: (a, b) => a.order_count - b.order_count,
                    render: (val) => <Tag color="blue">{val} lần</Tag>
                  },
                  {
                    title: 'Số lượng',
                    dataIndex: 'total_quantity',
                    key: 'total_quantity',
                    width: 100,
                    sorter: (a, b) => a.total_quantity - b.total_quantity,
                  },
                  {
                    title: 'Tổng tiền',
                    dataIndex: 'total_amount',
                    key: 'total_amount',
                    width: 150,
                    sorter: (a, b) => a.total_amount - b.total_amount,
                    render: (val) => (
                      <Text strong>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(val)}
                      </Text>
                    )
                  }
                ]}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const pieChartData = segments.map(seg => ({
    name: seg.segment,
    value: seg.customer_count,
    ...seg
  }));

  return (
    <Spin spinning={loading}>
      <Card
        title={
          <Space>
            <BarChartOutlined style={{ fontSize: '24px' }} />
            <span>Phân khúc khách hàng (RFM)</span>
          </Space>
        }
        extra={
          <DatePicker
            picker="month"
            placeholder="Lọc theo tháng"
            format="MM/YYYY"
            value={dateFilter}
            onChange={onDateChange}
            allowClear
            style={{ width: 150 }}
          />
        }
      >
        {segments.length === 0 && !loading ? (
          <Empty description="Không có dữ liệu phân khúc khách hàng. Vui lòng đăng nhập với tài khoản Admin." />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {segments.map(seg => (
            <Col span={8} key={seg.segment}>
              <Card
                size="small"
                hoverable
                onClick={() => fetchSegmentCustomers(seg.segment)}
                style={{
                  borderLeft: `4px solid ${SEGMENT_COLORS[seg.segment]}`,
                  cursor: 'pointer'
                }}
              >
                <Statistic
                  title={
                    <Space>
                      {SEGMENT_ICONS[seg.segment]}
                      <span>{seg.segment}</span>
                    </Space>
                  }
                  value={seg.customer_count}
                  suffix="khách"
                  valueStyle={{ color: SEGMENT_COLORS[seg.segment] }}
                />
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
                  <div>Doanh thu: {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(seg.total_revenue)}</div>
                  <div>TB: R={seg.avg_recency?.toFixed(0)} F={seg.avg_frequency?.toFixed(1)} M={(seg.avg_monetary / 1000000).toFixed(1)}M</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ marginTop: '24px', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={entry => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                onClick={handlePieClick}
                style={{ cursor: 'pointer' }}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.segment]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} khách hàng (${((value / segments.reduce((sum, s) => sum + s.customer_count, 0)) * 100).toFixed(1)}%)`,
                  props.payload.segment
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>        </>
        )}      </Card>

      <Modal
        title={
          <Space>
            {SEGMENT_ICONS[selectedSegment]}
            <span>Khách hàng phân khúc: {selectedSegment}</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setExpandedCustomer(null);
          setPurchaseHistory(null);
        }}
        width={1200}
        footer={null}
        destroyOnClose
      >
        <Table
          dataSource={customers}
          columns={customerColumns}
          rowKey="user_id"
          expandable={{
            expandedRowRender,
            onExpand: handleCustomerExpand,
            expandedRowKeys: expandedCustomer ? [expandedCustomer] : []
          }}
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Modal>
    </Spin>
  );
};

export default CustomerSegmentation;
