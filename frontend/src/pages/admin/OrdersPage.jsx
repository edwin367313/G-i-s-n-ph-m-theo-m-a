import React from 'react';
import { Table } from 'antd';

const OrdersPage = () => {
  const columns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    { title: 'Tổng tiền', dataIndex: 'total', key: 'total' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' }
  ];

  return (
    <div>
      <h1>Quản lý đơn hàng</h1>
      <Table columns={columns} dataSource={[]} />
    </div>
  );
};

export default OrdersPage;
