const crypto = require('crypto');

/**
 * Format số tiền VND
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Format ngày tháng
 */
const formatDate = (date, format = 'dd/MM/yyyy') => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year);
};

/**
 * Tạo mã đơn hàng ngẫu nhiên
 */
const generateOrderCode = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

/**
 * Tạo mã voucher ngẫu nhiên
 */
const generateVoucherCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Tạo mã thanh toán
 */
const generatePaymentCode = () => {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `PAY-${timestamp}-${random}`;
};

/**
 * Tính giá sau khi giảm
 */
const calculateDiscountedPrice = (originalPrice, discountPercent) => {
  if (!discountPercent || discountPercent <= 0) return originalPrice;
  return Math.round(originalPrice * (1 - discountPercent / 100));
};

/**
 * Validate email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate số điện thoại Việt Nam
 */
const isValidVietnamesePhone = (phone) => {
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
  return phoneRegex.test(phone);
};

/**
 * Sanitize tên file
 */
const sanitizeFilename = (filename) => {
  return filename
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Tạo slug từ tiêu đề
 */
const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Phân trang
 */
const paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { limit: parseInt(limit), offset: parseInt(offset) };
};

/**
 * Tính tổng số trang
 */
const calculateTotalPages = (totalItems, limit = 10) => {
  return Math.ceil(totalItems / limit);
};

/**
 * Sleep/delay function
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Random số trong khoảng
 */
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Tạo HMAC SHA256 signature
 */
const createHmacSignature = (data, secretKey) => {
  return crypto
    .createHmac('sha256', secretKey)
    .update(data)
    .digest('hex');
};

/**
 * Verify HMAC signature
 */
const verifyHmacSignature = (data, signature, secretKey) => {
  const expectedSignature = createHmacSignature(data, secretKey);
  return signature === expectedSignature;
};

/**
 * Truncate text
 */
const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Parse sort query string
 * Example: "-createdAt,price" => [['createdAt', 'DESC'], ['price', 'ASC']]
 */
const parseSortQuery = (sortString) => {
  if (!sortString) return [['createdAt', 'DESC']];
  
  return sortString.split(',').map(field => {
    field = field.trim();
    if (field.startsWith('-')) {
      return [field.substring(1), 'DESC'];
    }
    return [field, 'ASC'];
  });
};

/**
 * Response helper
 */
const successResponse = (res, data, message = 'Thành công', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message = 'Có lỗi xảy ra', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

module.exports = {
  formatCurrency,
  formatDate,
  generateOrderCode,
  generateVoucherCode,
  generatePaymentCode,
  calculateDiscountedPrice,
  isValidEmail,
  isValidVietnamesePhone,
  sanitizeFilename,
  createSlug,
  paginate,
  calculateTotalPages,
  sleep,
  randomInt,
  createHmacSignature,
  verifyHmacSignature,
  truncateText,
  parseSortQuery,
  successResponse,
  errorResponse
};
