const { errorResponse } = require('../utils/helpers');

/**
 * Middleware kiểm tra role
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Kiểm tra xem user đã được xác thực chưa
      if (!req.user || !req.userRole) {
        return errorResponse(res, 'Vui lòng đăng nhập để tiếp tục', 401);
      }
      
      // Kiểm tra role
      if (!allowedRoles.includes(req.userRole)) {
        return errorResponse(
          res,
          'Bạn không có quyền truy cập chức năng này',
          403
        );
      }
      
      next();
    } catch (error) {
      return errorResponse(res, 'Kiểm tra quyền thất bại', 500);
    }
  };
};

/**
 * Middleware chỉ cho phép admin
 */
const adminOnly = roleMiddleware('admin');

/**
 * Middleware cho phép admin và manager
 */
const adminOrManager = roleMiddleware('admin', 'manager');

/**
 * Middleware kiểm tra quyền sở hữu resource
 */
const checkOwnership = (resourceIdField = 'id') => {
  return (req, res, next) => {
    try {
      // Admin luôn có quyền
      if (req.userRole === 'admin') {
        return next();
      }
      
      // Kiểm tra ownership
      const resourceUserId = req.body.userId || req.params.userId || req.query.userId;
      
      if (resourceUserId && resourceUserId.toString() !== req.userId.toString()) {
        return errorResponse(
          res,
          'Bạn không có quyền truy cập tài nguyên này',
          403
        );
      }
      
      next();
    } catch (error) {
      return errorResponse(res, 'Kiểm tra quyền sở hữu thất bại', 500);
    }
  };
};

module.exports = {
  roleMiddleware,
  adminOnly,
  adminOrManager,
  checkOwnership
};
