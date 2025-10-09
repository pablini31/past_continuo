// src/config/development.js

/**
 * ═══════════════════════════════════════════════════
 * 🛠️ DEVELOPMENT CONFIGURATION
 * ═══════════════════════════════════════════════════
 * 
 * Configuraciones específicas para desarrollo
 */

module.exports = {
  // 🔧 Configuración de desarrollo
  development: {
    // Base de datos mock (sin conexión real)
    database: {
      mock: true,
      seedData: true,
      logQueries: true
    },
    
    // Logging más detallado
    logging: {
      level: 'DEBUG',
      logRequests: true,
      logResponses: true,
      logErrors: true
    },
    
    // Seguridad relajada para desarrollo
    security: {
      cors: {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true
      },
      rateLimit: {
        enabled: false, // Deshabilitado en desarrollo
        windowMs: 15 * 60 * 1000,
        maxRequests: 1000
      }
    },
    
    // Features experimentales
    features: {
      autoCorrection: true,
      advancedAnalysis: true,
      debugMode: true,
      mockUsers: true
    },
    
    // Performance
    performance: {
      cacheEnabled: false, // Sin cache en desarrollo
      compressionEnabled: false,
      minifyResponses: false
    }
  },
  
  // 🚀 Configuración de producción
  production: {
    database: {
      mock: false,
      seedData: false,
      logQueries: false
    },
    
    logging: {
      level: 'INFO',
      logRequests: true,
      logResponses: false,
      logErrors: true
    },
    
    security: {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'],
        credentials: true
      },
      rateLimit: {
        enabled: true,
        windowMs: 15 * 60 * 1000,
        maxRequests: 100
      }
    },
    
    features: {
      autoCorrection: true,
      advancedAnalysis: true,
      debugMode: false,
      mockUsers: false
    },
    
    performance: {
      cacheEnabled: true,
      compressionEnabled: true,
      minifyResponses: true
    }
  }
};

// Función para obtener configuración actual
const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  const configs = module.exports;
  return configs[env] || configs.development;
};

module.exports.getConfig = getConfig;