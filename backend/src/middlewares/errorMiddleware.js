/**
 * Global error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  // Log error
  console.error('❌ Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Có lỗi xảy ra trên server';
  let errors = err.errors || null;

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Dữ liệu không hợp lệ';
    errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'Dữ liệu đã tồn tại';
    errors = err.errors.map(e => ({
      field: e.path,
      message: `${e.path} đã được sử dụng`
    }));
  }

  // Sequelize foreign key error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Dữ liệu liên quan không tồn tại';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token không hợp lệ';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token đã hết hạn';
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File quá lớn';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Quá số lượng file cho phép';
  }

  // Cast error (invalid ID format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID không hợp lệ';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  });
};

/**
 * 404 Not Found handler
 */
const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại',
    path: req.originalUrl
  });
};

/**
 * Async handler wrapper
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorMiddleware,
  notFoundMiddleware,
  asyncHandler
};
