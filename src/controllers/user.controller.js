// src/controllers/user.controller.js

/**
 * ═══════════════════════════════════════════════════
 * 👤 USER CONTROLLER
 * ═══════════════════════════════════════════════════
 * 
 * Maneja las peticiones HTTP de usuarios
 */

const authService = require('../services/auth.service');
const practiceService = require('../services/practice.service');
const gamificationService = require('../services/gamification.service');
const { success, error } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

/**
 * 👤 GET /api/users/profile
 * Obtener perfil del usuario actual
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await authService.getUserById(userId);
    const stats = practiceService.getUserStats(userId);

    return success(res, { user, stats }, 'Profile retrieved successfully');

  } catch (err) {
    next(err);
  }
};

/**
 * 📊 GET /api/users/progress
 * Obtener progreso detallado
 */
const getProgress = async (req, res, next) => {
  try {
    const userId = req.userId;

    const stats = practiceService.getUserStats(userId);
    const connectorStats = practiceService.getConnectorStats(userId);
    const topSentences = practiceService.getTopSentences(userId, 5);

    return success(res, {
      overall: stats,
      byConnector: connectorStats,
      topSentences
    }, 'Progress retrieved successfully');

  } catch (err) {
    next(err);
  }
};

/**
 * 🏆 GET /api/users/leaderboard
 * Obtener tabla de líderes
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const leaderboard = gamificationService.getLeaderboard(limit);

    return success(res, { leaderboard }, 'Leaderboard retrieved successfully');

  } catch (err) {
    next(err);
  }
};

/**
 * 🎖️ GET /api/users/badges
 * Obtener badges del usuario
 */
const getBadges = async (req, res, next) => {
  try {
    const userId = req.userId;

    const stats = practiceService.getUserStats(userId);
    const badges = stats.badges || [];

    // Lista de todos los badges disponibles
    const allBadges = [
      { id: 'first_sentence', name: 'First Steps', description: 'Complete your first sentence', icon: '📝' },
      { id: 'ten_sentences', name: 'Practitioner', description: 'Complete 10 sentences', icon: '✍️' },
      { id: 'fifty_sentences', name: 'Dedicated Learner', description: 'Complete 50 sentences', icon: '📚' },
      { id: 'week_streak', name: 'Week Warrior', description: 'Practice for 7 days in a row', icon: '🔥' },
      { id: 'perfect_10', name: 'Perfection', description: '10 correct sentences in a row', icon: '⭐' },
      { id: 'level_intermediate', name: 'Rising Star', description: 'Reach Intermediate level', icon: '🌟' }
    ];

    // Marcar badges obtenidos
    const badgesWithStatus = allBadges.map(badge => ({
      ...badge,
      earned: badges.includes(badge.id)
    }));

    return success(res, { badges: badgesWithStatus }, 'Badges retrieved successfully');

  } catch (err) {
    next(err);
  }
};

/**
 * ✏️ PUT /api/users/profile (Opcional - para actualizar perfil)
 * Actualizar perfil del usuario
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { username } = req.body;

    // TODO: Implementar lógica de actualización
    // Por ahora solo retornamos un mensaje

    return success(res, { message: 'Feature coming soon!' }, 'Profile update not implemented yet');

  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  getProgress,
  getLeaderboard,
  getBadges,
  updateProfile
};