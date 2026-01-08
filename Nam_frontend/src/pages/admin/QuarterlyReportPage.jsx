import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Space, Typography, Spin, Alert, Button } from 'antd';
import { 
  ReloadOutlined, 
  BarChartOutlined, 
  RiseOutlined,
  ShoppingOutlined,
  UserOutlined,
  TrophyOutlined,
  FallOutlined
} from '@ant-design/icons';
import { getQuarterlyReport, getCurrentSeasonInfo } from '../../services/recommendationService';
import './QuarterlyReportPage.css';

const { Title, Text, Paragraph } = Typography;

const QuarterlyReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [reportResponse, seasonResponse] = await Promise.all([
        getQuarterlyReport(),
        getCurrentSeasonInfo()
      ]);

      if (reportResponse.success) {
        setReportData(reportResponse.data);
      } else {
        setError('Không thể tải dữ liệu báo cáo');
      }

      if (seasonResponse.success) {
        setCurrentSeason(seasonResponse.data.currentSeason);
      }
    } catch (err) {
      console.error('Error loading quarterly report:', err);
      setError('Đã xảy ra lỗi khi tải báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const summaryColumns = [
    {
      title: 'Mùa',
      dataIndex: 'Season',
      key: 'Season',
      width: 120,
      render: (season) => {
        const seasonEmoji = {
          'Xuân': '🌸',
          'Hạ': '☀️',
          'Thu': '🍂',
          'Đông': '❄️'
        };
        const seasonColor = {
          'Xuân': 'green',
          'Hạ': 'orange',
          'Thu': 'gold',
          'Đông': 'blue'
        };
        return (
          <Space>
            <span style={{ fontSize: 20 }}>{seasonEmoji[season]}</span>
            <Tag color={seasonColor[season]} style={{ fontSize: 14 }}>
              {season}
            </Tag>
            {currentSeason === season && (
              <Tag color="red">Hiện tại</Tag>
            )}
          </Space>
        );
      }
    },
    {
      title: 'Tổng sản phẩm',
      dataIndex: 'TotalProducts',
      key: 'TotalProducts',
      width: 150,
      render: (value) => (
        <Space>
          <ShoppingOutlined style={{ color: '#1890ff' }} />
          <Text strong>{value}</Text>
        </Space>
      ),
      sorter: (a, b) => a.TotalProducts - b.TotalProducts
    },
    {
      title: 'Tổng lượt mua',
      dataIndex: 'TotalPurchases',
      key: 'TotalPurchases',
      width: 150,
      render: (value) => (
        <Space>
          <RiseOutlined style={{ color: '#52c41a' }} />
          <Text strong>{value.toLocaleString()}</Text>
        </Space>
      ),
      sorter: (a, b) => a.TotalPurchases - b.TotalPurchases
    },
    {
      title: 'Tổng khách hàng',
      dataIndex: 'TotalCustomers',
      key: 'TotalCustomers',
      width: 150,
      render: (value) => (
        <Space>
          <UserOutlined style={{ color: '#fa8c16' }} />
          <Text strong>{value.toLocaleString()}</Text>
        </Space>
      ),
      sorter: (a, b) => a.TotalCustomers - b.TotalCustomers
    },
    {
      title: 'TB/Sản phẩm',
      key: 'avgPurchases',
      width: 120,
      render: (_, record) => {
        const avg = (record.TotalPurchases / record.TotalProducts).toFixed(2);
        return <Tag color="purple">{avg}</Tag>;
      },
      sorter: (a, b) => 
        (a.TotalPurchases / a.TotalProducts) - (b.TotalPurchases / b.TotalProducts)
    }
  ];

  const productColumns = [
    {
      title: '#',
      key: 'rank',
      width: 60,
      render: (_, __, index) => {
        const medals = ['🥇', '🥈', '🥉'];
        return medals[index] || `#${index + 1}`;
      }
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'ProductName',
      key: 'ProductName'
    },
    {
      title: 'Lượt mua',
      dataIndex: 'PurchaseCount',
      key: 'PurchaseCount',
      width: 120,
      render: (count) => count.toLocaleString()
    },
    {
      title: 'Khách hàng',
      dataIndex: 'CustomerCount',
      key: 'CustomerCount',
      width: 120,
      render: (count) => count.toLocaleString()
    },
    {
      title: 'Điểm',
      dataIndex: 'PopularityScore',
      key: 'PopularityScore',
      width: 100,
      render: (score) => (
        <Tag color="green">{score.toFixed(1)}</Tag>
      )
    }
  ];

  if (loading) {
    return (
      <div className="quarterly-report-page">
        <Card style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" tip="Đang tải báo cáo tổng hợp..." />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quarterly-report-page">
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          action={
            <Button onClick={loadReportData}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  const { summary, details } = reportData || {};

  // Tính toán thống kê tổng thể
  const grandTotal = summary ? {
    products: summary.reduce((sum, s) => sum + s.TotalProducts, 0),
    purchases: summary.reduce((sum, s) => sum + s.TotalPurchases, 0),
    customers: summary.reduce((sum, s) => sum + s.TotalCustomers, 0)
  } : { products: 0, purchases: 0, customers: 0 };

  // Tìm mùa có performance cao nhất
  const bestSeason = summary && summary.length > 0
    ? summary.reduce((best, current) => 
        current.TotalPurchases > best.TotalPurchases ? current : best
      )
    : null;

  return (
    <div className="quarterly-report-page">
      <div className="page-header">
        <div>
          <Title level={2}>
            <BarChartOutlined /> Báo cáo tổng hợp theo mùa
          </Title>
          <Paragraph type="secondary">
            Phân tích so sánh hiệu suất kinh doanh giữa 4 mùa trong năm
          </Paragraph>
        </div>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={loadReportData}
          size="large"
        >
          Làm mới
        </Button>
      </div>

      {/* Grand Total Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm khác biệt"
              value={grandTotal.products}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#3f8600', fontSize: 32 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng lượt mua"
              value={grandTotal.purchases}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: 32 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng khách hàng"
              value={grandTotal.customers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#fa8c16', fontSize: 32 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Mùa bán chạy nhất"
              value={bestSeason?.Season || 'N/A'}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#cf1322', fontSize: 32 }}
              suffix={bestSeason && `(${bestSeason.TotalPurchases.toLocaleString()})`}
            />
          </Card>
        </Col>
      </Row>

      {/* Summary Comparison Table */}
      <Card 
        title={
          <Space>
            <BarChartOutlined />
            <span>So sánh tổng quan 4 mùa</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          dataSource={summary}
          columns={summaryColumns}
          rowKey="Season"
          pagination={false}
          rowClassName={(record) => 
            record.Season === currentSeason ? 'current-season-row' : ''
          }
        />
      </Card>

      {/* Top Products by Season */}
      <Row gutter={[16, 16]}>
        {['Xuân', 'Hạ', 'Thu', 'Đông'].map(season => {
          const seasonProducts = details?.[season] || [];
          const seasonData = summary?.find(s => s.Season === season);
          const seasonEmoji = {
            'Xuân': '🌸',
            'Hạ': '☀️',
            'Thu': '🍂',
            'Đông': '❄️'
          };

          return (
            <Col xs={24} lg={12} key={season}>
              <Card 
                title={
                  <Space>
                    <span style={{ fontSize: 24 }}>{seasonEmoji[season]}</span>
                    <span>Top 10 - Mùa {season}</span>
                    {currentSeason === season && (
                      <Tag color="green">Hiện tại</Tag>
                    )}
                  </Space>
                }
                extra={
                  seasonData && (
                    <Space split="|">
                      <Text type="secondary">
                        {seasonData.TotalPurchases.toLocaleString()} lượt
                      </Text>
                      <Text type="secondary">
                        {seasonData.TotalCustomers.toLocaleString()} khách
                      </Text>
                    </Space>
                  )
                }
              >
                <Table
                  dataSource={seasonProducts.slice(0, 10)}
                  columns={productColumns}
                  rowKey={(record, index) => `${season}-${index}`}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default QuarterlyReportPage;
