/**
 * AWS S3 Configuration
 * Video and image upload to S3
 */

const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const s3 = new AWS.S3();

// S3 Buckets
const BUCKETS = {
  videos: process.env.AWS_S3_BUCKET_VIDEOS || 'feastro-videos',
  images: process.env.AWS_S3_BUCKET_IMAGES || 'feastro-images',
};

/**
 * Upload file to S3
 */
const uploadToS3 = async (file, folder = 'uploads') => {
  const bucket = file.mimetype.startsWith('video/') 
    ? BUCKETS.videos 
    : BUCKETS.images;
  
  const timestamp = Date.now();
  const fileName = `${folder}/${timestamp}-${file.originalname.replace(/\s/g, '-')}`;
  
  const params = {
    Bucket: bucket,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  const result = await s3.upload(params).promise();
  
  // Return CloudFront URL if available, else S3 URL
  if (process.env.CLOUDFRONT_URL) {
    return `${process.env.CLOUDFRONT_URL}/${fileName}`;
  }
  
  return result.Location;
};

/**
 * Delete file from S3
 */
const deleteFromS3 = async (fileUrl) => {
  try {
    // Extract key from URL
    const urlParts = fileUrl.split('/');
    const key = urlParts.slice(-2).join('/'); // folder/filename
    
    // Determine bucket from URL
    const bucket = fileUrl.includes('videos') 
      ? BUCKETS.videos 
      : BUCKETS.images;
    
    const params = {
      Bucket: bucket,
      Key: key,
    };

    await s3.deleteObject(params).promise();
    console.log(`✅ Deleted from S3: ${key}`);
  } catch (error) {
    console.error('❌ Error deleting from S3:', error.message);
  }
};

module.exports = {
  s3,
  BUCKETS,
  uploadToS3,
  deleteFromS3,
};