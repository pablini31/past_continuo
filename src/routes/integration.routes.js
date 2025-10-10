// src/routes/integration.routes.js

/**
 * ═══════════════════════════════════════════════════
 * 🔧 INTEGRATION ROUTES
 * ═══════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();

const integrationController = require('../controllers/integration.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');
const { practiceLimiter } = require('../middlewares/rateLimit.middleware');

// Aplicar rate limiting
router.use(practiceLimiter);

// Rutas principales de integración
router.post('/analyze', optionalAuth, integrationController.performIntegratedAnalysis);
router.post('/optimize', integrationController.optimizePerformance);
router.post('/test', integrationController.runIntegrationTests);

// Rutas de monitoreo y métricas
router.get('/metrics', integrationController.getPerformanceMetrics);
router.get('/health', integrationController.checkSystemHealth);
router.get('/stats', integrationController.getSystemStats);

// Rutas de utilidad (solo desarrollo)
router.post('/reset-cache', integrationController.resetSystemCache);

module.exports = router;