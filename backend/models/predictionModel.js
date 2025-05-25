const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Prediction = sequelize.define(
  'Prediction',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
    },
    hoursStudied: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    attendance: {
      type: DataTypes.FLOAT,  // Percentage
      allowNull: false,
    },
    extracurricularActivities: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    sleepHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    previousScores: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    motivationLevel: {
      type: DataTypes.INTEGER, // Scale 1-10
      allowNull: false,
    },
    tutoringSessions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacherQuality: {
      type: DataTypes.INTEGER, // Scale 1-10
      allowNull: false,
    },
    physicalActivity: {
      type: DataTypes.INTEGER, // Scale 1-10
      allowNull: false,
    },
    learningDisabilities: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    examScore: {
      type: DataTypes.FLOAT,
      allowNull: true, // Dapat null jika belum ada hasil prediksi
    },
    predictionScore: {
      type: DataTypes.FLOAT,
      allowNull: true, // Hasil prediksi
    },
    predictionStatus: {
      type: DataTypes.ENUM('success', 'at_risk', 'fail'),
      allowNull: true, // Status hasil prediksi
    },
    interventionRecommendations: {
      type: DataTypes.TEXT,
      allowNull: true, // Rekomendasi intervensi berdasarkan hasil prediksi
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    predictionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'predictions',
  }
);

module.exports = Prediction;