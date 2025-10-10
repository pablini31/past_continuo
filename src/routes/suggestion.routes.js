// src/routes/suggestion.routes.js

/**
 * ═══════════════════════════════════════════════════
 * 💡 SUGGESTION ROUTES
 * ═══════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();

const suggestionController = require('../controllers/suggestion.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');

// Rutas públicas (no requieren auth)
router.get('/', suggestionController.getAllSuggestions);
router.get('/search', suggestionController.searchSuggestions);
router.get('/:connector', suggestionController.getSuggestions);
router.get('/:connector/random', suggestionController.getRandomSuggestions);

// Ruta protegida (admin - por ahora sin protección)
router.post('/', optionalAuth, suggestionController.addSuggestion);

module.exports = router;