const Payment = require('../models/Minh_Payment');
const Order = require('../models/Order');
const { generatePaymentCode, sleep } = require('../utils/helpers');
const paymentConfig = require('../config/payment');

// Payment processing delay - 20 seconds
const PAYMENT_PROCESSING_DELAY = 20000;

/**
 * Tạo payment cho đơn hàng
 */
const createPayment = async (orderId, paymentMethod) => {
  const order = await Order.findByPk(orderId);

  if (!order) {
    throw new Error('Đơn hàng không tồn tại');
  }

  // Validate payment method
  const validMethods = Object.values(paymentConfig.methods);
  if (!validMethods.includes(paymentMethod)) {
    throw new Error('Phương thức thanh toán không hợp lệ');
  }

  // Tạo payment record
  const payment = await Payment.create({
    orderId,
    paymentCode: generatePaymentCode(),
    paymentMethod,
    amount: order.total,
    status: 'pending',
    transactionId: null
  });

  let paymentData = null;

  // Tạo payment data dựa vào method
  switch (paymentMethod) {
    case 'bank_transfer':
      // Generate QR code info for bank transfer
      const transferContent = paymentConfig.bankTransfer.transferContent
        .replace('[ORDER_CODE]', order.orderCode);
      
      paymentData = {
        bankName: paymentConfig.bankTransfer.bankName,
        accountNumber: paymentConfig.bankTransfer.accountNumber,
        accountName: paymentConfig.bankTransfer.accountName,
        amount: order.total,
        transferContent,
        qrCodeUrl: paymentConfig.bankTransfer.qrCodeUrl,
        note: `Vui lòng chuyển khoản với nội dung: ${transferContent}`
      };
      break;
    case 'cod':
      paymentData = {
        note: 'Thanh toán khi nhận hàng'
      };
      // COD is auto-confirmed
      await payment.update({ status: 'pending_confirmation' });
      break;
    default:
      throw new Error('Phương thức thanh toán không hợp lệ');
  }

  return {
    payment,
    paymentData
  };
};

/**
 * Xử lý thanh toán chuyển khoản ngân hàng
 */
const processBankTransferPayment = async (paymentCode, transactionId = null) => {
  const payment = await Payment.findOne({ where: { paymentCode } });

  if (!payment) {
    throw new Error('Thanh toán không tồn tại');
  }

  if (payment.paymentMethod !== 'bank_transfer') {
    throw new Error('Phương thức thanh toán không đúng');
  }

  // Simulate 20 seconds processing (checking bank transaction)
  await sleep(PAYMENT_PROCESSING_DELAY);

  // Simulate 90% success rate
  const success = Math.random() < 0.9;
  const finalTransactionId = transactionId || `BANK_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Update payment status
  await payment.update({
    status: success ? 'success' : 'failed',
    transactionId: success ? finalTransactionId : null,
    responseData: {
      success,
      transactionId: finalTransactionId,
      timestamp: new Date().toISOString(),
      message: success ? 'Đã xác nhận chuyển khoản thành công' : 'Không tìm thấy giao dịch chuyển khoản'
    }
  });

  // Update order payment status
  if (success) {
    await Order.update(
      { paymentStatus: 'paid', orderStatus: 'confirmed' },
      { where: { id: payment.orderId } }
    );
  }

  return {
    success,
    message: success ? 'Thanh toán thành công' : 'Thanh toán thất bại',
    payment
  };
};

/**
 * Xác nhận thanh toán COD (Admin only)
 */
const confirmCODPayment = async (paymentCode) => {
  const payment = await Payment.findOne({ where: { paymentCode } });

  if (!payment) {
    throw new Error('Thanh toán không tồn tại');
  }

  if (payment.paymentMethod !== 'cod') {
    throw new Error('Phương thức thanh toán không đúng');
  }

  await payment.update({
    status: 'success',
    transactionId: `COD_${Date.now()}`,
    responseData: {
      confirmedAt: new Date().toISOString(),
      message: 'Đã nhận tiền COD'
    }
  });

  await Order.update(
    { paymentStatus: 'paid' },
    { where: { id: payment.orderId } }
  );

  return {
    success: true,
    message: 'Xác nhận thanh toán COD thành công',
    payment
  };
};

/**
 * Lấy trạng thái thanh toán
 */
const getPaymentStatus = async (paymentCode) => {
  const payment = await Payment.findOne({
    where: { paymentCode },
    include: [{ model: Order, as: 'order' }]
  });

  if (!payment) {
    throw new Error('Thanh toán không tồn tại');
  }

  return payment;
};

/**
 * Hoàn tiền
 */
const refundPayment = async (paymentCode) => {
  const payment = await Payment.findOne({ where: { paymentCode } });

  if (!payment) {
    throw new Error('Thanh toán không tồn tại');
  }

  if (payment.status !== 'success') {
    throw new Error('Chỉ có thể hoàn tiền cho thanh toán thành công');
  }

  await payment.update({ 
    status: 'refunded',
    responseData: {
      ...payment.responseData,
      refundedAt: new Date().toISOString()
    }
  });

  await Order.update(
    { paymentStatus: 'refunded', orderStatus: 'cancelled' },
    { where: { id: payment.orderId } }
  );

  return payment;
};

module.exports = {
  createPayment,
  processBankTransferPayment,
  confirmCODPayment,
  getPaymentStatus,
  refundPayment
};
