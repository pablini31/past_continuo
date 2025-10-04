// src/middlewares/error.middleware.js

/**
 * ═══════════════════════════════════════════════════
 * ⚠️ ERROR HANDLING MIDDLEWARE
 * ═══════════════════════════════════════════════════
 * 
 * Middleware global para manejo de errores.
 * Captura todos los errores de la aplicación y los formatea.
 */

/**
 * Middleware de manejo de errores
 * @param {Error} err - Error capturado
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @param {Function} next - Función next de Express
 */
const errorMiddleware = (err, req, res, next) => {
  console.error('═══════════════════════════════════════════════════');
  console.error('💥 ERROR CAPTURADO POR MIDDLEWARE');
  console.error('═══════════════════════════════════════════════════');
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('═══════════════════════════════════════════════════');

  // Determinar el código de estado
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Errores específicos de MongoDB
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Errores de validación de express-validator
  if (err.type === 'validation') {
    statusCode = 400;
    message = err.errors.map(e => e.msg).join(', ');
  }

  // En desarrollo, mostrar stack trace
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  // Solo en desarrollo incluir stack trace
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.error = err;
  }

  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;