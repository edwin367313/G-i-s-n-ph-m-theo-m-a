const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
  cloudinary,
  
  // Upload options
  uploadOptions: {
    products: {
      folder: 'sieuthiabc/products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      max_file_size: 5 * 1024 * 1024, // 5MB
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    },
    themes: {
      folder: 'sieuthiabc/themes',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      max_file_size: 3 * 1024 * 1024 // 3MB
    },
    icons: {
      folder: 'sieuthiabc/icons',
      allowed_formats: ['png', 'svg', 'gif'],
      max_file_size: 1 * 1024 * 1024 // 1MB
    },
    banners: {
      folder: 'sieuthiabc/banners',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      max_file_size: 10 * 1024 * 1024, // 10MB
      transformation: [
        { width: 1920, height: 600, crop: 'limit' },
        { quality: 'auto' }
      ]
    }
  }
};
