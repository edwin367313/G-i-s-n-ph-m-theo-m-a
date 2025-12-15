const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const User = require('../models/User');
const { generateOrderCode, paginate, calculateTotalPages } = require('../utils/helpers');
const { Op } = require('sequelize');

/**
 * Tạo đơn hàng mới
 */
const createOrder = async (userId, orderData) => {
  const { items, shippingAddress, shippingPhone, shippingName, paymentMethod, voucherCode, note } = orderData;

  // Validate items
  if (!items || items.length === 0) {
    throw new Error('Đơn hàng phải có ít nhất 1 sản phẩm');
  }

  // Tính tổng tiền và kiểm tra tồn kho
  let subtotal = 0;
  for (const item of items) {
    const product = await Product.findByPk(item.productId);
    if (!product) {
      throw new Error(`Sản phẩm ${item.productId} không tồn tại`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Sản phẩm ${product.name} không đủ hàng`);
    }
    subtotal += item.price * item.quantity;
  }

  // Tính phí ship (giả định)
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  // Tạo đơn hàng
  const order = await Order.create({
    userId,
    orderCode: generateOrderCode(),
    subtotal,
    shippingFee,
    discount: 0,
    total,
    shippingAddress,
    shippingPhone,
    shippingName,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'unpaid',
    orderStatus: 'pending',
    voucherCode,
    note
  });

  // Tạo order items và trừ kho
  for (const item of items) {
    await OrderItem.create({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      discountPercent: item.discountPercent || 0
    });

    // Trừ tồn kho
    await Product.decrement('stock', {
      by: item.quantity,
      where: { id: item.productId }
    });
  }

  // Load lại order với items
  return await Order.findByPk(order.id, {
    include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
  });
};

/**
 * Lấy đơn hàng của user
 */
const getUserOrders = async (userId, filters = {}) => {
  const { page = 1, limit = 10, status } = filters;
  const { offset, limit: limitNum } = paginate(page, limit);

  const where = { userId };
  if (status) where.orderStatus = status;

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
    limit: limitNum,
    offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    orders: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: limitNum,
      totalPages: calculateTotalPages(count, limitNum)
    }
  };
};

/**
 * Lấy chi tiết đơn hàng
 */
const getOrderById = async (orderId, userId = null) => {
  const where = { id: orderId };
  if (userId) where.userId = userId;

  const order = await Order.findOne({
    where,
    include: [
      { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
      { model: User, as: 'user', attributes: ['id', 'username', 'email', 'fullName', 'phone'] }
    ]
  });

  if (!order) {
    throw new Error('Đơn hàng không tồn tại');
  }

  return order;
};

/**
 * Hủy đơn hàng
 */
const cancelOrder = async (orderId, userId) => {
  const order = await Order.findOne({ where: { id: orderId, userId } });

  if (!order) {
    throw new Error('Đơn hàng không tồn tại');
  }

  if (!['pending', 'confirmed'].includes(order.orderStatus)) {
    throw new Error('Không thể hủy đơn hàng ở trạng thái hiện tại');
  }

  // Hoàn lại tồn kho
  const items = await OrderItem.findAll({ where: { orderId } });
  for (const item of items) {
    await Product.increment('stock', {
      by: item.quantity,
      where: { id: item.productId }
    });
  }

  await order.update({ orderStatus: 'cancelled' });

  return order;
};

/**
 * Lấy tất cả đơn hàng (Admin)
 */
const getAllOrders = async (filters = {}) => {
  const { page = 1, limit = 20, status, paymentStatus, search } = filters;
  const { offset, limit: limitNum } = paginate(page, limit);

  const where = {};
  if (status) where.orderStatus = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (search) where.orderCode = { [Op.like]: `%${search}%` };

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [
      { model: User, as: 'user', attributes: ['id', 'username', 'fullName', 'phone'] },
      { model: OrderItem, as: 'items' }
    ],
    limit: limitNum,
    offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    orders: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: limitNum,
      totalPages: calculateTotalPages(count, limitNum)
    }
  };
};

/**
 * Cập nhật trạng thái đơn hàng (Admin)
 */
const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByPk(orderId);

  if (!order) {
    throw new Error('Đơn hàng không tồn tại');
  }

  await order.update({ orderStatus: status });

  return order;
};

/**
 * Cập nhật trạng thái thanh toán (Admin)
 */
const updatePaymentStatus = async (orderId, status) => {
  const order = await Order.findByPk(orderId);

  if (!order) {
    throw new Error('Đơn hàng không tồn tại');
  }

  await order.update({ paymentStatus: status });

  return order;
};

/**
 * Thống kê đơn hàng (Admin)
 */
const getOrderStatistics = async () => {
  const total = await Order.count();
  const pending = await Order.count({ where: { orderStatus: 'pending' } });
  const confirmed = await Order.count({ where: { orderStatus: 'confirmed' } });
  const shipping = await Order.count({ where: { orderStatus: 'shipping' } });
  const delivered = await Order.count({ where: { orderStatus: 'delivered' } });
  const cancelled = await Order.count({ where: { orderStatus: 'cancelled' } });

  const totalRevenue = await Order.sum('total', {
    where: { orderStatus: 'delivered', paymentStatus: 'paid' }
  }) || 0;

  return {
    total,
    pending,
    confirmed,
    shipping,
    delivered,
    cancelled,
    totalRevenue
  };
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStatistics
};
