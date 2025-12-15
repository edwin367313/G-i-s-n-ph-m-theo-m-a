const Voucher = require('../models/Voucher');
const { Op } = require('sequelize');
const { generateVoucherCode, paginate, calculateTotalPages } = require('../utils/helpers');

/**
 * Lấy danh sách voucher khả dụng
 */
const getAvailableVouchers = async () => {
  const now = new Date();

  const vouchers = await Voucher.findAll({
    where: {
      status: 'active',
      startDate: { [Op.lte]: now },
      endDate: { [Op.gte]: now },
      [Op.or]: [
        { usageLimit: null },
        { usedCount: { [Op.lt]: sequelize.col('usageLimit') } }
      ]
    },
    order: [['discountValue', 'DESC']]
  });

  return vouchers;
};

/**
 * Validate voucher
 */
const validateVoucher = async (code, orderTotal) => {
  const voucher = await Voucher.findOne({ where: { code } });

  if (!voucher) {
    throw new Error('Mã voucher không tồn tại');
  }

  if (voucher.status !== 'active') {
    throw new Error('Mã voucher không còn hiệu lực');
  }

  const now = new Date();
  if (now < voucher.startDate || now > voucher.endDate) {
    throw new Error('Mã voucher đã hết hạn hoặc chưa đến thời gian sử dụng');
  }

  if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
    throw new Error('Mã voucher đã hết lượt sử dụng');
  }

  if (orderTotal < voucher.minOrderValue) {
    throw new Error(`Đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString()}đ`);
  }

  // Tính số tiền giảm
  let discountAmount = 0;
  if (voucher.discountType === 'percent') {
    discountAmount = (orderTotal * voucher.discountValue) / 100;
    if (voucher.maxDiscountAmount && discountAmount > voucher.maxDiscountAmount) {
      discountAmount = voucher.maxDiscountAmount;
    }
  } else {
    discountAmount = voucher.discountValue;
  }

  return {
    voucher,
    discountAmount
  };
};

/**
 * Tạo voucher (Admin)
 */
const createVoucher = async (voucherData) => {
  const { code } = voucherData;

  const existing = await Voucher.findOne({ where: { code } });
  if (existing) {
    throw new Error('Mã voucher đã tồn tại');
  }

  const voucher = await Voucher.create({
    ...voucherData,
    usedCount: 0
  });

  return voucher;
};

/**
 * Cập nhật voucher (Admin)
 */
const updateVoucher = async (voucherId, updateData) => {
  const voucher = await Voucher.findByPk(voucherId);

  if (!voucher) {
    throw new Error('Voucher không tồn tại');
  }

  await voucher.update(updateData);

  return voucher;
};

/**
 * Xóa voucher (Admin)
 */
const deleteVoucher = async (voucherId) => {
  const voucher = await Voucher.findByPk(voucherId);

  if (!voucher) {
    throw new Error('Voucher không tồn tại');
  }

  await voucher.destroy();

  return true;
};

/**
 * Tăng số lần sử dụng voucher
 */
const incrementVoucherUsage = async (code) => {
  await Voucher.increment('usedCount', { where: { code } });
};

module.exports = {
  getAvailableVouchers,
  validateVoucher,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  incrementVoucherUsage
};
