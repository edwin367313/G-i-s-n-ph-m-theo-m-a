const paymentService = require('../services/paymentService');
const { successResponse } = require('../utils/helpers');
const { asyncHandler } = require('../middlewares/errorMiddleware');

const createPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod } = req.body;
  const result = await paymentService.createPayment(orderId, paymentMethod);
  return successResponse(res, result, 'Tạo thanh toán thành công', 201);
});

const processBankTransferPayment = asyncHandler(async (req, res) => {
  const { paymentCode, transactionId } = req.body;
  const result = await paymentService.processBankTransferPayment(paymentCode, transactionId);
  return successResponse(res, result, result.message);
});

const confirmCODPayment = asyncHandler(async (req, res) => {
  const { paymentCode } = req.body;
  const result = await paymentService.confirmCODPayment(paymentCode);
  return successResponse(res, result, result.message);
});

const getPaymentStatus = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentStatus(req.params.paymentCode);
  return successResponse(res, { payment }, 'Lấy trạng thái thanh toán thành công');
});

const refundPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.refundPayment(req.params.paymentCode);
  return successResponse(res, { payment }, 'Hoàn tiền thành công');
});

module.exports = {
  createPayment,
  processBankTransferPayment,
  confirmCODPayment,
  getPaymentStatus,
  refundPayment
};
