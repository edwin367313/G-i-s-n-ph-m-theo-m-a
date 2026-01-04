const express = require('express');
const router = express.Router();
const mlController = require('../controllers/mlController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

// Tất cả ML routes cần quyền admin
router.use(authMiddleware, adminOnly);

/**
 * @route   GET /api/ml/market-basket
 * @desc    Phân tích giỏ hàng (Apriori)
 * @access  Admin
 * @query   minSupport, minConfidence, limit
 */
router.get('/market-basket', mlController.marketBasketAnalysis);

/**
 * @route   POST /api/ml/segment-customers
 * @desc    Phân khúc khách hàng (K-Means)
 * @access  Admin
 * @body    { nClusters: 3 }
 */
router.post('/segment-customers', mlController.customerSegmentation);

/**
 * @route   POST /api/ml/train-classifier
 * @desc    Huấn luyện Decision Tree
 * @access  Admin
 * @body    { maxDepth: 5 }
 */
router.post('/train-classifier', mlController.trainDecisionTree);

/**
 * @route   POST /api/ml/predict-customer
 * @desc    Dự đoán loại khách hàng
 * @access  Admin
 * @body    { recency, frequency, monetary, accountAge, hasPhone, hasAddress }
 */
router.post('/predict-customer', mlController.predictCustomerType);

/**
 * @route   POST /api/ml/run-pipeline
 * @desc    Chạy toàn bộ pipeline ML
 * @access  Admin
 */
router.post('/run-pipeline', mlController.runFullPipeline);

module.exports = router;
