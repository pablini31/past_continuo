// src/services/real-time-analysis.service.js

/**
 * ═══════════════════════════════════════════════════
 * ⚡ REAL-TIME ANALYSIS SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Servicio optimizado para análisis en tiempo real
 * Proporciona feedback inmediato mientras el usuario escribe
 */

const { GrammarStructureService } = require('./grammar-structure.service');
const { ErrorDetectionService } = require('./error-detection.service');
const { SmartRecommendationsService } = require('./smart-recommendations.service');
const { SpanishFeedbackService } = require('./spanish-feedback.service');

/**
 * Configuración para análisis en tiempo real
 */
const REAL_TIME_CONFIG = {
  // Umbrales mínimos para activar análisis
  minCharacters: 5,
  minWords: 2,
  
  // Configuración de debounce
  debounceDelay: 500, // ms
  
  // Configuración de análisis progresivo
  progressiveAnalysis: {
    basic: { minChars: 5, features: ['structure', 'icons'] },
    intermediate: { minChars: 15, features: ['structure', 'icons', 'errors'] },
    advanced: { minChars: 30, features: ['structure', 'icons', 'errors', 'context', 'recommendations'] }
  },
  
  // Límites de performance
  maxAnalysisTime: 100, // ms
  maxTextLength: 500, // caracteres
  
  // Configuración de sugerencias
  maxSuggestions: 3,
  suggestionPriority: ['error', 'recommendation', 'tip']
};

class RealTimeAnalysisService {
  constructor() {
    this.grammarStructure = new GrammarStructureService();
    this.errorDetection = new ErrorDetectionService();
    this.smartRecommendations = new SmartRecommendationsService();
    this.spanishFeedback = new SpanishFeedbackService();
    
    // Cache para optimizar performance
    this.analysisCache = new Map();
    this.lastAnalysisTime = 0;
  }

  /**
   * Análisis en tiempo real optimizado
   */
  async performRealTimeAnalysis(text, options = {}) {
    const startTime = Date.now();
    
    // Validaciones básicas
    if (!this.shouldAnalyze(text)) {
      return this.createEmptyAnalysis(text);
    }

    // Verificar cache
    const cacheKey = this.generateCacheKey(text, options);
    if (this.analysisCache.has(cacheKey)) {
      return this.analysisCache.get(cacheKey);
    }

    // Determinar nivel de análisis basado en longitud del texto
    const analysisLevel = this.determineAnalysisLevel(text);
    
    // Realizar análisis progresivo
    const analysis = await this.performProgressiveAnalysis(text, analysisLevel, options);
    
    // Optimizar resultado para tiempo real
    const optimizedAnalysis = this.optimizeForRealTime(analysis);
    
    // Guardar en cache
    this.analysisCache.set(cacheKey, optimizedAnalysis);
    this.cleanupCache();
    
    // Registrar tiempo de análisis
    const analysisTime = Date.now() - startTime;
    optimizedAnalysis.performanceMetrics = {
      analysisTime,
      analysisLevel,
      cacheHit: false
    };

    return optimizedAnalysis;
  }

  /**
   * Determina si debe realizar análisis
   */
  shouldAnalyze(text) {
    if (!text || typeof text !== 'string') return false;
    if (text.trim().length < REAL_TIME_CONFIG.minCharacters) return false;
    if (text.length > REAL_TIME_CONFIG.maxTextLength) return false;
    
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length >= REAL_TIME_CONFIG.minWords;
  }

  /**
   * Determina el nivel de análisis basado en la longitud del texto
   */
  determineAnalysisLevel(text) {
    const length = text.length;
    const config = REAL_TIME_CONFIG.progressiveAnalysis;
    
    if (length >= config.advanced.minChars) {
      return 'advanced';
    } else if (length >= config.intermediate.minChars) {
      return 'intermediate';
    } else {
      return 'basic';
    }
  }

  /**
   * Realiza análisis progresivo según el nivel
   */
  async performProgressiveAnalysis(text, level, options) {
    const analysis = {
      text: text,
      level: level,
      timestamp: Date.now(),
      structure: null,
      errors: [],
      suggestions: [],
      iconStates: {},
      contextRecommendations: null,
      spanishFeedback: null
    };

    const config = REAL_TIME_CONFIG.progressiveAnalysis[level];
    
    try {
      // Análisis de estructura (siempre incluido)
      if (config.features.includes('structure')) {
        analysis.structure = this.grammarStructure.analyzeStructure(text);
        analysis.iconStates = this.generateIconStates(analysis.structure);
      }

      // Detección de errores (nivel intermedio+)
      if (config.features.includes('errors')) {
        const errorReport = this.errorDetection.generateErrorReport(text);
        analysis.errors = errorReport.errors;
        analysis.corrections = errorReport.corrections;
      }

      // Análisis contextual (nivel avanzado)
      if (config.features.includes('context')) {
        analysis.contextRecommendations = this.smartRecommendations.generateSmartRecommendations(text, analysis.structure);
      }

      // Feedback en español (nivel avanzado)
      if (config.features.includes('recommendations') && analysis.errors.length > 0) {
        analysis.spanishFeedback = this.generateSpanishFeedback(analysis);
      }

      // Generar sugerencias consolidadas
      analysis.suggestions = this.consolidateSuggestions(analysis);

    } catch (error) {
      console.error('Error in progressive analysis:', error);
      analysis.error = error.message;
    }

    return analysis;
  }

  /**
   * Genera estados de iconos para la interfaz
   */
  generateIconStates(structure) {
    if (!structure) return {};

    const iconStates = {
      subject: { active: false, error: false, type: null },
      auxiliary: { active: false, error: false, type: null },
      verb: { active: false, error: false, type: null },
      gerund: { active: false, error: false, type: null },
      complement: { active: false, error: false, type: null },
      connector: { active: false, error: false, type: null }
    };

    // Mapear partes detectadas a estados de iconos
    if (structure.parts.subject && structure.parts.subject.isValid) {
      iconStates.subject = { active: true, error: false, type: structure.parts.subject.type };
    }

    if (structure.parts.auxiliary) {
      iconStates.auxiliary = { 
        active: structure.parts.auxiliary.isValid, 
        error: !structure.parts.auxiliary.isValid,
        type: structure.parts.auxiliary.type 
      };
    }

    if (structure.parts.mainVerb && structure.parts.mainVerb.isValid) {
      iconStates.verb = { active: true, error: false, type: structure.parts.mainVerb.type };
    }

    if (structure.parts.gerund) {
      iconStates.gerund = { active: true, error: false, type: 'gerund' };
    }

    if (structure.parts.complement) {
      iconStates.complement = { active: true, error: false, type: 'complement' };
    }

    if (structure.parts.connector) {
      iconStates.connector = { active: true, error: false, type: structure.parts.connector.text };
    }

    return iconStates;
  }

  /**
   * Genera feedback en español para tiempo real
   */
  generateSpanishFeedback(analysis) {
    const feedback = {
      errors: [],
      tips: [],
      corrections: []
    };

    // Convertir errores a feedback en español
    if (analysis.errors) {
      analysis.errors.forEach(error => {
        if (error.type === 'wrong_auxiliary_am') {
          feedback.errors.push({
            type: 'error',
            message: '❌ Cambia "am" por "was" en contexto pasado',
            explanation: 'En pasado usa "was" con "I"'
          });
        } else if (error.type === 'missing_gerund') {
          feedback.errors.push({
            type: 'error',
            message: '📝 Agrega "-ing" al verbo para Past Continuous',
            explanation: 'Después de "was/were" necesitas verbo + ing'
          });
        }
      });
    }

    // Agregar tips contextuales
    if (analysis.structure && analysis.structure.parts.connector) {
      const connector = analysis.structure.parts.connector.text;
      if (connector === 'while') {
        feedback.tips.push({
          type: 'tip',
          message: '💡 "While" sugiere Past Continuous',
          explanation: 'Usa "was/were + verbo-ing" para acciones simultáneas'
        });
      }
    }

    return feedback;
  }

  /**
   * Consolida sugerencias de diferentes fuentes
   */
  consolidateSuggestions(analysis) {
    const suggestions = [];
    
    // Priorizar errores
    if (analysis.errors && analysis.errors.length > 0) {
      analysis.errors.slice(0, 2).forEach(error => {
        suggestions.push({
          type: 'error',
          priority: 1,
          message: error.message,
          icon: '❌'
        });
      });
    }

    // Agregar recomendaciones contextuales
    if (analysis.contextRecommendations && analysis.contextRecommendations.smartTips) {
      analysis.contextRecommendations.smartTips.slice(0, 1).forEach(tip => {
        suggestions.push({
          type: 'recommendation',
          priority: 2,
          message: tip.message,
          icon: tip.icon || '💡'
        });
      });
    }

    // Agregar feedback en español
    if (analysis.spanishFeedback) {
      analysis.spanishFeedback.tips.slice(0, 1).forEach(tip => {
        suggestions.push({
          type: 'tip',
          priority: 3,
          message: tip.message,
          icon: '💡'
        });
      });
    }

    // Ordenar por prioridad y limitar
    return suggestions
      .sort((a, b) => a.priority - b.priority)
      .slice(0, REAL_TIME_CONFIG.maxSuggestions);
  }

  /**
   * Optimiza el resultado para tiempo real
   */
  optimizeForRealTime(analysis) {
    // Crear versión ligera para tiempo real
    const optimized = {
      text: analysis.text,
      level: analysis.level,
      timestamp: analysis.timestamp,
      
      // Estados de iconos (esencial para UI)
      iconStates: analysis.iconStates,
      
      // Sugerencias consolidadas (máximo 3)
      suggestions: analysis.suggestions,
      
      // Información básica de estructura
      tenseType: analysis.structure?.tenseType || 'unknown',
      completionPercentage: analysis.structure ? 
        this.grammarStructure.calculateCompletionPercentage(analysis.structure) : 0,
      
      // Errores críticos solamente
      criticalErrors: analysis.errors?.filter(e => 
        ['wrong_auxiliary_am', 'wrong_auxiliary_are', 'present_in_past'].includes(e.type)
      ) || [],
      
      // Recomendación principal
      primaryRecommendation: analysis.contextRecommendations?.primaryRecommendation || 'either',
      confidence: analysis.contextRecommendations?.confidence || 0
    };

    return optimized;
  }

  /**
   * Análisis incremental para mejor performance
   */
  performIncrementalAnalysis(previousAnalysis, newText, changedPortion) {
    // Si el cambio es menor, reutilizar análisis previo
    if (this.isMinorChange(previousAnalysis?.text || '', newText)) {
      return this.updateAnalysisIncrementally(previousAnalysis, newText);
    }
    
    // Si es un cambio mayor, hacer análisis completo
    return this.performRealTimeAnalysis(newText);
  }

  /**
   * Determina si es un cambio menor
   */
  isMinorChange(oldText, newText) {
    const oldWords = oldText.split(/\s+/);
    const newWords = newText.split(/\s+/);
    
    // Si la diferencia es solo 1-2 palabras, es cambio menor
    const wordDiff = Math.abs(oldWords.length - newWords.length);
    return wordDiff <= 2;
  }

  /**
   * Actualiza análisis incrementalmente
   */
  updateAnalysisIncrementally(previousAnalysis, newText) {
    if (!previousAnalysis) {
      return this.performRealTimeAnalysis(newText);
    }

    // Crear análisis actualizado basado en el anterior
    const updated = {
      ...previousAnalysis,
      text: newText,
      timestamp: Date.now(),
      isIncremental: true
    };

    // Solo actualizar completion percentage
    if (updated.iconStates) {
      const activeIcons = Object.values(updated.iconStates).filter(state => state.active).length;
      const totalIcons = Object.keys(updated.iconStates).length;
      updated.completionPercentage = Math.round((activeIcons / totalIcons) * 100);
    }

    return updated;
  }

  /**
   * Genera clave de cache
   */
  generateCacheKey(text, options) {
    const textHash = text.length + '_' + text.substring(0, 10) + '_' + text.substring(text.length - 10);
    const optionsHash = JSON.stringify(options);
    return textHash + '_' + optionsHash;
  }

  /**
   * Limpia cache antiguo
   */
  cleanupCache() {
    const maxCacheSize = 50;
    const maxCacheAge = 5 * 60 * 1000; // 5 minutos
    const now = Date.now();

    if (this.analysisCache.size > maxCacheSize) {
      // Eliminar entradas más antiguas
      const entries = Array.from(this.analysisCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toDelete = entries.slice(0, entries.length - maxCacheSize);
      toDelete.forEach(([key]) => this.analysisCache.delete(key));
    }

    // Eliminar entradas expiradas
    for (const [key, value] of this.analysisCache.entries()) {
      if (now - value.timestamp > maxCacheAge) {
        this.analysisCache.delete(key);
      }
    }
  }

  /**
   * Crea análisis vacío para textos muy cortos
   */
  createEmptyAnalysis(text) {
    return {
      text: text,
      level: 'none',
      timestamp: Date.now(),
      iconStates: {},
      suggestions: [],
      tenseType: 'unknown',
      completionPercentage: 0,
      criticalErrors: [],
      primaryRecommendation: 'either',
      confidence: 0,
      isEmpty: true
    };
  }

  /**
   * Obtiene estadísticas de performance
   */
  getPerformanceStats() {
    return {
      cacheSize: this.analysisCache.size,
      lastAnalysisTime: this.lastAnalysisTime,
      averageAnalysisTime: this.calculateAverageAnalysisTime(),
      cacheHitRate: this.calculateCacheHitRate()
    };
  }

  /**
   * Calcula tiempo promedio de análisis
   */
  calculateAverageAnalysisTime() {
    // Implementación básica - en producción usaríamos métricas más sofisticadas
    return this.lastAnalysisTime;
  }

  /**
   * Calcula tasa de aciertos de cache
   */
  calculateCacheHitRate() {
    // Implementación básica - en producción rastrearíamos hits/misses
    return 0.75; // 75% estimado
  }
}

module.exports = {
  RealTimeAnalysisService,
  REAL_TIME_CONFIG
};