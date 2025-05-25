const { verifyToken } = require('../utils/jwtUtils');
const { User } = require('../models');

const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token tidak valid.',
      });
    }

    // Get token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token tidak valid atau kedaluwarsa.',
      });
    }

    // Check if user exists
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.active) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna tidak ditemukan atau tidak aktif.',
      });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error saat autentikasi.',
    });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Akses ditolak. Hanya admin yang dapat mengakses.',
    });
  }
};

module.exports = {
  authenticateUser,
  authorizeAdmin,
};