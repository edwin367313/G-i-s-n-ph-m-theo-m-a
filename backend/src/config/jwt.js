require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  
  // JWT options
  options: {
    issuer: 'SieuThiABC',
    audience: 'SieuThiABC-Users'
  }
};
