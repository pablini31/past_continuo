// src/controllers/practice.controller.js

/**
 * ═══════════════════════════════════════════════════
 * 📝 PRACTICE CONTROLLER
 * ═══════════════════════════════════════════════════
 * 
 * Maneja las peticiones HTTP de práctica
 */

const practiceService = require('../services/practice.service');
const { success, error } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

/**
 * ✅ POST /api/practice/submit
 * Enviar oración para validar
 */
const submitSentence = async (req, res, next) => {
  try {
    const userId = req.userId; // Del middleware auth
    const { part1, part2 } = req.body;

    // Validar campos requeridos
    if (!part1 || !part2) {
      return error(res, 'Both parts of the sentence are required', HTTP_STATUS.BAD_REQUEST);
    }

    // Llamar al service
    const result = await practiceService.submitSentence(userId, { part1, part2 });

    return success(res, result, 'Sentence validated successfully', HTTP_STATUS.CREATED);

  } catch (err) {
    next(err);
  }
};

/**
 * 📜 GET /api/practice/history
 * Obtener historial de oraciones
 */
const getHistory = async (req, res, next) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 20;

    const history = practiceService.getSentenceHistory(userId, limit);

    return success(res, { history, total: history.length }, 'History retrieved successfully');

  } catch (err) {
    next(err);
  }
};

/**
 * 📊 GET /api/practice/stats
 * Obtener estadísticas del usuario
 */
const getStats = async (req, res, next) => {
  try {
    const userId = req.userId;

    const stats = practiceService.getUserStats(userId);

    return success(res, { stats }, 'Stats retrieved successfully');

  } catch (err) {
    next(err);
  }
};

/**
 * 🎯 GET /api/practice/connector-stats
 * Obtener estadísticas por conector
 */
const getConnectorStats = async (req, res, next) => {
  try {
    const userId = req.userId;

    const stats = practiceService.getConnectorStats(userId);

    return success(res, { stats }, 'Connector stats retrieved successfully');

  } catch (err) {
    next(err);
  }
};

/**
 * 🔍 POST /api/practice/live-analyze
 * Análisis en tiempo real mientras escribe
 */
const liveAnalyze = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 5) {
      return success(res, { 
        analysis: { 
          quick: { suggestions: [], errors: [], tips: [] },
          detailed: { spellProblems: [], semanticIssues: [] }
        } 
      }, 'Text too short for analysis');
    }

    const analyzeService = require('../services/analyze.service');
    const analysis = await analyzeService.analyzeText(text);
    
    // combine with existing quick analysis from practice service for grammar-focused feedback
    const quick = practiceService.performLiveAnalysis(text);
    
    return success(res, { 
      analysis: { 
        quick, 
        detailed: analysis 
      } 
    }, 'Live analysis completed');

  } catch (err) {
    console.error('Live analyze error:', err);
    // Return graceful fallback instead of error
    return success(res, { 
      analysis: { 
        quick: { suggestions: [], errors: [], tips: [] },
        detailed: { spellProblems: [], semanticIssues: [] }
      } 
    }, 'Analysis completed with limitations');
  }
};

/**
 * 📊 POST /api/practice/full-analyze
 * Análisis completo y puntuación
 */
const fullAnalyze = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { text } = req.body;

    if (!text || text.trim().length < 10) {
      return error(res, 'Text is too short for analysis', HTTP_STATUS.BAD_REQUEST);
    }

  const analyzeService = require('../services/analyze.service');
  const analysis = await analyzeService.analyzeText(text);
  // store or compute gamified scoring using existing practice service
  const result = await practiceService.performFullAnalysis(userId, text);
  // attach spell/semantic details
  result.analysis = result.analysis || {};
  result.analysis.spellProblems = analysis.spellProblems;
  result.analysis.semanticIssues = analysis.semanticIssues;
  return success(res, result, 'Full analysis completed', HTTP_STATUS.CREATED);

  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitSentence,
  getHistory,
  getStats,
  getConnectorStats,
  liveAnalyze,
  fullAnalyze
};