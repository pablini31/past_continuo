// src/controllers/real-time.controller.js

/**
 * ═══════════════════════════════════════════════════
 * ⚡ REAL-TIME CONTROLLER
 * ═══════════════════════════════════════════════════
 * 
 * Controlador optimizado para análisis en tiempo real
 */

const { RealTimeAnalysisService } = require('../services/real-time-analysis.service');
const { IntelligentCorrectionService } = require('../services/intelligent-correction.service');
const { success, error } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

// Instancias de servicios
const realTimeAnalysis = new RealTimeAnalysisService();
const intelligentCorrection = new IntelligentCorrectionService();

/**
 * ⚡ POST /api/real-time/analyze
 * Análisis en tiempo real optimizado
 */
const analyzeRealTime = async (req, res, next) => {
  try {
    const { text, previousAnalysis, options = {} } = req.body;

    // Validar entrada
    if (!text || typeof text !== 'string') {
      return error(res, 'Text is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Realizar análisis en tiempo real
    const analysis = await realTimeAnalysis.performRealTimeAnalysis(text, options);

    return success(res, {
      analysis,
      performanceMetrics: analysis.performanceMetrics
    }, 'Real-time analysis completed');

  } catch (err) {
    console.error('Real-time analysis error:', err);
    next(err);
  }
};

/**
 * 🔄 POST /api/real-time/incremental
 * Análisis incremental para mejor performance
 */
const analyzeIncremental = async (req, res, next) => {
  try {
    const { text, previousAnalysis, changedPortion } = req.body;

    if (!text) {
      return error(res, 'Text is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Realizar análisis incremental
    const analysis = await realTimeAnalysis.performIncrementalAnalysis(
      previousAnalysis, 
      text, 
      changedPortion
    );

    return success(res, {
      analysis,
      isIncremental: analysis.isIncremental || false
    }, 'Incremental analysis completed');

  } catch (err) {
    console.error('Incremental analysis error:', err);
    next(err);
  }
};

/**
 * 🎯 POST /api/real-time/icons
 * Actualización rápida solo de iconos
 */
const updateIcons = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return error(res, 'Text is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Análisis básico solo para iconos
    const analysis = await realTimeAnalysis.performRealTimeAnalysis(text, {
      level: 'basic',
      iconsOnly: true
    });

    return success(res, {
      iconStates: analysis.iconStates,
      tenseType: analysis.tenseType,
      completionPercentage: analysis.completionPercentage
    }, 'Icons updated');

  } catch (err) {
    console.error('Icon update error:', err);
    next(err);
  }
};

/**
 * 💡 POST /api/real-time/suggestions
 * Obtener solo sugerencias rápidas
 */
const getSuggestions = async (req, res, next) => {
  try {
    const { text, maxSuggestions = 3 } = req.body;

    if (!text) {
      return error(res, 'Text is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Análisis enfocado en sugerencias
    const analysis = await realTimeAnalysis.performRealTimeAnalysis(text, {
      level: 'intermediate',
      suggestionsOnly: true,
      maxSuggestions
    });

    return success(res, {
      suggestions: analysis.suggestions,
      primaryRecommendation: analysis.primaryRecommendation,
      confidence: analysis.confidence
    }, 'Suggestions generated');

  } catch (err) {
    console.error('Suggestions error:', err);
    next(err);
  }
};

/**
 * 📊 GET /api/real-time/performance
 * Obtener estadísticas de performance
 */
const getPerformanceStats = async (req, res, next) => {
  try {
    const stats = realTimeAnalysis.getPerformanceStats();

    return success(res, {
      stats,
      timestamp: Date.now()
    }, 'Performance stats retrieved');

  } catch (err) {
    console.error('Performance stats error:', err);
    next(err);
  }
};

/**
 * 🔄 POST /api/real-time/validate
 * Validación rápida de estructura
 */
const validateStructure = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return error(res, 'Text is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Solo validación de estructura
    const analysis = await realTimeAnalysis.performRealTimeAnalysis(text, {
      level: 'basic',
      structureOnly: true
    });

    const isValid = analysis.criticalErrors.length === 0;
    const completeness = analysis.completionPercentage;

    return success(res, {
      isValid,
      completeness,
      tenseType: analysis.tenseType,
      criticalErrors: analysis.criticalErrors
    }, 'Structure validated');

  } catch (err) {
    console.error('Structure validation error:', err);
    next(err);
  }
};

/**
 * 🔧 POST /api/real-time/correct
 * Corrección inteligente de texto
 */
const correctText = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return error(res, 'Text is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Generar correcciones inteligentes
    const corrections = intelligentCorrection.generateIntelligentCorrections(text);

    return success(res, {
      corrections,
      stats: intelligentCorrection.getCorrectionStats()
    }, 'Intelligent corrections generated');

  } catch (err) {
    console.error('Intelligent correction error:', err);
    next(err);
  }
};

/**
 * 📊 GET /api/real-time/correction-stats
 * Obtener estadísticas de correcciones
 */
const getCorrectionStats = async (req, res, next) => {
  try {
    const stats = intelligentCorrection.getCorrectionStats();

    return success(res, {
      stats,
      timestamp: Date.now()
    }, 'Correction stats retrieved');

  } catch (err) {
    console.error('Correction stats error:', err);
    next(err);
  }
};

/**
 * 🧹 POST /api/real-time/clear-cache
 * Limpiar cache de análisis (para desarrollo)
 */
const clearCache = async (req, res, next) => {
  try {
    // Solo en desarrollo
    if (process.env.NODE_ENV === 'production') {
      return error(res, 'Not available in production', HTTP_STATUS.FORBIDDEN);
    }

    realTimeAnalysis.analysisCache.clear();
    intelligentCorrection.resetStats();

    return success(res, {
      message: 'Cache and stats cleared successfully'
    }, 'Cache cleared');

  } catch (err) {
    console.error('Clear cache error:', err);
    next(err);
  }
};

module.exports = {
  analyzeRealTime,
  analyzeIncremental,
  updateIcons,
  getSuggestions,
  getPerformanceStats,
  validateStructure,
  correctText,
  getCorrectionStats,
  clearCache
};