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

  const loadInitialData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading quarterly report...');
      
      // Lấy thông tin mùa hiện tại
      const seasonInfoResponse = await getCurrentSeasonInfo();
      if (seasonInfoResponse.success) {
        setCurrentSeason(seasonInfoResponse.data.currentSeason);
        setActiveTab(seasonInfoResponse.data.currentSeason);
      }

      // Load quarterly report - chứa data cho tất cả 4 mùa
      const reportResponse = await getQuarterlyReport();
      console.log('📦 Quarterly Report Response:', reportResponse);
      
      if (reportResponse.success) {
        const { summary: summaryData, details } = reportResponse.data;
        console.log('✅ Summary:', summaryData);
        console.log('✅ Details:', details);
        
        setSummary(summaryData || []);
        
        // Extract products for each season from details
        const newSeasonalData = {};
        Object.keys(details || {}).forEach(season => {
          newSeasonalData[season] = details[season] || [];
        });
        setSeasonalData(newSeasonalData);
        
        // Load associations for each season
        await loadAllAssociations();
      }
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllAssociations = async () => {
    const seasons = ['Xuân', 'Hạ', 'Thu', 'Đông'];
    const assocPromises = seasons.map(async (season) => {
      try {
        const response = await getTopAssociations(season, 20);
        return {
          season,
          associations: response.success ? response.data.associations : []
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
          onClick={loadAllSeasonsData}
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
    </div>
  );
};

export default SeasonalReportPage;
