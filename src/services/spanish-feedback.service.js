// src/services/spanish-feedback.service.js

/**
 * ═══════════════════════════════════════════════════
 * 🇪🇸 SPANISH FEEDBACK SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Servicio para generar feedback educativo en español
 * Ayuda a los estudiantes a entender sus errores y mejorar
 */

/**
 * Diccionario de mensajes educativos en español
 */
const SPANISH_MESSAGES = {
  // ❌ ERRORES COMUNES
  errors: {
    present_in_past: {
      message: "❌ Error: Estás usando tiempo presente, pero necesitas pasado",
      explanation: "En inglés, cuando hablamos del pasado debemos usar tiempos pasados",
      examples: {
        wrong: "I am walking yesterday",
        correct: "I was walking yesterday",
        spanish: "Yo estaba caminando ayer"
      }
    },
    wrong_auxiliary: {
      message: "⚠️ Cuidado: Verifica el auxiliar was/were",
      explanation: "Usa 'was' con I/he/she/it y 'were' con you/we/they",
      examples: {
        wrong: "I were walking",
        correct: "I was walking",
        rule: "I/he/she/it + was | you/we/they + were"
      }
    },
    missing_gerund: {
      message: "📝 Falta: Agrega '-ing' al verbo para Past Continuous",
      explanation: "El Past Continuous siempre necesita verbo + ing",
      examples: {
        wrong: "I was walk",
        correct: "I was walking",
        pattern: "was/were + verbo-ing"
      }
    },
    wrong_past_form: {
      message: "🔄 Error: Forma incorrecta del verbo en pasado",
      explanation: "Revisa la forma correcta del verbo en Past Simple",
      examples: {
        wrong: "I goed to school",
        correct: "I went to school",
        tip: "Algunos verbos son irregulares en pasado"
      }
    },
    mixed_tenses: {
      message: "⚡ Inconsistencia: Mezclas diferentes tiempos verbales",
      explanation: "Mantén consistencia en el tiempo verbal de tu oración",
      examples: {
        wrong: "I was walk and eat",
        correct: "I was walking and eating",
        tip: "Si usas Past Continuous, todos los verbos deben tener -ing"
      }
    }
  },

  // ✅ MENSAJES DE ÉXITO
  success: {
    correct_past_continuous: {
      message: "🎉 ¡Excelente! Past Continuous perfecto",
      explanation: "Usaste correctamente was/were + verbo-ing",
      encouragement: "¡Sigue así! Dominas el Past Continuous"
    },
    correct_past_simple: {
      message: "👏 ¡Muy bien! Past Simple correcto",
      explanation: "Usaste la forma correcta del verbo en pasado",
      encouragement: "¡Perfecto! Conoces bien el Past Simple"
    },
    good_connector_use: {
      message: "🔗 ¡Genial! Excelente uso del conector",
      explanation: "Elegiste el conector apropiado para el contexto",
      encouragement: "Entiendes bien cómo conectar ideas en inglés"
    },
    complex_sentence: {
      message: "🌟 ¡Impresionante! Oración compleja bien construida",
      explanation: "Combinaste correctamente diferentes tiempos verbales",
      encouragement: "Tu nivel de inglés está mejorando mucho"
    }
  },

  // 💡 TIPS EDUCATIVOS
  tips: {
    while_usage: {
      message: "💡 Tip: 'While' para acciones simultáneas",
      explanation: "'While' se usa cuando dos acciones ocurren al mismo tiempo",
      examples: {
        correct: "While I was studying, she was cooking",
        spanish: "Mientras yo estudiaba, ella cocinaba",
        pattern: "While + Past Continuous, Past Continuous"
      }
    },
    when_interruption: {
      message: "⚡ Tip: 'When' para interrupciones",
      explanation: "'When' se usa cuando una acción interrumpe a otra",
      examples: {
        correct: "I was sleeping when the phone rang",
        spanish: "Yo estaba durmiendo cuando sonó el teléfono",
        pattern: "Past Continuous + when + Past Simple"
      }
    },
    when_context: {
      message: "🕐 Tip: 'When' también para contexto",
      explanation: "'When' puede dar contexto temporal a una situación",
      examples: {
        correct: "When I was young, I lived in Mexico",
        spanish: "Cuando era joven, vivía en México",
        pattern: "When + Past Continuous/Simple, Past Simple"
      }
    },
    as_simultaneous: {
      message: "🔄 Tip: 'As' para acciones en desarrollo",
      explanation: "'As' muestra acciones que se desarrollan juntas",
      examples: {
        correct: "As the sun was setting, we were walking home",
        spanish: "Mientras el sol se ponía, caminábamos a casa",
        pattern: "As + Past Continuous, Past Continuous"
      }
    }
  },

  // 📚 EXPLICACIONES GRAMATICALES
  grammar: {
    past_continuous_structure: {
      title: "📖 Estructura del Past Continuous",
      explanation: "El Past Continuous describe acciones en progreso en el pasado",
      structure: "Sujeto + was/were + verbo-ing + complemento",
      examples: [
        { english: "I was reading a book", spanish: "Yo estaba leyendo un libro" },
        { english: "They were playing soccer", spanish: "Ellos estaban jugando fútbol" },
        { english: "She was cooking dinner", spanish: "Ella estaba cocinando la cena" }
      ],
      when_to_use: [
        "Acciones en progreso en un momento específico del pasado",
        "Acciones simultáneas en el pasado",
        "Acciones interrumpidas por otras acciones"
      ]
    },
    past_simple_structure: {
      title: "📖 Estructura del Past Simple",
      explanation: "El Past Simple describe acciones completadas en el pasado",
      structure: "Sujeto + verbo en pasado + complemento",
      examples: [
        { english: "I read a book", spanish: "Yo leí un libro" },
        { english: "They played soccer", spanish: "Ellos jugaron fútbol" },
        { english: "She cooked dinner", spanish: "Ella cocinó la cena" }
      ],
      when_to_use: [
        "Acciones completadas en el pasado",
        "Secuencia de acciones pasadas",
        "Acciones que interrumpen otras acciones"
      ]
    }
  },

  // 🎯 RECOMENDACIONES CONTEXTUALES
  recommendations: {
    use_past_continuous: {
      message: "🔄 Recomendación: Usa Past Continuous aquí",
      reason: "El contexto sugiere una acción en progreso",
      pattern: "was/were + verbo-ing"
    },
    use_past_simple: {
      message: "⚡ Recomendación: Usa Past Simple aquí",
      reason: "El contexto sugiere una acción completada",
      pattern: "verbo en pasado"
    },
    both_possible: {
      message: "🤔 Ambos tiempos son posibles aquí",
      reason: "El contexto permite ambas interpretaciones",
      suggestion: "Elige según lo que quieras expresar"
    }
  }
};

/**
 * Clase principal del servicio de feedback en español
 */
class SpanishFeedbackService {
  
  /**
   * Genera feedback de error en español
   */
  generateErrorFeedback(errorType, context = {}) {
    const errorData = SPANISH_MESSAGES.errors[errorType];
    if (!errorData) {
      return this.generateGenericError(errorType);
    }

    return {
      type: 'error',
      message: errorData.message,
      explanation: errorData.explanation,
      examples: errorData.examples,
      context: context,
      timestamp: new Date()
    };
  }

  /**
   * Genera feedback de éxito en español
   */
  generateSuccessFeedback(successType, context = {}) {
    const successData = SPANISH_MESSAGES.success[successType];
    if (!successData) {
      return this.generateGenericSuccess();
    }

    return {
      type: 'success',
      message: successData.message,
      explanation: successData.explanation,
      encouragement: successData.encouragement,
      context: context,
      timestamp: new Date()
    };
  }

  /**
   * Genera tips educativos en español
   */
  generateTip(tipType, context = {}) {
    const tipData = SPANISH_MESSAGES.tips[tipType];
    if (!tipData) {
      return null;
    }

    return {
      type: 'tip',
      message: tipData.message,
      explanation: tipData.explanation,
      examples: tipData.examples,
      context: context,
      timestamp: new Date()
    };
  }

  /**
   * Genera explicación gramatical en español
   */
  generateGrammarExplanation(grammarType) {
    const grammarData = SPANISH_MESSAGES.grammar[grammarType];
    if (!grammarData) {
      return null;
    }

    return {
      type: 'grammar',
      title: grammarData.title,
      explanation: grammarData.explanation,
      structure: grammarData.structure,
      examples: grammarData.examples,
      whenToUse: grammarData.when_to_use,
      timestamp: new Date()
    };
  }

  /**
   * Genera recomendación contextual en español
   */
  generateRecommendation(recommendationType, context = {}) {
    const recData = SPANISH_MESSAGES.recommendations[recommendationType];
    if (!recData) {
      return null;
    }

    return {
      type: 'recommendation',
      message: recData.message,
      reason: recData.reason,
      pattern: recData.pattern,
      suggestion: recData.suggestion,
      context: context,
      timestamp: new Date()
    };
  }

  /**
   * Genera corrección específica con explicación
   */
  generateCorrection(originalText, correctedText, reason) {
    return {
      type: 'correction',
      message: "🔧 Corrección sugerida:",
      original: originalText,
      corrected: correctedText,
      reason: reason,
      explanation: `Cambié "${originalText}" por "${correctedText}" porque ${reason}`,
      timestamp: new Date()
    };
  }

  /**
   * Genera feedback completo para una oración
   */
  generateCompleteFeedback(analysis) {
    const feedback = {
      errors: [],
      successes: [],
      tips: [],
      corrections: [],
      recommendations: []
    };

    // Agregar errores encontrados
    if (analysis.errors && analysis.errors.length > 0) {
      analysis.errors.forEach(error => {
        feedback.errors.push(this.generateErrorFeedback(error.type, error.context));
      });
    }

    // Agregar éxitos
    if (analysis.successes && analysis.successes.length > 0) {
      analysis.successes.forEach(success => {
        feedback.successes.push(this.generateSuccessFeedback(success.type, success.context));
      });
    }

    // Agregar tips contextuales
    if (analysis.connector) {
      const tipType = this.getConnectorTip(analysis.connector, analysis.structure);
      if (tipType) {
        feedback.tips.push(this.generateTip(tipType, { connector: analysis.connector }));
      }
    }

    // Agregar recomendaciones
    if (analysis.recommendation) {
      feedback.recommendations.push(
        this.generateRecommendation(analysis.recommendation, analysis.context)
      );
    }

    return feedback;
  }

  /**
   * Obtiene el tip apropiado para un conector
   */
  getConnectorTip(connector, structure) {
    const tipMap = {
      'while': 'while_usage',
      'when': structure.hasInterruption ? 'when_interruption' : 'when_context',
      'as': 'as_simultaneous'
    };
    return tipMap[connector];
  }

  /**
   * Genera error genérico cuando no se encuentra el tipo específico
   */
  generateGenericError(errorType) {
    return {
      type: 'error',
      message: "❌ Se detectó un error en tu oración",
      explanation: "Revisa la estructura gramatical y los tiempos verbales",
      errorType: errorType,
      timestamp: new Date()
    };
  }

  /**
   * Genera éxito genérico
   */
  generateGenericSuccess() {
    return {
      type: 'success',
      message: "✅ ¡Bien hecho!",
      explanation: "Tu oración está correcta",
      encouragement: "¡Sigue practicando!",
      timestamp: new Date()
    };
  }

  /**
   * Obtiene mensaje motivacional aleatorio
   */
  getMotivationalMessage() {
    const messages = [
      "¡Excelente progreso! 🌟",
      "¡Sigue así, lo estás haciendo genial! 💪",
      "¡Tu inglés está mejorando mucho! 🚀",
      "¡Cada error es una oportunidad de aprender! 📚",
      "¡Perfecto! Dominas estos conceptos 🎯"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

module.exports = {
  SpanishFeedbackService,
  SPANISH_MESSAGES
};