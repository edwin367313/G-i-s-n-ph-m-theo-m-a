const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const { validate, createVoucherSchema } = require('../middlewares/validationMiddleware');

// Public/Customer routes
router.get('/available', voucherController.getAvailableVouchers);
router.post('/validate', authMiddleware, voucherController.validateVoucher);

// Admin routes
router.post('/', authMiddleware, adminOnly, validate(createVoucherSchema), voucherController.createVoucher);
router.put('/:id', authMiddleware, adminOnly, voucherController.updateVoucher);
router.delete('/:id', authMiddleware, adminOnly, voucherController.deleteVoucher);

module.exports = router;
