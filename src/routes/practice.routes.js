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

// Todas las rutas requieren autenticación
router.use(protect);

router.post('/submit', sentenceValidation, practiceController.submitSentence);
router.get('/history', practiceController.getHistory);
router.get('/stats', practiceController.getStats);
router.get('/connector-stats', practiceController.getConnectorStats);
router.get('/top-sentences', practiceController.getTopSentences);

module.exports = router;