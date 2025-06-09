// controllers/predictionController.js
const { Prediction, Student } = require('../models');
const axios = require('axios');

// Flask ML API configuration
const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000';
const FLASK_TIMEOUT = 30000; // 30 seconds timeout

// Fallback prediction logic (jika Flask API tidak tersedia)
// const { generatePrediction, getInterventionRecommendations } = require('../ml/randomForestModel');

// Helper function to call Flask API
const callFlaskAPI = async (endpoint, data = null, method = 'GET') => {
  try {
    const config = {
      method,
      url: `${FLASK_API_URL}${endpoint}`,
      timeout: FLASK_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Flask API error (${endpoint}):`, error.message);
    throw error;
  }
};

// Check Flask API health
const checkFlaskHealth = async () => {
  try {
    const response = await callFlaskAPI('/health');
    return response.status === 'healthy' && response.model_loaded;
  } catch (error) {
    console.warn('Flask API health check failed:', error.message);
    return false;
  }
};

// ========================================
// CRUD OPERATIONS WITH FLASK ML INTEGRATION
// ========================================

// Create prediction record with Flask ML integration
const createPrediction = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.user?.id;

    // Validate student exists and belongs to this teacher (if not admin)
    const student = await Student.findOne({
      where: {
        id: studentId,
        ...(req.user?.role !== 'admin' && userId && { userId }),
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
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

    // Validate required fields
    if (!hoursStudied || !attendance || !previousScores || !motivationLevel || !teacherQuality) {
      return res.status(400).json({
        success: false,
        message: 'Data tidak lengkap. Pastikan semua field wajib terisi.',
        required: ['hoursStudied', 'attendance', 'previousScores', 'motivationLevel', 'teacherQuality']
      });
    }

    let predictionResult;
    let modelUsed = 'Fallback';

    // Prepare input data for Flask API
    const inputData = {
      hoursStudied: parseFloat(hoursStudied),
      attendance: parseFloat(attendance),
      extracurricularActivities: Boolean(extracurricularActivities),
      sleepHours: parseFloat(sleepHours) || 7,
      previousScores: parseFloat(previousScores),
      motivationLevel: motivationLevel, // 'High', 'Medium', 'Low'
      tutoringSessions: parseFloat(tutoringSessions) || 0,
      teacherQuality: teacherQuality, // 'High', 'Medium', 'Low'
      physicalActivity: parseFloat(physicalActivity) || 0,
      learningDisabilities: Boolean(learningDisabilities),
      gender: student.gender === 'male' ? 'Male' : 'Female',
      examScore: parseFloat(examScore) || parseFloat(previousScores)
    };

    try {
      // Check if Flask API is healthy
      const isFlaskHealthy = await checkFlaskHealth();

      if (isFlaskHealthy) {
        // Call Flask API for prediction
        console.log('🔄 Calling Flask API for prediction...');
        const flaskResponse = await callFlaskAPI('/predict', inputData, 'POST');

        if (flaskResponse.success) {
          predictionResult = {
            predictionScore: flaskResponse.predictionScore,
            predictionStatus: flaskResponse.predictionStatus,
            predictionCategory: flaskResponse.predictionCategory,
            interventionRecommendations: flaskResponse.interventionRecommendations,
            probabilities: flaskResponse.probabilities
          };
          modelUsed = flaskResponse.modelUsed || 'Flask ML API';
          console.log('✅ Flask API prediction successful');
        } else {
          throw new Error(`Flask API returned error: ${flaskResponse.error}`);
        }
      } else {
        throw new Error('Flask API is not healthy');
      }
    } catch (flaskError) {
      console.warn('⚠️ Flask API failed, using fallback:', flaskError.message);

      // Fallback ke model lama
      const { predictionScore, predictionStatus } = generatePrediction({
        hoursStudied: inputData.hoursStudied,
        attendance: inputData.attendance,
        extracurricularActivities: inputData.extracurricularActivities,
        sleepHours: inputData.sleepHours,
        previousScores: inputData.previousScores,
        motivationLevel: motivationLevel === 'High' ? 8 : motivationLevel === 'Medium' ? 5 : 2,
        tutoringSessions: inputData.tutoringSessions,
        teacherQuality: teacherQuality === 'High' ? 8 : teacherQuality === 'Medium' ? 5 : 2,
        physicalActivity: inputData.physicalActivity,
        learningDisabilities: inputData.learningDisabilities,
        gender: student.gender === 'male' ? 1 : 0,
      });

      const interventionRecommendations = getInterventionRecommendations({
        predictionStatus,
        hoursStudied: inputData.hoursStudied,
        attendance: inputData.attendance,
        extracurricularActivities: inputData.extracurricularActivities,
        sleepHours: inputData.sleepHours,
        motivationLevel,
        tutoringSessions: inputData.tutoringSessions,
        physicalActivity: inputData.physicalActivity,
        learningDisabilities: inputData.learningDisabilities,
      });

      predictionResult = {
        predictionScore,
        predictionStatus,
        predictionCategory: predictionStatus === 'success' ? 'Berhasil' :
          predictionStatus === 'at_risk' ? 'Cukup' : 'Gagal',
        interventionRecommendations,
        probabilities: null
      };
      modelUsed = 'Fallback Algorithm';
    }

    // Create prediction record
    // Tambahkan logging setelah Prediction.create()
    const prediction = await Prediction.create({
      studentId,
      hoursStudied: inputData.hoursStudied,
      attendance: inputData.attendance,
      extracurricularActivities: inputData.extracurricularActivities,
      sleepHours: inputData.sleepHours,
      previousScores: inputData.previousScores,
      motivationLevel,
      tutoringSessions: inputData.tutoringSessions,
      teacherQuality,
      physicalActivity: inputData.physicalActivity,
      learningDisabilities: inputData.learningDisabilities,
      examScore: inputData.examScore || null,
      predictionScore: predictionResult.predictionScore,
      predictionStatus: predictionResult.predictionStatus,
      interventionRecommendations: Array.isArray(predictionResult.interventionRecommendations)
        ? predictionResult.interventionRecommendations.join('\n\n')
        : predictionResult.interventionRecommendations,
      semester,
      academicYear,
      createdBy: req.user?.id
    });

    // TAMBAHKAN LOGGING INI
    console.log('✅ Prediction saved to database:', {
      id: prediction.id,
      studentId: prediction.studentId,
      predictionScore: prediction.predictionScore,
      createdAt: prediction.createdAt
    });

    // Verify data was saved
    const savedPrediction = await Prediction.findByPk(prediction.id);
    console.log('🔍 Verification - Data in DB:', !!savedPrediction);
    console.log('📊 Prediction ID:', prediction.id);
    console.log('🎯 Student ID:', prediction.studentId);
    console.log('⭐ Score:', prediction.predictionScore);
    // Prepare response data
    const responseData = {
      ...prediction.toJSON(),
      modelUsed,
      predictionCategory: predictionResult.predictionCategory,
      ...(predictionResult.probabilities && { probabilities: predictionResult.probabilities }),
      student: {
        id: student.id,
        name: student.name,
        gender: student.gender
      }
    };

    res.status(201).json({
      success: true,
      data: responseData,
      message: 'Prediction record created successfully'
    });

  } catch (error) {
    console.error('Create prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create prediction record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all predictions for a student
const getStudentPredictions = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.user?.id;

    // Validate student exists and belongs to this teacher (if not admin)
    const student = await Student.findOne({
      where: {
        id: studentId,
        ...(req.user?.role !== 'admin' && userId && { userId }),
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get predictions with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: predictions } = await Prediction.findAndCountAll({
      where: { studentId: studentId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'gender']
        }
      ]
    });

    // Add prediction category to each prediction
    const enhancedPredictions = predictions.map(prediction => {
      const pred = prediction.toJSON();

      // Determine category based on prediction score
      if (pred.predictionScore <= 40) {
        pred.predictionCategory = 'Gagal';
      } else if (pred.predictionScore <= 74) {
        pred.predictionCategory = 'Cukup';
      } else {
        pred.predictionCategory = 'Berhasil';
      }

      return pred;
    });

    res.json({
      success: true,
      data: {
        predictions: enhancedPredictions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      },
      count: count
    });

  } catch (error) {
    console.error('Get student predictions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get student predictions',
      error: error.message
    });
  }
};

// Get single prediction by ID
const getPredictionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const prediction = await Prediction.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'gender'],
          ...(req.user?.role !== 'admin' && userId && { where: { userId } }),
        }
      ]
    });

    if (!prediction || !prediction.student) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    // Enhanced response with category
    const responseData = {
      ...prediction.toJSON(),
      predictionCategory: prediction.predictionScore <= 40 ? 'Gagal' :
        prediction.predictionScore <= 74 ? 'Cukup' : 'Berhasil'
    };

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Get prediction by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get prediction',
      error: error.message
    });
  }
};

// Update prediction record
const updatePrediction = async (req, res) => {
  try {
    const { id } = req.params;
    const { examScore, ...updateData } = req.body;
    const userId = req.user?.id;

    const prediction = await Prediction.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          ...(req.user?.role !== 'admin' && userId && { where: { userId } }),
        },
      ],
    });

    if (!prediction || !prediction.student) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    // If examScore is provided, validate it
    if (examScore !== undefined && (isNaN(parseFloat(examScore)) || examScore === '')) {
      return res.status(400).json({
        success: false,
        message: 'Exam score must be a valid number',
      });
    }

    // Update prediction
    await prediction.update({
      ...updateData,
      ...(examScore !== undefined && { examScore: parseFloat(examScore) }),
      updatedBy: req.user?.id
    });

    // Calculate accuracy if both prediction and exam scores exist
    let accuracy = null;
    if (prediction.predictionScore && prediction.examScore) {
      const difference = Math.abs(prediction.predictionScore - prediction.examScore);
      accuracy = Math.max(0, 100 - difference);
    }

    const responseData = {
      ...prediction.toJSON(),
      accuracy: accuracy ? Math.round(accuracy * 100) / 100 : null,
      predictionCategory: prediction.predictionScore <= 40 ? 'Gagal' :
        prediction.predictionScore <= 74 ? 'Cukup' : 'Berhasil'
    };

    res.json({
      success: true,
      data: responseData,
      message: 'Prediction updated successfully'
    });

  } catch (error) {
    console.error('Update prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update prediction',
      error: error.message
    });
  }
};

// Delete prediction record
const deletePrediction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const prediction = await Prediction.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          ...(req.user?.role !== 'admin' && userId && { where: { userId } }),
        },
      ],
    });

    if (!prediction || !prediction.student) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    // Store prediction data for response
    const deletedData = {
      id: prediction.id,
      studentName: prediction.student.name,
      predictionScore: prediction.predictionScore,
      createdAt: prediction.createdAt
    };

    await prediction.destroy();

    res.json({
      success: true,
      message: 'Prediction deleted successfully',
      deletedData
    });

  } catch (error) {
    console.error('Delete prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete prediction',
      error: error.message
    });
  }
};

// Get model statistics
const getModelStatistics = async (req, res) => {
  try {
    const userId = req.user?.id;

    // Get all predictions for this user's students
    const predictions = await Prediction.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          ...(req.user?.role !== 'admin' && userId && { where: { userId } }),
          attributes: ['id', 'name']
        },
      ],
      where: {
        examScore: { [require('sequelize').Op.not]: null }
      }
    });

    if (predictions.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalPredictions: 0,
          averageAccuracy: 0,
          modelPerformance: 'Insufficient data',
          flaskApiStatus: 'unknown'
        }
      });
    }

    // Calculate accuracy statistics
    const accuracies = predictions.map(pred => {
      const difference = Math.abs(pred.predictionScore - pred.examScore);
      return Math.max(0, 100 - difference);
    });

    const averageAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;

    // Determine model performance category
    let modelPerformance;
    if (averageAccuracy >= 80) {
      modelPerformance = 'Excellent';
    } else if (averageAccuracy >= 70) {
      modelPerformance = 'Good';
    } else if (averageAccuracy >= 60) {
      modelPerformance = 'Fair';
    } else {
      modelPerformance = 'Poor';
    }

    // Check Flask API status
    let flaskApiStatus;
    try {
      const isHealthy = await checkFlaskHealth();
      flaskApiStatus = isHealthy ? 'healthy' : 'unhealthy';
    } catch (error) {
      flaskApiStatus = 'unreachable';
    }

    // Calculate distribution by category
    const categoryDistribution = {
      Berhasil: 0,
      Cukup: 0,
      Gagal: 0
    };

    predictions.forEach(pred => {
      if (pred.predictionScore <= 40) {
        categoryDistribution.Gagal++;
      } else if (pred.predictionScore <= 74) {
        categoryDistribution.Cukup++;
      } else {
        categoryDistribution.Berhasil++;
      }
    });

    res.json({
      success: true,
      data: {
        totalPredictions: predictions.length,
        averageAccuracy: Math.round(averageAccuracy * 100) / 100,
        modelPerformance,
        flaskApiStatus,
        categoryDistribution,
        accuracyRange: {
          min: Math.round(Math.min(...accuracies) * 100) / 100,
          max: Math.round(Math.max(...accuracies) * 100) / 100
        }
      }
    });

  } catch (error) {
    console.error('Get model statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get model statistics',
      error: error.message
    });
  }
};

// Bulk prediction for multiple students
const createBulkPredictions = async (req, res) => {
  try {
    const { predictions } = req.body;
    const userId = req.user?.id;

    if (!Array.isArray(predictions) || predictions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Predictions array is required and must not be empty'
      });
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < predictions.length; i++) {
      try {
        const predData = predictions[i];

        // Validate student exists
        const student = await Student.findOne({
          where: {
            id: predData.studentId,
            ...(req.user?.role !== 'admin' && userId && { userId }),
          },
        });

        if (!student) {
          errors.push({
            index: i,
            studentId: predData.studentId,
            error: 'Student not found'
          });
          continue;
        }

        // Process prediction (similar to createPrediction but simplified)
        const inputData = {
          hoursStudied: parseFloat(predData.hoursStudied),
          attendance: parseFloat(predData.attendance),
          extracurricularActivities: Boolean(predData.extracurricularActivities),
          sleepHours: parseFloat(predData.sleepHours) || 7,
          previousScores: parseFloat(predData.previousScores),
          motivationLevel: predData.motivationLevel,
          tutoringSessions: parseFloat(predData.tutoringSessions) || 0,
          teacherQuality: predData.teacherQuality,
          physicalActivity: parseFloat(predData.physicalActivity) || 0,
          learningDisabilities: Boolean(predData.learningDisabilities),
          gender: student.gender === 'male' ? 'Male' : 'Female',
          examScore: parseFloat(predData.examScore) || parseFloat(predData.previousScores)
        };

        // Use fallback model for bulk operations (faster)
        const { predictionScore, predictionStatus } = generatePrediction({
          hoursStudied: inputData.hoursStudied,
          attendance: inputData.attendance,
          extracurricularActivities: inputData.extracurricularActivities,
          sleepHours: inputData.sleepHours,
          previousScores: inputData.previousScores,
          motivationLevel: predData.motivationLevel === 'High' ? 8 :
            predData.motivationLevel === 'Medium' ? 5 : 2,
          tutoringSessions: inputData.tutoringSessions,
          teacherQuality: predData.teacherQuality === 'High' ? 8 :
            predData.teacherQuality === 'Medium' ? 5 : 2,
          physicalActivity: inputData.physicalActivity,
          learningDisabilities: inputData.learningDisabilities,
          gender: student.gender === 'male' ? 1 : 0,
        });

        const interventionRecommendations = getInterventionRecommendations({
          predictionStatus,
          hoursStudied: inputData.hoursStudied,
          attendance: inputData.attendance,
          extracurricularActivities: inputData.extracurricularActivities,
          sleepHours: inputData.sleepHours,
          motivationLevel: predData.motivationLevel,
          tutoringSessions: inputData.tutoringSessions,
          physicalActivity: inputData.physicalActivity,
          learningDisabilities: inputData.learningDisabilities,
        });

        // Create prediction record
        const prediction = await Prediction.create({
          studentId: predData.studentId,
          ...inputData,
          motivationLevel: predData.motivationLevel,
          teacherQuality: predData.teacherQuality,
          predictionScore,
          predictionStatus,
          interventionRecommendations: Array.isArray(interventionRecommendations)
            ? interventionRecommendations.join('\n\n')
            : interventionRecommendations,
          semester: predData.semester,
          academicYear: predData.academicYear,
          createdBy: req.user?.id
        });

        results.push({
          index: i,
          predictionId: prediction.id,
          studentId: predData.studentId,
          studentName: student.name,
          predictionScore,
          predictionStatus
        });

      } catch (error) {
        errors.push({
          index: i,
          studentId: predictions[i]?.studentId,
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      data: {
        successful: results,
        failed: errors,
        summary: {
          total: predictions.length,
          successful: results.length,
          failed: errors.length
        }
      },
      message: `Bulk prediction completed: ${results.length} successful, ${errors.length} failed`
    });

  } catch (error) {
    console.error('Bulk prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process bulk predictions',
      error: error.message
    });
  }
};

// Export all functions
module.exports = {
  createPrediction,
  getStudentPredictions,
  getPredictionById,
  updatePrediction,
  deletePrediction,
  getModelStatistics,
  createBulkPredictions,
  checkFlaskHealth
};