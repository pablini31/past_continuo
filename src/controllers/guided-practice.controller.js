// src/controllers/guided-practice.controller.js

/**
 * ═══════════════════════════════════════════════════
 * 🎓 GUIDED PRACTICE CONTROLLER
 * ═══════════════════════════════════════════════════
 * 
 * Controlador para manejar práctica guiada y tutoriales
 */

const { GuidedPracticeService } = require('../services/guided-practice.service');
const { success, error } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

// Instancia del servicio de práctica guiada
const guidedPractice = new GuidedPracticeService();

/**
 * 📚 GET /api/guided/tutorials
 * Obtiene tutoriales disponibles
 */
const getAvailableTutorials = async (req, res, next) => {
  try {
    const { level = 'beginner' } = req.query;
    
    const tutorials = guidedPractice.getAvailableTutorials(level);
    
    return success(res, {
      tutorials,
      count: tutorials.length,
      level
    }, 'Available tutorials retrieved successfully');

  } catch (err) {
    console.error('Get tutorials error:', err);
    next(err);
  }
};

/**
 * 🚀 POST /api/guided/tutorials/start
 * Inicia un tutorial
 */
const startTutorial = async (req, res, next) => {
  try {
    const { tutorialId } = req.body;
    const userId = req.user?.id || 'anonymous';

    if (!tutorialId) {
      return error(res, 'Tutorial ID is required', HTTP_STATUS.BAD_REQUEST);
    }

    const tutorialData = guidedPractice.startTutorial(tutorialId, userId);
    
    return success(res, {
      tutorial: tutorialData
    }, 'Tutorial started successfully');

  } catch (err) {
    console.error('Start tutorial error:', err);
    if (err.message.includes('not found')) {
      return error(res, err.message, HTTP_STATUS.NOT_FOUND);
    }
    next(err);
  }
};

/**
 * ➡️ POST /api/guided/tutorials/next
 * Avanza al siguiente paso
 */
const nextStep = async (req, res, next) => {
  try {
    const { stepResult } = req.body;
    const userId = req.user?.id || 'anonymous';

    const stepData = guidedPractice.nextStep(userId, stepResult);
    
    return success(res, {
      step: stepData
    }, 'Advanced to next step successfully');

  } catch (err) {
    console.error('Next step error:', err);
    if (err.message.includes('No active tutorial')) {
      return error(res, err.message, HTTP_STATUS.BAD_REQUEST);
    }
    next(err);
  }
};

/**
 * ⬅️ POST /api/guided/tutorials/previous
 * Retrocede al paso anterior
 */
const previousStep = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'anonymous';

    const stepData = guidedPractice.previousStep(userId);
    
    return success(res, {
      step: stepData
    }, 'Returned to previous step successfully');

  } catch (err) {
    console.error('Previous step error:', err);
    if (err.message.includes('No active tutorial')) {
      return error(res, err.message, HTTP_STATUS.BAD_REQUEST);
    }
    next(err);
  }
};

/**
 * 💡 POST /api/guided/tutorials/hint
 * Genera hint contextual
 */
const generateHint = async (req, res, next) => {
  try {
    const { context } = req.body;
    const userId = req.user?.id || 'anonymous';

    if (!context) {
      return error(res, 'Context is required for hint generation', HTTP_STATUS.BAD_REQUEST);
    }

    const hint = guidedPractice.generateContextualHint(userId, context);
    
    return success(res, {
      hint
    }, 'Contextual hint generated successfully');

  } catch (err) {
    console.error('Generate hint error:', err);
    next(err);
  }
};

/**
 * 📋 POST /api/guided/tutorials/evaluate
 * Evalúa respuesta del usuario
 */
const evaluateResponse = async (req, res, next) => {
  try {
    const { response, expectedAnswer, taskType } = req.body;
    const userId = req.user?.id || 'anonymous';

    if (!response || !expectedAnswer || !taskType) {
      return error(res, 'Response, expected answer, and task type are required', HTTP_STATUS.BAD_REQUEST);
    }

    const evaluation = guidedPractice.evaluateUserResponse(userId, response, expectedAnswer, taskType);
    
    return success(res, {
      evaluation
    }, 'Response evaluated successfully');

  } catch (err) {
    console.error('Evaluate response error:', err);
    next(err);
  }
};

/**
 * 📊 GET /api/guided/tutorials/progress
 * Obtiene progreso del tutorial
 */
const getTutorialProgress = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'anonymous';

    const progress = guidedPractice.getTutorialProgress(userId);
    
    if (!progress) {
      return error(res, 'No active tutorial found', HTTP_STATUS.NOT_FOUND);
    }

    return success(res, {
      progress
    }, 'Tutorial progress retrieved successfully');

  } catch (err) {
    console.error('Get tutorial progress error:', err);
    next(err);
  }
};

/**
 * 📝 POST /api/guided/tutorials/instructions
 * Genera instrucciones progresivas
 */
const getProgressiveInstructions = async (req, res, next) => {
  try {
    const { userLevel = 'beginner', currentTask } = req.body;

    const instructions = guidedPractice.generateProgressiveInstructions(userLevel, currentTask);
    
    return success(res, {
      instructions,
      level: userLevel
    }, 'Progressive instructions generated successfully');

  } catch (err) {
    console.error('Get progressive instructions error:', err);
    next(err);
  }
};

module.exports = {
  getAvailableTutorials,
  startTutorial,
  nextStep,
  previousStep,
  generateHint,
  evaluateResponse,
  getTutorialProgress,
  getProgressiveInstructions
};