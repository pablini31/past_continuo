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
  // Regex para detectar verbos en pasado simple
  // Incluye verbos regulares (-ed) e irregulares comunes
  const pastSimpleRegex = /\b(went|came|saw|did|had|got|took|made|said|told|gave|found|left|thought|felt|knew|heard|ate|drank|wrote|read|bought|sold|broke|spoke|ran|walked|worked|played|lived|loved|liked|wanted|needed|tried|asked|answered|looked|seemed|appeared|happened|occurred|started|finished|stopped|continued|decided|believed|remembered|forgot|learned|taught|helped|called|talked|listened|watched|studied|traveled|moved|changed|opened|closed|turned|pulled|pushed|carried|brought|sent|received|built|created|destroyed|killed|saved|won|lost|failed|succeeded|agreed|disagreed|argued|discussed|explained|described|suggested|recommended|advised|warned|promised|hoped|wished|expected|surprised|shocked|amazed|confused|worried|scared|excited|bored|interested|tired|relaxed|stressed|angry|happy|sad|proud|ashamed|guilty|innocent|nervous|confident|shy|brave|weak|strong|young|old|new|fresh|clean|dirty|hot|cold|warm|cool|bright|dark|loud|quiet|fast|slow|big|small|long|short|wide|narrow|high|low|deep|shallow|heavy|light|hard|soft|smooth|rough|sweet|bitter|sour|salty|spicy|mild|delicious|terrible|beautiful|ugly|pretty|handsome|cute|scary|funny|serious|silly|smart|stupid|crazy|normal|strange|weird|unusual|common|rare|expensive|cheap|free|busy|lazy|active|passive|positive|negative|good|bad|better|worse|best|worst|easy|difficult|simple|complex|clear|confusing|obvious|hidden|public|private|safe|dangerous|healthy|sick|alive|dead|awake|asleep|early|late|soon|never|always|often|sometimes|rarely|usually|generally|specifically|exactly|approximately|probably|possibly|definitely|certainly|surely|maybe|perhaps|however|therefore|because|although|unless|until|since|while|when|where|why|how|what|who|whom|whose|which)ed\b|\b(was|were|had|did|could|would|should|might|may|must|ought|used\s+to|went|came|saw|ate|drank|wrote|read|bought|sold|broke|spoke|ran|walked|talked|looked|took|made|said|told|gave|found|left|thought|felt|knew|heard|got|put|let|set|met|cut|hit|hurt|cost|burst|cast|caught|taught|brought|fought|sought|bought|thought|brought|caught|taught|fought|sought|wrought)\b/i;
  return pastSimpleRegex.test(sentence);
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