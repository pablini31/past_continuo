// src/controllers/adaptive-learning.controller.js

/**
 * ═══════════════════════════════════════════════════
 * 🧠 ADAPTIVE LEARNING CONTROLLER
 * ═══════════════════════════════════════════════════
 * 
 * Controlador para personalización del aprendizaje
 */

const { AdaptiveLearningService } = require('../services/adaptive-learning.service');
const { success, error } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

// Instancia del servicio de aprendizaje adaptativo
const adaptiveLearning = new AdaptiveLearningService();

/**
 * 📊 POST /api/adaptive/evaluate
 * Evalúa el nivel inicial del estudiante
 */
const evaluateInitialLevel = async (req, res, next) => {
  try {
    const { responses = [] } = req.body;
    const userId = req.user?.id || 'anonymous';

    const assessment = await adaptiveLearning.evaluateInitialLevel(userId, responses);
    
    return success(res, {
      assessment,
      recommendations: {
        level: assessment.recommendedLevel,
        focusAreas: assessment.learningPath?.milestones?.slice(0, 3) || [],
        nextSteps: assessment.learningPath?.milestones?.map(m => m.description) || []
      }
    }, 'Initial level evaluation completed');

  } catch (err) {
    console.error('Evaluate initial level error:', err);
    next(err);
  }
};

/**
 * 🎯 POST /api/adaptive/difficulty
 * Adapta la dificultad basada en el rendimiento
 */
const adaptDifficulty = async (req, res, next) => {
  try {
    const { recentPerformance = [] } = req.body;
    const userId = req.user?.id || 'anonymous';

    if (recentPerformance.length === 0) {
      return error(res, 'Recent performance data is required', HTTP_STATUS.BAD_REQUEST);
    }

    const adaptation = adaptiveLearning.adaptDifficulty(userId, recentPerformance);
    
    return success(res, {
      adaptation,
      newSettings: {
        difficulty: adaptation.newDifficulty,
        changes: adaptation.changes,
        reasoning: adaptation.reasoning
      }
    }, 'Difficulty adapted successfully');

  } catch (err) {
    console.error('Adapt difficulty error:', err);
    if (err.message.includes('not found')) {
      return error(res, 'User profile not found. Please complete initial evaluation first.', HTTP_STATUS.NOT_FOUND);
    }
    next(err);
  }
};

/**
 * 🧠 POST /api/adaptive/memory
 * Actualiza la memoria de fortalezas y debilidades
 */
const updateUserMemory = async (req, res, next) => {
  try {
    const { sessionData } = req.body;
    const userId = req.user?.id || 'anonymous';

    if (!sessionData) {
      return error(res, 'Session data is required', HTTP_STATUS.BAD_REQUEST);
    }

    const memory = adaptiveLearning.updateUserMemory(userId, sessionData);
    
    return success(res, {
      memory: {
        strengths: Object.keys(memory.strengths).length,
        weaknesses: Object.keys(memory.weaknesses).length,
        totalSessions: memory.totalSessions,
        lastActivity: memory.lastActivity
      },
      topStrengths: adaptiveLearning.getTopStrengths(memory.strengths, 3),
      topWeaknesses: adaptiveLearning.getTopWeaknesses(memory.weaknesses, 3)
    }, 'User memory updated successfully');

  } catch (err) {
    console.error('Update user memory error:', err);
    if (err.message.includes('not found')) {
      return error(res, 'User profile not found', HTTP_STATUS.NOT_FOUND);
    }
    next(err);
  }
};

/**
 * 💡 GET /api/adaptive/recommendations
 * Genera recomendaciones personalizadas
 */
const getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'anonymous';

    const recommendations = adaptiveLearning.generatePersonalizedRecommendations(userId);
    
    return success(res, {
      recommendations,
      summary: {
        currentLevel: recommendations.currentLevel,
        focusAreas: recommendations.focusAreas.slice(0, 3),
        estimatedTimeToNextLevel: `${recommendations.estimatedTimeToNextLevel} días`,
        primaryGoals: recommendations.learningGoals.slice(0, 2)
      }
    }, 'Personalized recommendations generated');

  } catch (err) {
    console.error('Get recommendations error:', err);
    if (err.message.includes('not found')) {
      return error(res, 'User profile not found', HTTP_STATUS.NOT_FOUND);
    }
    next(err);
  }
};

/**
 * 👤 GET /api/adaptive/profile
 * Obtiene el perfil del usuario
 */
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'anonymous';

    const profile = adaptiveLearning.getUserProfile(userId);
    
    if (!profile) {
      return error(res, 'User profile not found', HTTP_STATUS.NOT_FOUND);
    }

    return success(res, {
      profile: {
        userId: profile.userId,
        skillLevel: profile.skillLevel,
        currentDifficulty: profile.currentDifficulty,
        createdAt: profile.createdAt,
        lastUpdated: profile.lastUpdated,
        goals: profile.goals,
        preferences: profile.preferences
      },
      stats: {
        totalSessions: profile.memory.totalSessions,
        totalTimeSpent: profile.memory.totalTimeSpent,
        strengthsCount: Object.keys(profile.memory.strengths).length,
        weaknessesCount: Object.keys(profile.memory.weaknesses).length
      }
    }, 'User profile retrieved successfully');

  } catch (err) {
    console.error('Get user profile error:', err);
    next(err);
  }
};

/**
 * 📈 GET /api/adaptive/progress
 * Obtiene el progreso de aprendizaje
 */
const getLearningProgress = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'anonymous';

    const profile = adaptiveLearning.getUserProfile(userId);
    const adaptationHistory = adaptiveLearning.getAdaptationHistory(userId);
    const learningPath = adaptiveLearning.getLearningPath(userId);
    
    if (!profile) {
      return error(res, 'User profile not found', HTTP_STATUS.NOT_FOUND);
    }

    const progress = {
      currentLevel: profile.skillLevel,
      levelProgress: this.calculateLevelProgress(profile),
      recentAdaptations: adaptationHistory.slice(-5),
      learningPath: learningPath,
      milestoneProgress: this.calculateMilestoneProgress(profile, learningPath),
      timeToNextLevel: adaptiveLearning.estimateTimeToNextLevel(profile)
    };

    return success(res, {
      progress,
      insights: {
        improvementAreas: adaptiveLearning.getTopWeaknesses(profile.memory.weaknesses, 2),
        strongAreas: adaptiveLearning.getTopStrengths(profile.memory.strengths, 2),
        recommendedFocus: progress.learningPath?.milestones?.[0]?.skill || 'basic_structure'
      }
    }, 'Learning progress retrieved successfully');

  } catch (err) {
    console.error('Get learning progress error:', err);
    next(err);
  }
};

/**
 * 🎯 PUT /api/adaptive/preferences
 * Actualiza las preferencias del usuario
 */
const updateUserPreferences = async (req, res, next) => {
  try {
    const { preferences } = req.body;
    const userId = req.user?.id || 'anonymous';

    const profile = adaptiveLearning.getUserProfile(userId);
    
    if (!profile) {
      return error(res, 'User profile not found', HTTP_STATUS.NOT_FOUND);
    }

    // Actualizar preferencias
    profile.preferences = {
      ...profile.preferences,
      ...preferences
    };
    profile.lastUpdated = Date.now();

    return success(res, {
      preferences: profile.preferences
    }, 'User preferences updated successfully');

  } catch (err) {
    console.error('Update preferences error:', err);
    next(err);
  }
};

/**
 * 🎯 PUT /api/adaptive/goals
 * Actualiza los objetivos del usuario
 */
const updateLearningGoals = async (req, res, next) => {
  try {
    const { goals } = req.body;
    const userId = req.user?.id || 'anonymous';

    const profile = adaptiveLearning.getUserProfile(userId);
    
    if (!profile) {
      return error(res, 'User profile not found', HTTP_STATUS.NOT_FOUND);
    }

    // Actualizar objetivos
    profile.goals = {
      ...profile.goals,
      ...goals
    };
    profile.lastUpdated = Date.now();

    return success(res, {
      goals: profile.goals
    }, 'Learning goals updated successfully');

  } catch (err) {
    console.error('Update goals error:', err);
    next(err);
  }
};

/**
 * 📊 GET /api/adaptive/assessment
 * Obtiene las preguntas de evaluación inicial
 */
const getInitialAssessment = async (req, res, next) => {
  try {
    const { INITIAL_ASSESSMENT } = require('../services/adaptive-learning.service');
    
    // Enviar solo las preguntas, no las respuestas correctas
    const questions = INITIAL_ASSESSMENT.questions.map(q => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty
    }));

    return success(res, {
      questions,
      totalQuestions: questions.length,
      estimatedTime: '5-10 minutos',
      instructions: 'Responde todas las preguntas lo mejor que puedas. No te preocupes si no sabes alguna respuesta.'
    }, 'Initial assessment questions retrieved');

  } catch (err) {
    console.error('Get assessment error:', err);
    next(err);
  }
};

/**
 * Funciones auxiliares
 */
function calculateLevelProgress(profile) {
  const { SKILL_LEVELS } = require('../services/adaptive-learning.service');
  const currentLevel = SKILL_LEVELS[profile.skillLevel];
  
  // Calcular progreso basado en fortalezas vs debilidades
  const strengthsScore = Object.values(profile.memory.strengths)
    .reduce((sum, s) => sum + s.confidence, 0);
  const weaknessesScore = Object.values(profile.memory.weaknesses)
    .reduce((sum, w) => sum + (100 - w.severity), 0);
  
  const totalItems = Object.keys(profile.memory.strengths).length + 
                    Object.keys(profile.memory.weaknesses).length;
  
  if (totalItems === 0) return 0;
  
  const averageScore = (strengthsScore + weaknessesScore) / totalItems;
  const levelMin = currentLevel.range[0];
  const levelMax = currentLevel.range[1];
  
  return Math.round(((averageScore - levelMin) / (levelMax - levelMin)) * 100);
}

function calculateMilestoneProgress(profile, learningPath) {
  if (!learningPath || !learningPath.milestones) return [];
  
  return learningPath.milestones.map(milestone => {
    const weakness = profile.memory.weaknesses[milestone.skill];
    const strength = profile.memory.strengths[milestone.skill];
    
    let progress = 0;
    if (strength) {
      progress = strength.confidence;
    } else if (weakness) {
      progress = Math.max(0, 100 - weakness.severity);
    }
    
    return {
      ...milestone,
      progress: Math.round(progress),
      isCompleted: progress >= 80
    };
  });
}

module.exports = {
  evaluateInitialLevel,
  adaptDifficulty,
  updateUserMemory,
  getPersonalizedRecommendations,
  getUserProfile,
  getLearningProgress,
  updateUserPreferences,
  updateLearningGoals,
  getInitialAssessment
};