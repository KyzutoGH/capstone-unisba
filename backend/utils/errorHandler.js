// Centralized error handler
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: err.errors.map(e => e.message).join(', '),
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau kedaluwarsa',
    });
  }

  // Default server error
  return res.status(500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server',
  });
};

module.exports = errorHandler;