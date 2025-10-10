// src/services/intelligent-correction.service.js

/**
 * ═══════════════════════════════════════════════════
 * 🔧 INTELLIGENT CORRECTION SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Sistema inteligente de corrección automática
 * Detecta errores específicos y genera correcciones con explicaciones
 */

const { GrammarStructureService } = require('./grammar-structure.service');
const { SpanishFeedbackService } = require('./spanish-feedback.service');

/**
 * Patrones de errores comunes en estudiantes hispanohablantes
 */
const ERROR_PATTERNS = {
  // Errores de auxiliares
  auxiliaryErrors: {
    'am_in_past': {
      pattern: /\b(am)\b/gi,
      correction: 'was',
      type: 'wrong_auxiliary_am',
      explanation: 'En pasado, "I" siempre usa "was", nunca "am"'
    },
    'is_in_past': {
      pattern: /\b(is)\b/gi,
      correction: 'was',
      type: 'wrong_auxiliary_is',
      explanation: 'En pasado, "he/she/it" usa "was", no "is"'
    },
    'are_in_past': {
      pattern: /\b(are)\b/gi,
      correction: 'were',
      type: 'wrong_auxiliary_are',
      explanation: 'En pasado, "you/we/they" usa "were", no "are"'
    }
  },

  // Errores de gerundios
  gerundErrors: {
    'missing_ing': {
      pattern: /\b(was|were)\s+(walk|talk|work|play|study|cook|read|write|eat|drink|sleep|run|jump|sing|dance|watch|listen|speak|learn|teach|help|call|visit)\b/gi,
      type: 'missing_gerund',
      explanation: 'Después de "was/were" necesitas agregar "-ing" al verbo'
    },
    'double_ing': {
      pattern: /\b(\w+ing)ing\b/gi,
      type: 'double_gerund',
      explanation: 'No agregues "-ing" dos veces al mismo verbo'
    }
  },

  // Errores de verbos irregulares
  irregularVerbErrors: {
    'goed_instead_went': {
      pattern: /\bgoed\b/gi,
      correction: 'went',
      type: 'irregular_verb_error',
      explanation: 'El pasado de "go" es "went", no "goed"'
    },
    'comed_instead_came': {
      pattern: /\bcomed\b/gi,
      correction: 'came',
      type: 'irregular_verb_error',
      explanation: 'El pasado de "come" es "came", no "comed"'
    },
    'eated_instead_ate': {
      pattern: /\beated\b/gi,
      correction: 'ate',
      type: 'irregular_verb_error',
      explanation: 'El pasado de "eat" es "ate", no "eated"'
    }
  },

  // Errores de estructura
  structureErrors: {
    'subject_verb_disagreement': {
      pattern: /\b(I)\s+(were)\b/gi,
      correction: 'I was',
      type: 'subject_auxiliary_disagreement',
      explanation: '"I" siempre va con "was", nunca con "were"'
    },
    'plural_was': {
      pattern: /\b(we|they|you)\s+(was)\b/gi,
      correction: 'were',
      type: 'plural_auxiliary_error',
      explanation: 'Los sujetos plurales (we/they/you) usan "were", no "was"'
    }
  },

  // Errores de conectores
  connectorErrors: {
    'while_with_simple': {
      pattern: /\bwhile\s+.*\s+(went|came|saw|did|had|got|took|made|said|walked|worked|played|studied)\b/gi,
      type: 'connector_tense_mismatch',
      explanation: '"While" sugiere usar Past Continuous (was/were + verbo-ing), no Past Simple'
    }
  }
};

/**
 * Correcciones contextuales inteligentes
 */
const CONTEXTUAL_CORRECTIONS = {
  // Sugerencias basadas en conectores
  connectorSuggestions: {
    'while': {
      recommendedTense: 'past_continuous',
      message: 'Con "while" es mejor usar Past Continuous para mostrar acciones simultáneas',
      example: 'While I was studying, she was cooking'
    },
    'when': {
      recommendedTense: 'both',
      message: '"When" puede usar ambos tiempos: Past Simple para interrupciones, Past Continuous para contexto',
      example: 'When I was walking (contexto), I saw a dog (interrupción)'
    },
    'yesterday': {
      recommendedTense: 'past_simple',
      message: '"Yesterday" típicamente usa Past Simple para acciones completadas',
      example: 'Yesterday I went to school'
    }
  },

  // Mejoras de estilo
  styleSuggestions: {
    'repetitive_structure': {
      pattern: /\b(I was \w+ing)\s+and\s+(I was \w+ing)\b/gi,
      suggestion: 'Puedes combinar: "I was walking and talking" en lugar de repetir "I was"',
      type: 'style_improvement'
    },
    'add_time_context': {
      condition: 'no_time_marker',
      suggestion: 'Considera agregar un marcador temporal como "yesterday", "at 3 PM", "while"',
      type: 'context_enhancement'
    }
  }
};

class IntelligentCorrectionService {
  constructor() {
    this.grammarStructure = new GrammarStructureService();
    this.spanishFeedback = new SpanishFeedbackService();
    
    // Estadísticas de correcciones
    this.correctionStats = {
      totalCorrections: 0,
      errorTypes: {},
      successfulCorrections: 0
    };
  }

  /**
   * Genera reporte completo de correcciones inteligentes
   */
  generateIntelligentCorrections(text, structureAnalysis = null) {
    // Analizar estructura si no se proporciona
    if (!structureAnalysis) {
      structureAnalysis = this.grammarStructure.analyzeStructure(text);
    }

    const corrections = {
      originalText: text,
      correctedText: text,
      errors: [],
      corrections: [],
      suggestions: [],
      improvements: [],
      confidence: 0,
      correctionApplied: false
    };

    // Detectar errores específicos
    this.detectAuxiliaryErrors(text, corrections);
    this.detectGerundErrors(text, corrections, structureAnalysis);
    this.detectIrregularVerbErrors(text, corrections);
    this.detectStructureErrors(text, corrections);
    this.detectConnectorErrors(text, corrections, structureAnalysis);

    // Generar correcciones contextuales
    this.generateContextualCorrections(text, corrections, structureAnalysis);

    // Generar mejoras de estilo
    this.generateStyleImprovements(text, corrections, structureAnalysis);

    // Aplicar correcciones automáticas
    this.applyCorrectionsToCorrectedText(corrections);

    // Calcular confianza
    corrections.confidence = this.calculateCorrectionConfidence(corrections);

    // Actualizar estadísticas
    this.updateCorrectionStats(corrections);

    return corrections;
  }

  /**
   * Detecta errores de auxiliares (am/is/are en contexto pasado)
   */
  detectAuxiliaryErrors(text, corrections) {
    Object.entries(ERROR_PATTERNS.auxiliaryErrors).forEach(([errorKey, errorData]) => {
      const matches = [...text.matchAll(errorData.pattern)];
      
      matches.forEach(match => {
        const error = {
          type: errorData.type,
          position: match.index,
          detected: match[1],
          correction: errorData.correction,
          explanation: errorData.explanation,
          severity: 'high',
          category: 'auxiliary'
        };

        corrections.errors.push(error);
        corrections.corrections.push({
          from: match[1],
          to: errorData.correction,
          reason: errorData.explanation,
          type: 'automatic',
          confidence: 0.95
        });
      });
    });
  }

  /**
   * Detecta errores de gerundios
   */
  detectGerundErrors(text, corrections, structure) {
    // Detectar verbos sin -ing después de was/were
    const missingIngPattern = ERROR_PATTERNS.gerundErrors.missing_ing.pattern;
    const matches = [...text.matchAll(missingIngPattern)];

    matches.forEach(match => {
      const auxiliary = match[1];
      const verb = match[2];
      const correctedVerb = verb + 'ing';

      const error = {
        type: 'missing_gerund',
        position: match.index,
        detected: `${auxiliary} ${verb}`,
        correction: `${auxiliary} ${correctedVerb}`,
        explanation: `Después de "${auxiliary}" necesitas "${correctedVerb}" (verbo + ing)`,
        severity: 'high',
        category: 'gerund'
      };

      corrections.errors.push(error);
      corrections.corrections.push({
        from: `${auxiliary} ${verb}`,
        to: `${auxiliary} ${correctedVerb}`,
        reason: error.explanation,
        type: 'automatic',
        confidence: 0.9
      });
    });

    // Detectar doble -ing
    const doubleIngPattern = ERROR_PATTERNS.gerundErrors.double_ing.pattern;
    const doubleMatches = [...text.matchAll(doubleIngPattern)];

    doubleMatches.forEach(match => {
      const wrongWord = match[1];
      const correctedWord = wrongWord.slice(0, -3); // Remover un -ing

      corrections.errors.push({
        type: 'double_gerund',
        position: match.index,
        detected: wrongWord,
        correction: correctedWord,
        explanation: 'No agregues "-ing" dos veces al mismo verbo',
        severity: 'medium',
        category: 'gerund'
      });
    });
  }

  /**
   * Detecta errores de verbos irregulares
   */
  detectIrregularVerbErrors(text, corrections) {
    Object.entries(ERROR_PATTERNS.irregularVerbErrors).forEach(([errorKey, errorData]) => {
      const matches = [...text.matchAll(errorData.pattern)];
      
      matches.forEach(match => {
        corrections.errors.push({
          type: errorData.type,
          position: match.index,
          detected: match[0],
          correction: errorData.correction,
          explanation: errorData.explanation,
          severity: 'high',
          category: 'irregular_verb'
        });

        corrections.corrections.push({
          from: match[0],
          to: errorData.correction,
          reason: errorData.explanation,
          type: 'automatic',
          confidence: 0.98
        });
      });
    });
  }

  /**
   * Detecta errores de estructura (concordancia sujeto-auxiliar)
   */
  detectStructureErrors(text, corrections) {
    Object.entries(ERROR_PATTERNS.structureErrors).forEach(([errorKey, errorData]) => {
      const matches = [...text.matchAll(errorData.pattern)];
      
      matches.forEach(match => {
        corrections.errors.push({
          type: errorData.type,
          position: match.index,
          detected: match[0],
          correction: errorData.correction,
          explanation: errorData.explanation,
          severity: 'high',
          category: 'structure'
        });

        corrections.corrections.push({
          from: match[0],
          to: errorData.correction,
          reason: errorData.explanation,
          type: 'automatic',
          confidence: 0.95
        });
      });
    });
  }

  /**
   * Detecta errores relacionados con conectores
   */
  detectConnectorErrors(text, corrections, structure) {
    // Detectar "while" con Past Simple
    const whileSimplePattern = /\bwhile\s+.*\s+(went|came|saw|did|had|got|took|made|said|walked|worked|played|studied)\b/gi;
    const matches = [...text.matchAll(whileSimplePattern)];

    if (matches.length > 0) {
      corrections.suggestions.push({
        type: 'connector_tense_mismatch',
        message: '"While" sugiere usar Past Continuous para mostrar acciones simultáneas',
        suggestion: 'Cambia a "was/were + verbo-ing"',
        example: 'While I was studying → mejor que → While I studied',
        severity: 'medium',
        category: 'connector'
      });
    }

    if (structure.parts.connector) {
      const connector = structure.parts.connector.text;
      
      // Verificar si el conector sugiere un tiempo diferente al usado
      if (connector === 'while' && structure.tenseType === 'past_simple') {
        corrections.suggestions.push({
          type: 'connector_tense_mismatch',
          message: '"While" sugiere usar Past Continuous para mostrar acciones simultáneas',
          suggestion: 'Cambia a "was/were + verbo-ing"',
          example: 'While I was studying → mejor que → While I studied',
          severity: 'medium',
          category: 'connector'
        });
      }
    }
  }

  /**
   * Genera correcciones contextuales basadas en el contexto
   */
  generateContextualCorrections(text, corrections, structure) {
    // Sugerencias basadas en conectores
    if (structure.parts.connector) {
      const connector = structure.parts.connector.text;
      const suggestion = CONTEXTUAL_CORRECTIONS.connectorSuggestions[connector];
      
      if (suggestion) {
        corrections.suggestions.push({
          type: 'contextual_suggestion',
          message: suggestion.message,
          example: suggestion.example,
          recommendedTense: suggestion.recommendedTense,
          severity: 'low',
          category: 'context'
        });
      }
    }

    // Sugerencias basadas en marcadores temporales
    if (structure.parts.timeMarker) {
      const marker = structure.parts.timeMarker.text;
      const suggestion = CONTEXTUAL_CORRECTIONS.connectorSuggestions[marker];
      
      if (suggestion && suggestion.recommendedTense !== structure.tenseType) {
        corrections.suggestions.push({
          type: 'time_marker_suggestion',
          message: `"${marker}" ${suggestion.message}`,
          example: suggestion.example,
          severity: 'low',
          category: 'temporal'
        });
      }
    }
  }

  /**
   * Genera mejoras de estilo
   */
  generateStyleImprovements(text, corrections, structure) {
    // Detectar estructura repetitiva
    const repetitivePattern = CONTEXTUAL_CORRECTIONS.styleSuggestions.repetitive_structure.pattern;
    const matches = [...text.matchAll(repetitivePattern)];

    if (matches.length > 0) {
      corrections.improvements.push({
        type: 'style_improvement',
        message: CONTEXTUAL_CORRECTIONS.styleSuggestions.repetitive_structure.suggestion,
        severity: 'low',
        category: 'style'
      });
    }

    // Sugerir agregar contexto temporal si falta
    if (!structure.parts.timeMarker && !structure.parts.connector) {
      corrections.improvements.push({
        type: 'context_enhancement',
        message: CONTEXTUAL_CORRECTIONS.styleSuggestions.add_time_context.suggestion,
        severity: 'low',
        category: 'enhancement'
      });
    }
  }

  /**
   * Aplica correcciones automáticas al texto
   */
  applyCorrectionsToCorrectedText(corrections) {
    let correctedText = corrections.originalText;
    let appliedCorrections = 0;

    // Aplicar correcciones automáticas de alta confianza
    corrections.corrections
      .filter(correction => correction.confidence >= 0.9)
      .sort((a, b) => b.from.length - a.from.length) // Aplicar las más largas primero
      .forEach(correction => {
        const regex = new RegExp(this.escapeRegExp(correction.from), 'gi');
        if (regex.test(correctedText)) {
          correctedText = correctedText.replace(regex, correction.to);
          appliedCorrections++;
        }
      });

    corrections.correctedText = correctedText;
    corrections.correctionApplied = appliedCorrections > 0;
    corrections.appliedCorrectionsCount = appliedCorrections;
  }

  /**
   * Calcula la confianza de las correcciones
   */
  calculateCorrectionConfidence(corrections) {
    if (corrections.corrections.length === 0) return 1.0;

    const totalConfidence = corrections.corrections.reduce((sum, correction) => {
      return sum + (correction.confidence || 0.5);
    }, 0);

    const averageConfidence = totalConfidence / corrections.corrections.length;
    
    // Ajustar confianza basada en el número de errores
    const errorPenalty = Math.min(corrections.errors.length * 0.1, 0.3);
    
    return Math.max(0.1, Math.min(1.0, averageConfidence - errorPenalty));
  }

  /**
   * Actualiza estadísticas de correcciones
   */
  updateCorrectionStats(corrections) {
    this.correctionStats.totalCorrections++;
    
    if (corrections.correctionApplied) {
      this.correctionStats.successfulCorrections++;
    }

    corrections.errors.forEach(error => {
      if (!this.correctionStats.errorTypes[error.type]) {
        this.correctionStats.errorTypes[error.type] = 0;
      }
      this.correctionStats.errorTypes[error.type]++;
    });
  }

  /**
   * Genera explicaciones en español para las correcciones
   */
  generateSpanishExplanations(corrections) {
    const explanations = [];

    corrections.errors.forEach(error => {
      const spanishExplanation = this.spanishFeedback.generateErrorExplanation(error);
      if (spanishExplanation) {
        explanations.push(spanishExplanation);
      }
    });

    corrections.suggestions.forEach(suggestion => {
      const spanishSuggestion = this.spanishFeedback.generateSuggestionExplanation(suggestion);
      if (spanishSuggestion) {
        explanations.push(spanishSuggestion);
      }
    });

    return explanations;
  }

  /**
   * Obtiene estadísticas de correcciones
   */
  getCorrectionStats() {
    const successRate = this.correctionStats.totalCorrections > 0 
      ? (this.correctionStats.successfulCorrections / this.correctionStats.totalCorrections) * 100 
      : 0;

    return {
      ...this.correctionStats,
      successRate: Math.round(successRate * 100) / 100,
      mostCommonErrors: this.getMostCommonErrors()
    };
  }

  /**
   * Obtiene los errores más comunes
   */
  getMostCommonErrors() {
    const errorEntries = Object.entries(this.correctionStats.errorTypes);
    return errorEntries
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));
  }

  /**
   * Escapa caracteres especiales para regex
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Resetea estadísticas (útil para testing)
   */
  resetStats() {
    this.correctionStats = {
      totalCorrections: 0,
      errorTypes: {},
      successfulCorrections: 0
    };
  }
}

module.exports = {
  IntelligentCorrectionService,
  ERROR_PATTERNS,
  CONTEXTUAL_CORRECTIONS
};