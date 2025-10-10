// src/routes/user.routes.js

/**
 * ═══════════════════════════════════════════════════
 * 👤 USER ROUTES
 * ═══════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación
router.use(protect);

router.get('/profile', userController.getProfile);
router.get('/progress', userController.getProgress);
router.get('/badges', userController.getBadges);
router.put('/profile', userController.updateProfile);

// Leaderboard es público pero requiere auth para ver tu posición
router.get('/leaderboard', userController.getLeaderboard);

module.exports = router;