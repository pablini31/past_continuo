// src/routes/auth.routes.js

/**
 * ═══════════════════════════════════════════════════
 * 🔐 AUTH ROUTES
 * ═══════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { registerValidation, loginValidation } = require('../middlewares/validation.middleware');

// Rutas públicas
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/logout', authController.logout);

// Rutas protegidas
router.get('/me', protect, authController.getMe);
router.post('/refresh', authController.refreshToken);

module.exports = router;