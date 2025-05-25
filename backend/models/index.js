const User = require('./userModel');
const Student = require('./studentModel');
const Prediction = require('./predictionModel');

// Define relationships
User.hasMany(Student, {
  foreignKey: 'userId',
  as: 'students',
  onDelete: 'CASCADE',
});
Student.belongsTo(User, {
  foreignKey: 'userId',
  as: 'teacher',
});

Student.hasMany(Prediction, {
  foreignKey: 'studentId',
  as: 'predictions',
  onDelete: 'CASCADE',
});
Prediction.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student',
});

module.exports = {
  User,
  Student,
  Prediction,
};