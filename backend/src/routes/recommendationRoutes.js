const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { authMiddleware, optionalAuth } = require('../middlewares/authMiddleware');

/**
 * Public routes - Recommendations APIs
 */

// Lấy thông tin mùa hiện tại
router.get('/current-season-info', recommendationController.getCurrentSeasonInfo);

// Lấy sản phẩm hot của mùa hiện tại
router.get('/current-season', recommendationController.getCurrentSeasonProducts);

// Lấy sản phẩm hot theo mùa cụ thể
router.get('/seasonal/:season', recommendationController.getSeasonalProducts);

// Lấy gợi ý sản phẩm dựa trên sản phẩm đã chọn
router.get('/suggest/:productName', recommendationController.getProductSuggestions);

// Lấy gợi ý cho giỏ hàng (cần body với items)
router.post('/cart', optionalAuth, recommendationController.getCartRecommendations);

// Lấy báo cáo theo 4 mùa
router.get('/quarterly-report', recommendationController.getQuarterlyReport);

// Lấy top association rules (cho admin analysis)
router.get('/associations', recommendationController.getTopAssociations);

module.exports = router;
