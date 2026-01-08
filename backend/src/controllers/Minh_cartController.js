const cartService = require('../services/cartService');
const recommendationService = require('../services/recommendationService');
const { successResponse } = require('../utils/helpers');
const { asyncHandler } = require('../middlewares/errorMiddleware');

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.userId);
  
  // Thêm recommendations cho giỏ hàng
  let recommendations = [];
  if (cart && cart.items && cart.items.length > 0) {
    const currentSeason = recommendationService.getCurrentSeason();
    recommendations = await recommendationService.getCartRecommendations(
      cart.items,
      currentSeason,
      5
    );
  }
  
  return successResponse(res, { 
    cart, 
    recommendations: {
      season: recommendationService.getCurrentSeason(),
      items: recommendations
    }
  }, 'Lấy giỏ hàng thành công');
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(req.userId, productId, quantity);
  return successResponse(res, { cart }, 'Thêm vào giỏ hàng thành công');
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = await cartService.updateCartItem(req.userId, productId, quantity);
  return successResponse(res, { cart }, 'Cập nhật giỏ hàng thành công');
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await cartService.removeFromCart(req.userId, req.params.productId);
  return successResponse(res, { cart }, 'Xóa sản phẩm khỏi giỏ hàng thành công');
});

const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.userId);
  return successResponse(res, null, 'Xóa toàn bộ giỏ hàng thành công');
});

const applyVoucher = asyncHandler(async (req, res) => {
  const { voucherCode } = req.body;
  const cart = await cartService.applyVoucher(req.userId, voucherCode);
  return successResponse(res, { cart }, 'Áp dụng voucher thành công');
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyVoucher
};
