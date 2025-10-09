// src/routes/contextual-guides.routes.js

/**
 * ═══════════════════════════════════════════════════
 * 🎯 CONTEXTUAL GUIDES ROUTES
 * ═══════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();

const contextualGuidesController = require('../controllers/contextual-guides.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');
const { practiceLimiter } = require('../middlewares/rateLimit.middleware');

// Aplicar rate limiting
router.use(practiceLimiter);

// Rutas principales de guías contextuales
router.post('/tips', optionalAuth, contextualGuidesController.generateTips);
router.post('/mini-lesson', optionalAuth, contextualGuidesController.generateMiniLesson);
router.post('/motivation', optionalAuth, contextualGuidesController.generateMotivation);
router.post('/contextual', optionalAuth, contextualGuidesController.generateContextualGuide);

// Rutas de progreso del usuario
router.post('/progress', optionalAuth, contextualGuidesController.updateProgress);
router.get('/stats/:userId', optionalAuth, contextualGuidesController.getUserStats);

// Rutas de utilidad
router.get('/random-tip', contextualGuidesController.getRandomTip);
router.get('/lesson-types', contextualGuidesController.getLessonTypes);

module.exports = router;