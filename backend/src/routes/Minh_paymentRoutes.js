const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/Minh_paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

// Payment creation
router.post('/create', authMiddleware, paymentController.createPayment);

// Payment processing
router.post('/bank-transfer/process', authMiddleware, paymentController.processBankTransferPayment);
router.post('/cod/confirm', authMiddleware, adminOnly, paymentController.confirmCODPayment);

// Payment status
router.get('/:paymentCode/status', authMiddleware, paymentController.getPaymentStatus);

// Refund (Admin only)
router.post('/:paymentCode/refund', authMiddleware, adminOnly, paymentController.refundPayment);

module.exports = router;
