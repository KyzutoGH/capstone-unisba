// middlewares/validationMiddleware.js - UPDATED VERSION
const Joi = require('joi');

// Validation middleware generator - IMPROVED WITH LOGGING
const validate = (schema) => {
  return (req, res, next) => {
    console.log('🔍 Validation middleware called');
    console.log('📝 Request body:', req.body);
    
    const { error } = schema.validate(req.body);
    
    if (error) {
      console.log('❌ Validation failed:', error.details[0].message);
      console.log('🚨 Full error details:', error.details);
      
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        field: error.details[0].path?.join('.'),
        value: error.details[0].context?.value
      });
    }
    
    console.log('✅ Validation passed');
    next();
  };
};

// FIXED SCHEMA - sesuai dengan data yang dikirim frontend
const predictionInputSchema = Joi.object({
  hoursStudied: Joi.number().required().min(0).max(24),
  attendance: Joi.number().required().min(0).max(100),
  extracurricularActivities: Joi.boolean().required(),
  sleepHours: Joi.number().required().min(0).max(24),
  previousScores: Joi.number().required().min(0).max(100),
  
  // FIXED: Accept both number and string for motivationLevel
  motivationLevel: Joi.alternatives().try(
    Joi.number().integer().min(1).max(10),
    Joi.string().valid('High', 'Medium', 'Low')
  ).required(),
  
  tutoringSessions: Joi.number().integer().required().min(0),
  
  // FIXED: Accept both number and string for teacherQuality  
  teacherQuality: Joi.alternatives().try(
    Joi.number().integer().min(1).max(10),
    Joi.string().valid('High', 'Medium', 'Low')
  ).required(),
  
  physicalActivity: Joi.number().integer().required().min(1).max(10),
  learningDisabilities: Joi.boolean().required(),
  semester: Joi.string().required(),
  academicYear: Joi.string().required(),
  examScore: Joi.number().min(0).max(100).optional().allow(null, '') // Allow empty
});

// ALTERNATIVE SIMPLER SCHEMA (temporary for testing)
const predictionInputSchemaSimple = Joi.object({
  hoursStudied: Joi.number().required(),
  attendance: Joi.number().required(),
  extracurricularActivities: Joi.boolean().required(),
  sleepHours: Joi.number().required(),
  previousScores: Joi.number().required(),
  motivationLevel: Joi.required(), // Accept any type for now
  tutoringSessions: Joi.number().required(),
  teacherQuality: Joi.required(), // Accept any type for now
  physicalActivity: Joi.number().required(),
  learningDisabilities: Joi.boolean().required(),
  semester: Joi.string().required(),
  academicYear: Joi.string().required(),
  examScore: Joi.optional()
});

// Other schemas remain the same
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

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  studentSchema,
  predictionInputSchema,
  predictionInputSchemaSimple, // Export simple version for testing
};