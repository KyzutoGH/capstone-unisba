//server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Import database configuration
const { sequelize, testDbConnection } = require('./config/database');
const errorHandler = require('./utils/errorHandler');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Serve static files for TensorFlow.js model
const modelDir = path.join(__dirname, 'tfjs_model');
if (fs.existsSync(modelDir)) {
  app.use('/model', express.static(modelDir));
} else {
  console.warn('Warning: TensorFlow.js model directory not found at', modelDir);
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testDbConnection();

    // Sync database models
    await sequelize.sync();
    console.log('Database synced successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Model served at: http://localhost:${PORT}/model/model.json`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
