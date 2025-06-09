const { Student, Prediction, User } = require('../models');
const { Op, Sequelize } = require('sequelize');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Define base query condition
    const userCondition = isAdmin ? {} : { userId };

    // Get total students count
    const totalStudents = await Student.count({
      where: userCondition,
    });

    // Get predictions stats with proper joins
    let predictionStats = {
      success: 0,
      at_risk: 0,
      fail: 0,
    };

    try {
      const predictions = await Prediction.findAll({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: [], // Remove attributes since we're not using them
            where: isAdmin ? {} : { userId },
            required: true,
          },
        ],
        attributes: [
          'predictionStatus',
          [Sequelize.fn('COUNT', Sequelize.col('Prediction.id')), 'count'],
        ],
        group: ['predictionStatus'],
        raw: true,
      });

      // Format prediction stats
      predictions.forEach((prediction) => {
        if (prediction.predictionStatus && predictionStats.hasOwnProperty(prediction.predictionStatus)) {
          predictionStats[prediction.predictionStatus] = parseInt(prediction.count) || 0;
        }
      });
    } catch (predictionError) {
      console.error('Error fetching prediction stats:', predictionError);
    }

    // Get recent predictions
    let recentPredictions = [];
    try {
      recentPredictions = await Prediction.findAll({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'name', 'grade', 'class'],
            where: isAdmin ? {} : { userId },
            required: true,
          },
        ],
        order: [['createdAt', 'DESC']],
        limit: 5,
      });
    } catch (recentError) {
      console.error('Error fetching recent predictions:', recentError);
    }

    // Get class performance - FIXED missing comma
    let classPerformance = [];
    try {
      classPerformance = await Prediction.findAll({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: [], // Remove attributes from here since we're grouping by class
            where: isAdmin ? {} : { userId },
            required: true,
          },
        ],
        attributes: [
          [Sequelize.literal('`student`.`class`'), 'class'],
          [Sequelize.fn('AVG', Sequelize.col('Prediction.prediction_score')), 'averageScore'], // Added missing comma
          [Sequelize.fn('COUNT', Sequelize.col('Prediction.id')), 'predictionCount'],
        ],
        group: ['student.class'], // Simplified group by
        raw: true,
      });

      // Format the results
      classPerformance = classPerformance.map(item => ({
        class: item.class,
        averageScore: parseFloat(item.averageScore || 0).toFixed(1),
        predictionCount: parseInt(item.predictionCount || 0)
      }));
    } catch (classError) {
      console.error('Error fetching class performance:', classError);
    }

    // Success rate by factor (simplified)
    const factorSuccessRate = {
      extracurricularActivities: {
        true: { success: 0, at_risk: 0, fail: 0, total: 0 },
        false: { success: 0, at_risk: 0, fail: 0, total: 0 },
      },
      sleepHours: {
        true: { success: 0, at_risk: 0, fail: 0, total: 0 },
        false: { success: 0, at_risk: 0, fail: 0, total: 0 },
      },
      learningDisabilities: {
        true: { success: 0, at_risk: 0, fail: 0, total: 0 },
        false: { success: 0, at_risk: 0, fail: 0, total: 0 },
      },
    };

    // Get admin only stats
    let teacherStats = [];
    if (isAdmin) {
      try {
        teacherStats = await User.findAll({
          where: { role: 'teacher' },
          attributes: [
            'id', 
            'name',
            [Sequelize.fn('COUNT', Sequelize.col('students.id')), 'studentCount'],
          ],
          include: [
            {
              model: Student,
              as: 'students',
              attributes: [],
            },
          ],
          group: ['User.id'],
          raw: true,
        });
      } catch (teacherError) {
        console.error('Error fetching teacher stats:', teacherError);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        predictionStats,
        recentPredictions,
        classPerformance,
        factorSuccessRate,
        ...(isAdmin && { teacherStats }),
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data statistik dashboard',
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};