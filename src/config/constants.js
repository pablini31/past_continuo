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

  // 🎯 Análisis de texto
  ANALYSIS: {
    MIN_TEXT_LENGTH: 10,
    MAX_TEXT_LENGTH: 1000,
    MIN_WORDS_FOR_BONUS: 50,
    DEBOUNCE_DELAY: 1500, // ms para análisis en vivo
    CONFIDENCE_THRESHOLD: 70 // % para considerar "correcto"
  },

  // ⏱️ Tiempos
  SESSION_DURATION: 20 * 60 * 1000, // 20 minutos
  STREAK_RESET_HOURS: 48,

  // 🏆 Badges y logros
  BADGES: {
    FIRST_SENTENCE: { id: 'first_sentence', name: 'First Steps', description: 'Complete your first sentence' },
    STREAK_3: { id: 'streak_3', name: 'Getting Started', description: '3 days streak' },
    STREAK_7: { id: 'streak_7', name: 'Week Warrior', description: '7 days streak' },
    STREAK_30: { id: 'streak_30', name: 'Monthly Master', description: '30 days streak' },
    PERFECT_10: { id: 'perfect_10', name: 'Perfect Ten', description: '10 perfect sentences in a row' },
    GRAMMAR_GURU: { id: 'grammar_guru', name: 'Grammar Guru', description: '95% accuracy over 50 sentences' },
    CONNECTOR_MASTER: { id: 'connector_master', name: 'Connector Master', description: 'Master all three connectors' },
    SPEED_WRITER: { id: 'speed_writer', name: 'Speed Writer', description: 'Write 100+ words in one session' }
  },

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