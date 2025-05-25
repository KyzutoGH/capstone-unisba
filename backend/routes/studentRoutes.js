const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

const { authenticateUser } = require('../middlewares/authMiddleware');
const { validate, studentSchema } = require('../middlewares/validationMiddleware');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'student-' + uniqueSuffix + path.extname(file.originalname));
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

// Student routes
router.post('/', authenticateUser, upload.single('photo'), validate(studentSchema), createStudent);
router.get('/', authenticateUser, getAllStudents);
router.get('/:id', authenticateUser, getStudentById);
router.put('/:id', authenticateUser, upload.single('photo'), updateStudent);
router.delete('/:id', authenticateUser, deleteStudent);

module.exports = router;