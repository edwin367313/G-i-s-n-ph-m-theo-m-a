import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Statistic, Table, Button, DatePicker, message, Tooltip as AntTooltip } from 'antd';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpOutlined, ArrowDownOutlined, DownloadOutlined, LinkOutlined } from '@ant-design/icons';
import revenueService from '../../services/revenueService';
import { formatCurrency } from '../../utils/helpers';
import dayjs from 'dayjs';
import AprioriDrillDown from '../../components/Analytics/AprioriDrillDown';
import CustomerSegmentation from '../../components/Analytics/CustomerSegmentation';

const { RangePicker } = DatePicker;

const RevenuePage = () => {
  const [overview, setOverview] = useState({
    dailyRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    totalOrders: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(2015);
  const [aprioriModalVisible, setAprioriModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [segmentDateFilter, setSegmentDateFilter] = useState(null);

  // Load tổng quan
  const fetchOverview = async () => {
    try {
      const res = await revenueService.getOverview();
      if (res?.success || res?.data) {
        setOverview(res.data || res);
      }
    } catch (error) {
      console.error('Error fetching overview:', error);
      message.error('Không thể tải dữ liệu tổng quan');
    }
  };

  // Load data theo tháng
  const fetchMonthlyData = async () => {
    try {
      const res = await revenueService.getMonthlyRevenue(year);
      if (res?.success || res?.data) {
        const results = res.data?.results || res.results || [];
        const chartData = Array.from({ length: 12 }, (_, i) => {
          const monthData = results.find(item => item.month === i + 1);
          return {
            month: `T${i + 1}`,
            revenue: monthData ? monthData.revenue : 0,
            orders: monthData ? monthData.orders : 0
          };
        });
        setMonthlyData(chartData);
      }
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      message.error('Không thể tải dữ liệu theo tháng');
    }
  };

  const fetchTopProducts = async () => {
    try {
      const res = await revenueService.getTopProducts();
      if (res?.success || res?.data) {
        const products = res.data?.products || res.products || [];
        setTopProducts(products);
      }
    } catch (error) {
      console.error('Error fetching top products:', error);
      message.error('Không thể tải top sản phẩm');
    }
  };

  const fetchCategoryData = async () => {
    try {
      const res = await revenueService.getRevenueByCategory();
      if (res?.success || res?.data) {
        const categories = res.data?.categories || res.categories || [];
        setCategoryData(categories);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
      message.error('Không thể tải dữ liệu danh mục');
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchOverview(),
      fetchMonthlyData(),
      fetchTopProducts(),
      fetchCategoryData()
    ]).finally(() => setLoading(false));
  }, [year]);

  const handleExport = async () => {
    try {
      const startDate = dayjs().startOf('year').format('YYYY-MM-DD');
      const endDate = dayjs().endOf('year').format('YYYY-MM-DD');
      
      message.loading({ content: 'Đang xuất báo cáo...', key: 'export' });
      
      const response = await revenueService.exportReport(startDate, endDate);
      
      // Tạo blob từ response
      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Tạo link download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bao-cao-doanh-thu-${startDate}-${endDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Dọn dẹp
      window.URL.revokeObjectURL(url);
      
      message.success({ content: 'Xuất báo cáo thành công!', key: 'export' });
    } catch (error) {
      console.error('Export error:', error);
      message.error({ content: 'Không thể xuất báo cáo', key: 'export' });
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Báo cáo doanh thu</h1>
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
          Xuất báo cáo năm nay
        </Button>
      </div>

      {/* Overview Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Doanh thu hôm nay" 
              value={overview.dailyRevenue} 
              formatter={val => formatCurrency(val)}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Doanh thu tháng này" 
              value={overview.monthlyRevenue} 
              formatter={val => formatCurrency(val)}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Doanh thu năm nay" 
              value={overview.yearlyRevenue} 
              formatter={val => formatCurrency(val)}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tổng đơn hàng (Đã giao)" 
              value={overview.totalOrders} 
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card title={`Biểu đồ doanh thu năm ${year}`} extra={
            <Select value={year} onChange={setYear} style={{ width: 100 }}>
              <Select.Option value={2014}>2014</Select.Option>
              <Select.Option value={2015}>2015</Select.Option>
            </Select>
          }>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" name="Doanh thu" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="Đơn hàng" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tỷ trọng theo danh mục">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Top Products */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LinkOutlined />
                <span>Phân tích Apriori - Sản phẩm liên kết</span>
                <AntTooltip title="Click vào sản phẩm để xem các nhóm sản phẩm thường được mua cùng">
                  <span style={{ fontSize: '14px', color: '#666', cursor: 'help' }}>
                    (?
                  </span>
                </AntTooltip>
              </div>
            }
          >
            <Table 
              dataSource={topProducts} 
              rowKey="id"
              pagination={false}
              onRow={(record) => ({
                onClick: () => {
                  setSelectedProduct({ id: record.id, name: record.name });
                  setAprioriModalVisible(true);
                },
                style: { cursor: 'pointer' }
              })}
              columns={[
                { 
                  title: 'Sản phẩm', 
                  dataIndex: 'name', 
                  key: 'name',
                  render: (text) => (
                    <span style={{ color: '#1890ff', fontWeight: 500 }}>
                      {text}
                    </span>
                  )
                },
                { title: 'Số lượng bán', dataIndex: 'sold_quantity', key: 'sold_quantity' },
                { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', render: val => formatCurrency(val) }
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Customer Segmentation */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <CustomerSegmentation 
            dateFilter={segmentDateFilter}
            onDateChange={(date) => setSegmentDateFilter(date)}
          />
        </Col>
      </Row>

      {/* Apriori Modal */}
      <AprioriDrillDown
        visible={aprioriModalVisible}
        product={selectedProduct}
        onClose={() => {
          setAprioriModalVisible(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default RevenuePage;
