const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/helpers');
const { asyncHandler } = require('../middlewares/errorMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký user mới
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  console.log('📝 REGISTER REQUEST:', req.body);
  const result = await authService.register(req.body);
  console.log('✅ Register successful:', result.user.username);
  return successResponse(res, result, 'Đăng ký thành công', 201);
});

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const result = await authService.login(usernameOrEmail, password);
  return successResponse(res, result, 'Đăng nhập thành công');
});

/**
 * @route   GET /api/auth/profile
 * @desc    Lấy thông tin user hiện tại
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.userId);
  return successResponse(res, { user }, 'Lấy thông tin thành công');
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Cập nhật profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.userId, req.body);
  return successResponse(res, { user }, 'Cập nhật thông tin thành công');
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Đổi mật khẩu
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.userId, currentPassword, newPassword);
  return successResponse(res, null, 'Đổi mật khẩu thành công');
});

/**
 * @route   GET /api/auth/users
 * @desc    Lấy danh sách users (Admin)
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const result = await authService.getAllUsers(req.query);
  return successResponse(res, result, 'Lấy danh sách users thành công');
});

/**
 * @route   PUT /api/auth/users/:id
 * @desc    Cập nhật user (Admin)
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await authService.updateUser(req.params.id, req.body);
  return successResponse(res, { user }, 'Cập nhật user thành công');
});

/**
 * @route   DELETE /api/auth/users/:id
 * @desc    Xóa user (Admin)
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  await authService.deleteUser(req.params.id);
  return successResponse(res, null, 'Xóa user thành công');
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUser,
  deleteUser
};
