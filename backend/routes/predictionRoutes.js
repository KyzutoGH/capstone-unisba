// routes/predictionRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Import existing controllers and middlewares
const {
  createPrediction,
  getStudentPredictions,
  getPredictionById,
  updatePrediction,
  deletePrediction,
} = require('../controllers/predictionController');

const { authenticateUser } = require('../middlewares/authMiddleware');
const { validate, predictionInputSchema } = require('../middlewares/validationMiddleware');

// Flask API URL - sesuaikan dengan setup Flask Anda
const FLASK_API_URL = process.env.FLASK_API_URL || 'http://127.0.0.1:5000/';

// ================================
// EXISTING CRUD ROUTES (Database)
// ================================
router.post('/student/:studentId', authenticateUser, createPrediction);
router.get('/student/:studentId', authenticateUser, getStudentPredictions);
router.get('/:id', authenticateUser, getPredictionById);
router.put('/:id', authenticateUser, updatePrediction);
router.delete('/:id', authenticateUser, deletePrediction);

// ================================
// NEW ML PREDICTION ROUTES (Flask)
// ================================

// Health check untuk Flask API
router.get('/ml/health', async (req, res) => {
    try {
        const flaskResponse = await axios.get(`${FLASK_API_URL}/health`, {
            timeout: 5000
        });
        
        res.json({
            success: true,
            flask_status: flaskResponse.data,
            message: 'Flask API is healthy'
        });
    } catch (error) {
        console.error('Flask health check failed:', error.message);
        res.status(503).json({
            success: false,
            error: 'Flask API not available',
            message: error.message
        });
    }
});

// ML Prediction endpoint - with authentication
router.post('/ml/predict', authenticateUser, async (req, res) => {
    try {
        const { input, student_id } = req.body;
        
        if (!input) {
            return res.status(400).json({
                success: false,
                error: 'Input data is required'
            });
        }
        
        console.log('Making prediction request to Flask...');
        
        // Call Flask API
        const flaskResponse = await axios.post(`${FLASK_API_URL}/predict`, {
            input: input
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });
        
        const prediction = flaskResponse.data;
        
        // TODO: Save prediction to database using existing controller
        // You can integrate with createPrediction controller here
        // const savedPrediction = await createPrediction({
        //     student_id,
        //     input_data: input,
        //     prediction_result: prediction,
        //     user: req.user
        // });
        
        res.json({
            success: true,
            data: {
                prediction: prediction.prediction,
                input_shape: prediction.input_shape,
                student_id: student_id || null,
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Prediction error:', error.message);
        
        if (error.response?.data) {
            // Flask API returned an error
            return res.status(error.response.status || 500).json({
                success: false,
                error: error.response.data.error || 'Flask API error',
                details: error.response.data
            });
        } else if (error.code === 'ECONNREFUSED') {
            // Flask server not running
            return res.status(503).json({
                success: false,
                error: 'ML service unavailable',
                message: 'Please ensure Flask ML service is running'
            });
        } else {
            // Other errors
            return res.status(500).json({
                success: false,
                error: 'Prediction failed',
                message: error.message
            });
        }
    }
});

// Batch ML prediction endpoint - with authentication
router.post('/ml/predict-batch', authenticateUser, async (req, res) => {
    try {
        const { inputs, student_ids } = req.body;
        
        if (!Array.isArray(inputs)) {
            return res.status(400).json({
                success: false,
                error: 'inputs must be an array'
            });
        }
        
        console.log(`Processing batch prediction for ${inputs.length} inputs...`);
        
        // Process predictions sequentially to avoid overwhelming Flask
        const results = [];
        
        for (let i = 0; i < inputs.length; i++) {
            try {
                const flaskResponse = await axios.post(`${FLASK_API_URL}/predict`, {
                    input: inputs[i]
                }, {
                    timeout: 30000
                });
                
                results.push({
                    index: i,
                    success: true,
                    prediction: flaskResponse.data.prediction,
                    student_id: student_ids?.[i] || null
                });
                
            } catch (error) {
                console.error(`Batch prediction ${i} failed:`, error.message);
                results.push({
                    index: i,
                    success: false,
                    error: error.message,
                    student_id: student_ids?.[i] || null
                });
            }
        }
        
        const successful = results.filter(r => r.success).length;
        
        res.json({
            success: true,
            data: {
                results: results,
                total: inputs.length,
                successful: successful,
                failed: inputs.length - successful,
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Batch prediction error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Batch prediction failed',
            message: error.message
        });
    }
});

// Get ML model information
router.get('/ml/model-info', authenticateUser, async (req, res) => {
    try {
        const flaskResponse = await axios.get(`${FLASK_API_URL}/model-info`, {
            timeout: 10000
        });
        
        res.json({
            success: true,
            data: flaskResponse.data
        });
        
    } catch (error) {
        console.error('Model info error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to get model information',
            message: error.message
        });
    }
});

// Get prediction history from database (existing functionality)  
router.get('/ml/history/:student_id?', authenticateUser, async (req, res) => {
    try {
        const { student_id } = req.params;
        
        // Use existing controller to get predictions
        if (student_id) {
            // Call existing getStudentPredictions function
            const mockReq = { ...req, params: { studentId: student_id } };
            return getStudentPredictions(mockReq, res);
        } else {
            // Get all predictions (you might need to create this in controller)
            res.json({
                success: true,
                message: 'Use specific student ID or implement get all predictions',
                data: []
            });
        }
        
    } catch (error) {
        console.error('Get ML history error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to get prediction history',
            message: error.message
        });
    }
});

module.exports = router;