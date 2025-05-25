const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

const { authenticateUser } = require('../middlewares/authMiddleware');
const { validate, registerSchema, loginSchema } = require('../middlewares/validationMiddleware');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan'));
    }
  },
});

// Auth routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticateUser, getCurrentUser);
router.put('/profile', authenticateUser, upload.single('profilePicture'), updateProfile);
router.put('/change-password', authenticateUser, changePassword);

module.exports = router;