const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Images only!');
    }
  }
});

const uploadImage = (req, res) => {
  if (req.file) {
    res.json({
      message: 'Image Uploaded',
      url: `/uploads/${req.file.filename}`
    });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
};

module.exports = { upload, uploadImage };
