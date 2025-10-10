// src/routes/practice.routes.js

/**
 * ═══════════════════════════════════════════════════
 * 📝 PRACTICE ROUTES
 * ═══════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();

const practiceController = require('../controllers/practice.controller');
const { protect } = require('../middlewares/auth.middleware');
const { sentenceValidation } = require('../middlewares/validation.middleware');
const { createRateLimit } = require('../middlewares/rateLimit.middleware');

// Rate limit more permissive for analysis endpoints
const analysisRateLimit = createRateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  maxRequests: 20, // 20 análisis por 5 minutos
  message: 'Too many analysis requests, please wait before trying again'
});

// Analysis endpoints - no auth required for demo
router.post('/live-analyze', practiceController.liveAnalyze);
router.post('/full-analyze', analysisRateLimit, practiceController.fullAnalyze);

// Todas las otras rutas requieren autenticación
router.use(protect);

router.post('/submit', sentenceValidation, practiceController.submitSentence);
router.get('/history', practiceController.getHistory);
router.get('/stats', practiceController.getStats);
router.get('/connector-stats', practiceController.getConnectorStats);

module.exports = router;