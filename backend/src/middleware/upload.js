/**
 * File Upload Middleware
 * Multer + AWS S3 integration
 */

const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3, BUCKETS } = require('../config/aws');
const ApiError = require('../utils/ApiError');

// File size limits
const MAX_VIDEO_SIZE = parseInt(process.env.MAX_VIDEO_SIZE) || 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = parseInt(process.env.MAX_IMAGE_SIZE) || 5 * 1024 * 1024; // 5MB

/**
 * File filter for videos
 */
const videoFileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest('Only video files are allowed (MP4, MPEG, MOV, AVI)'), false);
  }
};

/**
 * File filter for images
 */
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest('Only image files are allowed (JPEG, PNG, WebP)'), false);
  }
};

/**
 * Generate S3 key with timestamp and original filename
 */
const generateS3Key = (folder) => {
  return (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedFilename = file.originalname.replace(/\s+/g, '-').toLowerCase();
    const key = `${folder}/${timestamp}-${sanitizedFilename}`;
    cb(null, key);
  };
};

/**
 * Upload video to S3
 */
const uploadVideo = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKETS.videos,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: generateS3Key('recipes'),
  }),
  fileFilter: videoFileFilter,
  limits: {
    fileSize: MAX_VIDEO_SIZE,
  },
}).single('video');

/**
 * Upload image to S3
 */
const uploadImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKETS.images,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: generateS3Key('images'),
  }),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
  },
}).single('image');

/**
 * Upload thumbnail (smaller image size)
 */
const uploadThumbnail = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKETS.images,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: generateS3Key('thumbnails'),
  }),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
  },
}).single('thumbnail');

/**
 * Upload multiple images
 */
const uploadMultipleImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKETS.images,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: generateS3Key('gallery'),
  }),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
    files: 10, // Max 10 files
  },
}).array('images', 10);

/**
 * Error handler for multer errors
 */
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(ApiError.badRequest('File size too large'));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(ApiError.badRequest('Too many files'));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(ApiError.badRequest('Unexpected file field'));
    }
    return next(ApiError.badRequest(err.message));
  }
  next(err);
};

module.exports = {
  uploadVideo,
  uploadImage,
  uploadThumbnail,
  uploadMultipleImages,
  handleUploadError,
};