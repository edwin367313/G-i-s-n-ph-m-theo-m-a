const voucherService = require('../services/voucherService');
const { successResponse } = require('../utils/helpers');
const { asyncHandler } = require('../middlewares/errorMiddleware');

const getAvailableVouchers = asyncHandler(async (req, res) => {
  const vouchers = await voucherService.getAvailableVouchers();
  return successResponse(res, { vouchers }, 'Lấy danh sách voucher thành công');
});

const validateVoucher = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;
  const result = await voucherService.validateVoucher(code, orderTotal);
  return successResponse(res, result, 'Voucher hợp lệ');
});

const createVoucher = asyncHandler(async (req, res) => {
  const voucher = await voucherService.createVoucher(req.body);
  return successResponse(res, { voucher }, 'Tạo voucher thành công', 201);
});

const updateVoucher = asyncHandler(async (req, res) => {
  const voucher = await voucherService.updateVoucher(req.params.id, req.body);
  return successResponse(res, { voucher }, 'Cập nhật voucher thành công');
});

const deleteVoucher = asyncHandler(async (req, res) => {
  await voucherService.deleteVoucher(req.params.id);
  return successResponse(res, null, 'Xóa voucher thành công');
});

module.exports = {
  getAvailableVouchers,
  validateVoucher,
  createVoucher,
  updateVoucher,
  deleteVoucher
};
