const orderService = require('../services/orderService');
const { successResponse } = require('../utils/helpers');
const { asyncHandler } = require('../middlewares/errorMiddleware');

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.userId, req.body);
  return successResponse(res, { order }, 'Tạo đơn hàng thành công', 201);
});

const getUserOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getUserOrders(req.userId, req.query);
  return successResponse(res, result, 'Lấy danh sách đơn hàng thành công');
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.userId);
  return successResponse(res, { order }, 'Lấy chi tiết đơn hàng thành công');
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id, req.userId);
  return successResponse(res, { order }, 'Hủy đơn hàng thành công');
});

const getAllOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getAllOrders(req.query);
  return successResponse(res, result, 'Lấy danh sách đơn hàng thành công');
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(req.params.id, status);
  return successResponse(res, { order }, 'Cập nhật trạng thái đơn hàng thành công');
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await orderService.updatePaymentStatus(req.params.id, status);
  return successResponse(res, { order }, 'Cập nhật trạng thái thanh toán thành công');
});

const getOrderStatistics = asyncHandler(async (req, res) => {
  const stats = await orderService.getOrderStatistics();
  return successResponse(res, stats, 'Lấy thống kê đơn hàng thành công');
});

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
