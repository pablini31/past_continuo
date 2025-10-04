// src/middlewares/auth.middleware.js

/**
 * ═══════════════════════════════════════════════════
 * 🔐 AUTHENTICATION MIDDLEWARE
 * ═══════════════════════════════════════════════════
 * 
 * Protege rutas que requieren autenticación
 */

const authService = require('../services/auth.service');
const { unauthorized } = require('../utils/response');

/**
 * Middleware para proteger rutas
 * Verifica que el usuario esté autenticado con un JWT válido
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Obtener token de cookie o header Authorization
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Verificar que existe token
    if (!token) {
      return unauthorized(res, 'Not authorized. Please login.');
    }

    // 3. Verificar token
    const decoded = authService.verifyToken(token);

    // 4. Agregar userId al request para usarlo en controllers
    req.userId = decoded.userId;

    // 5. Continuar al siguiente middleware/controller
    next();

  } catch (err) {
    return unauthorized(res, err.message || 'Not authorized');
  }
};

/**
 * Middleware opcional para rutas que pueden funcionar con o sin auth
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = authService.verifyToken(token);
      req.userId = decoded.userId;
    }

    next();

  } catch (err) {
    // Si hay error, simplemente continúa sin autenticación
    next();
  }
};

module.exports = {
  protect,
  optionalAuth
};