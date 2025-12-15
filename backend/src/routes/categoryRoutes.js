const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin routes
router.post('/', authMiddleware, isAdmin, categoryController.createCategory);
router.put('/:id', authMiddleware, isAdmin, categoryController.updateCategory);
router.delete('/:id', authMiddleware, isAdmin, categoryController.deleteCategory);

module.exports = router;
