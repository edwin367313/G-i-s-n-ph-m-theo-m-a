require('dotenv').config();

module.exports = {
  // Momo Payment Gateway Configuration (Mock)
  momo: {
    partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO_PARTNER_CODE_MOCK',
    accessKey: process.env.MOMO_ACCESS_KEY || 'MOMO_ACCESS_KEY_MOCK',
    secretKey: process.env.MOMO_SECRET_KEY || 'MOMO_SECRET_KEY_MOCK',
    redirectUrl: process.env.MOMO_REDIRECT_URL || 'http://localhost:3000/payment/momo/callback',
    ipnUrl: process.env.MOMO_IPN_URL || 'http://localhost:5000/api/payment/momo/ipn',
    requestType: 'captureWallet',
    orderInfo: 'Thanh toán đơn hàng Siêu Thị ABC',
    lang: 'vi',
    autoCapture: true,
    extraData: ''
  },

  // ZaloPay Payment Gateway Configuration (Mock)
  zalopay: {
    appId: process.env.ZALOPAY_APP_ID || '2554',
    key1: process.env.ZALOPAY_KEY1 || 'ZALOPAY_KEY1_MOCK',
    key2: process.env.ZALOPAY_KEY2 || 'ZALOPAY_KEY2_MOCK',
    callbackUrl: process.env.ZALOPAY_CALLBACK_URL || 'http://localhost:5000/api/payment/zalopay/callback',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
    description: 'Siêu Thị ABC - Thanh toán đơn hàng'
  },

  // PayPal Payment Gateway Configuration (Mock)
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || 'PAYPAL_CLIENT_ID_MOCK',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'PAYPAL_CLIENT_SECRET_MOCK',
    mode: process.env.PAYPAL_MODE || 'sandbox',
    returnUrl: process.env.PAYPAL_RETURN_URL || 'http://localhost:3000/payment/paypal/success',
    cancelUrl: process.env.PAYPAL_CANCEL_URL || 'http://localhost:3000/payment/paypal/cancel'
  },

  // Payment processing delay (20 seconds as specified)
  processingDelay: 20000, // 20 seconds in milliseconds

  // Payment status
  status: {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED'
  }
};
