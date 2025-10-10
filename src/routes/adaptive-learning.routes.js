// src/routes/adaptive-learning.routes.js

/**
 * ═══════════════════════════════════════════════════
 * 🧠 ADAPTIVE LEARNING ROUTES
 * ═══════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();

const adaptiveLearningController = require('../controllers/adaptive-learning.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');
const { practiceLimiter } = require('../middlewares/rateLimit.middleware');

// Aplicar rate limiting
router.use(practiceLimiter);

// Rutas de evaluación y adaptación
router.get('/assessment', adaptiveLearningController.getInitialAssessment);
router.post('/evaluate', optionalAuth, adaptiveLearningController.evaluateInitialLevel);
router.post('/difficulty', optionalAuth, adaptiveLearningController.adaptDifficulty);

// Rutas de memoria y personalización
router.post('/memory', optionalAuth, adaptiveLearningController.updateUserMemory);
router.get('/recommendations', optionalAuth, adaptiveLearningController.getPersonalizedRecommendations);

// Rutas de perfil y progreso
router.get('/profile', optionalAuth, adaptiveLearningController.getUserProfile);
router.get('/progress', optionalAuth, adaptiveLearningController.getLearningProgress);

// Rutas de configuración
router.put('/preferences', optionalAuth, adaptiveLearningController.updateUserPreferences);
router.put('/goals', optionalAuth, adaptiveLearningController.updateLearningGoals);

module.exports = router;