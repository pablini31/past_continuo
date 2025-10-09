// src/services/contextual-guides.service.js

/**
 * ═══════════════════════════════════════════════════
 * 🎯 CONTEXTUAL GUIDES SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Servicio para generar guías contextuales, tips educativos
 * y mini-lecciones basadas en el progreso del estudiante
 */

const { SpanishFeedbackService } = require('./spanish-feedback.service');

/**
 * Base de datos de tips educativos en español
 */
const EDUCATIONAL_TIPS = {
  // Tips para Past Continuous
  past_continuous: {
    basic: [
      {
        id: 'pc_basic_1',
        title: '🔄 ¿Qué es Past Continuous?',
        message: 'Past Continuous describe acciones que estaban en progreso en el pasado',
        example: 'I was studying when you called',
        explanation: 'Usa "was/were + verbo-ing" para acciones en desarrollo'
      },
      {
        id: 'pc_basic_2',
        title: '⚡ Auxiliares: was/were',
        message: 'Usa "was" con I, he, she, it. Usa "were" con you, we, they',
        example: 'She was reading / They were playing',
        explanation: 'El auxiliar debe concordar con el sujeto'
      },
      {
        id: 'pc_basic_3',
        title: '📝 Gerundio (-ing)',
        message: 'Siempre agrega "-ing" al verbo principal en Past Continuous',
        example: 'walk → walking, study → studying',
        explanation: 'El gerundio indica acción en progreso'
      }
    ],
    intermediate: [
      {
        id: 'pc_int_1',
        title: '🔗 Conectores con Past Continuous',
        message: '"While" indica acciones simultáneas en Past Continuous',
        example: 'While I was cooking, she was studying',
        explanation: 'Ambas acciones ocurrían al mismo tiempo'
      },
      {
        id: 'pc_int_2',
        title: '⏰ Interrupciones con "when"',
        message: '"When" + Past Simple interrumpe Past Continuous',
        example: 'I was sleeping when the phone rang',
        explanation: 'Una acción corta (rang) interrumpe una larga (sleeping)'
      },
      {
        id: 'pc_int_3',
        title: '🎯 Contexto temporal',
        message: 'Usa Past Continuous para describir el contexto de una historia',
        example: 'It was raining. People were walking quickly.',
        explanation: 'Crea la atmósfera de lo que estaba pasando'
      }
    ],
    advanced: [
      {
        id: 'pc_adv_1',
        title: '🌟 Acciones paralelas',
        message: 'Past Continuous muestra múltiples acciones simultáneas',
        example: 'While mom was cooking, dad was reading and I was playing',
        explanation: 'Todas las acciones ocurrían al mismo tiempo'
      },
      {
        id: 'pc_adv_2',
        title: '💭 Estados temporales',
        message: 'Describe estados temporales o situaciones en desarrollo',
        example: 'She was feeling sad that day',
        explanation: 'El sentimiento era temporal, no permanente'
      }
    ]
  },

  // Tips para Past Simple
  past_simple: {
    basic: [
      {
        id: 'ps_basic_1',
        title: '✅ ¿Qué es Past Simple?',
        message: 'Past Simple describe acciones completadas en el pasado',
        example: 'I studied English yesterday',
        explanation: 'La acción terminó en un momento específico del pasado'
      },
      {
        id: 'ps_basic_2',
        title: '📚 Verbos regulares (-ed)',
        message: 'Agrega "-ed" a verbos regulares para formar el pasado',
        example: 'walk → walked, play → played',
        explanation: 'La mayoría de verbos siguen esta regla'
      },
      {
        id: 'ps_basic_3',
        title: '🔄 Verbos irregulares',
        message: 'Los verbos irregulares cambian completamente en pasado',
        example: 'go → went, see → saw, eat → ate',
        explanation: 'Debes memorizar estas formas especiales'
      }
    ],
    intermediate: [
      {
        id: 'ps_int_1',
        title: '⏰ Marcadores temporales',
        message: 'Yesterday, last week, ago indican Past Simple',
        example: 'I visited my grandmother last Sunday',
        explanation: 'Estas palabras señalan tiempo pasado específico'
      },
      {
        id: 'ps_int_2',
        title: '📖 Secuencia de eventos',
        message: 'Past Simple narra eventos en orden cronológico',
        example: 'I woke up, had breakfast, and went to school',
        explanation: 'Cada acción ocurrió después de la anterior'
      }
    ]
  },

  // Tips para errores comunes
  common_errors: [
    {
      id: 'error_present_past',
      title: '❌ Error: Presente en contexto pasado',
      message: 'No uses "am/is/are" cuando hablas del pasado',
      example: '❌ I am walking yesterday → ✅ I was walking yesterday',
      explanation: 'Cambia auxiliares de presente por auxiliares de pasado'
    },
    {
      id: 'error_missing_ing',
      title: '❌ Error: Falta el gerundio',
      message: 'Past Continuous siempre necesita verbo + ing',
      example: '❌ I was walk → ✅ I was walking',
      explanation: 'Después de was/were siempre va verbo-ing'
    },
    {
      id: 'error_wrong_auxiliary',
      title: '❌ Error: Auxiliar incorrecto',
      message: 'Verifica que el auxiliar concuerde con el sujeto',
      example: '❌ I were studying → ✅ I was studying',
      explanation: 'I, he, she, it usan "was". You, we, they usan "were"'
    }
  ]
};

/**
 * Mini-lecciones para errores recurrentes
 */
const MINI_LESSONS = {
  present_in_past: {
    title: '🎓 Mini-lección: Auxiliares de Pasado',
    steps: [
      {
        step: 1,
        title: 'Identifica el problema',
        content: 'Estás usando auxiliares de presente (am/is/are) en contexto pasado',
        example: '❌ I am walking yesterday'
      },
      {
        step: 2,
        title: 'Aprende la regla',
        content: 'En pasado usa "was" con I/he/she/it y "were" con you/we/they',
        example: 'I was, you were, he was, we were'
      },
      {
        step: 3,
        title: 'Practica la corrección',
        content: 'Cambia el auxiliar manteniendo el resto igual',
        example: '✅ I was walking yesterday'
      },
      {
        step: 4,
        title: 'Recuerda el contexto',
        content: 'Palabras como "yesterday", "last week" indican pasado',
        example: 'Siempre usa auxiliares de pasado con estos marcadores'
      }
    ]
  },

  missing_gerund: {
    title: '🎓 Mini-lección: El Gerundio en Past Continuous',
    steps: [
      {
        step: 1,
        title: 'Identifica la estructura',
        content: 'Past Continuous = was/were + verbo-ing',
        example: 'was + walking = was walking'
      },
      {
        step: 2,
        title: 'Forma el gerundio',
        content: 'Agrega "-ing" al verbo base',
        example: 'walk → walking, study → studying'
      },
      {
        step: 3,
        title: 'Reglas especiales',
        content: 'Algunos verbos cambian: run → running, write → writing',
        example: 'Duplica consonante o quita "e" final'
      },
      {
        step: 4,
        title: 'Aplica la corrección',
        content: 'Siempre verifica que tengas was/were + verbo-ing',
        example: '✅ I was studying (no "I was study")'
      }
    ]
  },

  wrong_auxiliary: {
    title: '🎓 Mini-lección: Concordancia de Auxiliares',
    steps: [
      {
        step: 1,
        title: 'Memoriza las reglas',
        content: 'I was, you were, he/she/it was, we were, they were',
        example: 'Cada sujeto tiene su auxiliar específico'
      },
      {
        step: 2,
        title: 'Identifica el sujeto',
        content: 'Primero encuentra quién hace la acción',
        example: 'En "She were walking" → sujeto es "She"'
      },
      {
        step: 3,
        title: 'Aplica la regla',
        content: '"She" es tercera persona singular, usa "was"',
        example: '✅ She was walking'
      },
      {
        step: 4,
        title: 'Practica con ejemplos',
        content: 'Verifica siempre la concordancia sujeto-auxiliar',
        example: 'They were playing, I was reading, etc.'
      }
    ]
  }
};

/**
 * Mensajes de motivación y progreso
 */
const MOTIVATION_MESSAGES = {
  progress: {
    beginner: [
      '🌱 ¡Excelente inicio! Cada palabra cuenta en tu aprendizaje',
      '💪 ¡Sigue así! Estás construyendo bases sólidas',
      '🎯 ¡Buen trabajo! Cada error es una oportunidad de aprender',
      '⭐ ¡Fantástico! Tu progreso es constante y notable'
    ],
    intermediate: [
      '🚀 ¡Increíble progreso! Ya dominas los conceptos básicos',
      '🎨 ¡Excelente! Estás creando oraciones más complejas',
      '🏆 ¡Impresionante! Tu comprensión está mejorando mucho',
      '💎 ¡Brillante! Estás conectando ideas de forma natural'
    ],
    advanced: [
      '🌟 ¡Excepcional! Tu nivel de inglés es muy avanzado',
      '🎓 ¡Magistral! Dominas las estructuras complejas',
      '👑 ¡Perfecto! Tu fluidez es realmente impresionante',
      '🏅 ¡Extraordinario! Eres un ejemplo de perseverancia'
    ]
  },
  
  encouragement: [
    '💝 Recuerda: cada error te acerca más al éxito',
    '🌈 El aprendizaje es un viaje, no un destino',
    '🔥 Tu dedicación es tu mayor fortaleza',
    '🎪 ¡Diviértete aprendiendo! El inglés puede ser entretenido',
    '🌸 La práctica constante da frutos increíbles',
    '🎵 Cada oración es una nota en tu sinfonía del inglés'
  ],

  achievements: {
    first_correct: '🎉 ¡Tu primera oración correcta! ¡Felicitaciones!',
    five_correct: '🏆 ¡5 oraciones correctas! Estás en racha',
    ten_correct: '💎 ¡10 oraciones perfectas! Eres imparable',
    error_fixed: '✨ ¡Excelente corrección! Aprendes de tus errores',
    complex_sentence: '🌟 ¡Oración compleja dominada! Nivel avanzado',
    consistency: '🔥 ¡Práctica constante! La disciplina da resultados'
  }
};

/**
 * Clase principal del servicio de guías contextuales
 */
class ContextualGuidesService {
  constructor() {
    this.spanishFeedback = new SpanishFeedbackService();
    this.userProgress = new Map(); // Cache de progreso por usuario
    this.sessionStats = new Map(); // Estadísticas de sesión
  }

  /**
   * Genera tips educativos basados en el contexto
   */
  generateEducationalTips(context) {
    const { tenseType, userLevel, errors, completedSentences } = context;
    const tips = [];

    // Determinar nivel del usuario
    const level = this.determineUserLevel(userLevel, completedSentences);

    // Obtener tips específicos del tiempo verbal
    if (tenseType === 'past_continuous' && EDUCATIONAL_TIPS.past_continuous[level]) {
      const availableTips = EDUCATIONAL_TIPS.past_continuous[level];
      tips.push(this.selectRandomTip(availableTips));
    } else if (tenseType === 'past_simple' && EDUCATIONAL_TIPS.past_simple[level]) {
      const availableTips = EDUCATIONAL_TIPS.past_simple[level];
      tips.push(this.selectRandomTip(availableTips));
    }

    // Agregar tips para errores comunes si hay errores
    if (errors && errors.length > 0) {
      const errorTips = this.getErrorSpecificTips(errors);
      tips.push(...errorTips);
    }

    // Agregar tip motivacional
    const motivationTip = this.generateMotivationalTip(context);
    if (motivationTip) {
      tips.push(motivationTip);
    }

    return tips.slice(0, 3); // Máximo 3 tips para no abrumar
  }

  /**
   * Genera mini-lección para errores recurrentes
   */
  generateMiniLesson(errorType, userContext = {}) {
    const lesson = MINI_LESSONS[errorType];
    if (!lesson) {
      return null;
    }

    // Personalizar la lección según el contexto del usuario
    const personalizedLesson = {
      ...lesson,
      id: `lesson_${errorType}_${Date.now()}`,
      timestamp: Date.now(),
      userLevel: userContext.level || 'beginner',
      estimatedTime: '2-3 minutos',
      difficulty: this.calculateLessonDifficulty(errorType),
      steps: lesson.steps.map((step, index) => ({
        ...step,
        isCompleted: false,
        timeSpent: 0,
        userNotes: ''
      }))
    };

    return personalizedLesson;
  }

  /**
   * Genera mensajes de motivación y progreso
   */
  generateMotivationalMessage(context) {
    const { 
      correctSentences = 0, 
      totalAttempts = 0, 
      consecutiveCorrect = 0,
      sessionTime = 0,
      improvementRate = 0
    } = context;

    // Determinar tipo de mensaje basado en el progreso
    if (correctSentences === 1) {
      return {
        type: 'achievement',
        message: MOTIVATION_MESSAGES.achievements.first_correct,
        icon: '🎉',
        priority: 'high'
      };
    }

    if (correctSentences === 5) {
      return {
        type: 'achievement',
        message: MOTIVATION_MESSAGES.achievements.five_correct,
        icon: '🏆',
        priority: 'high'
      };
    }

    if (correctSentences === 10) {
      return {
        type: 'achievement',
        message: MOTIVATION_MESSAGES.achievements.ten_correct,
        icon: '💎',
        priority: 'high'
      };
    }

    if (consecutiveCorrect >= 3) {
      return {
        type: 'achievement',
        message: MOTIVATION_MESSAGES.achievements.consistency,
        icon: '🔥',
        priority: 'medium'
      };
    }

    // Mensaje de progreso general
    const level = this.determineProgressLevel(correctSentences, totalAttempts);
    const progressMessages = MOTIVATION_MESSAGES.progress[level];
    
    return {
      type: 'progress',
      message: this.selectRandomMessage(progressMessages),
      icon: '⭐',
      priority: 'low',
      stats: {
        accuracy: totalAttempts > 0 ? Math.round((correctSentences / totalAttempts) * 100) : 0,
        improvement: improvementRate
      }
    };
  }

  /**
   * Genera guía contextual completa
   */
  generateContextualGuide(analysisResult, userContext = {}) {
    const guide = {
      timestamp: Date.now(),
      context: {
        tenseType: analysisResult.tenseType,
        errors: analysisResult.errors || [],
        completionLevel: analysisResult.completionPercentage || 0,
        userLevel: userContext.level || 'beginner'
      },
      tips: [],
      miniLesson: null,
      motivation: null,
      nextSteps: []
    };

    // Generar tips educativos
    guide.tips = this.generateEducationalTips({
      tenseType: analysisResult.tenseType,
      userLevel: userContext.level,
      errors: analysisResult.errors,
      completedSentences: userContext.completedSentences || 0
    });

    // Generar mini-lección si hay errores recurrentes
    if (analysisResult.errors && analysisResult.errors.length > 0) {
      const primaryError = this.identifyPrimaryError(analysisResult.errors);
      if (this.isRecurrentError(primaryError, userContext)) {
        guide.miniLesson = this.generateMiniLesson(primaryError, userContext);
      }
    }

    // Generar mensaje motivacional
    guide.motivation = this.generateMotivationalMessage(userContext);

    // Generar próximos pasos
    guide.nextSteps = this.generateNextSteps(analysisResult, userContext);

    return guide;
  }

  /**
   * Determina el nivel del usuario
   */
  determineUserLevel(explicitLevel, completedSentences = 0) {
    if (explicitLevel) return explicitLevel;
    
    if (completedSentences < 5) return 'basic';
    if (completedSentences < 15) return 'intermediate';
    return 'advanced';
  }

  /**
   * Determina el nivel de progreso
   */
  determineProgressLevel(correctSentences, totalAttempts) {
    const accuracy = totalAttempts > 0 ? correctSentences / totalAttempts : 0;
    
    if (correctSentences < 5 || accuracy < 0.6) return 'beginner';
    if (correctSentences < 15 || accuracy < 0.8) return 'intermediate';
    return 'advanced';
  }

  /**
   * Selecciona un tip aleatorio de una lista
   */
  selectRandomTip(tips) {
    return tips[Math.floor(Math.random() * tips.length)];
  }

  /**
   * Selecciona un mensaje aleatorio
   */
  selectRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Obtiene tips específicos para errores
   */
  getErrorSpecificTips(errors) {
    const tips = [];
    const errorTypes = [...new Set(errors.map(e => e.type))];
    
    errorTypes.forEach(errorType => {
      const errorTip = EDUCATIONAL_TIPS.common_errors.find(tip => 
        tip.id.includes(errorType.replace('_', ''))
      );
      if (errorTip) {
        tips.push(errorTip);
      }
    });

    return tips;
  }

  /**
   * Genera tip motivacional
   */
  generateMotivationalTip(context) {
    const encouragementMessages = MOTIVATION_MESSAGES.encouragement;
    return {
      id: 'motivation_tip',
      title: '💪 Mensaje de Ánimo',
      message: this.selectRandomMessage(encouragementMessages),
      type: 'motivation'
    };
  }

  /**
   * Identifica el error principal
   */
  identifyPrimaryError(errors) {
    // Priorizar errores por importancia
    const errorPriority = {
      'present_in_past': 1,
      'wrong_auxiliary': 2,
      'missing_gerund': 3,
      'base_verb_in_past': 4
    };

    return errors.reduce((primary, current) => {
      const currentPriority = errorPriority[current.type] || 999;
      const primaryPriority = errorPriority[primary?.type] || 999;
      
      return currentPriority < primaryPriority ? current : primary;
    }, null)?.type;
  }

  /**
   * Verifica si es un error recurrente
   */
  isRecurrentError(errorType, userContext) {
    const errorHistory = userContext.errorHistory || {};
    const errorCount = errorHistory[errorType] || 0;
    
    return errorCount >= 2; // Considerar recurrente después de 2 ocurrencias
  }

  /**
   * Calcula la dificultad de una lección
   */
  calculateLessonDifficulty(errorType) {
    const difficultyMap = {
      'present_in_past': 'easy',
      'missing_gerund': 'easy',
      'wrong_auxiliary': 'medium',
      'base_verb_in_past': 'medium'
    };

    return difficultyMap[errorType] || 'medium';
  }

  /**
   * Genera próximos pasos recomendados
   */
  generateNextSteps(analysisResult, userContext) {
    const steps = [];
    const { tenseType, errors, completionPercentage } = analysisResult;

    // Pasos basados en errores
    if (errors && errors.length > 0) {
      steps.push({
        type: 'correction',
        title: 'Corrige los errores identificados',
        description: 'Revisa y corrige los errores marcados en tu oración',
        priority: 'high',
        estimatedTime: '1-2 minutos'
      });
    }

    // Pasos basados en completitud
    if (completionPercentage < 100) {
      steps.push({
        type: 'completion',
        title: 'Completa la estructura gramatical',
        description: 'Agrega las partes faltantes para completar tu oración',
        priority: 'medium',
        estimatedTime: '2-3 minutos'
      });
    }

    // Pasos basados en nivel
    const userLevel = this.determineUserLevel(userContext.level, userContext.completedSentences);
    if (userLevel === 'basic') {
      steps.push({
        type: 'practice',
        title: 'Practica con oraciones simples',
        description: 'Enfócate en la estructura básica: sujeto + auxiliar + verbo-ing',
        priority: 'low',
        estimatedTime: '5-10 minutos'
      });
    } else if (userLevel === 'intermediate') {
      steps.push({
        type: 'challenge',
        title: 'Intenta oraciones con conectores',
        description: 'Usa "while", "when", "as" para crear oraciones más complejas',
        priority: 'low',
        estimatedTime: '10-15 minutos'
      });
    }

    return steps.slice(0, 3); // Máximo 3 pasos
  }

  /**
   * Actualiza el progreso del usuario
   */
  updateUserProgress(userId, progressData) {
    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, {
        totalSentences: 0,
        correctSentences: 0,
        errorHistory: {},
        lastActivity: Date.now(),
        level: 'beginner'
      });
    }

    const progress = this.userProgress.get(userId);
    
    // Actualizar estadísticas
    if (progressData.isCorrect) {
      progress.correctSentences++;
    }
    progress.totalSentences++;
    
    // Actualizar historial de errores
    if (progressData.errors) {
      progressData.errors.forEach(error => {
        progress.errorHistory[error.type] = (progress.errorHistory[error.type] || 0) + 1;
      });
    }

    // Actualizar nivel
    progress.level = this.determineProgressLevel(progress.correctSentences, progress.totalSentences);
    progress.lastActivity = Date.now();

    this.userProgress.set(userId, progress);
    return progress;
  }

  /**
   * Obtiene estadísticas del usuario
   */
  getUserStats(userId) {
    return this.userProgress.get(userId) || {
      totalSentences: 0,
      correctSentences: 0,
      errorHistory: {},
      lastActivity: null,
      level: 'beginner'
    };
  }
}

module.exports = {
  ContextualGuidesService,
  EDUCATIONAL_TIPS,
  MINI_LESSONS,
  MOTIVATION_MESSAGES
};