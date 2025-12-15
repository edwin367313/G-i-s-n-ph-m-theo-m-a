const { upload } = require('../utils/fileUpload');
const { errorResponse } = require('../utils/helpers');

/**
 * Middleware upload single file
 */
const uploadSingle = (fieldName = 'image') => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);
    
    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return errorResponse(res, 'File quá lớn. Kích thước tối đa 5MB', 400);
        }
        return errorResponse(res, err.message || 'Upload file thất bại', 400);
      }
      next();
    });
  };
};

/**
 * Middleware upload multiple files
 */
const uploadMultiple = (fieldName = 'images', maxCount = 5) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);
    
    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return errorResponse(res, 'File quá lớn. Kích thước tối đa 5MB', 400);
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return errorResponse(res, `Chỉ cho phép upload tối đa ${maxCount} files`, 400);
        }
        return errorResponse(res, err.message || 'Upload files thất bại', 400);
      }
      next();
    });
  };
};

/**
 * Middleware upload multiple fields
 */
const uploadFields = (fields) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.fields(fields);
    
    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return errorResponse(res, 'File quá lớn. Kích thước tối đa 5MB', 400);
        }
        return errorResponse(res, err.message || 'Upload files thất bại', 400);
      }
      next();
    });
  };
};

/**
 * Middleware validate file exists
 */
const requireFile = (fieldName = 'image') => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return errorResponse(res, 'Vui lòng chọn file để upload', 400);
    }
    next();
  };
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  requireFile
};
