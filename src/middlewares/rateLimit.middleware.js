// src/middlewares/rateLimit.middleware.js

/**
 * ═══════════════════════════════════════════════════
 * 🚦 RATE LIMITING MIDDLEWARE
 * ═══════════════════════════════════════════════════
 * 
 * Previene spam y abuso de la API
 */

const { HTTP_STATUS } = require('../config/constants');

// Store para tracking de requests (en producción usar Redis)
const requestStore = new Map();

/**
 * Rate limiter simple basado en IP
 */
const createRateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutos por defecto
    maxRequests = 100, // 100 requests por ventana
    message = 'Too many requests, please try again later',
    skipSuccessfulRequests = false
  } = options;

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Limpiar entradas expiradas
    for (const [ip, data] of requestStore.entries()) {
      if (now - data.resetTime > windowMs) {
        requestStore.delete(ip);
      }
    }
    
    // Obtener o crear entrada para esta IP
    let requestData = requestStore.get(key);
    
    if (!requestData) {
      requestData = {
        count: 0,
        resetTime: now
      };
      requestStore.set(key, requestData);
    }
    
    // Reset si ha pasado la ventana de tiempo
    if (now - requestData.resetTime > windowMs) {
      requestData.count = 0;
      requestData.resetTime = now;
    }
    
    // Incrementar contador
    requestData.count++;
    
    // Headers informativos
    res.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': Math.max(0, maxRequests - requestData.count),
      'X-RateLimit-Reset': new Date(requestData.resetTime + windowMs).toISOString()
    });
    
    // Verificar límite
    if (requestData.count > maxRequests) {
      return res.status(HTTP_STATUS.TOO_MANY_REQUESTS || 429).json({
        success: false,
        message,
        retryAfter: Math.ceil((requestData.resetTime + windowMs - now) / 1000)
      });
    }
    
    next();
  };
};

// Rate limiters específicos para diferentes endpoints
const apiLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 100,
  message: 'Too many API requests, please try again in 15 minutes'
});

const authLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 5, // Solo 5 intentos de login por IP
  message: 'Too many authentication attempts, please try again in 15 minutes'
});

const practiceLimiter = createRateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  maxRequests: 30, // 30 análisis por minuto
  message: 'Too many practice requests, please slow down'
});

module.exports = {
  createRateLimit,
  apiLimiter,
  authLimiter,
  practiceLimiter
};