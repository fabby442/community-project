const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Post / story media storage
const mediaStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'lumina/posts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov'],
    resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
    transformation: file.mimetype.startsWith('video')
      ? []
      : [{ quality: 'auto:good', fetch_format: 'auto' }],
  }),
});

// Avatar storage
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'lumina/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }],
  },
});

const uploadMedia  = multer({ storage: mediaStorage,  limits: { fileSize: 50 * 1024 * 1024 } });
const uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { cloudinary, uploadMedia, uploadAvatar };