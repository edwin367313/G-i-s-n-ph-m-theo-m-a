const { query } = require('../config/database');
const ExcelJS = require('exceljs');


const getRevenueOverview = async () => {
  // Lấy ngày mới nhất
  const latestDateResult = await query(`
    SELECT MAX(TransactionDate) as latest_date FROM Transactions
  `);
  const latestDate = latestDateResult[0]?.latest_date;
  
  const dailyResult = await query(`
    SELECT COUNT(*) as total 
    FROM Transactions 
    WHERE CAST(TransactionDate AS DATE) = CAST(@latestDate AS DATE)
  `, { latestDate });

  const monthlyResult = await query(`
    SELECT COUNT(*) as total 
    FROM Transactions 
    WHERE MONTH(TransactionDate) = MONTH(@latestDate) 
    AND YEAR(TransactionDate) = YEAR(@latestDate)
  `, { latestDate });

  const yearlyResult = await query(`
    SELECT COUNT(*) as total 
    FROM Transactions 
    WHERE YEAR(TransactionDate) = YEAR(@latestDate)
  `, { latestDate });

  const ordersResult = await query(`
    SELECT COUNT(*) as total 
    FROM Transactions 
  `);

  const productsResult = await query(`
    SELECT COUNT(DISTINCT value) as total 
    FROM Transactions 
    CROSS APPLY STRING_SPLIT(Items, ', ')
  `);

  const usersResult = await query(`
    SELECT COUNT(DISTINCT MemberNumber) as total 
    FROM Transactions 
  `);

  const result = {
    dailyRevenue: dailyResult[0]?.total || 0,
    monthlyRevenue: monthlyResult[0]?.total || 0,
    yearlyRevenue: yearlyResult[0]?.total || 0,
    totalOrders: ordersResult[0]?.total || 0,
    totalProducts: productsResult[0]?.total || 0,
    totalUsers: usersResult[0]?.total || 0
  };
  return result;
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
      MONTH(TransactionDate) as month,
      COUNT(*) as revenue,
      COUNT(*) as orders
    FROM Transactions
    WHERE YEAR(TransactionDate) = @year
    GROUP BY MONTH(TransactionDate)
    ORDER BY month
  `, { year });
  
  return result;
};

/**
 * Lấy top sản phẩm bán chạy
 */
const getTopProducts = async (limit = 10) => {
  const result = await query(`
    WITH ProductSales AS (
      SELECT 
        value as product_name,
        COUNT(*) as sold_quantity
      FROM Transactions
      CROSS APPLY STRING_SPLIT(Items, ', ')
      GROUP BY value
    )
    SELECT TOP (@limit)
      ROW_NUMBER() OVER (ORDER BY sold_quantity DESC) as id,
      product_name as name,
      sold_quantity,
      sold_quantity as revenue
    FROM ProductSales
    ORDER BY sold_quantity DESC
  `, { limit });
  
  return result;
};

/**
 * Lấy doanh thu theo danh mục
 */
const getRevenueByCategory = async () => {
  // Dataset không có categories, nên trả về top items grouped
  const result = await query(`
    WITH ItemCategories AS (
      SELECT 
        LEFT(value, CHARINDEX(' ', value + ' ') - 1) as category,
        COUNT(*) as revenue
      FROM Transactions
      CROSS APPLY STRING_SPLIT(Items, ', ')
      GROUP BY LEFT(value, CHARINDEX(' ', value + ' ') - 1)
    )
    SELECT TOP 10
      category as name,
      revenue
    FROM ItemCategories
    ORDER BY revenue DESC
  `);
  
  return result;
};

/** Export báo cáo doanh thu ra file Excel*/
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
