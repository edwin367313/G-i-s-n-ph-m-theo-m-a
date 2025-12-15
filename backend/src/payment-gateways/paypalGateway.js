const crypto = require('crypto');
const paymentConfig = require('../config/payment');

/**
 * PayPal Payment Gateway (Mock Implementation)
 * Simulates PayPal payment flow with 20 second processing delay
 */
class PaypalGateway {
  /**
   * Create payment
   */
  static async createPayment(paymentData) {
    try {
      const {
        orderId,
        amount,
        currency = 'USD',
        description = 'Siêu Thị ABC Order Payment',
        returnUrl,
        cancelUrl
      } = paymentData;
      
      const { paypal } = paymentConfig;
      
      // Convert VND to USD (mock rate: 1 USD = 24000 VND)
      const usdAmount = (amount / 24000).toFixed(2);
      
      // Generate payment ID
      const paymentId = `PAY_${Date.now()}`;
      const token = crypto.randomBytes(20).toString('hex');
      
      // Mock PayPal payment object
      const payment = {
        id: paymentId,
        intent: 'sale',
        state: 'created',
        payer: {
          payment_method: 'paypal'
        },
        transactions: [
          {
            amount: {
              total: usdAmount,
              currency: currency,
              details: {
                subtotal: usdAmount,
                tax: '0.00',
                shipping: '0.00'
              }
            },
            description,
            custom: orderId.toString(),
            invoice_number: `INV_${orderId}_${Date.now()}`,
            payment_options: {
              allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
            },
            item_list: {
              items: []
            }
          }
        ],
        redirect_urls: {
          return_url: returnUrl || paypal.returnUrl,
          cancel_url: cancelUrl || paypal.cancelUrl
        },
        create_time: new Date().toISOString(),
        links: [
          {
            href: `http://localhost:3000/payment/paypal/process?paymentId=${paymentId}&token=${token}`,
            rel: 'approval_url',
            method: 'REDIRECT'
          },
          {
            href: `http://localhost:5000/api/payment/paypal/execute`,
            rel: 'execute',
            method: 'POST'
          }
        ]
      };
      
      return {
        success: true,
        message: 'Payment created successfully',
        data: {
          paymentId: payment.id,
          approvalUrl: payment.links[0].href,
          token,
          amount: usdAmount,
          currency,
          status: 'CREATED'
        }
      };
    } catch (error) {
      throw new Error(`PayPal payment creation error: ${error.message}`);
    }
  }

  /**
   * Execute/Process payment (Mock - simulates 20s delay)
   */
  static async executePayment(paymentData) {
    return new Promise((resolve) => {
      const { paymentId, payerId, token } = paymentData;
      
      // Simulate 20 second processing delay
      setTimeout(() => {
        const isSuccess = Math.random() > 0.1; // 90% success rate
        const saleId = `SALE_${Date.now()}`;
        
        const result = {
          id: paymentId,
          intent: 'sale',
          state: isSuccess ? 'approved' : 'failed',
          cart: `EC_${token}`,
          payer: {
            payment_method: 'paypal',
            status: 'VERIFIED',
            payer_info: {
              email: 'buyer@example.com',
              first_name: 'Test',
              last_name: 'Buyer',
              payer_id: payerId,
              country_code: 'US'
            }
          },
          transactions: [
            {
              related_resources: [
                {
                  sale: {
                    id: saleId,
                    state: isSuccess ? 'completed' : 'denied',
                    amount: {
                      total: '0.00',
                      currency: 'USD'
                    },
                    payment_mode: 'INSTANT_TRANSFER',
                    protection_eligibility: 'ELIGIBLE',
                    transaction_fee: {
                      value: '0.00',
                      currency: 'USD'
                    },
                    create_time: new Date().toISOString(),
                    update_time: new Date().toISOString()
                  }
                }
              ]
            }
          ],
          create_time: new Date().toISOString(),
          update_time: new Date().toISOString(),
          status: isSuccess ? 'SUCCESS' : 'FAILED'
        };
        
        resolve(result);
      }, paymentConfig.processingDelay); // 20 seconds
    });
  }

  /**
   * Get payment details
   */
  static async getPaymentDetails(paymentId) {
    try {
      // Mock payment details
      return {
        id: paymentId,
        intent: 'sale',
        state: 'approved',
        cart: `EC_${crypto.randomBytes(10).toString('hex')}`,
        create_time: new Date().toISOString(),
        update_time: new Date().toISOString(),
        transactions: [
          {
            amount: {
              total: '0.00',
              currency: 'USD'
            },
            description: 'Siêu Thị ABC Order Payment',
            related_resources: [
              {
                sale: {
                  id: `SALE_${Date.now()}`,
                  state: 'completed',
                  create_time: new Date().toISOString()
                }
              }
            ]
          }
        ],
        status: 'COMPLETED'
      };
    } catch (error) {
      throw new Error(`PayPal get payment error: ${error.message}`);
    }
  }

  /**
   * Refund payment (Mock)
   */
  static async refundPayment(refundData) {
    try {
      const { saleId, amount, currency = 'USD' } = refundData;
      
      const refundId = `REFUND_${Date.now()}`;
      
      return {
        id: refundId,
        state: 'completed',
        amount: {
          total: amount,
          currency
        },
        sale_id: saleId,
        parent_payment: `PAY_${Date.now()}`,
        create_time: new Date().toISOString(),
        update_time: new Date().toISOString(),
        status: 'REFUNDED',
        success: true,
        message: 'Refund completed successfully'
      };
    } catch (error) {
      throw new Error(`PayPal refund error: ${error.message}`);
    }
  }

  /**
   * Cancel payment
   */
  static async cancelPayment(paymentId) {
    try {
      return {
        success: true,
        message: 'Payment cancelled successfully',
        paymentId,
        status: 'CANCELLED'
      };
    } catch (error) {
      throw new Error(`PayPal cancel error: ${error.message}`);
    }
  }

  /**
   * Verify webhook signature (Mock)
   */
  static verifyWebhookSignature(headers, body) {
    try {
      // Mock verification - always true in development
      return true;
    } catch (error) {
      console.error('Webhook verification error:', error);
      return false;
    }
  }

  /**
   * Handle webhook event
   */
  static async handleWebhook(webhookData) {
    try {
      const { event_type, resource } = webhookData;
      
      return {
        success: true,
        event_type,
        resource_id: resource.id,
        status: resource.state || resource.status
      };
    } catch (error) {
      throw new Error(`PayPal webhook error: ${error.message}`);
    }
  }
}

module.exports = PaypalGateway;
