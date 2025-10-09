// src/controllers/contextual-guides.controller.js

/**
 * ═══════════════════════════════════════════════════
 * 🎯 CONTEXTUAL GUIDES CONTROLLER
 * ═══════════════════════════════════════════════════
 * 
 * Controlador para manejar guías contextuales,
 * tips educativos y mini-lecciones
 */

const { ContextualGuidesService } = require('../services/contextual-guides.service');
const { success, error } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

// Instancia del servicio de guías contextuales
const contextualGuides = new ContextualGuidesService();

/**
 * 🎯 POST /api/guides/tips
 * Genera tips educativos contextuales
 */
const generateTips = async (req, res, next) => {
  try {
    const { 
      tenseType, 
      userLevel, 
      errors = [], 
      completedSentences = 0,
      sessionContext = {}
    } = req.body;

    // Validar entrada
    if (!tenseType) {
      return error(res, 'Tense type is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Generar tips educativos
    const tips = contextualGuides.generateEducationalTips({
      tenseType,
      userLevel,
      errors,
      completedSentences,
      ...sessionContext
    });

    return success(res, {
      tips,
      count: tips.length,
      context: {
        tenseType,
        userLevel: contextualGuides.determineUserLevel(userLevel, completedSentences)
      }
    }, 'Educational tips generated successfully');

  } catch (err) {
    console.error('Generate tips error:', err);
    next(err);
  }
};

/**
 * 📚 POST /api/guides/mini-lesson
 * Genera mini-lección para error específico
 */
const generateMiniLesson = async (req, res, next) => {
  try {
    const { errorType, userContext = {} } = req.body;

    // Validar entrada
    if (!errorType) {
      return error(res, 'Error type is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Generar mini-lección
    const miniLesson = contextualGuides.generateMiniLesson(errorType, userContext);

    if (!miniLesson) {
      return error(res, 'Mini-lesson not available for this error type', HTTP_STATUS.NOT_FOUND);
    }

    return success(res, {
      miniLesson,
      metadata: {
        errorType,
        difficulty: miniLesson.difficulty,
        estimatedTime: miniLesson.estimatedTime,
        steps: miniLesson.steps.length
      }
    }, 'Mini-lesson generated successfully');

  } catch (err) {
    console.error('Generate mini-lesson error:', err);
    next(err);
  }
};

/**
 * 💪 POST /api/guides/motivation
 * Genera mensaje motivacional
 */
const generateMotivation = async (req, res, next) => {
  try {
    const { 
      correctSentences = 0,
      totalAttempts = 0,
      consecutiveCorrect = 0,
      sessionTime = 0,
      improvementRate = 0
    } = req.body;

    // Generar mensaje motivacional
    const motivation = contextualGuides.generateMotivationalMessage({
      correctSentences,
      totalAttempts,
      consecutiveCorrect,
      sessionTime,
      improvementRate
    });

    return success(res, {
      motivation,
      stats: {
        accuracy: totalAttempts > 0 ? Math.round((correctSentences / totalAttempts) * 100) : 0,
        progress: correctSentences,
        streak: consecutiveCorrect
      }
    }, 'Motivational message generated successfully');

  } catch (err) {
    console.error('Generate motivation error:', err);
    next(err);
  }
};

/**
 * 🎯 POST /api/guides/contextual
 * Genera guía contextual completa
 */
const generateContextualGuide = async (req, res, next) => {
  try {
    const { analysisResult, userContext = {} } = req.body;

    // Validar entrada
    if (!analysisResult) {
      return error(res, 'Analysis result is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Generar guía contextual completa
    const guide = contextualGuides.generateContextualGuide(analysisResult, userContext);

    return success(res, {
      guide,
      summary: {
        tipsCount: guide.tips.length,
        hasMiniLesson: !!guide.miniLesson,
        hasMotivation: !!guide.motivation,
        nextStepsCount: guide.nextSteps.length
      }
    }, 'Contextual guide generated successfully');

  } catch (err) {
    console.error('Generate contextual guide error:', err);
    next(err);
  }
};

/**
 * 📊 POST /api/guides/progress
 * Actualiza progreso del usuario
 */
const updateProgress = async (req, res, next) => {
  try {
    const { userId, progressData } = req.body;

    // Validar entrada
    if (!userId || !progressData) {
      return error(res, 'User ID and progress data are required', HTTP_STATUS.BAD_REQUEST);
    }

    // Actualizar progreso
    const updatedProgress = contextualGuides.updateUserProgress(userId, progressData);

    return success(res, {
      progress: updatedProgress,
      level: updatedProgress.level,
      accuracy: updatedProgress.totalSentences > 0 ? 
        Math.round((updatedProgress.correctSentences / updatedProgress.totalSentences) * 100) : 0
    }, 'User progress updated successfully');

  } catch (err) {
    console.error('Update progress error:', err);
    next(err);
  }
};

/**
 * 📈 GET /api/guides/stats/:userId
 * Obtiene estadísticas del usuario
 */
const getUserStats = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Validar entrada
    if (!userId) {
      return error(res, 'User ID is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Obtener estadísticas
    const stats = contextualGuides.getUserStats(userId);

    return success(res, {
      stats,
      computed: {
        accuracy: stats.totalSentences > 0 ? 
          Math.round((stats.correctSentences / stats.totalSentences) * 100) : 0,
        totalErrors: Object.values(stats.errorHistory).reduce((sum, count) => sum + count, 0),
        mostCommonError: this.getMostCommonError(stats.errorHistory),
        isActive: stats.lastActivity && (Date.now() - stats.lastActivity) < 24 * 60 * 60 * 1000 // 24 horas
      }
    }, 'User stats retrieved successfully');

  } catch (err) {
    console.error('Get user stats error:', err);
    next(err);
  }
};

/**
 * 🎲 GET /api/guides/random-tip
 * Obtiene tip educativo aleatorio
 */
const getRandomTip = async (req, res, next) => {
  try {
    const { tenseType = 'past_continuous', level = 'basic' } = req.query;

    // Generar tip aleatorio
    const tips = contextualGuides.generateEducationalTips({
      tenseType,
      userLevel: level,
      errors: [],
      completedSentences: 0
    });

    const randomTip = tips.length > 0 ? tips[0] : null;

    if (!randomTip) {
      return error(res, 'No tips available for the specified criteria', HTTP_STATUS.NOT_FOUND);
    }

    return success(res, {
      tip: randomTip,
      criteria: { tenseType, level }
    }, 'Random tip retrieved successfully');

  } catch (err) {
    console.error('Get random tip error:', err);
    next(err);
  }
};

/**
 * 📋 GET /api/guides/lesson-types
 * Obtiene tipos de mini-lecciones disponibles
 */
const getLessonTypes = async (req, res, next) => {
  try {
    const { MINI_LESSONS } = require('../services/contextual-guides.service');
    
    const lessonTypes = Object.keys(MINI_LESSONS).map(key => ({
      type: key,
      title: MINI_LESSONS[key].title,
      steps: MINI_LESSONS[key].steps.length,
      difficulty: contextualGuides.calculateLessonDifficulty(key)
    }));

    return success(res, {
      lessonTypes,
      count: lessonTypes.length
    }, 'Lesson types retrieved successfully');

  } catch (err) {
    console.error('Get lesson types error:', err);
    next(err);
  }
};

/**
 * Función auxiliar para obtener el error más común
 */
function getMostCommonError(errorHistory) {
  if (!errorHistory || Object.keys(errorHistory).length === 0) {
    return null;
  }

  return Object.entries(errorHistory).reduce((most, [error, count]) => {
    return count > (most.count || 0) ? { error, count } : most;
  }, {}).error || null;
}

module.exports = {
  generateTips,
  generateMiniLesson,
  generateMotivation,
  generateContextualGuide,
  updateProgress,
  getUserStats,
  getRandomTip,
  getLessonTypes
};