const Category = require('../models/Category');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * Get all categories
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return successResponse(res, categories, 'Lấy danh sách danh mục thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get category by ID
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      return errorResponse(res, 'Không tìm thấy danh mục', 404);
    }
    
    return successResponse(res, category, 'Lấy thông tin danh mục thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Create new category (Admin only)
 */
const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return successResponse(res, category, 'Tạo danh mục thành công', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Update category (Admin only)
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.update(id, req.body);
    
    if (!category) {
      return errorResponse(res, 'Không tìm thấy danh mục', 404);
    }
    
    return successResponse(res, category, 'Cập nhật danh mục thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Delete category (Admin only)
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.delete(id);
    return successResponse(res, null, 'Xóa danh mục thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
