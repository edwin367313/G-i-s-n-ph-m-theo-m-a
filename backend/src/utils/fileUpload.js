const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { sanitizeFilename } = require('./helpers');

// Tạo thư mục uploads nếu chưa tồn tại
const createUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Local storage configuration
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Phân loại theo type
    if (file.fieldname === 'productImage') {
      uploadPath += 'products/';
    } else if (file.fieldname === 'themeImage') {
      uploadPath += 'themes/';
    } else if (file.fieldname === 'avatar') {
      uploadPath += 'avatars/';
    } else {
      uploadPath += 'others/';
    }
    
    createUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const sanitized = sanitizeFilename(basename);
    const uniqueName = `${sanitized}-${uuidv4()}${ext}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed extensions
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp, svg)'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: localStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Cloudinary configuration (nếu sử dụng)
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file lên Cloudinary
 */
const uploadToCloudinary = async (filePath, folder = 'sieuthiabc') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true
    });
    
    // Xóa file local sau khi upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    // Xóa file local nếu upload thất bại
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error('Upload ảnh thất bại: ' + error.message);
  }
};

/**
 * Upload nhiều files lên Cloudinary
 */
const uploadMultipleToCloudinary = async (files, folder = 'sieuthiabc') => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file.path, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error('Upload nhiều ảnh thất bại: ' + error.message);
  }
};

/**
 * Xóa file từ Cloudinary
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    throw new Error('Xóa ảnh thất bại: ' + error.message);
  }
};

/**
 * Xóa file local
 */
const deleteLocalFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Xóa file local thất bại:', error);
    return false;
  }
};

/**
 * Get file info
 */
const getFileInfo = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const stats = fs.statSync(filePath);
  return {
    size: stats.size,
    created: stats.birthtime,
    modified: stats.mtime,
    extension: path.extname(filePath),
    filename: path.basename(filePath)
  };
};

module.exports = {
  upload,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteLocalFile,
  getFileInfo,
  createUploadDir
};
