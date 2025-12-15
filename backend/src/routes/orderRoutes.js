const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const { validate, createOrderSchema } = require('../middlewares/validationMiddleware');

// Customer routes
router.post('/', authMiddleware, validate(createOrderSchema), orderController.createOrder);
router.get('/my-orders', authMiddleware, orderController.getUserOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);

// Admin routes
router.get('/', authMiddleware, adminOnly, orderController.getAllOrders);
router.put('/:id/status', authMiddleware, adminOnly, orderController.updateOrderStatus);
router.put('/:id/payment-status', authMiddleware, adminOnly, orderController.updatePaymentStatus);
router.get('/statistics/overview', authMiddleware, adminOnly, orderController.getOrderStatistics);

module.exports = router;
