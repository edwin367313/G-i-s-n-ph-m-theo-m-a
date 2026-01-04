require('dotenv').config();

module.exports = {
  // Bank Transfer QR Configuration
  bankTransfer: {
    bankName: process.env.BANK_NAME || 'VietQR',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || '**********313',
    accountName: process.env.BANK_ACCOUNT_NAME || 'BÙI QUANG NGHỊ',
    qrCodeUrl: process.env.BANK_QR_CODE_URL || '/qr-codes/payment-qr.png',
    transferContent: 'SIEUTHIABC [ORDER_CODE]',
    supportedApps: ['MoMo', 'VietQR', 'Napas 247'],
    note: 'Quét mã QR để thanh toán qua ứng dụng MoMo, VietQR hoặc Napas 247'
  },

  
  processingDelay: 2000, 

  // Payment methods
  methods: {
    COD: 'cod',              // Cash on Delivery (Offline)
    BANK_TRANSFER: 'bank_transfer'  // Online Bank Transfer with QR
  },

  // Payment status
  status: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SUCCESS: 'success',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  }
};
