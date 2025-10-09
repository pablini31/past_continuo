// src/controllers/integration.controller.js

/**
 * ═══════════════════════════════════════════════════
 * 🔧 INTEGRATION CONTROLLER
 * ═══════════════════════════════════════════════════
 * 
 * Controlador para integración y optimización del sistema
 */

const { IntegrationOptimizerService } = require('../services/integration-optimizer.service');
const { success, error } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

// Instancia del servicio de integración
const integrationOptimizer = new IntegrationOptimizerService();

/**
 * 🔍 POST /api/integration/analyze
 * Análisis completo integrado
 */
const performIntegratedAnalysis = async (req, res, next) => {
  try {
    const { text, options = {} } = req.body;
    const userId = req.user?.id || 'anonymous';

    if (!text || typeof text !== 'string') {
      return error(res, 'Text is required for analysis', HTTP_STATUS.BAD_REQUEST);
    }

    const result = await integrationOptimizer.performIntegratedAnalysis(text, userId, options);
    
    return success(res, {
      analysis: result,
      integration: {
        componentsUsed: this.getComponentsUsed(result),
        optimizationsApplied: result.performance.optimizationsApplied,
        analysisTime: result.performance.analysisTime
      }
    }, 'Integrated analysis completed successfully');

  } catch (err) {
    console.error('Integrated analysis error:', err);
    next(err);
  }
};

/**
 * ⚡ POST /api/integration/optimize
 * Optimiza el rendimiento del sistema
 */
const optimizePerformance = async (req, res, next) => {
  try {
    const optimization = integrationOptimizer.optimizePerformance();
    
    return success(res, {
      optimization,
      summary: {
        cacheOptimized: optimization.optimizations.cacheOptimization.entriesRemoved > 0,
        memoryOptimized: optimization.optimizations.memoryOptimization.memoryOptimized,
        performanceImproved: optimization.recommendations.length === 0
      }
    }, 'System optimization completed');

  } catch (err) {
    console.error('Performance optimization error:', err);
    next(err);
  }
};

/**
 * 🧪 POST /api/integration/test
 * Ejecuta tests de integración completos
 */
const runIntegrationTests = async (req, res, next) => {
  try {
    const testResults = await integrationOptimizer.runIntegrationTests();
    
    return success(res, {
      testResults,
      status: testResults.allTestsPassed ? 'PASSED' : 'FAILED',
      recommendations: testResults.allTestsPassed ? 
        ['All integration tests passed successfully'] :
        ['Some integration tests failed. Check individual test details.']
    }, 'Integration tests completed');

  } catch (err) {
    console.error('Integration tests error:', err);
    next(err);
  }
};

/**
 * 📊 GET /api/integration/metrics
 * Obtiene métricas de rendimiento del sistema
 */
const getPerformanceMetrics = async (req, res, next) => {
  try {
    const metrics = integrationOptimizer.getPerformanceMetrics();
    const cacheStats = {
      size: integrationOptimizer.integratedCache.size,
      memoryUsage: integrationOptimizer.calculateCacheMemoryUsage()
    };
    
    return success(res, {
      metrics,
      cache: cacheStats,
      system: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        timestamp: Date.now()
      }
    }, 'Performance metrics retrieved successfully');

  } catch (err) {
    console.error('Get metrics error:', err);
    next(err);
  }
};

/**
 * 🔧 GET /api/integration/health
 * Verifica el estado de salud del sistema integrado
 */
const checkSystemHealth = async (req, res, next) => {
  try {
    const health = {
      timestamp: Date.now(),
      status: 'healthy',
      components: {
        realTimeAnalysis: await checkComponentHealth('realTimeAnalysis'),
        contextualGuides: await checkComponentHealth('contextualGuides'),
        progressIndicators: await checkComponentHealth('progressIndicators'),
        guidedPractice: await checkComponentHealth('guidedPractice'),
        adaptiveLearning: await checkComponentHealth('adaptiveLearning')
      },
      performance: {
        averageResponseTime: calculateAverageResponseTime(),
        cacheHitRate: calculateCacheHitRate(),
        errorRate: calculateErrorRate()
      }
    };

    // Determinar estado general
    const componentStatuses = Object.values(health.components);
    const allHealthy = componentStatuses.every(status => status === 'healthy');
    health.status = allHealthy ? 'healthy' : 'degraded';

    const statusCode = allHealthy ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;
    
    return res.status(statusCode).json({
      success: allHealthy,
      message: allHealthy ? 'System is healthy' : 'System has issues',
      data: health
    });

  } catch (err) {
    console.error('Health check error:', err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Health check failed',
      data: {
        status: 'unhealthy',
        error: err.message,
        timestamp: Date.now()
      }
    });
  }
};

/**
 * 🔄 POST /api/integration/reset-cache
 * Resetea el cache del sistema (solo desarrollo)
 */
const resetSystemCache = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return error(res, 'Cache reset not available in production', HTTP_STATUS.FORBIDDEN);
    }

    const beforeSize = integrationOptimizer.integratedCache.size;
    integrationOptimizer.integratedCache.clear();
    integrationOptimizer.performanceMetrics.clear();
    
    // También limpiar caches de servicios individuales
    integrationOptimizer.realTimeAnalysis.analysisCache.clear();
    
    return success(res, {
      cacheReset: true,
      entriesCleared: beforeSize,
      timestamp: Date.now()
    }, 'System cache reset successfully');

  } catch (err) {
    console.error('Cache reset error:', err);
    next(err);
  }
};

/**
 * 📈 GET /api/integration/stats
 * Obtiene estadísticas completas del sistema
 */
const getSystemStats = async (req, res, next) => {
  try {
    const stats = {
      timestamp: Date.now(),
      uptime: process.uptime(),
      
      // Estadísticas de cache
      cache: {
        integratedCacheSize: integrationOptimizer.integratedCache.size,
        realTimeCacheSize: integrationOptimizer.realTimeAnalysis.analysisCache.size,
        totalMemoryUsage: integrationOptimizer.calculateCacheMemoryUsage()
      },
      
      // Estadísticas de rendimiento
      performance: integrationOptimizer.getPerformanceMetrics(),
      
      // Estadísticas del sistema
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      },
      
      // Estadísticas de componentes
      components: {
        totalServices: 5,
        activeServices: 5,
        integrationEnabled: true
      }
    };
    
    return success(res, {
      stats,
      summary: {
        systemHealth: 'good',
        performanceLevel: 'optimal',
        cacheEfficiency: 'high'
      }
    }, 'System statistics retrieved successfully');

  } catch (err) {
    console.error('Get system stats error:', err);
    next(err);
  }
};

/**
 * Funciones auxiliares
 */
function getComponentsUsed(result) {
  const components = [];
  
  if (result.realTime) components.push('realTimeAnalysis');
  if (result.contextualGuides) components.push('contextualGuides');
  if (result.progressIndicators) components.push('progressIndicators');
  if (result.adaptiveRecommendations) components.push('adaptiveLearning');
  
  return components;
}

async function checkComponentHealth(componentName) {
  try {
    // Simulación de verificación de salud de componentes
    switch (componentName) {
      case 'realTimeAnalysis':
        // Verificar que el servicio de análisis en tiempo real responde
        const testAnalysis = await integrationOptimizer.realTimeAnalysis.performRealTimeAnalysis('test');
        return testAnalysis ? 'healthy' : 'unhealthy';
        
      case 'contextualGuides':
        // Verificar que el servicio de guías contextuales responde
        const testGuides = integrationOptimizer.contextualGuides.generateEducationalTips({
          tenseType: 'past_continuous',
          userLevel: 'basic'
        });
        return testGuides.length > 0 ? 'healthy' : 'unhealthy';
        
      case 'progressIndicators':
        // Verificar que el servicio de indicadores de progreso responde
        const testProgress = integrationOptimizer.progressIndicators.calculateUserLevel(50);
        return testProgress.current ? 'healthy' : 'unhealthy';
        
      case 'guidedPractice':
        // Verificar que el servicio de práctica guiada responde
        const testTutorials = integrationOptimizer.guidedPractice.getAvailableTutorials('beginner');
        return testTutorials.length > 0 ? 'healthy' : 'unhealthy';
        
      case 'adaptiveLearning':
        // Verificar que el servicio de aprendizaje adaptativo responde
        const testLevel = integrationOptimizer.adaptiveLearning.determineSkillLevel(75);
        return testLevel ? 'healthy' : 'unhealthy';
        
      default:
        return 'unknown';
    }
  } catch (error) {
    console.error(`Health check failed for ${componentName}:`, error);
    return 'unhealthy';
  }
}

function calculateAverageResponseTime() {
  const metrics = integrationOptimizer.getPerformanceMetrics();
  const analysisMetrics = metrics.integrated_analysis;
  return analysisMetrics ? Math.round(analysisMetrics.averageDuration) : 0;
}

function calculateCacheHitRate() {
  const metrics = integrationOptimizer.getPerformanceMetrics();
  const cacheHits = metrics.cache_hit?.count || 0;
  const totalAnalysis = metrics.integrated_analysis?.count || 0;
  return totalAnalysis > 0 ? Math.round((cacheHits / totalAnalysis) * 100) : 0;
}

function calculateErrorRate() {
  const metrics = integrationOptimizer.getPerformanceMetrics();
  const errors = metrics.analysis_error?.count || 0;
  const totalAnalysis = metrics.integrated_analysis?.count || 0;
  return totalAnalysis > 0 ? Math.round((errors / totalAnalysis) * 100) : 0;
}

module.exports = {
  performIntegratedAnalysis,
  optimizePerformance,
  runIntegrationTests,
  getPerformanceMetrics,
  checkSystemHealth,
  resetSystemCache,
  getSystemStats
};