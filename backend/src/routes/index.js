const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
// const categoryRoutes = require('./categoryRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');
const voucherRoutes = require('./voucherRoutes');
const themeRoutes = require('./themeRoutes');
// const revenueRoutes = require('./revenueRoutes');
const uploadRoutes = require('./uploadRoutes');
const analyticsRoutes = require('./analytics');

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
// router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payment', paymentRoutes);
router.use('/vouchers', voucherRoutes);
router.use('/themes', themeRoutes);
// router.use('/revenue', revenueRoutes);
router.use('/upload', uploadRoutes);
router.use('/analytics', analyticsRoutes);

// API info route
router.get('/', (req, res) => {
  res.json({
    message: 'Siêu Thị ABC API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      cart: '/api/cart',
      orders: '/api/orders',
      payment: '/api/payment',
      vouchers: '/api/vouchers',
      themes: '/api/themes',
      analytics: '/api/analytics (Admin only)',
      revenue: '/api/revenue (Admin only)',
      upload: '/api/upload (Admin only)'
    }
  });
});

module.exports = router;
