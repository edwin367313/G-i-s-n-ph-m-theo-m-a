const { query } = require('../config/database');
const ExcelJS = require('exceljs');

/**
 * Lấy tổng quan doanh thu
 */
const getRevenueOverview = async () => {
  // Daily Revenue
  const dailyResult = await query(`
    SELECT SUM(total_amount) as total 
    FROM Orders 
    WHERE status IN (N'Đã giao', 'DELIVERED', 'paid', 'delivery', 'completed') 
    AND CAST(created_at AS DATE) = CAST(GETDATE() AS DATE)
  `);

  // Monthly Revenue
  const monthlyResult = await query(`
    SELECT SUM(total_amount) as total 
    FROM Orders 
    WHERE status IN (N'Đã giao', 'DELIVERED', 'paid', 'delivery', 'completed') 
    AND MONTH(created_at) = MONTH(GETDATE()) 
    AND YEAR(created_at) = YEAR(GETDATE())
  `);

  // Yearly Revenue
  const yearlyResult = await query(`
    SELECT SUM(total_amount) as total 
    FROM Orders 
    WHERE status IN (N'Đã giao', 'DELIVERED', 'paid', 'delivery', 'completed') 
    AND YEAR(created_at) = YEAR(GETDATE())
  `);

  // Total Orders
  const ordersResult = await query(`
    SELECT COUNT(*) as total 
    FROM Orders 
  `);

  // Total Products
  const productsResult = await query(`
    SELECT COUNT(*) as total 
    FROM Products 
    WHERE status = '1'
  `);

  // Total Users
  const usersResult = await query(`
    SELECT COUNT(*) as total 
    FROM Users 
    WHERE role = 'customer'
  `);

  return {
    dailyRevenue: dailyResult[0]?.total || 0,
    monthlyRevenue: monthlyResult[0]?.total || 0,
    yearlyRevenue: yearlyResult[0]?.total || 0,
    totalOrders: ordersResult[0]?.total || 0,
    totalProducts: productsResult[0]?.total || 0,
    totalUsers: usersResult[0]?.total || 0
  };
};

/**
 * Lấy doanh thu theo khoảng thời gian
 */
const getRevenueByPeriod = async (startDate, endDate) => {
  const result = await query(`
    SELECT 
      SUM(total_amount) as revenue,
      COUNT(*) as orders
    FROM Orders
    WHERE status IN (N'Đã giao', 'DELIVERED', 'paid', 'delivery', 'completed')
    AND created_at BETWEEN @startDate AND @endDate
  `, { startDate, endDate });

  return {
    revenue: result[0]?.revenue || 0,
    orders: result[0]?.orders || 0,
    startDate,
    endDate
  };
};

/**
 * Lấy doanh thu theo tháng
 */
const getMonthlyRevenue = async (year) => {
  const result = await query(`
    SELECT 
      MONTH(created_at) as month,
      SUM(total_amount) as revenue,
      COUNT(*) as orders
    FROM Orders
    WHERE YEAR(created_at) = @year
      AND status IN (N'Đã giao', 'DELIVERED', 'paid', 'delivery', 'completed')
    GROUP BY MONTH(created_at)
    ORDER BY month
  `, { year });
  
  return result;
};

/**
 * Lấy top sản phẩm bán chạy
 */
const getTopProducts = async (limit = 5) => {
  const result = await query(`
    SELECT TOP (@limit)
      p.id,
      p.name,
      SUM(oi.quantity) as sold_quantity,
      SUM(oi.price * oi.quantity) as revenue
    FROM OrderItems oi
    JOIN Orders o ON oi.order_id = o.id
    JOIN Products p ON oi.product_id = p.id
    WHERE o.status IN (N'Đã giao', 'DELIVERED', 'paid', 'delivery', 'completed')
    GROUP BY p.id, p.name
    ORDER BY sold_quantity DESC
  `, { limit: parseInt(limit) });
  
  return result;
};

/**
 * Lấy doanh thu theo danh mục
 */
const getRevenueByCategory = async () => {
  const result = await query(`
    SELECT 
      c.name as name,
      SUM(oi.price * oi.quantity) as revenue
    FROM OrderItems oi
    JOIN Orders o ON oi.order_id = o.id
    JOIN Products p ON oi.product_id = p.id
    JOIN Categories c ON p.category_id = c.id
    WHERE o.status IN (N'Đã giao', 'DELIVERED', 'paid', 'delivery', 'completed')
    GROUP BY c.name
    ORDER BY revenue DESC
  `);
  
  return result;
};

/**
 * Export báo cáo doanh thu ra file Excel
 */
const exportRevenueReport = async (startDate, endDate) => {
  // Lấy dữ liệu từ database
  const orders = await query(`
    SELECT 
      o.id,
      o.created_at,
      o.full_name,
      o.phone,
      o.total_amount,
      o.payment_method,
      o.status
    FROM Orders o
    WHERE o.status IN (N'Đã giao', 'DELIVERED', 'paid', 'delivery', 'completed')
    AND o.created_at BETWEEN @startDate AND @endDate
    ORDER BY o.created_at DESC
  `, { startDate, endDate });

  // Tạo workbook và worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Báo Cáo Doanh Thu');

  // Định dạng header
  worksheet.columns = [
    { header: 'Mã Đơn', key: 'id', width: 10 },
    { header: 'Ngày Tạo', key: 'created_at', width: 20 },
    { header: 'Khách Hàng', key: 'full_name', width: 25 },
    { header: 'Số Điện Thoại', key: 'phone', width: 15 },
    { header: 'Tổng Tiền', key: 'total_amount', width: 15 },
    { header: 'Phương Thức', key: 'payment_method', width: 15 },
    { header: 'Trạng Thái', key: 'status', width: 15 }
  ];

  // Style cho header
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Thêm dữ liệu
  orders.forEach(order => {
    worksheet.addRow({
      id: order.id,
      created_at: new Date(order.created_at).toLocaleString('vi-VN'),
      full_name: order.full_name,
      phone: order.phone,
      total_amount: order.total_amount,
      payment_method: order.payment_method,
      status: order.status
    });
  });

  // Format số tiền
  worksheet.getColumn('total_amount').numFmt = '#,##0 "đ"';

  // Thêm dòng tổng cộng
  const totalRow = worksheet.addRow({
    id: '',
    created_at: '',
    full_name: '',
    phone: 'TỔNG CỘNG:',
    total_amount: orders.reduce((sum, o) => sum + o.total_amount, 0),
    payment_method: '',
    status: ''
  });
  
  totalRow.font = { bold: true };
  totalRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE7E6E6' }
  };

  // Trả về buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = {
  getRevenueOverview,
  getRevenueByPeriod,
  getMonthlyRevenue,
  getTopProducts,
  getRevenueByCategory,
  exportRevenueReport
};
