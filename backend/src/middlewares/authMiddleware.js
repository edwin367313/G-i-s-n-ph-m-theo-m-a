const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/helpers');
const { query } = require('../config/database');

/**
 * Middleware xác thực JWT token
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Vui lòng đăng nhập để tiếp tục', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Tìm user trong database
    const result = await query(
      'SELECT id, username, email, full_name, role, is_active FROM Users WHERE id = @userId',
      { userId: decoded.userId }
    );
    
    const user = result[0];
    
    if (!user) {
      return errorResponse(res, 'Người dùng không tồn tại', 401);
    }
    
    if (!user.is_active) {
      return errorResponse(res, 'Tài khoản đã bị khóa', 403);
    }
    
    // Gắn user vào request
    req.user = user;
    req.userId = user.id;
    req.userRole = user.role;
    
    next();
  } catch (error) {
    if (error.message.includes('Token')) {
      return errorResponse(res, error.message, 401);
    }
    return errorResponse(res, 'Xác thực thất bại', 401);
  }
};

/**
 * Middleware xác thực token optional (không bắt buộc)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      
      const result = await query(
        'SELECT id, username, email, full_name, role, is_active FROM Users WHERE id = @userId',
        { userId: decoded.userId }
      );
      
      const user = result[0];
      
      if (user && user.is_active) {
        req.user = user;
        req.userId = user.id;
        req.userRole = user.role;
      }
    }
    
    next();
  } catch (error) {
    // Không trả lỗi, chỉ bỏ qua
    next();
  }
};

module.exports = { authMiddleware, optionalAuth };
