const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, optionalAuth } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const { validate, createProductSchema, updateProductSchema } = require('../middlewares/validationMiddleware');

// Public routes
router.get('/', optionalAuth, productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', authMiddleware, adminOnly, validate(createProductSchema), productController.createProduct);
router.put('/:id', authMiddleware, adminOnly, validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', authMiddleware, adminOnly, productController.deleteProduct);

module.exports = router;
