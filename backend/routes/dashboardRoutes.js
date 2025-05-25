const express = require('express');
const router = express.Router();

const { getDashboardStats } = require('../controllers/dashboardController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Dashboard routes
router.get('/stats', authenticateUser, getDashboardStats);

module.exports = router;