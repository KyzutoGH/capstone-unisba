const { Student, Prediction } = require('../models');
const { Op } = require('sequelize');

// Create new student
const createStudent = async (req, res) => {
  try {
    const { name, studentId, gender, dateOfBirth, grade, class: className } = req.body;
    const userId = req.user.id;

    // Check if student ID already exists
    const existingStudent = await Student.findOne({ where: { studentId } });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'ID Siswa sudah terdaftar',
      });
    }

    // Create student
    const student = await Student.create({
      name,
      studentId,
      gender,
      dateOfBirth,
      grade,
      class: className,
      userId,
      photo: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({
      success: true,
      message: 'Data siswa berhasil ditambahkan',
      data: student,
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambahkan data siswa',
      error: error.message,
    });
  }
};

// Get all students (with optional filtering)
const getAllStudents = async (req, res) => {
  try {
    const { search, grade, class: className, sort = 'name', order = 'ASC' } = req.query;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Build filter conditions
    let where = { userId };
    
    if (req.user.role === 'admin') {
      // Admin can see all students
      where = {};
    }

    // Add search filter
    if (search && search.trim()) {
      where = {
        ...where,
        [Op.or]: [
          { name: { [Op.like]: `%${search.trim()}%` } },
          { studentId: { [Op.like]: `%${search.trim()}%` } },
        ],
      };
    }

    // Add grade filter
    if (grade && grade.trim()) {
      where.grade = grade.trim();
    }

    // Add class filter
    if (className && className.trim()) {
      where.class = className.trim();
    }

    // Validate sort field
    const allowedSortFields = ['name', 'studentId', 'grade', 'createdAt'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'name';
    const sortOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

    // Get students with pagination
    const { count, rows: students } = await Student.findAndCountAll({
      where,
      limit: Math.min(limit, 100), // Max 100 items per page
      offset,
      order: [[sortField, sortOrder]],
      attributes: {
        exclude: ['userId'] // Don't expose userId in response
      }
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      data: {
        students: students || [],
        pagination: {
          total: count || 0,
          totalPages: totalPages || 0,
          currentPage: page,
          limit,
        },
      },
    });
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data siswa',
      error: error.message,
    });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID siswa tidak valid',
      });
    }

    // Build query conditions
    let where = { id };
    
    // If user is not admin, only allow access to own students
    if (req.user.role !== 'admin') {
      where.userId = userId;
    }

    const student = await Student.findOne({
      where,
      include: [
        {
          model: Prediction,
          as: 'predictions',
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Siswa tidak ditemukan',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('Get student by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data siswa',
      error: error.message,
    });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, studentId, gender, dateOfBirth, grade, class: className } = req.body;
    const userId = req.user.id;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID siswa tidak valid',
      });
    }

    // Build query conditions
    let where = { id };
    
    // If user is not admin, only allow update of own students
    if (req.user.role !== 'admin') {
      where.userId = userId;
    }

    // Find student
    const student = await Student.findOne({ where });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Siswa tidak ditemukan',
      });
    }

    // Check if student ID is changed and already exists
    if (studentId && studentId !== student.studentId) {
      const existingStudent = await Student.findOne({ 
        where: { 
          studentId,
          id: { [Op.ne]: id } // Exclude current student
        } 
      });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'ID Siswa sudah digunakan',
        });
      }
    }

    // Update student
    const updateData = {};
    if (name) updateData.name = name;
    if (studentId) updateData.studentId = studentId;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (grade) updateData.grade = grade;
    if (className) updateData.class = className;

    // Save photo if uploaded
    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }

    await student.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Data siswa berhasil diperbarui',
      data: student,
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui data siswa',
      error: error.message,
    });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID siswa tidak valid',
      });
    }

    // Build query conditions
    let where = { id };
    
    // If user is not admin, only allow deletion of own students
    if (req.user.role !== 'admin') {
      where.userId = userId;
    }

    // Find student
    const student = await Student.findOne({ where });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Siswa tidak ditemukan',
      });
    }

    // Delete student
    await student.destroy();

    res.status(200).json({
      success: true,
      message: 'Data siswa berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus data siswa',
      error: error.message,
    });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};