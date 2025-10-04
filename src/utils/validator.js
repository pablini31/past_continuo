// src/utils/validator.js

/**
 * ✅ Validadores personalizados para oraciones
 */

const { VALIDATION, CONNECTORS } = require('../config/constants');

/**
 * Valida que una oración use Past Continuous correctamente
 */
const validatePastContinuous = (sentence) => {
  // Regex para detectar "was/were + verbo-ing"
  const pastContinuousRegex = /\b(was|were)\s+\w+ing\b/i;
  return pastContinuousRegex.test(sentence);
};

/**
 * Valida que contenga un conector válido
 */
const hasValidConnector = (sentence) => {
  const lowerSentence = sentence.toLowerCase();
  return CONNECTORS.some(connector => lowerSentence.includes(connector));
};

/**
 * Detecta qué conector usa la oración
 */
const detectConnector = (sentence) => {
  const lowerSentence = sentence.toLowerCase();
  return CONNECTORS.find(connector => lowerSentence.includes(connector)) || null;
};

/**
 * Valida longitud de oración
 */
const validateLength = (sentence) => {
  const length = sentence.trim().length;
  return length >= VALIDATION.MIN_SENTENCE_LENGTH && 
         length <= VALIDATION.MAX_SENTENCE_LENGTH;
};

/**
 * Valida username
 */
const validateUsername = (username) => {
  const length = username.length;
  const isValidLength = length >= VALIDATION.MIN_USERNAME_LENGTH && 
                       length <= VALIDATION.MAX_USERNAME_LENGTH;
  const isValidFormat = /^[a-zA-Z0-9_]+$/.test(username); // Solo letras, números y _
  
  return isValidLength && isValidFormat;
};

/**
 * Valida email
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida password
 */
const validatePassword = (password) => {
  return password.length >= VALIDATION.MIN_PASSWORD_LENGTH;
};

/**
 * Limpia y normaliza texto
 */
const sanitizeSentence = (sentence) => {
  return sentence
    .trim()
    .replace(/\s+/g, ' ') // Múltiples espacios → un espacio
    .replace(/[^\w\s.,!?'-]/g, ''); // Remover caracteres extraños
};

module.exports = {
  validatePastContinuous,
  hasValidConnector,
  detectConnector,
  validateLength,
  validateUsername,
  validateEmail,
  validatePassword,
  sanitizeSentence
};