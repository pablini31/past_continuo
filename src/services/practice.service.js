// src/services/practice.service.js

/**
 * ═══════════════════════════════════════════════════
 * 📝 PRACTICE SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Maneja toda la lógica de práctica:
 * - Validar oraciones
 * - Guardar intentos
 * - Historial
 * - Estadísticas
 */

const { mockSentences, mockProgress } = require('../utils/mockData');
const { 
  validatePastContinuous, 
  detectConnector,
  validateLength,
  sanitizeSentence
} = require('../utils/validator');
const gamificationService = require('./gamification.service');

/**
 * ✅ VALIDAR Y GUARDAR ORACIÓN
 * 
 * @param {number} userId 
 * @param {Object} sentenceData - {part1, part2}
 * @returns {Object} Resultado de la validación
 */
const submitSentence = async (userId, sentenceData) => {
  const { part1, part2 } = sentenceData;

  // 1. Sanitizar inputs
  const cleanPart1 = sanitizeSentence(part1);
  const cleanPart2 = sanitizeSentence(part2);

  // 2. Validar longitud
  if (!validateLength(cleanPart1) || !validateLength(cleanPart2)) {
    throw {
      statusCode: 400,
      message: 'Sentence is too short or too long'
    };
  }

  // 3. Detectar conector
  const connector = detectConnector(cleanPart1);
  
  if (!connector) {
    throw {
      statusCode: 400,
      message: 'Sentence must contain a connector (while, when, or as)'
    };
  }

  // 4. Validar que use Past Continuous
  const isPart1Valid = validatePastContinuous(cleanPart1);
  const isPart2Valid = validatePastContinuous(cleanPart2);

  const isCorrect = isPart1Valid && isPart2Valid;
  const isPerfectGrammar = isCorrect; // Por ahora, simplificado

  // 5. Calcular puntos
  const currentProgress = mockProgress[userId];
  const currentStreak = currentProgress?.streak || 0;
  
  const points = gamificationService.calculatePoints(
    isCorrect,
    isPerfectGrammar,
    currentStreak
  );

  // 6. Crear registro de oración
  const newSentence = {
    id: mockSentences.length + 1,
    userId,
    part1: cleanPart1,
    connector,
    part2: cleanPart2,
    isCorrect,
    isPerfectGrammar,
    points,
    createdAt: new Date()
  };

  // 7. Guardar oración
  mockSentences.push(newSentence);

  // 8. Actualizar progreso del usuario
  const progressUpdate = gamificationService.updateUserProgress(
    userId,
    points,
    isCorrect
  );

  // 9. Preparar feedback
  const feedback = {
    isCorrect,
    points,
    message: isCorrect 
      ? '🎉 Perfect! Great use of Past Continuous!' 
      : '❌ Try again! Make sure both parts use Past Continuous (was/were + verb-ing)',
    details: {
      part1Valid: isPart1Valid,
      part2Valid: isPart2Valid,
      connectorUsed: connector
    }
  };

  return {
    sentence: newSentence,
    feedback,
    progress: progressUpdate.progress,
    newBadges: progressUpdate.newBadges,
    levelInfo: progressUpdate.levelInfo
  };
};

/**
 * 📜 OBTENER HISTORIAL DE ORACIONES
 * 
 * @param {number} userId 
 * @param {number} limit 
 * @returns {Array} Historial de oraciones
 */
const getSentenceHistory = (userId, limit = 20) => {
  const userSentences = mockSentences
    .filter(s => s.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

  return userSentences.map(sentence => ({
    id: sentence.id,
    fullSentence: `${sentence.part1} ${sentence.connector} ${sentence.part2}`,
    isCorrect: sentence.isCorrect,
    points: sentence.points,
    createdAt: sentence.createdAt
  }));
};

/**
 * 📊 OBTENER ESTADÍSTICAS DEL USUARIO
 * 
 * @param {number} userId 
 * @returns {Object} Estadísticas completas
 */
const getUserStats = (userId) => {
  const progress = mockProgress[userId];

  if (!progress) {
    return {
      totalSentences: 0,
      correctSentences: 0,
      accuracy: 0,
      totalPoints: 0,
      level: 'beginner',
      streak: 0,
      badges: []
    };
  }

  const levelInfo = gamificationService.calculateLevel(progress.totalPoints);
  const streakInfo = gamificationService.calculateStreak(progress.lastPracticeDate);

  return {
    ...progress,
    levelInfo,
    streakInfo,
    lastPractice: progress.lastPracticeDate
  };
};

/**
 * 🎯 OBTENER ESTADÍSTICAS POR CONECTOR
 * 
 * @param {number} userId 
 * @returns {Object} Stats agrupadas por conector
 */
const getConnectorStats = (userId) => {
  const userSentences = mockSentences.filter(s => s.userId === userId);

  const stats = {
    while: { total: 0, correct: 0, accuracy: 0 },
    when: { total: 0, correct: 0, accuracy: 0 },
    as: { total: 0, correct: 0, accuracy: 0 }
  };

  userSentences.forEach(sentence => {
    const connector = sentence.connector;
    stats[connector].total += 1;
    if (sentence.isCorrect) {
      stats[connector].correct += 1;
    }
  });

  // Calcular accuracy para cada conector
  Object.keys(stats).forEach(connector => {
    if (stats[connector].total > 0) {
      stats[connector].accuracy = Math.round(
        (stats[connector].correct / stats[connector].total) * 100
      );
    }
  });

  return stats;
};

/**
 * 🔝 OBTENER MEJORES ORACIONES
 * 
 * @param {number} userId 
 * @param {number} limit 
 * @returns {Array} Mejores oraciones del usuario
 */
const getTopSentences = (userId, limit = 5) => {
  const userSentences = mockSentences
    .filter(s => s.userId === userId && s.isCorrect)
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);

  return userSentences.map(sentence => ({
    id: sentence.id,
    fullSentence: `${sentence.part1} ${sentence.connector} ${sentence.part2}`,
    points: sentence.points,
    createdAt: sentence.createdAt
  }));
};

module.exports = {
  submitSentence,
  getSentenceHistory,
  getUserStats,
  getConnectorStats,
  getTopSentences
};