// src/middlewares/validation.middleware.js

/**
 * ═══════════════════════════════════════════════════
 * ✅ VALIDATION MIDDLEWARE
 * ═══════════════════════════════════════════════════
 * 
 * Valida datos de entrada usando express-validator
 */

const { body, validationResult } = require('express-validator');
const { validationError } = require('../utils/response');
const { VALIDATION } = require('../config/constants');

/**
 * Middleware para verificar resultados de validación
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return validationError(res, errors);
  }
  
  next();
};

/**
 * Validaciones para registro
 */
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: VALIDATION.MIN_USERNAME_LENGTH, max: VALIDATION.MAX_USERNAME_LENGTH })
    .withMessage(`Username must be between ${VALIDATION.MIN_USERNAME_LENGTH} and ${VALIDATION.MAX_USERNAME_LENGTH} characters`)
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: VALIDATION.MIN_PASSWORD_LENGTH })
    .withMessage(`Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`),
  
  validate
];

/**
 * Validaciones para login
 */
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  validate
];

/**
 * Validaciones para enviar oración
 */
const sentenceValidation = [
  body('part1')
    .trim()
    .isLength({ min: VALIDATION.MIN_SENTENCE_LENGTH, max: VALIDATION.MAX_SENTENCE_LENGTH })
    .withMessage(`Part 1 must be between ${VALIDATION.MIN_SENTENCE_LENGTH} and ${VALIDATION.MAX_SENTENCE_LENGTH} characters`),
  
  body('part2')
    .trim()
    .isLength({ min: VALIDATION.MIN_SENTENCE_LENGTH, max: VALIDATION.MAX_SENTENCE_LENGTH })
    .withMessage(`Part 2 must be between ${VALIDATION.MIN_SENTENCE_LENGTH} and ${VALIDATION.MAX_SENTENCE_LENGTH} characters`),
  
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  sentenceValidation
};