const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const { uploadSingle, uploadMultiple } = require('../middlewares/uploadMiddleware');

// All upload routes require admin access
router.use(authMiddleware, adminOnly);

router.post('/single', uploadSingle('image'), uploadController.uploadSingleImage);
router.post('/multiple', uploadMultiple('images', 10), uploadController.uploadMultipleImages);

module.exports = router;
