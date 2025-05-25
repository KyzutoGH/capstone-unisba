const Joi = require('joi');

// Validation middleware generator
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    
    next();
  };
};

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(30),
  role: Joi.string().valid('admin', 'teacher').default('teacher'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const studentSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  studentId: Joi.string().required().min(3).max(20),
  gender: Joi.string().valid('male', 'female').required(),
  dateOfBirth: Joi.date().iso().required(),
  grade: Joi.string().required(),
  class: Joi.string().required(),
});

const predictionInputSchema = Joi.object({
  hoursStudied: Joi.number().required().min(0).max(24),
  attendance: Joi.number().required().min(0).max(100),
  extracurricularActivities: Joi.boolean().required(),
  sleepHours: Joi.number().required().min(0).max(24),
  previousScores: Joi.number().required().min(0).max(100),
  motivationLevel: Joi.number().integer().required().min(1).max(10),
  tutoringSessions: Joi.number().integer().required().min(0),
  teacherQuality: Joi.number().integer().required().min(1).max(10),
  physicalActivity: Joi.number().integer().required().min(1).max(10),
  learningDisabilities: Joi.boolean().required(),
  semester: Joi.string().required(),
  academicYear: Joi.string().required(),
  examScore: Joi.number().min(0).max(100),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  studentSchema,
  predictionInputSchema,
};