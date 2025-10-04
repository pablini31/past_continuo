// src/services/gamification.service.js

/**
 * ═══════════════════════════════════════════════════
 * 🎮 GAMIFICATION SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Maneja toda la lógica de gamificación:
 * - Cálculo de puntos
 * - Niveles
 * - Streaks (rachas)
 * - Badges (medallas)
 * - Leaderboard
 */

const { POINTS, LEVELS } = require('../config/constants');
const { mockUsers, mockProgress } = require('../utils/mockData');

/**
 * 🎯 CALCULAR PUNTOS POR ORACIÓN
 * 
 * @param {boolean} isCorrect - Si la oración es correcta
 * @param {boolean} isPerfectGrammar - Si la gramática es perfecta
 * @param {number} currentStreak - Racha actual del usuario
 * @returns {number} Puntos ganados
 */
const calculatePoints = (isCorrect, isPerfectGrammar = false, currentStreak = 0) => {
  if (!isCorrect) {
    return 0;
  }

  let points = POINTS.CORRECT_SENTENCE;

  // Bonus por gramática perfecta
  if (isPerfectGrammar) {
    points += POINTS.PERFECT_GRAMMAR;
  }

  // Bonus por racha (cada 5 días de racha = +5 puntos)
  if (currentStreak >= 5) {
    const streakBonus = Math.floor(currentStreak / 5) * POINTS.STREAK_BONUS;
    points += streakBonus;
  }

  return points;
};

/**
 * 📊 CALCULAR NIVEL DEL USUARIO
 * 
 * @param {number} totalPoints - Puntos totales del usuario
 * @returns {Object} {level, nextLevel, pointsToNext, progress}
 */
const calculateLevel = (totalPoints) => {
  let currentLevel = 'beginner';
  let levelData = LEVELS.BEGINNER;

  // Determinar nivel actual
  for (const [levelName, data] of Object.entries(LEVELS)) {
    if (totalPoints >= data.min && totalPoints <= data.max) {
      currentLevel = levelName.toLowerCase();
      levelData = data;
      break;
    }
  }

  // Calcular siguiente nivel
  const levelKeys = Object.keys(LEVELS);
  const currentIndex = levelKeys.findIndex(
    key => key.toLowerCase() === currentLevel
  );

  let nextLevelData = null;
  let pointsToNext = 0;
  let progress = 0;

  if (currentIndex < levelKeys.length - 1) {
    nextLevelData = LEVELS[levelKeys[currentIndex + 1]];
    pointsToNext = nextLevelData.min - totalPoints;
    
    // Progreso en porcentaje dentro del nivel actual
    const levelRange = levelData.max - levelData.min;
    const currentProgress = totalPoints - levelData.min;
    progress = Math.round((currentProgress / levelRange) * 100);
  } else {
    // Ya está en el nivel máximo
    progress = 100;
  }

  return {
    level: levelData.name,
    currentPoints: totalPoints,
    minPoints: levelData.min,
    maxPoints: levelData.max === Infinity ? '∞' : levelData.max,
    nextLevel: nextLevelData ? nextLevelData.name : null,
    pointsToNext,
    progress: Math.min(progress, 100)
  };
};

/**
 * 🔥 CALCULAR RACHA (STREAK)
 * 
 * @param {Date} lastPracticeDate - Última fecha de práctica
 * @returns {Object} {streak, isActive, message}
 */
const calculateStreak = (lastPracticeDate) => {
  if (!lastPracticeDate) {
    return {
      streak: 0,
      isActive: false,
      message: 'Start your streak today!'
    };
  }

  const now = new Date();
  const lastPractice = new Date(lastPracticeDate);
  
  // Resetear horas para comparar solo fechas
  now.setHours(0, 0, 0, 0);
  lastPractice.setHours(0, 0, 0, 0);

  const diffTime = now - lastPractice;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Practicó hoy
    return {
      isActive: true,
      message: 'Great! You practiced today! 🔥'
    };
  } else if (diffDays === 1) {
    // Practicó ayer, puede continuar la racha hoy
    return {
      isActive: true,
      message: 'Practice today to continue your streak! 🔥'
    };
  } else {
    // Racha rota
    return {
      streak: 0,
      isActive: false,
      message: 'Streak broken. Start a new one today! 💪'
    };
  }
};

/**
 * 🏆 OBTENER LEADERBOARD
 * 
 * @param {number} limit - Número de usuarios a retornar
 * @returns {Array} Top usuarios ordenados por puntos
 */
const getLeaderboard = (limit = 10) => {
  // Ordenar usuarios por puntos (descendente)
  const sortedUsers = [...mockUsers]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, limit);

  // Formatear respuesta
  return sortedUsers.map((user, index) => {
    const levelInfo = calculateLevel(user.totalPoints);
    
    return {
      rank: index + 1,
      username: user.username,
      totalPoints: user.totalPoints,
      level: levelInfo.level,
      streak: user.streak || 0
    };
  });
};

/**
 * 🎖️ VERIFICAR Y OTORGAR BADGES
 * 
 * @param {Object} userProgress - Progreso del usuario
 * @returns {Array} Nuevos badges ganados
 */
const checkBadges = (userProgress) => {
  const newBadges = [];
  const currentBadges = userProgress.badges || [];

  // Badge: Primera oración
  if (userProgress.totalSentences >= 1 && !currentBadges.includes('first_sentence')) {
    newBadges.push({
      id: 'first_sentence',
      name: 'First Steps',
      description: 'Complete your first sentence',
      icon: '📝'
    });
  }

  // Badge: 10 oraciones
  if (userProgress.totalSentences >= 10 && !currentBadges.includes('ten_sentences')) {
    newBadges.push({
      id: 'ten_sentences',
      name: 'Practitioner',
      description: 'Complete 10 sentences',
      icon: '✍️'
    });
  }

  // Badge: 50 oraciones
  if (userProgress.totalSentences >= 50 && !currentBadges.includes('fifty_sentences')) {
    newBadges.push({
      id: 'fifty_sentences',
      name: 'Dedicated Learner',
      description: 'Complete 50 sentences',
      icon: '📚'
    });
  }

  // Badge: Racha de 7 días
  if (userProgress.streak >= 7 && !currentBadges.includes('week_streak')) {
    newBadges.push({
      id: 'week_streak',
      name: 'Week Warrior',
      description: 'Practice for 7 days in a row',
      icon: '🔥'
    });
  }

  // Badge: 10 oraciones perfectas seguidas
  if (userProgress.correctSentences >= 10 && !currentBadges.includes('perfect_10')) {
    newBadges.push({
      id: 'perfect_10',
      name: 'Perfection',
      description: '10 correct sentences in a row',
      icon: '⭐'
    });
  }

  // Badge: Nivel Intermediate
  if (userProgress.level === 'intermediate' && !currentBadges.includes('level_intermediate')) {
    newBadges.push({
      id: 'level_intermediate',
      name: 'Rising Star',
      description: 'Reach Intermediate level',
      icon: '🌟'
    });
  }

  return newBadges;
};

/**
 * 📈 ACTUALIZAR PROGRESO DEL USUARIO
 * 
 * @param {number} userId 
 * @param {number} points 
 * @param {boolean} isCorrect 
 * @returns {Object} Progreso actualizado
 */
const updateUserProgress = (userId, points, isCorrect) => {
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw {
      statusCode: 404,
      message: 'User not found'
    };
  }

  // Obtener o crear progreso
  let progress = mockProgress[userId] || {
    userId,
    totalSentences: 0,
    correctSentences: 0,
    accuracy: 0,
    totalPoints: 0,
    level: 'beginner',
    streak: 0,
    lastPracticeDate: null,
    badges: []
  };

  // Actualizar estadísticas
  progress.totalSentences += 1;
  if (isCorrect) {
    progress.correctSentences += 1;
  }
  progress.totalPoints += points;
  progress.accuracy = Math.round((progress.correctSentences / progress.totalSentences) * 100);
  progress.lastPracticeDate = new Date();

  // Actualizar nivel
  const levelInfo = calculateLevel(progress.totalPoints);
  progress.level = levelInfo.level.toLowerCase();

  // Verificar nuevos badges
  const newBadges = checkBadges(progress);
  if (newBadges.length > 0) {
    progress.badges = [...progress.badges, ...newBadges.map(b => b.id)];
  }

  // Guardar progreso
  mockProgress[userId] = progress;

  // Actualizar usuario
  user.totalPoints = progress.totalPoints;
  user.level = progress.level;

  return {
    progress,
    newBadges,
    levelInfo
  };
};

module.exports = {
  calculatePoints,
  calculateLevel,
  calculateStreak,
  getLeaderboard,
  checkBadges,
  updateUserProgress
};