// src/config/constants.js

/**
 * 📌 Constantes de la aplicación
 * Valores que usamos en todo el proyecto
 */

module.exports = {
  // 🎮 Gamificación
  POINTS: {
    CORRECT_SENTENCE: 10,
    PERFECT_GRAMMAR: 15,
    STREAK_BONUS: 5,
    DAILY_LOGIN: 2
  },

  // 📊 Niveles
  LEVELS: {
    BEGINNER: { min: 0, max: 100, name: 'Beginner' },
    INTERMEDIATE: { min: 101, max: 500, name: 'Intermediate' },
    ADVANCED: { min: 501, max: 1000, name: 'Advanced' },
    EXPERT: { min: 1001, max: Infinity, name: 'Expert' }
  },

  // 🔤 Palabras conectoras
  CONNECTORS: ['while', 'when', 'as'],

  // ⏱️ Tiempos
  SESSION_DURATION: 20 * 60 * 1000, // 20 minutos
  STREAK_RESET_HOURS: 48,

  // 📝 Validaciones
  VALIDATION: {
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 20,
    MIN_PASSWORD_LENGTH: 6,
    MIN_SENTENCE_LENGTH: 10,
    MAX_SENTENCE_LENGTH: 200
  },

  // 🎯 HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  }
};