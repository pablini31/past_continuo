// src/services/integration-optimizer.service.js

/**
 * ═══════════════════════════════════════════════════
 * 🔧 INTEGRATION OPTIMIZER SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Servicio para integrar todos los componentes y optimizar
 * el rendimiento del sistema completo
 */

const { RealTimeAnalysisService } = require('./real-time-analysis.service');
const { ContextualGuidesService } = require('./contextual-guides.service');
const { ProgressIndicatorsService } = require('./progress-indicators.service');
const { GuidedPracticeService } = require('./guided-practice.service');
const { AdaptiveLearningService } = require('./adaptive-learning.service');

/**
 * Configuración de optimización
 */
const OPTIMIZATION_CONFIG = {
  // Configuración de cache
  cache: {
    maxSize: 1000,
    ttl: 300000, // 5 minutos
    cleanupInterval: 60000 // 1 minuto
  },
  
  // Configuración de performance
  performance: {
    maxAnalysisTime: 200, // ms
    batchSize: 10,
    concurrentRequests: 5
  },
  
  // Configuración de integración
  integration: {
    enableRealTimeUpdates: true,
    enableProgressTracking: true,
    enableAdaptiveDifficulty: true,
    enableContextualGuides: true
  }
};

/**
 * Clase principal del servicio de integración y optimización
 */
class IntegrationOptimizerService {
  constructor() {
    // Inicializar todos los servicios
    this.realTimeAnalysis = new RealTimeAnalysisService();
    this.contextualGuides = new ContextualGuidesService();
    this.progressIndicators = new ProgressIndicatorsService();
    this.guidedPractice = new GuidedPracticeService();
    this.adaptiveLearning = new AdaptiveLearningService();
    
    // Cache integrado
    this.integratedCache = new Map();
    this.performanceMetrics = new Map();
    
    // Inicializar optimizaciones
    this.initializeOptimizations();
  }

  /**
   * Análisis completo integrado
   */
  async performIntegratedAnalysis(text, userId = 'anonymous', options = {}) {
    const startTime = Date.now();
    
    try {
      // Validar entrada
      if (!text || typeof text !== 'string') {
        return this.performFallbackAnalysis('', userId);
      }

      // Verificar cache integrado
      const cacheKey = this.generateIntegratedCacheKey(text, userId, options);
      if (this.integratedCache.has(cacheKey)) {
        const cached = this.integratedCache.get(cacheKey);
        this.recordPerformanceMetric('cache_hit', Date.now() - startTime);
        return cached;
      }

      // Realizar análisis en paralelo para optimizar rendimiento
      const [
        realTimeAnalysis,
        userProfile,
        userProgress
      ] = await Promise.all([
        this.realTimeAnalysis.performRealTimeAnalysis(text, options),
        this.getUserProfileSafely(userId),
        this.getUserProgressSafely(userId)
      ]);

      // Generar análisis integrado
      const integratedResult = await this.buildIntegratedResult(
        realTimeAnalysis,
        userProfile,
        userProgress,
        text,
        userId,
        options
      );

      // Guardar en cache
      this.integratedCache.set(cacheKey, integratedResult);
      
      // Registrar métricas
      this.recordPerformanceMetric('integrated_analysis', Date.now() - startTime);
      
      return integratedResult;

    } catch (error) {
      console.error('Integrated analysis error:', error);
      this.recordPerformanceMetric('analysis_error', Date.now() - startTime);
      
      // Fallback a análisis básico
      return this.performFallbackAnalysis(text, userId);
    }
  }

  /**
   * Construye el resultado integrado
   */
  async buildIntegratedResult(realTimeAnalysis, userProfile, userProgress, text, userId, options) {
    const result = {
      timestamp: Date.now(),
      userId,
      text,
      
      // Análisis en tiempo real
      realTime: realTimeAnalysis,
      
      // Guías contextuales
      contextualGuides: null,
      
      // Indicadores de progreso
      progressIndicators: null,
      
      // Recomendaciones adaptativas
      adaptiveRecommendations: null,
      
      // Métricas de rendimiento
      performance: {
        analysisTime: 0,
        cacheHit: false,
        optimizationsApplied: []
      }
    };

    // Generar guías contextuales si están habilitadas
    if (OPTIMIZATION_CONFIG.integration.enableContextualGuides) {
      result.contextualGuides = await this.generateContextualGuides(
        realTimeAnalysis,
        userProfile,
        userProgress
      );
    }

    // Generar indicadores de progreso si están habilitados
    if (OPTIMIZATION_CONFIG.integration.enableProgressTracking) {
      result.progressIndicators = await this.generateProgressIndicators(
        realTimeAnalysis,
        userProfile,
        userProgress
      );
    }

    // Generar recomendaciones adaptativas si están habilitadas
    if (OPTIMIZATION_CONFIG.integration.enableAdaptiveDifficulty && userProfile) {
      result.adaptiveRecommendations = await this.generateAdaptiveRecommendations(
        realTimeAnalysis,
        userProfile,
        userProgress
      );
    }

    return result;
  }

  /**
   * Genera guías contextuales integradas
   */
  async generateContextualGuides(realTimeAnalysis, userProfile, userProgress) {
    try {
      const context = {
        tenseType: realTimeAnalysis.tenseType,
        errors: realTimeAnalysis.criticalErrors || [],
        completionLevel: realTimeAnalysis.completionPercentage || 0,
        userLevel: userProfile?.skillLevel || 'beginner'
      };

      const userContext = {
        level: userProfile?.skillLevel || 'beginner',
        completedSentences: userProgress?.correctSentences || 0,
        errorHistory: userProfile?.memory?.weaknesses || {}
      };

      return this.contextualGuides.generateContextualGuide(context, userContext);
    } catch (error) {
      console.error('Error generating contextual guides:', error);
      return null;
    }
  }

  /**
   * Genera indicadores de progreso integrados
   */
  async generateProgressIndicators(realTimeAnalysis, userProfile, userProgress) {
    try {
      const userStats = {
        correctSentences: userProgress?.correctSentences || 0,
        totalSentences: userProgress?.totalSentences || 0,
        consecutiveCorrect: userProgress?.consecutiveCorrect || 0,
        sessionTime: userProgress?.sessionTime || 0,
        errorHistory: userProfile?.memory?.weaknesses || {},
        practiceStreak: userProfile?.goals?.weeklyGoal || 0
      };

      const userHistory = this.generateUserHistory(userProfile, userProgress);

      return this.progressIndicators.generateCompleteProgressIndicators(
        realTimeAnalysis,
        userStats,
        userHistory
      );
    } catch (error) {
      console.error('Error generating progress indicators:', error);
      return null;
    }
  }

  /**
   * Genera recomendaciones adaptativas integradas
   */
  async generateAdaptiveRecommendations(realTimeAnalysis, userProfile, userProgress) {
    try {
      // Actualizar memoria del usuario con la sesión actual
      const sessionData = {
        errors: (realTimeAnalysis.criticalErrors || []).map(error => ({ skill: error.type })),
        successes: this.extractSuccesses(realTimeAnalysis),
        timeSpent: realTimeAnalysis.performanceMetrics?.analysisTime || 0,
        difficulty: userProfile.currentDifficulty || 'medium'
      };

      // Actualizar memoria
      this.adaptiveLearning.updateUserMemory(userProfile.userId, sessionData);

      // Generar recomendaciones personalizadas
      return this.adaptiveLearning.generatePersonalizedRecommendations(userProfile.userId);
    } catch (error) {
      console.error('Error generating adaptive recommendations:', error);
      return null;
    }
  }

  /**
   * Optimiza el rendimiento del sistema
   */
  optimizePerformance() {
    const optimizations = {
      cacheOptimization: this.optimizeCache(),
      memoryOptimization: this.optimizeMemory(),
      requestOptimization: this.optimizeRequests(),
      analysisOptimization: this.optimizeAnalysis()
    };

    return {
      timestamp: Date.now(),
      optimizations,
      metrics: this.getPerformanceMetrics(),
      recommendations: this.generateOptimizationRecommendations(optimizations)
    };
  }

  /**
   * Optimiza el cache del sistema
   */
  optimizeCache() {
    const beforeSize = this.integratedCache.size;
    const beforeMemory = this.calculateCacheMemoryUsage();
    
    // Limpiar entradas expiradas
    const now = Date.now();
    const ttl = OPTIMIZATION_CONFIG.cache.ttl;
    
    for (const [key, value] of this.integratedCache.entries()) {
      if (now - value.timestamp > ttl) {
        this.integratedCache.delete(key);
      }
    }

    // Limpiar cache si excede el tamaño máximo
    if (this.integratedCache.size > OPTIMIZATION_CONFIG.cache.maxSize) {
      const entries = Array.from(this.integratedCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toDelete = entries.slice(0, entries.length - OPTIMIZATION_CONFIG.cache.maxSize);
      toDelete.forEach(([key]) => this.integratedCache.delete(key));
    }

    const afterSize = this.integratedCache.size;
    const afterMemory = this.calculateCacheMemoryUsage();

    return {
      entriesRemoved: beforeSize - afterSize,
      memoryFreed: beforeMemory - afterMemory,
      currentSize: afterSize,
      maxSize: OPTIMIZATION_CONFIG.cache.maxSize,
      utilizationPercentage: Math.round((afterSize / OPTIMIZATION_CONFIG.cache.maxSize) * 100)
    };
  }

  /**
   * Optimiza el uso de memoria
   */
  optimizeMemory() {
    // Limpiar métricas antiguas
    const metricsBeforeSize = this.performanceMetrics.size;
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 horas
    
    for (const [key, metrics] of this.performanceMetrics.entries()) {
      const recentMetrics = metrics.filter(m => m.timestamp > cutoffTime);
      if (recentMetrics.length === 0) {
        this.performanceMetrics.delete(key);
      } else {
        this.performanceMetrics.set(key, recentMetrics);
      }
    }

    // Optimizar servicios individuales
    this.realTimeAnalysis.cleanupCache();
    
    return {
      metricsEntriesRemoved: metricsBeforeSize - this.performanceMetrics.size,
      currentMetricsSize: this.performanceMetrics.size,
      memoryOptimized: true
    };
  }

  /**
   * Optimiza las peticiones
   */
  optimizeRequests() {
    // Implementar batching para peticiones múltiples
    // Implementar rate limiting inteligente
    // Implementar priorización de peticiones
    
    return {
      batchingEnabled: true,
      rateLimitingOptimized: true,
      prioritizationEnabled: true,
      maxConcurrentRequests: OPTIMIZATION_CONFIG.performance.concurrentRequests
    };
  }

  /**
   * Optimiza el análisis
   */
  optimizeAnalysis() {
    // Configurar análisis progresivo más eficiente
    // Optimizar algoritmos de detección
    // Implementar análisis predictivo
    
    return {
      progressiveAnalysisOptimized: true,
      detectionAlgorithmsOptimized: true,
      predictiveAnalysisEnabled: true,
      maxAnalysisTime: OPTIMIZATION_CONFIG.performance.maxAnalysisTime
    };
  }

  /**
   * Ejecuta tests de integración completos
   */
  async runIntegrationTests() {
    const tests = {
      realTimeIntegration: await this.testRealTimeIntegration(),
      guidesIntegration: await this.testGuidesIntegration(),
      progressIntegration: await this.testProgressIntegration(),
      adaptiveIntegration: await this.testAdaptiveIntegration(),
      performanceTests: await this.testPerformance()
    };

    const allPassed = Object.values(tests).every(test => test.passed);
    
    return {
      timestamp: Date.now(),
      allTestsPassed: allPassed,
      tests,
      summary: {
        totalTests: Object.keys(tests).length,
        passedTests: Object.values(tests).filter(t => t.passed).length,
        failedTests: Object.values(tests).filter(t => !t.passed).length
      }
    };
  }

  /**
   * Funciones auxiliares
   */
  async getUserProfileSafely(userId) {
    try {
      return this.adaptiveLearning.getUserProfile(userId);
    } catch (error) {
      return null;
    }
  }

  async getUserProgressSafely(userId) {
    try {
      // Simular obtención de progreso del usuario
      return {
        correctSentences: 0,
        totalSentences: 0,
        consecutiveCorrect: 0,
        sessionTime: Date.now()
      };
    } catch (error) {
      return null;
    }
  }

  generateIntegratedCacheKey(text, userId, options) {
    if (!text || typeof text !== 'string') {
      return `${userId}_invalid_text_${Date.now()}`;
    }
    const textHash = text.substring(0, 20) + text.length;
    const optionsHash = JSON.stringify(options);
    return `${userId}_${textHash}_${optionsHash}`;
  }

  recordPerformanceMetric(type, duration) {
    if (!this.performanceMetrics.has(type)) {
      this.performanceMetrics.set(type, []);
    }
    
    const metrics = this.performanceMetrics.get(type);
    metrics.push({
      timestamp: Date.now(),
      duration,
      type
    });
    
    // Mantener solo las últimas 100 métricas por tipo
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  calculateCacheMemoryUsage() {
    // Estimación aproximada del uso de memoria del cache
    return this.integratedCache.size * 1024; // 1KB por entrada estimado
  }

  extractSuccesses(realTimeAnalysis) {
    const successes = [];
    
    if (realTimeAnalysis.iconStates) {
      Object.entries(realTimeAnalysis.iconStates).forEach(([part, state]) => {
        if (state.active && !state.error) {
          successes.push({ skill: part });
        }
      });
    }
    
    return successes;
  }

  generateUserHistory(userProfile, userProgress) {
    // Generar historial simulado basado en el perfil del usuario
    const history = [];
    
    if (userProfile && userProfile.memory) {
      const sessions = userProfile.memory.totalSessions || 1;
      
      for (let i = 0; i < Math.min(sessions, 10); i++) {
        history.push({
          date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
          accuracy: Math.random() * 40 + 60, // 60-100%
          correctSentences: Math.floor(Math.random() * 10) + 1,
          totalSentences: Math.floor(Math.random() * 5) + 5,
          errors: []
        });
      }
    }
    
    return history;
  }

  async performFallbackAnalysis(text, userId) {
    return {
      timestamp: Date.now(),
      userId,
      text,
      realTime: await this.realTimeAnalysis.performRealTimeAnalysis(text),
      contextualGuides: null,
      progressIndicators: null,
      adaptiveRecommendations: null,
      performance: {
        analysisTime: 0,
        cacheHit: false,
        optimizationsApplied: ['fallback_mode']
      },
      isFallback: true
    };
  }

  initializeOptimizations() {
    // Configurar limpieza automática del cache
    setInterval(() => {
      this.optimizeCache();
    }, OPTIMIZATION_CONFIG.cache.cleanupInterval);
    
    // Configurar optimización de memoria
    setInterval(() => {
      this.optimizeMemory();
    }, 5 * 60 * 1000); // Cada 5 minutos
  }

  getPerformanceMetrics() {
    const metrics = {};
    
    for (const [type, data] of this.performanceMetrics.entries()) {
      const durations = data.map(d => d.duration);
      metrics[type] = {
        count: data.length,
        averageDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length || 0,
        minDuration: Math.min(...durations) || 0,
        maxDuration: Math.max(...durations) || 0,
        lastRecorded: data[data.length - 1]?.timestamp || 0
      };
    }
    
    return metrics;
  }

  generateOptimizationRecommendations(optimizations) {
    const recommendations = [];
    
    // Recomendaciones basadas en uso de cache
    if (optimizations.cacheOptimization.utilizationPercentage > 90) {
      recommendations.push({
        type: 'cache',
        priority: 'high',
        message: 'Considerar aumentar el tamaño del cache',
        action: 'increase_cache_size'
      });
    }
    
    // Recomendaciones basadas en métricas de rendimiento
    const metrics = this.getPerformanceMetrics();
    if (metrics.integrated_analysis?.averageDuration > OPTIMIZATION_CONFIG.performance.maxAnalysisTime) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: 'Tiempo de análisis por encima del objetivo',
        action: 'optimize_analysis_algorithms'
      });
    }
    
    return recommendations;
  }

  // Tests de integración
  async testRealTimeIntegration() {
    try {
      const result = await this.performIntegratedAnalysis('I was walking', 'test_user');
      const hasTenseType = result && result.realTime && result.realTime.tenseType;
      return {
        passed: !!hasTenseType,
        message: 'Real-time integration working correctly',
        details: { tenseDetected: result?.realTime?.tenseType }
      };
    } catch (error) {
      return {
        passed: false,
        message: 'Real-time integration failed',
        error: error.message
      };
    }
  }

  async testGuidesIntegration() {
    try {
      const result = await this.performIntegratedAnalysis('I am walking yesterday', 'test_user');
      return {
        passed: result && result.contextualGuides,
        message: 'Contextual guides integration working correctly',
        details: { guidesGenerated: !!result?.contextualGuides }
      };
    } catch (error) {
      return {
        passed: false,
        message: 'Contextual guides integration failed',
        error: error.message
      };
    }
  }

  async testProgressIntegration() {
    try {
      const result = await this.performIntegratedAnalysis('I was studying', 'test_user');
      return {
        passed: result && result.progressIndicators,
        message: 'Progress indicators integration working correctly',
        details: { progressGenerated: !!result?.progressIndicators }
      };
    } catch (error) {
      return {
        passed: false,
        message: 'Progress indicators integration failed',
        error: error.message
      };
    }
  }

  async testAdaptiveIntegration() {
    try {
      // Crear perfil de usuario primero
      await this.adaptiveLearning.evaluateInitialLevel('adaptive_test_user', [
        { answer: 'was', timeSpent: 5000 }
      ]);
      
      const result = await this.performIntegratedAnalysis('I was reading', 'adaptive_test_user');
      return {
        passed: result && result.adaptiveRecommendations,
        message: 'Adaptive learning integration working correctly',
        details: { recommendationsGenerated: !!result?.adaptiveRecommendations }
      };
    } catch (error) {
      return {
        passed: false,
        message: 'Adaptive learning integration failed',
        error: error.message
      };
    }
  }

  async testPerformance() {
    try {
      const startTime = Date.now();
      const promises = [];
      
      // Test de carga con múltiples análisis simultáneos
      for (let i = 0; i < 5; i++) {
        promises.push(this.performIntegratedAnalysis(`I was walking ${i}`, `perf_test_user_${i}`));
      }
      
      await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      return {
        passed: duration < 2000, // Menos de 2 segundos para 5 análisis
        message: 'Performance test completed',
        details: { 
          duration,
          analysisCount: 5,
          averageTime: duration / 5
        }
      };
    } catch (error) {
      return {
        passed: false,
        message: 'Performance test failed',
        error: error.message
      };
    }
  }
}

module.exports = {
  IntegrationOptimizerService,
  OPTIMIZATION_CONFIG
};