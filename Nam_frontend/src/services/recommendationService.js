import api from '../utils/api';

/**
 * Lấy thông tin mùa hiện tại
 */
export const getCurrentSeasonInfo = async () => {
  try {
    const response = await api.get('/recommendations/current-season-info');
    return response.data;
  } catch (error) {
    console.error('Error getting current season info:', error);
    throw error;
  }
};

/**
 * Lấy sản phẩm hot của mùa hiện tại
 */
export const getCurrentSeasonProducts = async (limit = 20) => {
  try {
    const response = await api.get('/recommendations/current-season', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting current season products:', error);
    throw error;
  }
};

/**
 * Lấy sản phẩm hot theo mùa cụ thể
 */
export const getSeasonalProducts = async (season, limit = 20) => {
  try {
    const response = await api.get(`/recommendations/seasonal/${season}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting seasonal products:', error);
    throw error;
  }
};

/**
 * Lấy gợi ý sản phẩm dựa trên sản phẩm đã chọn
 */
export const getProductSuggestions = async (productName, season = null, limit = 5) => {
  try {
    const response = await api.get(`/recommendations/suggest/${encodeURIComponent(productName)}`, {
      params: { season, limit }
    });
    // axios interceptor already returns response.data
    return response;
  } catch (error) {
    console.error('Error getting product suggestions:', error);
    throw error;
  }
};

/**
 * Lấy gợi ý cho giỏ hàng
 */
export const getCartRecommendations = async (cartItems, limit = 5) => {
  try {
    const response = await api.post('/recommendations/cart', {
      items: cartItems
    }, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting cart recommendations:', error);
    throw error;
  }
};

/**
 * Lấy báo cáo theo 4 mùa
 */
export const getQuarterlyReport = async () => {
  try {
    const response = await api.get('/recommendations/quarterly-report');
    return response.data;
  } catch (error) {
    console.error('Error getting quarterly report:', error);
    throw error;
  }
};

/**
 * Lấy top association rules
 */
export const getTopAssociations = async (season = null, limit = 20) => {
  try {
    const response = await api.get('/recommendations/associations', {
      params: { season, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting associations:', error);
    throw error;
  }
};

const recommendationService = {
  getCurrentSeasonInfo,
  getCurrentSeasonProducts,
  getSeasonalProducts,
  getProductSuggestions,
  getCartRecommendations,
  getQuarterlyReport,
  getTopAssociations
};

export default recommendationService;
