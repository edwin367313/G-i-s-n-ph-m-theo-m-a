const recommendationService = require('../services/recommendationService');
const { successResponse } = require('../utils/helpers');
const { asyncHandler } = require('../middlewares/errorMiddleware');

/**
 * Lấy sản phẩm hot theo mùa
 * GET /api/recommendations/seasonal/:season?limit=20
 */
const getSeasonalProducts = asyncHandler(async (req, res) => {
  const { season } = req.params;
  const limit = parseInt(req.query.limit) || 20;
  
  // Validate season
  const validSeasons = ['Xuân', 'Hạ', 'Thu', 'Đông'];
  if (!validSeasons.includes(season)) {
    return res.status(400).json({
      success: false,
      message: `Mùa không hợp lệ. Chọn một trong: ${validSeasons.join(', ')}`
    });
  }
  
  const products = await recommendationService.getSeasonalProducts(season, limit);
  
  return successResponse(res, {
    season,
    count: products.length,
    products
  }, `Lấy sản phẩm mùa ${season} thành công`);
});

/**
 * Lấy sản phẩm hot của mùa hiện tại
 * GET /api/recommendations/current-season?limit=20
 */
const getCurrentSeasonProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const currentSeason = recommendationService.getCurrentSeason();
  
  const products = await recommendationService.getSeasonalProducts(currentSeason, limit);
  
  return successResponse(res, {
    season: currentSeason,
    count: products.length,
    products
  }, `Lấy sản phẩm mùa ${currentSeason} thành công`);
});

/**
 * Lấy gợi ý sản phẩm dựa trên sản phẩm đã chọn
 * GET /api/recommendations/suggest/:productName?season=Xuân&limit=5
 */
const getProductSuggestions = asyncHandler(async (req, res) => {
  const { productName } = req.params;
  const season = req.query.season || null;
  const limit = parseInt(req.query.limit) || 5;
  
  const suggestions = await recommendationService.getProductSuggestions(
    productName, 
    season, 
    limit
  );
  
  return successResponse(res, {
    baseProduct: productName,
    season: season || 'Tất cả',
    count: suggestions.length,
    suggestions
  }, 'Lấy gợi ý sản phẩm thành công');
});

/**
 * Lấy gợi ý cho giỏ hàng
 * POST /api/recommendations/cart
 * Body: { items: [{productName: 'whole milk'}, ...] }
 */
const getCartRecommendations = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const currentSeason = recommendationService.getCurrentSeason();
  const limit = parseInt(req.query.limit) || 5;
  
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu danh sách sản phẩm trong giỏ hàng'
    });
  }
  
  const recommendations = await recommendationService.getCartRecommendations(
    items,
    currentSeason,
    limit
  );
  
  return successResponse(res, {
    cartItemsCount: items.length,
    season: currentSeason,
    count: recommendations.length,
    recommendations
  }, 'Lấy gợi ý cho giỏ hàng thành công');
});

/**
 * Lấy báo cáo theo 4 mùa
 * GET /api/recommendations/quarterly-report
 */
const getQuarterlyReport = asyncHandler(async (req, res) => {
  const report = await recommendationService.getQuarterlyReport();
  
  return successResponse(res, report, 'Lấy báo cáo theo mùa thành công');
});

/**
 * Lấy top association rules
 * GET /api/recommendations/associations?season=Xuân&limit=20
 */
const getTopAssociations = asyncHandler(async (req, res) => {
  const season = req.query.season || null;
  const limit = parseInt(req.query.limit) || 20;
  
  const associations = await recommendationService.getTopAssociations(season, limit);
  
  return successResponse(res, {
    season: season || 'Tất cả',
    count: associations.length,
    associations
  }, 'Lấy association rules thành công');
});

/**
 * Lấy thông tin mùa hiện tại
 * GET /api/recommendations/current-season-info
 */
const getCurrentSeasonInfo = asyncHandler(async (req, res) => {
  const currentSeason = recommendationService.getCurrentSeason();
  const currentMonth = new Date().getMonth() + 1;
  
  const seasonInfo = {
    'Xuân': { months: '1-3', description: 'Mùa xuân' },
    'Hạ': { months: '4-6', description: 'Mùa hè' },
    'Thu': { months: '7-9', description: 'Mùa thu' },
    'Đông': { months: '10-12', description: 'Mùa đông' }
  };
  
  return successResponse(res, {
    currentSeason,
    currentMonth,
    info: seasonInfo[currentSeason]
  }, 'Lấy thông tin mùa thành công');
});

module.exports = {
  getSeasonalProducts,
  getCurrentSeasonProducts,
  getProductSuggestions,
  getCartRecommendations,
  getQuarterlyReport,
  getTopAssociations,
  getCurrentSeasonInfo
};
