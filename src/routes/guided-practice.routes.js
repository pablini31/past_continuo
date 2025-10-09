// src/routes/guided-practice.routes.js

/**
 * ═══════════════════════════════════════════════════
 * 🎓 GUIDED PRACTICE ROUTES
 * ═══════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();

const guidedPracticeController = require('../controllers/guided-practice.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');
const { practiceLimiter } = require('../middlewares/rateLimit.middleware');

// Aplicar rate limiting
router.use(practiceLimiter);

// Rutas de tutoriales
router.get('/tutorials', guidedPracticeController.getAvailableTutorials);
router.post('/tutorials/start', optionalAuth, guidedPracticeController.startTutorial);
router.post('/tutorials/next', optionalAuth, guidedPracticeController.nextStep);
router.post('/tutorials/previous', optionalAuth, guidedPracticeController.previousStep);
router.get('/tutorials/progress', optionalAuth, guidedPracticeController.getTutorialProgress);

// Rutas de asistencia
router.post('/tutorials/hint', optionalAuth, guidedPracticeController.generateHint);
router.post('/tutorials/evaluate', optionalAuth, guidedPracticeController.evaluateResponse);
router.post('/tutorials/instructions', optionalAuth, guidedPracticeController.getProgressiveInstructions);

module.exports = router;