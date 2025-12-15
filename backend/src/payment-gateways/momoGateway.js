const crypto = require('crypto');
const paymentConfig = require('../config/payment');

/**
 * Momo Payment Gateway (Mock Implementation)
 * Simulates Momo payment flow with 20 second processing delay
 */
class MomoGateway {
  /**
   * Create payment request
   */
  static async createPayment(orderData) {
    try {
      const {
        orderId,
        amount,
        orderInfo = 'Thanh toán đơn hàng Siêu Thị ABC',
        redirectUrl,
        ipnUrl
      } = orderData;
      
      const { momo } = paymentConfig;
      
      // Generate request ID and order ID
      const requestId = `MOMO_${Date.now()}`;
      const momoOrderId = `ORDER_${orderId}_${Date.now()}`;
      
      // Create signature (Mock)
      const rawSignature = `accessKey=${momo.accessKey}&amount=${amount}&extraData=${momo.extraData}&ipnUrl=${ipnUrl || momo.ipnUrl}&orderId=${momoOrderId}&orderInfo=${orderInfo}&partnerCode=${momo.partnerCode}&redirectUrl=${redirectUrl || momo.redirectUrl}&requestId=${requestId}&requestType=${momo.requestType}`;
      
      const signature = crypto
        .createHmac('sha256', momo.secretKey)
        .update(rawSignature)
        .digest('hex');
      
      // Mock payment URL (would redirect to actual Momo in production)
      const payUrl = `http://localhost:3000/payment/momo/process?orderId=${momoOrderId}&requestId=${requestId}&amount=${amount}`;
      
      // Store payment info (in production, this would be in database)
      const paymentInfo = {
        partnerCode: momo.partnerCode,
        requestId,
        orderId: momoOrderId,
        amount,
        orderInfo,
        redirectUrl: redirectUrl || momo.redirectUrl,
        ipnUrl: ipnUrl || momo.ipnUrl,
        requestType: momo.requestType,
        signature,
        lang: momo.lang,
        payUrl,
        deeplink: `momo://app?action=pay&orderId=${momoOrderId}`,
        qrCodeUrl: `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(payUrl)}`,
        createdAt: new Date(),
        status: 'PENDING'
      };
      
      return {
        success: true,
        message: 'Payment request created successfully',
        data: paymentInfo
      };
    } catch (error) {
      throw new Error(`Momo payment creation error: ${error.message}`);
    }
  }

  /**
   * Process payment (Mock - simulates 20s delay)
   */
  static async processPayment(paymentData) {
    return new Promise((resolve) => {
      const { orderId, requestId, amount } = paymentData;
      
      // Simulate 20 second processing delay as specified
      setTimeout(() => {
        // Generate mock transaction ID
        const transId = `MOMO_TRANS_${Date.now()}`;
        
        // Mock successful payment (90% success rate)
        const isSuccess = Math.random() > 0.1;
        
        const result = {
          partnerCode: paymentConfig.momo.partnerCode,
          requestId,
          orderId,
          transId,
          amount,
          resultCode: isSuccess ? 0 : 1,
          message: isSuccess ? 'Giao dịch thành công' : 'Giao dịch thất bại',
          responseTime: new Date().toISOString(),
          payType: 'qr',
          signature: crypto.randomBytes(32).toString('hex'),
          status: isSuccess ? 'SUCCESS' : 'FAILED'
        };
        
        resolve(result);
      }, paymentConfig.processingDelay); // 20 seconds
    });
  }

  /**
   * Verify payment signature
   */
  static verifySignature(data, signature) {
    try {
      const {
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        responseTime
      } = data;
      
      const rawSignature = `accessKey=${paymentConfig.momo.accessKey}&amount=${amount}&extraData=${paymentConfig.momo.extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
      
      const expectedSignature = crypto
        .createHmac('sha256', paymentConfig.momo.secretKey)
        .update(rawSignature)
        .digest('hex');
      
      return signature === expectedSignature;
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  /**
   * Handle IPN callback
   */
  static async handleCallback(callbackData) {
    try {
      const { orderId, resultCode, message, transId, signature } = callbackData;
      
      // Verify signature (mock verification)
      const isValid = true; // In production: this.verifySignature(callbackData, signature);
      
      if (!isValid) {
        return {
          success: false,
          message: 'Invalid signature'
        };
      }
      
      return {
        success: resultCode === 0,
        message,
        transId,
        orderId,
        status: resultCode === 0 ? 'SUCCESS' : 'FAILED'
      };
    } catch (error) {
      throw new Error(`Momo callback handling error: ${error.message}`);
    }
  }

  /**
   * Query payment status
   */
  static async queryPaymentStatus(orderId, requestId) {
    try {
      // Mock query implementation
      return {
        partnerCode: paymentConfig.momo.partnerCode,
        requestId,
        orderId,
        resultCode: 0,
        message: 'Giao dịch thành công',
        responseTime: new Date().toISOString(),
        status: 'SUCCESS'
      };
    } catch (error) {
      throw new Error(`Momo query error: ${error.message}`);
    }
  }

  /**
   * Refund payment (Mock)
   */
  static async refundPayment(refundData) {
    try {
      const { orderId, amount, transId, description } = refundData;
      
      return {
        success: true,
        message: 'Hoàn tiền thành công',
        orderId,
        transId,
        refundId: `REFUND_${Date.now()}`,
        amount,
        status: 'REFUNDED'
      };
    } catch (error) {
      throw new Error(`Momo refund error: ${error.message}`);
    }
  }
}

module.exports = MomoGateway;
