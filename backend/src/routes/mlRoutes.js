const express = require('express');
const router = express.Router();
const mlController = require('../controllers/Nghi_mlController');
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

/**
 * @route   GET /api/ml/product-associations/:productId
 * @desc    Lấy các itemsets liên quan đến 1 sản phẩm (2 & 3 sản phẩm)
 * @access  Admin
 * @params  productId - ID sản phẩm
 * @query   minSupport, minConfidence, minLift
 */
router.get('/product-associations/:productId', mlController.getProductAssociations);

/**
 * @route   GET /api/ml/customer-segments
 * @desc    Lấy danh sách segments với thống kê
 * @access  Admin
 */
router.get('/customer-segments', mlController.getCustomerSegments);

/**
 * @route   GET /api/ml/segment/:segmentId/customers
 * @desc    Lấy danh sách khách hàng trong 1 segment
 * @access  Admin
 * @params  segmentId - Tên segment (VIP, Thường xuyên, Vãng lai)
 */
router.get('/segment/:segmentId/customers', mlController.getSegmentCustomers);

/**
 * @route   GET /api/ml/customer/:customerId/purchase-history
 * @desc    Lấy lịch sử mua hàng của khách (theo category)
 * @access  Admin
 * @params  customerId - ID khách hàng
 */
router.get('/customer/:customerId/purchase-history', mlController.getCustomerPurchaseHistory);

module.exports = router;
