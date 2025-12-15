import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';

const Dashboard = () => {
  return (
    <div>
      <h1>Trang quản trị</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={112893000}
              suffix="đ"
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đơn hàng"
              value={128}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Sản phẩm"
              value={234}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Khách hàng"
              value={456}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
