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
 * Valida que una oración use Past Simple correctamente
 */
const validatePastSimple = (sentence) => {
  // Verbos irregulares más comunes en pasado
  const irregularVerbs = [
    'was', 'were', 'had', 'did', 'went', 'came', 'saw', 'got', 'took', 'made', 
    'said', 'told', 'gave', 'found', 'left', 'thought', 'felt', 'knew', 'heard',
    'ate', 'drank', 'wrote', 'read', 'bought', 'sold', 'broke', 'spoke', 'ran',
    'drove', 'rode', 'flew', 'swam', 'sang', 'rang', 'began', 'won', 'lost',
    'met', 'put', 'let', 'set', 'cut', 'hit', 'hurt', 'cost', 'shut', 'quit',
    'split', 'spread', 'spent', 'sent', 'built', 'lent', 'bent', 'meant',
    'kept', 'slept', 'wept', 'swept', 'felt', 'dealt', 'dreamt', 'learnt',
    'burnt', 'spelt', 'smelt', 'caught', 'taught', 'brought', 'fought', 'sought',
    'thought', 'bought', 'wrought', 'stood', 'understood', 'withstood',
    'held', 'told', 'sold', 'paid', 'laid', 'said', 'fed', 'led', 'read',
    'bled', 'bred', 'fled', 'shed', 'sped', 'wed', 'hid', 'slid', 'bid',
    'rid', 'forbid', 'outdid', 'undid', 'redid', 'arose', 'chose', 'froze',
    'woke', 'broke', 'spoke', 'stole', 'wore', 'swore', 'tore', 'bore',
    'drew', 'grew', 'knew', 'threw', 'flew', 'blew', 'showed', 'allowed'
  ];
  
  // Regex para verbos regulares terminados en -ed
  const regularVerbsRegex = /\b\w+ed\b/i;
  
  // Regex para verbos irregulares
  const irregularVerbsRegex = new RegExp(`\\b(${irregularVerbs.join('|')})\\b`, 'i');
  
  // También incluir auxiliares modales en pasado
  const modalAuxiliariesRegex = /\b(could|would|should|might|used\s+to)\b/i;
  
  return regularVerbsRegex.test(sentence) || 
         irregularVerbsRegex.test(sentence) || 
         modalAuxiliariesRegex.test(sentence);
};

/**
 * Analiza el contexto de la oración para recomendar Simple vs Continuo
 */
const analyzeContext = (sentence, connector) => {
  const lowerSentence = sentence.toLowerCase();
  
  // Palabras clave que sugieren Past Continuous (acciones en progreso)
  const continuousKeywords = [
    'while', 'during', 'all day', 'all night', 'all morning', 'all afternoon', 'all evening',
    'still', 'constantly', 'continuously', 'repeatedly', 'again and again',
    'at that time', 'at that moment', 'at 3 o\'clock', 'at midnight'
  ];
  
  // Palabras clave que sugieren Past Simple (acciones completas/interrupciones)
  const simpleKeywords = [
    'when', 'suddenly', 'immediately', 'then', 'next', 'after that', 'finally',
    'once', 'twice', 'three times', 'many times', 'often', 'sometimes', 'never',
    'yesterday', 'last week', 'last month', 'last year', 'ago', 'in 2020'
  ];
  
  const hasContinuousKeywords = continuousKeywords.some(keyword => 
    lowerSentence.includes(keyword)
  );
  
  const hasSimpleKeywords = simpleKeywords.some(keyword => 
    lowerSentence.includes(keyword)
  );
  
  // Análisis específico por conector
  let recommendation = 'either'; // por defecto ambos son válidos
  let reason = '';
  
  if (connector === 'while') {
    recommendation = 'continuous';
    reason = '"While" typically introduces ongoing actions, so Past Continuous is preferred.';
  } else if (connector === 'when') {
    if (hasSimpleKeywords || lowerSentence.includes('suddenly')) {
      recommendation = 'simple';
      reason = '"When" with interrupting actions typically uses Past Simple.';
    } else {
      recommendation = 'either';
      reason = '"When" can use both tenses depending on whether the action was ongoing or completed.';
    }
  } else if (connector === 'as') {
    recommendation = 'continuous';
    reason = '"As" often describes simultaneous ongoing actions, so Past Continuous fits well.';
  }
  
  // Override basado en keywords específicos
  if (hasContinuousKeywords && recommendation !== 'simple') {
    recommendation = 'continuous';
    reason = 'Time expressions suggest an ongoing action in the past.';
  } else if (hasSimpleKeywords && recommendation !== 'continuous') {
    recommendation = 'simple';
    reason = 'Context suggests a completed action or specific moment in time.';
  }
  
  return {
    recommendation, // 'simple', 'continuous', 'either'
    reason,
    hasContinuousIndicators: hasContinuousKeywords,
    hasSimpleIndicators: hasSimpleKeywords
  };
};

/**
 * Valida una oración completa y proporciona recomendaciones
 */
const validateSentenceWithRecommendation = (part1, part2, connector) => {
  const isPart1Continuous = validatePastContinuous(part1);
  const isPart1Simple = validatePastSimple(part1);
  const isPart2Continuous = validatePastContinuous(part2);
  const isPart2Simple = validatePastSimple(part2);
  
  // Analizar contexto de ambas partes
  const fullSentence = `${part1} ${connector} ${part2}`;
  const contextAnalysis = analyzeContext(fullSentence, connector);
  
  const analysis = {
    part1: {
      text: part1,
      hasContinuous: isPart1Continuous,
      hasSimple: isPart1Simple,
      isValid: isPart1Continuous || isPart1Simple,
      recommendedTense: contextAnalysis.recommendation
    },
    part2: {
      text: part2,
      hasContinuous: isPart2Continuous,
      hasSimple: isPart2Simple,
      isValid: isPart2Continuous || isPart2Simple,
      recommendedTense: contextAnalysis.recommendation
    },
    context: contextAnalysis,
    overallValid: (isPart1Continuous || isPart1Simple) && (isPart2Continuous || isPart2Simple),
    connector
  };
  
  return analysis;
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
  validatePastSimple,
  analyzeContext,
  validateSentenceWithRecommendation,
  hasValidConnector,
  detectConnector,
  validateLength,
  validateUsername,
  validateEmail,
  validatePassword,
  sanitizeSentence
};