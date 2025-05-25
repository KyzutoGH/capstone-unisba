const express = require('express');
const router = express.Router();

const {
  createPrediction,
  getStudentPredictions,
  getPredictionById,
  updatePrediction,
  deletePrediction,
} = require('../controllers/predictionController');

const { authenticateUser } = require('../middlewares/authMiddleware');
const { validate, predictionInputSchema } = require('../middlewares/validationMiddleware');

// Prediction routes
router.post('/student/:studentId', authenticateUser, validate(predictionInputSchema), createPrediction);
router.get('/student/:studentId', authenticateUser, getStudentPredictions);
router.get('/:id', authenticateUser, getPredictionById);
router.put('/:id', authenticateUser, updatePrediction);
router.delete('/:id', authenticateUser, deletePrediction);

module.exports = router;