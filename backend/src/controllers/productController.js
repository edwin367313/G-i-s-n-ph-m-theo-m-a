const productService = require('../services/productService');
const { successResponse } = require('../utils/helpers');
const { asyncHandler } = require('../middlewares/errorMiddleware');

const getAllProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.query);
  return successResponse(res, result, 'Lấy danh sách sản phẩm thành công');
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return successResponse(res, { product }, 'Lấy chi tiết sản phẩm thành công');
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  return successResponse(res, { product }, 'Tạo sản phẩm thành công', 201);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  return successResponse(res, { product }, 'Cập nhật sản phẩm thành công');
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return successResponse(res, null, 'Xóa sản phẩm thành công');
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await productService.getFeaturedProducts(req.query.limit);
  return successResponse(res, { products }, 'Lấy sản phẩm nổi bật thành công');
});

const searchProducts = asyncHandler(async (req, res) => {
  const products = await productService.searchProducts(req.query.keyword, req.query.limit);
  return successResponse(res, { products }, 'Tìm kiếm thành công');
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  searchProducts
};
