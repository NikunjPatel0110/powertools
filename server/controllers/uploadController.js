const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'powertools/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

const uploadImage = (req, res) => {
  if (req.file) {
    const secure_url = req.file.path || req.file.secure_url;
    res.json({
      message: 'Image Uploaded',
      secure_url,
      url: secure_url,
    });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
};

module.exports = { upload, uploadImage };
