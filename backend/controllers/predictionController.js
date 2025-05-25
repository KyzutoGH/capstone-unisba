const { Prediction, Student } = require('../models');
const { generatePrediction, getInterventionRecommendations } = require('../ml/randomForestModel');

// Create new prediction
const createPrediction = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.user.id;

    // Verify that student exists and belongs to this teacher
    const student = await Student.findOne({
      where: {
        id: studentId,
        ...(req.user.role !== 'admin' && { userId }),
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Siswa tidak ditemukan',
      });
    }

    // Get prediction data from request body
    const {
      hoursStudied,
      attendance,
      extracurricularActivities,
      sleepHours,
      previousScores,
      motivationLevel,
      tutoringSessions,
      teacherQuality,
      physicalActivity,
      learningDisabilities,
      semester,
      academicYear,
      examScore,
    } = req.body;

    // Generate prediction
    const { predictionScore, predictionStatus } = generatePrediction({
      hoursStudied,
      attendance,
      extracurricularActivities,
      sleepHours,
      previousScores,
      motivationLevel,
      tutoringSessions,
      teacherQuality,
      physicalActivity,
      learningDisabilities,
      gender: student.gender === 'male' ? 1 : 0,
    });

    // Generate intervention recommendations
    const interventionRecommendations = getInterventionRecommendations({
      predictionStatus,
      hoursStudied,
      attendance,
      extracurricularActivities,
      sleepHours,
      motivationLevel,
      tutoringSessions,
      physicalActivity,
      learningDisabilities,
    });

    // Create prediction record
    const prediction = await Prediction.create({
      studentId,
      hoursStudied,
      attendance,
      extracurricularActivities,
      sleepHours,
      previousScores,
      motivationLevel,
      tutoringSessions,
      teacherQuality,
      physicalActivity,
      learningDisabilities,
      examScore,
      predictionScore,
      predictionStatus,
      interventionRecommendations,
      semester,
      academicYear,
    });

    res.status(201).json({
      success: true,
      message: 'Prediksi berhasil dibuat',
      data: prediction,
    });
  } catch (error) {
    console.error('Create prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat prediksi',
    });
  }
};

// Get all predictions for a student
const getStudentPredictions = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.user.id;

    // Verify that student exists and belongs to this teacher
    const student = await Student.findOne({
      where: {
        id: studentId,
        ...(req.user.role !== 'admin' && { userId }),
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Siswa tidak ditemukan',
      });
    }

    // Get predictions
    const predictions = await Prediction.findAll({
      where: { studentId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: predictions,
    });
  } catch (error) {
    console.error('Get student predictions error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data prediksi',
    });
  }
};

// Get prediction by ID
const getPredictionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get prediction with student data
    const prediction = await Prediction.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          ...(req.user.role !== 'admin' && { where: { userId } }),
        },
      ],
    });

    if (!prediction || !prediction.student) {
      return res.status(404).json({
        success: false,
        message: 'Prediksi tidak ditemukan',
      });
    }

    res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    console.error('Get prediction by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data prediksi',
    });
  }
};

// Update prediction (actual exam score)
const updatePrediction = async (req, res) => {
  try {
    const { id } = req.params;
    const { examScore } = req.body;
    const userId = req.user.id;

    // Get prediction with student data
    const prediction = await Prediction.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          ...(req.user.role !== 'admin' && { where: { userId } }),
        },
      ],
    });

    if (!prediction || !prediction.student) {
      return res.status(404).json({
        success: false,
        message: 'Prediksi tidak ditemukan',
      });
    }

    // Update prediction with actual exam score
    prediction.examScore = examScore;
    await prediction.save();

    res.status(200).json({
      success: true,
      message: 'Nilai ujian berhasil diperbarui',
      data: prediction,
    });
  } catch (error) {
    console.error('Update prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui nilai ujian',
    });
  }
};

// Delete prediction
const deletePrediction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get prediction with student data
    const prediction = await Prediction.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          ...(req.user.role !== 'admin' && { where: { userId } }),
        },
      ],
    });

    if (!prediction || !prediction.student) {
      return res.status(404).json({
        success: false,
        message: 'Prediksi tidak ditemukan',
      });
    }

    // Delete prediction
    await prediction.destroy();

    res.status(200).json({
      success: true,
      message: 'Data prediksi berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus data prediksi',
    });
  }
};

module.exports = {
  createPrediction,
  getStudentPredictions,
  getPredictionById,
  updatePrediction,
  deletePrediction,
};