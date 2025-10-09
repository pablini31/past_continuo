// src/routes/real-time.routes.js

/**
 * ═══════════════════════════════════════════════════
 * ⚡ REAL-TIME ROUTES
 * ═══════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();

const realTimeController = require('../controllers/real-time.controller');
const { protect, optionalAuth } = require('../middlewares/auth.middleware');
const { practiceLimiter } = require('../middlewares/rateLimit.middleware');

// Aplicar rate limiting específico para tiempo real
router.use(practiceLimiter);

// Rutas principales de análisis en tiempo real
router.post('/analyze', optionalAuth, realTimeController.analyzeRealTime);
router.post('/incremental', optionalAuth, realTimeController.analyzeIncremental);

// Rutas optimizadas para componentes específicos
router.post('/icons', optionalAuth, realTimeController.updateIcons);
router.post('/suggestions', optionalAuth, realTimeController.getSuggestions);
router.post('/validate', optionalAuth, realTimeController.validateStructure);

// Rutas de corrección inteligente
router.post('/correct', optionalAuth, realTimeController.correctText);
router.get('/correction-stats', realTimeController.getCorrectionStats);

// Rutas de utilidad
router.get('/performance', realTimeController.getPerformanceStats);
router.post('/clear-cache', realTimeController.clearCache);

module.exports = router;