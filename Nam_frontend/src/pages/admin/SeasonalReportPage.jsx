import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Tag, Space, Typography, Spin, Row, Col, Statistic, Button } from 'antd';
import { 
  FireOutlined, 
  ReloadOutlined, 
  RiseOutlined, 
  ShoppingOutlined,
  UserOutlined,
  TrophyOutlined 
} from '@ant-design/icons';
import { getQuarterlyReport, getCurrentSeasonInfo, getTopAssociations } from '../../services/recommendationService';
import './SeasonalReportPage.css';

const { Title, Text, Paragraph } = Typography;

const SeasonalReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [seasonalData, setSeasonalData] = useState({});
  const [associations, setAssociations] = useState({});
  const [activeTab, setActiveTab] = useState('Xuân');
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  // Load dữ liệu ban đầu
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const seasonInfoResponse = await getCurrentSeasonInfo();
      if (seasonInfoResponse?.success) {
        const currentSeasonData = seasonInfoResponse.data?.currentSeason || seasonInfoResponse.currentSeason;
        setCurrentSeason(currentSeasonData);
        setActiveTab(currentSeasonData);
      }

      const reportResponse = await getQuarterlyReport();
      const hasSuccessField = reportResponse?.success !== undefined;
      const summaryData = hasSuccessField 
        ? (reportResponse.data?.summary || [])
        : (reportResponse?.summary || []);
      const details = hasSuccessField
        ? (reportResponse.data?.details || {})
        : (reportResponse?.details || {});
      
      setSummary(summaryData);
      
      const newSeasonalData = {};
      Object.keys(details).forEach(season => {
        newSeasonalData[season] = details[season] || [];
      });
      setSeasonalData(newSeasonalData);
      
      await loadAllAssociations();
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load associations cho 4 mùa
  const loadAllAssociations = async () => {
    const seasons = ['Xuân', 'Hạ', 'Thu', 'Đông'];
    const assocPromises = seasons.map(async (season) => {
      try {
        const response = await getTopAssociations(season, 20);
        const associations = response?.success 
          ? (response.data?.associations || [])
          : (response?.associations || []);
        
        return {
          season,
          associations
        };
      } catch (error) {
        console.error(`Error loading associations for ${season}:`, error);
        return { season, associations: [] };
      }
    });

    const results = await Promise.all(assocPromises);
    
    const newAssociations = {};
    results.forEach(({ season, associations }) => {
      newAssociations[season] = associations;
    });

    setAssociations(newAssociations);
  };

  const productColumns = [
    {
      title: 'Rank',
      key: 'rank',
      width: 70,
      render: (_, __, index) => {
        const icons = ['🥇', '🥈', '🥉'];
        return (
          <Space>
            {index < 3 ? icons[index] : `#${index + 1}`}
          </Space>
        );
      }
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'ProductName',
      key: 'ProductName',
      render: (name, _, index) => (
        <Space>
          {index < 5 && <FireOutlined style={{ color: '#ff4d4f' }} />}
          <Text strong>{name}</Text>
        </Space>
      )
    },
    {
      title: 'Lượt mua',
      dataIndex: 'PurchaseCount',
      key: 'PurchaseCount',
      width: 120,
      render: (count) => (
        <Space>
          <ShoppingOutlined />
          <Text>{count}</Text>
        </Space>
      ),
      sorter: (a, b) => a.PurchaseCount - b.PurchaseCount
    },
    {
      title: 'Khách hàng',
      dataIndex: 'CustomerCount',
      key: 'CustomerCount',
      width: 120,
      render: (count) => (
        <Space>
          <UserOutlined />
          <Text>{count}</Text>
        </Space>
      ),
      sorter: (a, b) => a.CustomerCount - b.CustomerCount
    },
    {
      title: 'Độ phổ biến',
      dataIndex: 'PopularityScore',
      key: 'PopularityScore',
      width: 140,
      render: (score) => (
        <Tag color="green" style={{ fontSize: 14 }}>
          <TrophyOutlined /> {score.toFixed(2)}
        </Tag>
      ),
      sorter: (a, b) => a.PopularityScore - b.PopularityScore,
      defaultSortOrder: 'descend'
    }
  ];

  const associationColumns = [
    {
      title: 'Sản phẩm A',
      dataIndex: 'ProductA',
      key: 'ProductA',
      width: '30%'
    },
    {
      title: '→',
      width: 50,
      render: () => <Text type="secondary" style={{ fontSize: 16 }}>→</Text>
    },
    {
      title: 'Sản phẩm B',
      dataIndex: 'ProductB',
      key: 'ProductB',
      width: '30%'
    },
    {
      title: 'Confidence',
      dataIndex: 'Confidence',
      key: 'Confidence',
      width: '15%',
      render: (confidence) => (
        <Tag color="blue">{(confidence * 100).toFixed(2)}%</Tag>
      ),
      sorter: (a, b) => a.Confidence - b.Confidence
    },
    {
      title: 'Lift',
      dataIndex: 'Lift',
      key: 'Lift',
      width: '15%',
      render: (lift) => (
        <Text>{lift.toFixed(3)}</Text>
      ),
      sorter: (a, b) => a.Lift - b.Lift
    }
  ];

  const getSeasonStats = (season) => {
    const seasonSummary = summary.find(s => s.Season === season);
    const assocs = associations[season] || [];
    
    if (!seasonSummary) {
      return { totalPurchases: 0, totalCustomers: 0, totalProducts: 0, associationRules: 0 };
    }

    return {
      totalPurchases: seasonSummary.TotalPurchases || 0,
      totalCustomers: seasonSummary.TotalCustomers || 0,
      totalProducts: seasonSummary.TotalProducts || 0,
      associationRules: assocs.length
    };
  };

  const seasonEmoji = {
    'Xuân': '🌸',
    'Hạ': '☀️',
    'Thu': '🍂',
    'Đông': '❄️'
  };

  const tabItems = ['Xuân', 'Hạ', 'Thu', 'Đông'].map(season => {
    const stats = getSeasonStats(season);
    const products = seasonalData[season] || [];
    const assocs = associations[season] || [];

    return {
      key: season,
      label: (
        <Space>
          <span>{seasonEmoji[season]}</span>
          <span>{season}</span>
          {currentSeason === season && (
            <Tag color="green">Hiện tại</Tag>
          )}
        </Space>
      ),
      children: (
        <div className="season-content">
          {/* Statistics */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng sản phẩm"
                  value={stats.totalProducts}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng lượt mua"
                  value={stats.totalPurchases}
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng khách hàng"
                  value={stats.totalCustomers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Association Rules"
                  value={stats.associationRules}
                  prefix={<FireOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Top Products */}
          <Card 
            title={
              <Space>
                <TrophyOutlined />
                <span>Top sản phẩm mùa {season}</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Table
              dataSource={products.slice(0, 20)}
              columns={productColumns}
              rowKey={(record, index) => `${season}-product-${index}`}
              pagination={{ pageSize: 10 }}
              loading={loading}
            />
          </Card>

          {/* Association Rules */}
          <Card 
            title={
              <Space>
                <FireOutlined />
                <span>Association Rules mùa {season}</span>
              </Space>
            }
          >
            <Paragraph type="secondary">
              Các cặp sản phẩm thường được mua cùng nhau trong mùa {season}
            </Paragraph>
            <Table
              dataSource={assocs}
              columns={associationColumns}
              rowKey={(record, index) => `${season}-assoc-${index}`}
              pagination={{ pageSize: 10 }}
              loading={loading}
            />
          </Card>
        </div>
      )
    };
  });

  return (
    <div className="seasonal-report-page">
      <div className="page-header">
        <Title level={2}>
          <FireOutlined /> Báo cáo theo mùa
        </Title>
        <Paragraph type="secondary">
          Phân tích sản phẩm và mối quan hệ mua chùm theo 4 mùa Việt Nam
        </Paragraph>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={loadInitialData}
          loading={loading}
        >
          Tải lại dữ liệu
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        items={tabItems}
        onChange={setActiveTab}
        size="large"
      />

      {/* AI Recommendations Section */}
      <Card 
        title={
          <Space>
            <FireOutlined style={{ color: '#ff4d4f' }} />
            <span>💡 Gợi ý</span>
          </Space>
        }
        style={{ marginTop: 24 }}
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card 
              hoverable
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                height: '100%'
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ fontSize: 40 }}>📈</div>
                <Title level={4} style={{ color: 'white', margin: 0 }}>
                  Gợi ý Bán hàng
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.9)' }}>
                  • Tập trung vào top {seasonalData[activeTab]?.length > 0 ? '10' : ''} sản phẩm hot mùa {activeTab}
                  <br />
                  • Đẩy mạnh combo sản phẩm theo Association Rules
                  <br />
                  • Ưu đãi đặc biệt cho sản phẩm có Confidence cao
                  <br />
                  • Cross-sell với sản phẩm có Lift {'>'} 2.0
                </Paragraph>
              </Space>
            </Card>
          </Col>

          <Col span={8}>
            <Card 
              hoverable
              style={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                height: '100%'
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ fontSize: 40 }}>📦</div>
                <Title level={4} style={{ color: 'white', margin: 0 }}>
                  Gợi ý Nhập hàng
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.9)' }}>
                  • Chuẩn bị tồn kho cho sản phẩm mùa tiếp theo
                  <br />
                  • Tăng lượng nhập cho sản phẩm có CustomerCount cao
                  <br />
                  • Đảm bảo sản phẩm B trong association luôn có sẵn
                  <br />
                  • Giảm tồn kho sản phẩm ngoài mùa
                </Paragraph>
              </Space>
            </Card>
          </Col>

          <Col span={8}>
            <Card 
              hoverable
              style={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                height: '100%'
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ fontSize: 40 }}>💡</div>
                <Title level={4} style={{ color: 'white', margin: 0 }}>
                  Gợi ý Marketing
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.9)' }}>
                  • Bundle promotion theo association rules
                  <br />
                  • Flash sale sản phẩm có PopularityScore cao
                  <br />
                  • Email marketing sản phẩm theo mùa cho khách cũ
                  <br />
                  • Voucher combo cho sản phẩm mua chùm
                </Paragraph>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Detailed Recommendations based on current season */}
        {currentSeason && seasonalData[activeTab]?.length > 0 && (
          <Card 
            style={{ marginTop: 16, background: '#f5f5f5' }}
            bordered={false}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text strong style={{ fontSize: 16 }}>
                🎯 Gợi ý cụ thể cho mùa {activeTab}:
              </Text>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                <li>
                  <Text>
                    Sản phẩm <Text code>{seasonalData[activeTab]?.[0]?.ProductName}</Text> đang hot nhất với {seasonalData[activeTab]?.[0]?.PurchaseCount} lượt mua
                  </Text>
                </li>
                {associations[activeTab]?.length > 0 && (
                  <li>
                    <Text>
                      Khi khách mua <Text code>{associations[activeTab][0]?.ProductA}</Text>, có {(associations[activeTab][0]?.Confidence * 100).toFixed(1)}% khả năng họ sẽ mua thêm{' '}
                      <Text code>{associations[activeTab][0]?.ProductB}</Text>
                    </Text>
                  </li>
                )}
                <li>
                  <Text>
                    Tổng {summary.find(s => s.Season === activeTab)?.TotalCustomers || 0} khách hàng đã mua sắm trong mùa này
                  </Text>
                </li>
                <li>
                  <Text strong type="danger">
                    💰 Tiềm năng doanh thu: Tập trung vào top 5 sản phẩm và 10 association rules có confidence cao nhất
                  </Text>
                </li>
              </ul>
            </Space>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default SeasonalReportPage;
