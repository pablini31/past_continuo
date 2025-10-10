// src/services/error-detection.service.js

/**
 * ═══════════════════════════════════════════════════
 * 🔍 ERROR DETECTION SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Servicio especializado en detectar errores comunes
 * de estudiantes hispanohablantes aprendiendo inglés
 */

/**
 * Patrones de errores comunes
 */
const ERROR_PATTERNS = {
  // Errores de auxiliares
  auxiliary_errors: [
    {
      pattern: /\b(I|you|we|they)\s+am\s+(\w+ing)\b/gi,
      type: 'wrong_auxiliary_am',
      correction: (match) => match.replace(/\bam\b/gi, 'was'),
      message: 'Usa "was" con I, no "am" en pasado'
    },
    {
      pattern: /\b(he|she|it)\s+are\s+(\w+ing)\b/gi,
      type: 'wrong_auxiliary_are',
      correction: (match) => match.replace(/\bare\b/gi, 'was'),
      message: 'Usa "was" con he/she/it, no "are" en pasado'
    },
    {
      pattern: /\b(I|he|she|it)\s+were\s+(\w+ing)\b/gi,
      type: 'wrong_auxiliary_were',
      correction: (match) => match.replace(/\bwere\b/gi, 'was'),
      message: 'Usa "was" con I/he/she/it, no "were"'
    },
    {
      pattern: /\b(you|we|they)\s+was\s+(\w+ing)\b/gi,
      type: 'wrong_auxiliary_was',
      correction: (match) => match.replace(/\bwas\b/gi, 'were'),
      message: 'Usa "were" con you/we/they, no "was"'
    }
  ],

  // Errores de gerundio
  gerund_errors: [
    {
      pattern: /\b(was|were)\s+(walk|talk|work|play|study|cook|read|write|eat|drink|sleep|run)\b/gi,
      type: 'missing_gerund',
      correction: (match) => {
        const parts = match.split(' ');
        if (parts.length >= 2) {
          const verb = parts[1];
          return `${parts[0]} ${verb}ing`;
        }
        return match;
      },
      message: 'Agrega "-ing" al verbo en Past Continuous'
    },
    {
      pattern: /\b(\w+)inging\b/gi,
      type: 'double_gerund',
      correction: (match) => match.replace(/inging/gi, 'ing'),
      message: 'No agregues "-ing" dos veces'
    }
  ],

  // Errores de verbos irregulares
  irregular_verb_errors: [
    {
      pattern: /\bgoed\b/gi,
      type: 'goed_error',
      correction: (match) => match.replace(/goed/gi, 'went'),
      message: 'El pasado de "go" es "went", no "goed"'
    },
    {
      pattern: /\beated\b/gi,
      type: 'eated_error',
      correction: (match) => match.replace(/eated/gi, 'ate'),
      message: 'El pasado de "eat" es "ate", no "eated"'
    },
    {
      pattern: /\bcatched\b/gi,
      type: 'catched_error',
      correction: (match) => match.replace(/catched/gi, 'caught'),
      message: 'El pasado de "catch" es "caught", no "catched"'
    },
    {
      pattern: /\bteached\b/gi,
      type: 'teached_error',
      correction: (match) => match.replace(/teached/gi, 'taught'),
      message: 'El pasado de "teach" es "taught", no "teached"'
    },
    {
      pattern: /\bbuyed\b/gi,
      type: 'buyed_error',
      correction: (match) => match.replace(/buyed/gi, 'bought'),
      message: 'El pasado de "buy" es "bought", no "buyed"'
    }
  ],

  // Errores de orden de palabras (influencia del español)
  word_order_errors: [
    {
      pattern: /\b(very|much|more)\s+(was|were)\b/gi,
      type: 'adverb_order',
      correction: (match) => {
        const parts = match.split(' ');
        return `${parts[1]} ${parts[0]}`;
      },
      message: 'El adverbio va después del auxiliar en inglés'
    }
  ],

  // Errores de mezcla de tiempos
  tense_mixing_errors: [
    {
      pattern: /\b(was|were)\s+([a-zA-Z]+ed)\b/gi,
      type: 'continuous_simple_mix',
      correction: (match) => {
        const parts = match.trim().split(/\s+/);
        if (parts.length >= 2) {
          let verb = parts[1].replace(/ed$/, '');
          // Manejar casos especiales de ortografía
          if (verb.endsWith('k')) verb = verb + 'ing';
          else if (verb.endsWith('e')) verb = verb.slice(0, -1) + 'ing';
          else verb = verb + 'ing';
          return `${parts[0]} ${verb}`;
        }
        return match;
      },
      message: 'Con was/were usa verbo-ing, no verbo-ed'
    },
    {
      pattern: /\b(am|is|are)\s+(\w+ed)\b/gi,
      type: 'present_past_mix',
      correction: (match) => {
        const parts = match.split(' ');
        const auxiliary = parts[0] === 'am' ? 'was' : parts[0] === 'is' ? 'was' : 'were';
        const verb = parts[1].replace(/ed$/, '');
        return `${auxiliary} ${verb}ing`;
      },
      message: 'Para pasado usa was/were, no am/is/are'
    }
  ],

  // Errores de ortografía comunes
  spelling_errors: [
    {
      pattern: /\bstudyng\b/gi,
      type: 'study_spelling',
      correction: (match) => 'studying',
      message: 'La forma correcta es "studying"'
    },
    {
      pattern: /\bwalkng\b/gi,
      type: 'walk_spelling',
      correction: (match) => 'walking',
      message: 'La forma correcta es "walking"'
    },
    {
      pattern: /\bcomming\b/gi,
      type: 'come_spelling',
      correction: (match) => 'coming',
      message: 'La forma correcta es "coming" (una sola m)'
    },
    {
      pattern: /\brunng\b/gi,
      type: 'run_spelling_error',
      correction: (match) => 'running',
      message: 'La forma correcta es "running" (doble n)'
    }
  ]
};

/**
 * Clase principal del detector de errores
 */
class ErrorDetectionService {

  /**
   * Detecta todos los errores en una oración
   */
  detectAllErrors(sentence) {
    const errors = [];
    const corrections = [];
    let correctedSentence = sentence;

    // Detectar cada tipo de error (orden importante: más específicos primero)
    const errorTypes = [
      'tense_mixing_errors',    // Detectar primero para evitar conflictos
      'auxiliary_errors',
      'irregular_verb_errors',
      'gerund_errors',          // Detectar después de tense mixing
      'word_order_errors',
      'spelling_errors'
    ];

    errorTypes.forEach(errorType => {
      const typeErrors = this.detectErrorType(correctedSentence, errorType);
      errors.push(...typeErrors.errors);
      corrections.push(...typeErrors.corrections);
      
      // Aplicar correcciones
      typeErrors.corrections.forEach(correction => {
        correctedSentence = correctedSentence.replace(
          correction.original, 
          correction.corrected
        );
      });
    });

    return {
      originalSentence: sentence,
      correctedSentence: correctedSentence,
      errors: errors,
      corrections: corrections,
      hasErrors: errors.length > 0,
      errorCount: errors.length
    };
  }

  /**
   * Detecta errores de un tipo específico
   */
  detectErrorType(sentence, errorType) {
    const patterns = ERROR_PATTERNS[errorType] || [];
    const errors = [];
    const corrections = [];

    patterns.forEach(pattern => {
      const matches = [...sentence.matchAll(pattern.pattern)];
      
      matches.forEach(match => {
        const error = {
          type: pattern.type,
          message: pattern.message,
          original: match[0],
          position: match.index,
          length: match[0].length
        };

        const correction = {
          original: match[0],
          corrected: pattern.correction(match[0]),
          reason: pattern.message,
          type: pattern.type
        };

        errors.push(error);
        corrections.push(correction);
      });
    });

    return { errors, corrections };
  }

  /**
   * Detecta errores específicos de auxiliares
   */
  detectAuxiliaryErrors(sentence) {
    return this.detectErrorType(sentence, 'auxiliary_errors');
  }

  /**
   * Detecta errores de gerundio
   */
  detectGerundErrors(sentence) {
    return this.detectErrorType(sentence, 'gerund_errors');
  }

  /**
   * Detecta errores de verbos irregulares
   */
  detectIrregularVerbErrors(sentence) {
    return this.detectErrorType(sentence, 'irregular_verb_errors');
  }

  /**
   * Detecta errores de mezcla de tiempos
   */
  detectTenseMixingErrors(sentence) {
    return this.detectErrorType(sentence, 'tense_mixing_errors');
  }

  /**
   * Analiza la severidad de los errores
   */
  analyzeErrorSeverity(errors) {
    const severityLevels = {
      critical: ['present_past_mix', 'wrong_auxiliary_am', 'wrong_auxiliary_are'],
      high: ['missing_gerund', 'goed_error', 'eated_error', 'continuous_simple_mix'],
      medium: ['wrong_auxiliary_were', 'wrong_auxiliary_was', 'double_gerund'],
      low: ['spelling_errors', 'adverb_order']
    };

    const analysis = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      total: errors.length
    };

    errors.forEach(error => {
      let severity = 'low'; // default
      
      for (const [level, types] of Object.entries(severityLevels)) {
        if (types.includes(error.type)) {
          severity = level;
          break;
        }
      }
      
      analysis[severity]++;
    });

    return analysis;
  }

  /**
   * Genera reporte de errores con explicaciones educativas
   */
  generateErrorReport(sentence) {
    const detection = this.detectAllErrors(sentence);
    const severity = this.analyzeErrorSeverity(detection.errors);
    
    const report = {
      sentence: sentence,
      correctedSentence: detection.correctedSentence,
      hasErrors: detection.hasErrors,
      errorCount: detection.errorCount,
      severity: severity,
      errors: detection.errors.map(error => ({
        ...error,
        explanation: this.getErrorExplanation(error.type),
        example: this.getErrorExample(error.type)
      })),
      corrections: detection.corrections,
      overallFeedback: this.generateOverallFeedback(severity, detection.errorCount),
      recommendations: this.generateRecommendations(detection.errors)
    };

    return report;
  }

  /**
   * Obtiene explicación educativa para un tipo de error
   */
  getErrorExplanation(errorType) {
    const explanations = {
      'wrong_auxiliary_am': 'En Past Continuous, "am" se convierte en "was" para I',
      'wrong_auxiliary_are': 'En Past Continuous, "are" se convierte en "were" para you/we/they y "was" para he/she/it',
      'wrong_auxiliary_were': 'Usa "was" con I/he/she/it y "were" con you/we/they',
      'wrong_auxiliary_was': 'Usa "were" con you/we/they, no "was"',
      'missing_gerund': 'El Past Continuous necesita verbo + ing después de was/were',
      'double_gerund': 'Solo agrega "-ing" una vez al final del verbo',
      'goed_error': 'El verbo "go" es irregular: go → went (no goed)',
      'eated_error': 'El verbo "eat" es irregular: eat → ate (no eated)',
      'continuous_simple_mix': 'Con was/were usa gerundio (-ing), no pasado simple (-ed)',
      'present_past_mix': 'Para hablar del pasado usa was/were, no am/is/are'
    };

    return explanations[errorType] || 'Revisa la estructura gramatical';
  }

  /**
   * Obtiene ejemplo para un tipo de error
   */
  getErrorExample(errorType) {
    const examples = {
      'wrong_auxiliary_am': { wrong: 'I am walking', correct: 'I was walking' },
      'wrong_auxiliary_are': { wrong: 'They are walking', correct: 'They were walking' },
      'wrong_auxiliary_were': { wrong: 'She were walking', correct: 'She was walking' },
      'wrong_auxiliary_was': { wrong: 'They was walking', correct: 'They were walking' },
      'missing_gerund': { wrong: 'I was walk', correct: 'I was walking' },
      'double_gerund': { wrong: 'I was walkinging', correct: 'I was walking' },
      'goed_error': { wrong: 'I goed home', correct: 'I went home' },
      'eated_error': { wrong: 'I eated pizza', correct: 'I ate pizza' }
    };

    return examples[errorType] || { wrong: '', correct: '' };
  }

  /**
   * Genera feedback general basado en la severidad
   */
  generateOverallFeedback(severity, errorCount) {
    if (errorCount === 0) {
      return {
        message: '🎉 ¡Excelente! No se encontraron errores',
        level: 'success',
        encouragement: 'Tu gramática está perfecta'
      };
    }

    if (severity.critical > 0) {
      return {
        message: '🚨 Errores críticos encontrados',
        level: 'critical',
        encouragement: 'Revisa los tiempos verbales básicos'
      };
    }

    if (severity.high > 0) {
      return {
        message: '⚠️ Errores importantes encontrados',
        level: 'high',
        encouragement: 'Estás cerca, solo ajusta algunos detalles'
      };
    }

    if (severity.medium > 0) {
      return {
        message: '📝 Errores menores encontrados',
        level: 'medium',
        encouragement: 'Buen trabajo, solo pequeñas correcciones'
      };
    }

    return {
      message: '✨ Solo errores menores',
      level: 'low',
      encouragement: '¡Casi perfecto! Excelente progreso'
    };
  }

  /**
   * Genera recomendaciones basadas en los errores encontrados
   */
  generateRecommendations(errors) {
    const recommendations = [];
    const errorTypes = [...new Set(errors.map(e => e.type))];

    // Recomendaciones específicas por tipo de error
    if (errorTypes.some(t => t.includes('auxiliary'))) {
      recommendations.push({
        type: 'study_tip',
        message: '📚 Practica más: was/were + verbo-ing',
        detail: 'I/he/she/it → was | you/we/they → were'
      });
    }

    if (errorTypes.some(t => t.includes('gerund'))) {
      recommendations.push({
        type: 'practice_tip',
        message: '🔄 Practica agregar -ing a los verbos',
        detail: 'walk → walking, study → studying, run → running'
      });
    }

    if (errorTypes.some(t => t.includes('irregular'))) {
      recommendations.push({
        type: 'vocabulary_tip',
        message: '📖 Estudia verbos irregulares comunes',
        detail: 'go→went, eat→ate, see→saw, come→came'
      });
    }

    return recommendations;
  }

  /**
   * Detecta patrones de errores recurrentes
   */
  detectErrorPatterns(userHistory) {
    const patterns = {};
    
    userHistory.forEach(session => {
      if (session.errors) {
        session.errors.forEach(error => {
          if (!patterns[error.type]) {
            patterns[error.type] = 0;
          }
          patterns[error.type]++;
        });
      }
    });

    // Identificar patrones problemáticos (3+ ocurrencias)
    const problematicPatterns = Object.entries(patterns)
      .filter(([type, count]) => count >= 3)
      .map(([type, count]) => ({
        errorType: type,
        frequency: count,
        recommendation: this.getPatternRecommendation(type)
      }));

    return problematicPatterns;
  }

  /**
   * Obtiene recomendación para un patrón de error recurrente
   */
  getPatternRecommendation(errorType) {
    const recommendations = {
      'wrong_auxiliary_am': 'Practica: I was (no I am) en pasado',
      'wrong_auxiliary_are': 'Memoriza: you/we/they were en pasado',
      'missing_gerund': 'Siempre agrega -ing después de was/were',
      'goed_error': 'Memoriza: go → went (verbo irregular)',
      'eated_error': 'Memoriza: eat → ate (verbo irregular)'
    };

    return recommendations[errorType] || 'Practica más este tipo de estructura';
  }
}

module.exports = {
  ErrorDetectionService,
  ERROR_PATTERNS
};