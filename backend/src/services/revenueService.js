const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Category = require('../models/Category');
// const { Op } = require('sequelize');
// const { sequelize } = require('../config/database');

/**
 * Lấy tổng quan doanh thu
 */
const getRevenueOverview = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const dailyRevenue = await Order.sum('total', {
    where: {
      orderStatus: 'delivered',
      paymentStatus: 'paid',
      createdAt: { [Op.gte]: startOfDay }
    }
  }) || 0;

  const monthlyRevenue = await Order.sum('total', {
    where: {
      orderStatus: 'delivered',
      paymentStatus: 'paid',
      createdAt: { [Op.gte]: startOfMonth }
    }
  }) || 0;

  const yearlyRevenue = await Order.sum('total', {
    where: {
      orderStatus: 'delivered',
      paymentStatus: 'paid',
      createdAt: { [Op.gte]: startOfYear }
    }
  }) || 0;

  const totalOrders = await Order.count({
    where: { orderStatus: 'delivered' }
  });

  return {
    dailyRevenue,
    monthlyRevenue,
    yearlyRevenue,
    totalOrders
  };
};

/**
 * Lấy doanh thu theo khoảng thời gian
 */
const getRevenueByPeriod = async (startDate, endDate) => {
  const revenue = await Order.sum('total', {
    where: {
      orderStatus: 'delivered',
      paymentStatus: 'paid',
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    }
  }) || 0;

  const orders = await Order.count({
    where: {
      orderStatus: 'delivered',
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    }
  });

  return {
    revenue,
    orders,
    startDate,
    endDate
  };
};

/**
 * Lấy doanh thu theo tháng
 */
const getMonthlyRevenue = async (year) => {
  const results = await sequelize.query(`
    SELECT 
      MONTH(createdAt) as month,
      SUM(total) as revenue,
      COUNT(*) as orders
    FROM Orders
    WHERE YEAR(createdAt) = :year
      AND orderStatus = 'delivered'
      AND paymentStatus = 'paid'
    GROUP BY MONTH(createdAt)
    ORDER BY month
  `, {
    replacements: { year },
    type: sequelize.QueryTypes.SELECT
  });

  return results;
};

/**
 * Lấy sản phẩm bán chạy nhất
 */
const getTopProducts = async (limit = 10) => {
  const results = await OrderItem.findAll({
    attributes: [
      'productId',
      [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold'],
      [sequelize.fn('SUM', sequelize.literal('quantity * price')), 'totalRevenue']
    ],
    include: [{
      model: Product,
      as: 'product',
      attributes: ['id', 'name', 'price', 'images']
    }],
    group: ['productId'],
    order: [[sequelize.literal('totalSold'), 'DESC']],
    limit
  });

  return results;
};

/**
 * Lấy doanh thu theo danh mục
 */
const getRevenueByCategory = async () => {
  const results = await sequelize.query(`
    SELECT 
      c.id,
      c.name,
      SUM(oi.quantity * oi.price) as revenue,
      SUM(oi.quantity) as totalSold
    FROM Categories c
    LEFT JOIN Products p ON c.id = p.categoryId
    LEFT JOIN OrderItems oi ON p.id = oi.productId
    LEFT JOIN Orders o ON oi.orderId = o.id
    WHERE o.orderStatus = 'delivered' AND o.paymentStatus = 'paid'
    GROUP BY c.id, c.name
    ORDER BY revenue DESC
  `, {
    type: sequelize.QueryTypes.SELECT
  });

  return results;
};

/**
 * Export báo cáo doanh thu
 */
const exportRevenueReport = async (startDate, endDate) => {
  // TODO: Implement Excel/PDF export
  const data = await getRevenueByPeriod(startDate, endDate);
  return data;
};

module.exports = {
  getRevenueOverview,
  getRevenueByPeriod,
  getMonthlyRevenue,
  getTopProducts,
  getRevenueByCategory,
  exportRevenueReport
};
