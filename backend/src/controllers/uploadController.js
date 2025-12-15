const { uploadToCloudinary, uploadMultipleToCloudinary } = require('../utils/fileUpload');
const { successResponse, errorResponse } = require('../utils/helpers');
const { asyncHandler } = require('../middlewares/errorMiddleware');

const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, 'Vui lòng chọn file để upload', 400);
  }

  const result = await uploadToCloudinary(req.file.path, 'sieuthiabc');

  return successResponse(res, { image: result }, 'Upload ảnh thành công', 201);
});

const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return errorResponse(res, 'Vui lòng chọn files để upload', 400);
  }

  const results = await uploadMultipleToCloudinary(req.files, 'sieuthiabc');

  return successResponse(res, { images: results }, 'Upload ảnh thành công', 201);
});

module.exports = {
  uploadSingleImage,
  uploadMultipleImages
};
