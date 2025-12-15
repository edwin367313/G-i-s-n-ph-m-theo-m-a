const crypto = require('crypto');
const moment = require('moment');
const paymentConfig = require('../config/payment');

/**
 * ZaloPay Payment Gateway (Mock Implementation)
 * Simulates ZaloPay payment flow with 20 second processing delay
 */
class ZaloPayGateway {
  /**
   * Create payment order
   */
  static async createOrder(orderData) {
    try {
      const {
        orderId,
        amount,
        description = 'Thanh toán đơn hàng Siêu Thị ABC',
        callbackUrl
      } = orderData;
      
      const { zalopay } = paymentConfig;
      
      // Generate app trans ID
      const appTransId = `${moment().format('YYMMDD')}_${orderId}_${Date.now()}`;
      const appTime = Date.now();
      const embedData = JSON.stringify({
        redirecturl: 'http://localhost:3000/payment/zalopay/callback'
      });
      
      // Create HMAC signature
      const data = `${zalopay.appId}|${appTransId}|${amount}|${description}|${appTime}|${embedData}|`;
      const mac = crypto
        .createHmac('sha256', zalopay.key1)
        .update(data)
        .digest('hex');
      
      // Mock payment URL
      const orderUrl = `http://localhost:3000/payment/zalopay/process?app_trans_id=${appTransId}&amount=${amount}`;
      
      const orderInfo = {
        app_id: zalopay.appId,
        app_trans_id: appTransId,
        app_user: `user_${orderId}`,
        app_time: appTime,
        amount,
        description,
        item: JSON.stringify([]),
        embed_data: embedData,
        callback_url: callbackUrl || zalopay.callbackUrl,
        mac,
        order_url: orderUrl,
        zp_trans_token: `TOKEN_${Date.now()}`,
        qr_code: `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(orderUrl)}`,
        return_code: 1,
        return_message: 'success',
        sub_return_code: 1,
        sub_return_message: 'success',
        status: 'PENDING'
      };
      
      return {
        success: true,
        message: 'Order created successfully',
        data: orderInfo
      };
    } catch (error) {
      throw new Error(`ZaloPay order creation error: ${error.message}`);
    }
  }

  /**
   * Process payment (Mock - simulates 20s delay)
   */
  static async processPayment(paymentData) {
    return new Promise((resolve) => {
      const { appTransId, amount } = paymentData;
      
      // Simulate 20 second processing delay
      setTimeout(() => {
        const zpTransId = Date.now();
        const isSuccess = Math.random() > 0.1; // 90% success rate
        
        const result = {
          app_trans_id: appTransId,
          zp_trans_id: zpTransId,
          amount,
          return_code: isSuccess ? 1 : 2,
          return_message: isSuccess ? 'Giao dịch thành công' : 'Giao dịch thất bại',
          server_time: Date.now(),
          status: isSuccess ? 'SUCCESS' : 'FAILED',
          sub_return_code: isSuccess ? 1 : -1,
          sub_return_message: isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'
        };
        
        resolve(result);
      }, paymentConfig.processingDelay); // 20 seconds
    });
  }

  /**
   * Handle callback from ZaloPay
   */
  static async handleCallback(callbackData) {
    try {
      const { data: dataStr, mac } = callbackData;
      
      // Verify MAC
      const expectedMac = crypto
        .createHmac('sha256', paymentConfig.zalopay.key2)
        .update(dataStr)
        .digest('hex');
      
      // Mock verification - always true in development
      const isValid = true; // In production: mac === expectedMac
      
      if (!isValid) {
        return {
          return_code: -1,
          return_message: 'mac not equal'
        };
      }
      
      // Parse callback data
      const data = JSON.parse(dataStr);
      
      return {
        return_code: 1,
        return_message: 'success',
        data: {
          app_trans_id: data.app_trans_id,
          zp_trans_id: data.zp_trans_id,
          amount: data.amount,
          status: 'SUCCESS'
        }
      };
    } catch (error) {
      throw new Error(`ZaloPay callback error: ${error.message}`);
    }
  }

  /**
   * Query order status
   */
  static async queryOrderStatus(appTransId) {
    try {
      const { zalopay } = paymentConfig;
      const data = `${zalopay.appId}|${appTransId}|${zalopay.key1}`;
      const mac = crypto
        .createHmac('sha256', zalopay.key1)
        .update(data)
        .digest('hex');
      
      // Mock query response
      return {
        return_code: 1,
        return_message: 'Giao dịch thành công',
        is_processing: false,
        amount: 0,
        zp_trans_id: Date.now(),
        server_time: Date.now(),
        discount_amount: 0,
        status: 'SUCCESS'
      };
    } catch (error) {
      throw new Error(`ZaloPay query error: ${error.message}`);
    }
  }

  
  static async refundOrder(refundData) {
    try {
      const { zpTransId, amount, description } = refundData;
      const { zalopay } = paymentConfig;
      
      const mRefundId = `${moment().format('YYMMDD')}_${zalopay.appId}_${Date.now()}`;
      const timestamp = Date.now();
      
      const data = `${zalopay.appId}|${zpTransId}|${amount}|${description}|${timestamp}`;
      const mac = crypto
        .createHmac('sha256', zalopay.key1)
        .update(data)
        .digest('hex');
      
      return {
        return_code: 1,
        return_message: 'Hoàn tiền thành công',
        m_refund_id: mRefundId,
        refund_id: `REFUND_${Date.now()}`,
        status: 'REFUNDED'
      };
    } catch (error) {
      throw new Error(`ZaloPay refund error: ${error.message}`);
    }
  }

  static generateQRCode(orderUrl) {
    return `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(orderUrl)}`;
  }
}

module.exports = ZaloPayGateway;
