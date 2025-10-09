// src/services/educational-translator.service.js

/**
 * ═══════════════════════════════════════════════════
 * 📚 EDUCATIONAL TRANSLATOR SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Servicio para traducir y explicar conceptos gramaticales
 * Ayuda a estudiantes hispanohablantes a entender el inglés
 */

const { COMMON_ERRORS, EDUCATIONAL_TIPS, GRAMMAR_EXPLANATIONS } = require('../config/spanish-messages');

class EducationalTranslatorService {

  /**
   * Traduce errores técnicos a explicaciones educativas en español
   */
  translateError(errorType, context = {}) {
    // Buscar en errores comunes primero
    const commonError = this.findCommonError(errorType, context);
    if (commonError) {
      return this.formatErrorExplanation(commonError, context);
    }

    // Generar explicación genérica si no se encuentra específica
    return this.generateGenericErrorExplanation(errorType, context);
  }

  /**
   * Busca errores comunes específicos
   */
  findCommonError(errorType, context) {
    // Errores con auxiliares
    if (errorType.includes('auxiliary') || errorType.includes('was') || errorType.includes('were')) {
      if (context.detected && context.detected.includes('am')) {
        return COMMON_ERRORS.auxiliary_errors.am_in_past;
      }
      if (context.detected && context.detected.includes('is')) {
        return COMMON_ERRORS.auxiliary_errors.is_in_past;
      }
      if (context.detected && context.detected.includes('are')) {
        return COMMON_ERRORS.auxiliary_errors.are_in_past;
      }
      return COMMON_ERRORS.auxiliary_errors.wrong_was_were;
    }

    // Errores con gerundios
    if (errorType.includes('gerund') || errorType.includes('ing')) {
      if (context.missing && context.missing.includes('ing')) {
        return COMMON_ERRORS.gerund_errors.missing_ing;
      }
      if (context.detected && context.detected.includes('inging')) {
        return COMMON_ERRORS.gerund_errors.double_ing;
      }
      return COMMON_ERRORS.gerund_errors.ing_in_simple;
    }

    // Errores con verbos irregulares
    if (errorType.includes('irregular') || errorType.includes('verb')) {
      if (context.detected && context.detected.includes('goed')) {
        return COMMON_ERRORS.irregular_verb_errors.goed_went;
      }
      if (context.detected && context.detected.includes('eated')) {
        return COMMON_ERRORS.irregular_verb_errors.eated_ate;
      }
      if (context.detected && context.detected.includes('catched')) {
        return COMMON_ERRORS.irregular_verb_errors.catched_caught;
      }
    }

    // Errores de mezcla de tiempos
    if (errorType.includes('tense') || errorType.includes('mix')) {
      if (context.hasPresentAndPast) {
        return COMMON_ERRORS.tense_mixing.present_past_mix;
      }
      return COMMON_ERRORS.tense_mixing.simple_continuous_mix;
    }

    return null;
  }

  /**
   * Formatea explicación de error con contexto
   */
  formatErrorExplanation(errorData, context) {
    return {
      type: 'error',
      message: errorData.spanish,
      englishMessage: errorData.english,
      correction: errorData.correction,
      example: errorData.example,
      rule: errorData.rule,
      examples: errorData.examples,
      tip: errorData.tip,
      context: context,
      severity: 'high'
    };
  }

  /**
   * Genera explicación genérica para errores no específicos
   */
  generateGenericErrorExplanation(errorType, context) {
    return {
      type: 'error',
      message: "❌ Se detectó un error en la estructura gramatical",
      explanation: "Revisa los tiempos verbales y la construcción de la oración",
      suggestion: "Verifica que uses Past Simple o Past Continuous correctamente",
      errorType: errorType,
      context: context,
      severity: 'medium'
    };
  }

  /**
   * Proporciona tip educativo basado en conector usado
   */
  getConnectorTip(connector, sentenceStructure = {}) {
    const connectorTips = EDUCATIONAL_TIPS.connectors[connector];
    if (!connectorTips) {
      return null;
    }

    return {
      type: 'tip',
      connector: connector,
      usage: connectorTips.usage,
      pattern: connectorTips.pattern,
      patterns: connectorTips.patterns,
      examples: connectorTips.examples,
      tip: connectorTips.tip,
      commonMistake: connectorTips.common_mistake,
      context: sentenceStructure
    };
  }

  /**
   * Proporciona tip basado en expresión temporal
   */
  getTimeExpressionTip(timeExpression) {
    const timeTips = EDUCATIONAL_TIPS.time_expressions[timeExpression];
    if (!timeTips) {
      return null;
    }

    return {
      type: 'tip',
      timeExpression: timeExpression,
      recommendedTense: timeTips.tense,
      reason: timeTips.reason,
      examples: timeTips.examples,
      message: `💡 "${timeExpression}" sugiere usar ${timeTips.tense}`
    };
  }

  /**
   * Genera explicación gramatical completa
   */
  getGrammarExplanation(grammarTopic) {
    const explanation = GRAMMAR_EXPLANATIONS[grammarTopic];
    if (!explanation) {
      return null;
    }

    return {
      type: 'grammar_explanation',
      title: explanation.title,
      definition: explanation.definition,
      structure: explanation.structure,
      uses: explanation.uses,
      timeMarkers: explanation.time_markers,
      examples: explanation.uses.map(use => ({
        english: use.example,
        spanish: use.spanish,
        usage: use.use
      }))
    };
  }

  /**
   * Traduce estructura técnica a explicación amigable
   */
  explainStructure(detectedStructure) {
    const explanations = [];

    if (detectedStructure.hasPastContinuous) {
      explanations.push({
        type: 'structure_detected',
        message: "✅ Detecté Past Continuous (was/were + verbo-ing)",
        explanation: "Usas este tiempo para acciones en progreso en el pasado",
        example: "I was walking = Yo estaba caminando"
      });
    }

    if (detectedStructure.hasPastSimple) {
      explanations.push({
        type: 'structure_detected',
        message: "✅ Detecté Past Simple (verbo en pasado)",
        explanation: "Usas este tiempo para acciones completadas en el pasado",
        example: "I walked = Yo caminé"
      });
    }

    if (detectedStructure.hasConnector) {
      const connectorTip = this.getConnectorTip(detectedStructure.connector);
      if (connectorTip) {
        explanations.push(connectorTip);
      }
    }

    return explanations;
  }

  /**
   * Genera corrección paso a paso
   */
  generateStepByStepCorrection(originalSentence, errors) {
    const steps = [];
    let currentSentence = originalSentence;

    errors.forEach((error, index) => {
      const step = {
        step: index + 1,
        problem: error.message,
        before: currentSentence,
        after: error.correction || currentSentence,
        explanation: error.explanation || error.tip,
        rule: error.rule
      };

      if (error.correction) {
        currentSentence = error.correction;
      }

      steps.push(step);
    });

    return {
      type: 'step_by_step_correction',
      originalSentence: originalSentence,
      finalSentence: currentSentence,
      steps: steps,
      summary: `Se corrigieron ${steps.length} error(es) en tu oración`
    };
  }

  /**
   * Genera feedback motivacional personalizado
   */
  generateMotivationalFeedback(userProgress) {
    const { correctSentences, totalAttempts, improvementAreas } = userProgress;
    const accuracy = totalAttempts > 0 ? (correctSentences / totalAttempts) * 100 : 0;

    let message = "";
    let encouragement = "";

    if (accuracy >= 90) {
      message = "🌟 ¡Excelente! Tu dominio del inglés es impresionante";
      encouragement = "Estás listo para desafíos más complejos";
    } else if (accuracy >= 70) {
      message = "👏 ¡Muy bien! Tu inglés está mejorando constantemente";
      encouragement = "Sigue practicando, vas por buen camino";
    } else if (accuracy >= 50) {
      message = "📚 ¡Buen esfuerzo! Cada error es una oportunidad de aprender";
      encouragement = "No te desanimes, el progreso toma tiempo";
    } else {
      message = "💪 ¡Sigue intentando! Todos empezamos desde algún lugar";
      encouragement = "Cada práctica te acerca más a tu objetivo";
    }

    return {
      type: 'motivational',
      message: message,
      encouragement: encouragement,
      accuracy: Math.round(accuracy),
      progress: {
        correct: correctSentences,
        total: totalAttempts,
        improvementAreas: improvementAreas
      }
    };
  }

  /**
   * Detecta el idioma nativo probable basado en errores comunes
   */
  detectNativeLanguageInfluence(errors) {
    const spanishInfluenceIndicators = [
      'ser_estar_confusion', // I am have vs I have
      'false_friends', // "actually" usado como "actualmente"
      'gender_agreement', // Intentar concordar adjetivos
      'word_order' // Orden de palabras del español
    ];

    const influences = [];
    
    errors.forEach(error => {
      if (spanishInfluenceIndicators.some(indicator => 
          error.type.includes(indicator) || error.context?.nativeInfluence === 'spanish')) {
        influences.push({
          type: 'spanish_influence',
          message: "💡 Tip: Este error es común en estudiantes de habla hispana",
          explanation: "En inglés la estructura es diferente al español",
          suggestion: "Practica más este patrón específico"
        });
      }
    });

    return influences;
  }
}

module.exports = {
  EducationalTranslatorService
};