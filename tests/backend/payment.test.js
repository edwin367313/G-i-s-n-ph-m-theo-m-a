const request = require('supertest');

const app = require('../../backend/src/app');

describe('Payment API Tests', () => {
  let authToken;
  let testOrderId;
  let testPaymentId;

  beforeAll(async () => {
    // Login as customer
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nguyenvanan@gmail.com',
        password: '123456'
      });
    authToken = res.body.data.token;

    // Create a test order first
    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        items: [
          { product_id: 1, quantity: 2 },
          { product_id: 2, quantity: 1 }
        ],
        shipping_address: '123 Test Street, Hanoi',
        customer_name: 'Nguyen Van A',
        customer_phone: '0901234567',
        payment_method: 'momo'
      });
    testOrderId = orderRes.body.data.id;
  });

  describe('POST /api/payments/create', () => {
    it('should create payment for order', async () => {
      const res = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          order_id: testOrderId,
          payment_method: 'momo'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('payment_code');
      expect(res.body.data).toHaveProperty('payUrl');
      testPaymentId = res.body.data.id;
    });

    it('should fail with invalid order', async () => {
      const res = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          order_id: 99999,
          payment_method: 'momo'
        })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/payments/create')
        .send({
          order_id: testOrderId,
          payment_method: 'momo'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/payments/momo/callback', () => {
    it('should handle MoMo callback successfully', async () => {
      const callbackData = {
        orderId: `ORDER_${testOrderId}`,
        resultCode: 0,
        message: 'Success',
        transId: '123456789',
        amount: 100000
      };

      const res = await request(app)
        .post('/api/payments/momo/callback')
        .send(callbackData)
        .expect(200);

      expect(res.body.resultCode).toBe(0);
    });

    it('should handle failed payment callback', async () => {
      const callbackData = {
        orderId: `ORDER_${testOrderId}`,
        resultCode: 1,
        message: 'Failed',
        transId: '123456790'
      };

      const res = await request(app)
        .post('/api/payments/momo/callback')
        .send(callbackData)
        .expect(200);

      expect(res.body.resultCode).toBe(0);
    });
  });

  describe('POST /api/payments/zalopay/callback', () => {
    it('should handle ZaloPay callback successfully', async () => {
      const callbackData = {
        data: JSON.stringify({
          app_trans_id: `ORDER_${testOrderId}`,
          status: 1,
          amount: 100000
        }),
        mac: 'dummy-mac'
      };

      const res = await request(app)
        .post('/api/payments/zalopay/callback')
        .send(callbackData)
        .expect(200);

      expect(res.body).toHaveProperty('return_code');
    });
  });

  describe('GET /api/payments/:id', () => {
    it('should get payment by id', async () => {
      const res = await request(app)
        .get(`/api/payments/${testPaymentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('payment_code');
      expect(res.body.data).toHaveProperty('status');
    });

    it('should fail to get other user payment', async () => {
      // Login as different user
      const otherRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'tranthib@gmail.com',
          password: '123456'
        });
      const otherToken = otherRes.body.data.token;

      const res = await request(app)
        .get(`/api/payments/${testPaymentId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/payments/order/:orderId', () => {
    it('should get payments for order', async () => {
      const res = await request(app)
        .get(`/api/payments/order/${testOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/payments/:id/verify', () => {
    it('should verify payment status', async () => {
      const res = await request(app)
        .post(`/api/payments/${testPaymentId}/verify`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status');
    });
  });

  describe('POST /api/payments/:id/refund', () => {
    it('should fail to refund unpaid payment', async () => {
      const res = await request(app)
        .post(`/api/payments/${testPaymentId}/refund`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Payment Methods', () => {
    it('should create MoMo payment', async () => {
      const res = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          order_id: testOrderId,
          payment_method: 'momo'
        })
        .expect(200);

      expect(res.body.data.gateway).toBe('momo');
    });

    it('should create ZaloPay payment', async () => {
      const res = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          order_id: testOrderId,
          payment_method: 'zalopay'
        })
        .expect(200);

      expect(res.body.data.gateway).toBe('zalopay');
    });

    it('should create PayPal payment', async () => {
      const res = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          order_id: testOrderId,
          payment_method: 'paypal'
        })
        .expect(200);

      expect(res.body.data.gateway).toBe('paypal');
    });

    it('should create COD payment', async () => {
      const res = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          order_id: testOrderId,
          payment_method: 'cod'
        })
        .expect(200);

      expect(res.body.data.gateway).toBe('cod');
      expect(res.body.data.status).toBe('pending');
    });
  });
});
