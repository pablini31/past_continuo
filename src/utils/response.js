// src/utils/response.js

/**
 * 📤 Utilidades para respuestas HTTP estandarizadas
 * Todas las respuestas de la API siguen el mismo formato
 */

const { HTTP_STATUS } = require('../config/constants');

/**
 * ✅ Respuesta exitosa
 */
const success = (res, data, message = 'Success', statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * ❌ Respuesta de error
 */
const error = (res, message = 'Error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors) {
    response.errors = errors;
  }

  // En desarrollo, incluir stack trace
  if (process.env.NODE_ENV === 'development' && errors?.stack) {
    response.stack = errors.stack;
  }

  return res.status(statusCode).json(response);
};

/**
 * ⚠️ Respuesta de validación fallida
 */
const validationError = (res, errors) => {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    message: 'Validation failed',
    errors: errors.array ? errors.array() : errors,
    timestamp: new Date().toISOString()
  });
};

/**
 * 🔒 No autorizado
 */
const unauthorized = (res, message = 'Unauthorized') => {
  return error(res, message, HTTP_STATUS.UNAUTHORIZED);
};

/**
 * 🚫 Prohibido
 */
const forbidden = (res, message = 'Forbidden') => {
  return error(res, message, HTTP_STATUS.FORBIDDEN);
};

/**
 * 🔍 No encontrado
 */
const notFound = (res, message = 'Resource not found') => {
  return error(res, message, HTTP_STATUS.NOT_FOUND);
};

/**
 * ⚡ Conflicto (ej: usuario ya existe)
 */
const conflict = (res, message = 'Resource already exists') => {
  return error(res, message, HTTP_STATUS.CONFLICT);
};

module.exports = {
  success,
  error,
  validationError,
  unauthorized,
  forbidden,
  notFound,
  conflict
};