// src/services/guided-practice.service.js

/**
 * ═══════════════════════════════════════════════════
 * 🎓 GUIDED PRACTICE SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Servicio para crear modo de práctica guiada con
 * tutorial interactivo, instrucciones progresivas y hints
 */

/**
 * Configuración de tutoriales paso a paso
 */
const TUTORIAL_STEPS = {
  // Tutorial básico de Past Continuous
  past_continuous_basics: {
    id: 'past_continuous_basics',
    title: '🔄 Tutorial: Past Continuous Básico',
    description: 'Aprende la estructura básica del Past Continuous paso a paso',
    difficulty: 'beginner',
    estimatedTime: '10-15 minutos',
    steps: [
      {
        step: 1,
        title: 'Bienvenido al Past Continuous',
        instruction: 'El Past Continuous describe acciones que estaban en progreso en el pasado',
        example: 'I was studying when you called',
        explanation: 'Usamos Past Continuous para acciones que duraban un tiempo en el pasado',
        task: null,
        hint: 'Piensa en acciones que estaban "en proceso" en un momento del pasado'
      },
      {
        step: 2,
        title: 'Estructura: Sujeto + was/were',
        instruction: 'Primero necesitas un sujeto y el auxiliar correcto',
        example: 'I was... / You were... / She was...',
        explanation: 'Usa "was" con I, he, she, it. Usa "were" con you, we, they',
        task: {
          type: 'complete',
          prompt: 'Completa: "She ___ walking"',
          answer: 'was',
          alternatives: ['were', 'is', 'are']
        },
        hint: 'She es tercera persona singular, ¿qué auxiliar usa?'
      },
      {
        step: 3,
        title: 'Agregar el gerundio (-ing)',
        instruction: 'Después del auxiliar, agrega el verbo con -ing',
        example: 'I was walking / They were studying',
        explanation: 'El gerundio (-ing) indica que la acción estaba en progreso',
        task: {
          type: 'transform',
          prompt: 'Convierte "walk" a gerundio',
          answer: 'walking',
          baseWord: 'walk'
        },
        hint: 'Solo agrega -ing al final del verbo'
      },
      {
        step: 4,
        title: 'Estructura completa',
        instruction: 'Ahora junta todo: Sujeto + was/were + verbo-ing',
        example: 'I was reading a book',
        explanation: 'Esta es la estructura básica del Past Continuous',
        task: {
          type: 'build',
          prompt: 'Construye una oración con: I / study / yesterday',
          answer: 'I was studying yesterday',
          components: ['I', 'was', 'studying', 'yesterday']
        },
        hint: 'Recuerda: I + was + studying + complemento'
      },
      {
        step: 5,
        title: 'Práctica libre',
        instruction: 'Ahora escribe tu propia oración en Past Continuous',
        example: 'Ejemplo: We were playing soccer',
        explanation: 'Usa cualquier sujeto, el auxiliar correcto y un verbo con -ing',
        task: {
          type: 'free_write',
          prompt: 'Escribe una oración en Past Continuous sobre lo que hacías ayer',
          requirements: ['subject', 'auxiliary', 'gerund'],
          minWords: 4
        },
        hint: 'Piensa en algo que estabas haciendo ayer por un tiempo'
      }
    ]
  },

  // Tutorial de conectores
  connectors_tutorial: {
    id: 'connectors_tutorial',
    title: '🔗 Tutorial: Conectores en Past Continuous',
    description: 'Aprende a usar while, when y as con Past Continuous',
    difficulty: 'intermediate',
    estimatedTime: '15-20 minutos',
    steps: [
      {
        step: 1,
        title: 'Introducción a los conectores',
        instruction: 'Los conectores unen dos acciones en el pasado',
        example: 'While I was cooking, she was studying',
        explanation: 'Conectores como "while", "when", "as" muestran relación temporal',
        task: null,
        hint: 'Los conectores nos ayudan a contar historias más completas'
      },
      {
        step: 2,
        title: 'Using "while" - Acciones simultáneas',
        instruction: '"While" conecta dos acciones que ocurrían al mismo tiempo',
        example: 'While I was reading, it was raining',
        explanation: 'Ambas acciones estaban en progreso simultáneamente',
        task: {
          type: 'complete',
          prompt: 'Completa: "While she was cooking, I ___ watching TV"',
          answer: 'was',
          context: 'simultaneous_actions'
        },
        hint: 'Ambas acciones ocurren al mismo tiempo, usa Past Continuous en ambas'
      },
      {
        step: 3,
        title: 'Using "when" - Interrupción',
        instruction: '"When" a menudo muestra una acción que interrumpe otra',
        example: 'I was sleeping when the phone rang',
        explanation: 'Past Continuous (acción larga) + when + Past Simple (interrupción)',
        task: {
          type: 'choose',
          prompt: 'I was studying when my friend ___',
          options: ['called', 'was calling', 'calls'],
          answer: 'called',
          explanation: 'La llamada es una interrupción corta (Past Simple)'
        },
        hint: 'La acción después de "when" suele ser más corta (Past Simple)'
      },
      {
        step: 4,
        title: 'Using "as" - Contexto',
        instruction: '"As" describe el contexto o trasfondo de una acción',
        example: 'As I was walking home, I saw a rainbow',
        explanation: '"As" da contexto a la acción principal',
        task: {
          type: 'build',
          prompt: 'Construye: As / I / drive / I / see / accident',
          answer: 'As I was driving, I saw an accident',
          structure: 'as_clause'
        },
        hint: 'As + Past Continuous (contexto) + Past Simple (acción principal)'
      },
      {
        step: 5,
        title: 'Práctica con conectores',
        instruction: 'Escribe oraciones usando diferentes conectores',
        example: 'While we were having dinner, the lights went out',
        explanation: 'Combina Past Continuous y Past Simple con conectores',
        task: {
          type: 'free_write',
          prompt: 'Escribe 3 oraciones usando while, when y as',
          requirements: ['connector', 'past_continuous', 'past_simple'],
          minSentences: 3
        },
        hint: 'Piensa en situaciones donde una acción interrumpe o acompaña a otra'
      }
    ]
  },

  // Tutorial de diferencias Past Simple vs Past Continuous
  tense_differences: {
    id: 'tense_differences',
    title: '⚖️ Tutorial: Past Simple vs Past Continuous',
    description: 'Aprende cuándo usar cada tiempo verbal',
    difficulty: 'intermediate',
    estimatedTime: '12-18 minutos',
    steps: [
      {
        step: 1,
        title: 'Diferencias clave',
        instruction: 'Past Simple: acciones completadas. Past Continuous: acciones en progreso',
        example: 'I studied (completé) vs I was studying (estaba en proceso)',
        explanation: 'La diferencia está en si la acción estaba terminada o en progreso',
        task: null,
        hint: 'Past Simple = terminado, Past Continuous = en proceso'
      },
      {
        step: 2,
        title: 'Marcadores temporales',
        instruction: 'Ciertas palabras indican qué tiempo usar',
        example: 'Yesterday (Past Simple) vs All day yesterday (Past Continuous)',
        explanation: 'Palabras como "all day", "while" sugieren Past Continuous',
        task: {
          type: 'classify',
          prompt: 'Clasifica estos marcadores: yesterday, all morning, at 3pm, last week',
          categories: ['past_simple', 'past_continuous'],
          items: [
            { text: 'yesterday', category: 'past_simple' },
            { text: 'all morning', category: 'past_continuous' },
            { text: 'at 3pm', category: 'past_continuous' },
            { text: 'last week', category: 'past_simple' }
          ]
        },
        hint: 'Duración o momento específico = Past Continuous, tiempo general = Past Simple'
      },
      {
        step: 3,
        title: 'Contexto vs Acción principal',
        instruction: 'Past Continuous da contexto, Past Simple es la acción principal',
        example: 'While I was cooking (contexto), the doorbell rang (acción)',
        explanation: 'El contexto es lo que estaba pasando, la acción es lo que ocurrió',
        task: {
          type: 'identify',
          prompt: 'Identifica contexto y acción: "While she was reading, someone knocked"',
          context: 'she was reading',
          action: 'someone knocked'
        },
        hint: 'El contexto es más largo, la acción es más específica'
      },
      {
        step: 4,
        title: 'Práctica de elección',
        instruction: 'Elige el tiempo correcto según el contexto',
        example: 'I ___ (watch) TV when you ___ (call)',
        explanation: 'Analiza si es acción en progreso o acción completada',
        task: {
          type: 'fill_blanks',
          sentences: [
            {
              text: 'I ___ (study) all evening yesterday',
              answer: 'was studying',
              reason: 'Duración específica (all evening)'
            },
            {
              text: 'She ___ (finish) her homework at 9pm',
              answer: 'finished',
              reason: 'Acción completada en momento específico'
            }
          ]
        },
        hint: 'Pregúntate: ¿estaba en proceso o se completó?'
      },
      {
        step: 5,
        title: 'Aplicación práctica',
        instruction: 'Escribe un párrafo mezclando ambos tiempos',
        example: 'Yesterday I was working when my boss called. I finished the report and went home.',
        explanation: 'En historias reales mezclamos ambos tiempos naturalmente',
        task: {
          type: 'paragraph',
          prompt: 'Cuenta qué pasó ayer mezclando Past Simple y Past Continuous',
          requirements: ['past_simple', 'past_continuous', 'connector'],
          minSentences: 4
        },
        hint: 'Usa Past Continuous para el contexto y Past Simple para eventos específicos'
      }
    ]
  }
};

/**
 * Configuración de hints contextuales
 */
const CONTEXTUAL_HINTS = {
  // Hints por tipo de error
  error_hints: {
    'present_in_past': [
      'Recuerda que estamos hablando del pasado, no del presente',
      'Cambia "am/is/are" por "was/were"',
      'En Past Continuous usamos auxiliares de pasado'
    ],
    'missing_gerund': [
      'Después de "was/were" necesitas un verbo con -ing',
      'Agrega "-ing" al final del verbo',
      'El gerundio indica acción en progreso'
    ],
    'wrong_auxiliary': [
      'Verifica que el auxiliar concuerde con el sujeto',
      'I/he/she/it usan "was", you/we/they usan "were"',
      'El auxiliar debe concordar en número y persona'
    ]
  },

  // Hints por nivel de progreso
  progress_hints: {
    'just_started': [
      'Empieza con el sujeto (I, you, she, etc.)',
      'Recuerda la estructura: sujeto + was/were + verbo-ing',
      'No te preocupes por ser perfecto, solo practica'
    ],
    'basic_structure': [
      'Ya tienes la estructura básica, ¡excelente!',
      'Ahora puedes agregar más detalles',
      'Intenta agregar cuándo o dónde pasó la acción'
    ],
    'advanced': [
      'Intenta usar conectores como "while" o "when"',
      'Puedes combinar Past Simple y Past Continuous',
      '¡Experimenta con oraciones más complejas!'
    ]
  },

  // Hints por contexto
  context_hints: {
    'connector_while': [
      'Con "while" usa Past Continuous en ambas partes',
      '"While" indica acciones simultáneas',
      'Ejemplo: While I was cooking, she was studying'
    ],
    'connector_when': [
      'Con "when" mezcla Past Continuous y Past Simple',
      'La acción después de "when" suele ser Past Simple',
      'Ejemplo: I was reading when the phone rang'
    ],
    'time_marker': [
      'Palabras como "all day" sugieren Past Continuous',
      'Momentos específicos como "at 3pm" también',
      'Piensa en la duración de la acción'
    ]
  }
};

/**
 * Clase principal del servicio de práctica guiada
 */
class GuidedPracticeService {
  constructor() {
    this.activeTutorials = new Map(); // Tutoriales activos por usuario
    this.userProgress = new Map(); // Progreso por usuario
    this.hintHistory = new Map(); // Historial de hints por usuario
  }

  /**
   * Inicia un tutorial interactivo
   */
  startTutorial(tutorialId, userId = 'anonymous') {
    const tutorial = TUTORIAL_STEPS[tutorialId];
    if (!tutorial) {
      throw new Error(`Tutorial ${tutorialId} not found`);
    }

    const tutorialSession = {
      id: tutorialId,
      userId,
      tutorial: { ...tutorial },
      currentStep: 1,
      startTime: Date.now(),
      completedSteps: [],
      stepProgress: {},
      hints: [],
      isCompleted: false
    };

    this.activeTutorials.set(userId, tutorialSession);
    return this.getCurrentStepData(tutorialSession);
  }

  /**
   * Avanza al siguiente paso del tutorial
   */
  nextStep(userId = 'anonymous', stepResult = null) {
    const session = this.activeTutorials.get(userId);
    if (!session) {
      throw new Error('No active tutorial found');
    }

    // Guardar resultado del paso actual
    if (stepResult) {
      session.stepProgress[session.currentStep] = {
        ...stepResult,
        completedAt: Date.now()
      };
      session.completedSteps.push(session.currentStep);
    }

    // Avanzar al siguiente paso
    if (session.currentStep < session.tutorial.steps.length) {
      session.currentStep++;
      return this.getCurrentStepData(session);
    } else {
      // Tutorial completado
      session.isCompleted = true;
      session.completedAt = Date.now();
      return this.getTutorialCompletionData(session);
    }
  }

  /**
   * Retrocede al paso anterior
   */
  previousStep(userId = 'anonymous') {
    const session = this.activeTutorials.get(userId);
    if (!session) {
      throw new Error('No active tutorial found');
    }

    if (session.currentStep > 1) {
      session.currentStep--;
      return this.getCurrentStepData(session);
    }

    return this.getCurrentStepData(session);
  }

  /**
   * Obtiene datos del paso actual
   */
  getCurrentStepData(session) {
    const currentStep = session.tutorial.steps[session.currentStep - 1];
    
    return {
      tutorial: {
        id: session.tutorial.id,
        title: session.tutorial.title,
        description: session.tutorial.description,
        difficulty: session.tutorial.difficulty,
        estimatedTime: session.tutorial.estimatedTime
      },
      step: {
        number: session.currentStep,
        total: session.tutorial.steps.length,
        ...currentStep
      },
      progress: {
        percentage: Math.round((session.currentStep / session.tutorial.steps.length) * 100),
        completedSteps: session.completedSteps.length,
        totalSteps: session.tutorial.steps.length
      },
      navigation: {
        canGoBack: session.currentStep > 1,
        canGoForward: session.currentStep < session.tutorial.steps.length,
        isLastStep: session.currentStep === session.tutorial.steps.length
      }
    };
  }

  /**
   * Genera hint contextual
   */
  generateContextualHint(userId, context) {
    const { errorType, progressLevel, connectorUsed, userInput } = context;
    let hints = [];

    // Hints basados en errores
    if (errorType && CONTEXTUAL_HINTS.error_hints[errorType]) {
      hints.push(...CONTEXTUAL_HINTS.error_hints[errorType]);
    }

    // Hints basados en progreso
    if (progressLevel && CONTEXTUAL_HINTS.progress_hints[progressLevel]) {
      hints.push(...CONTEXTUAL_HINTS.progress_hints[progressLevel]);
    }

    // Hints basados en contexto
    if (connectorUsed) {
      const contextKey = `connector_${connectorUsed}`;
      if (CONTEXTUAL_HINTS.context_hints[contextKey]) {
        hints.push(...CONTEXTUAL_HINTS.context_hints[contextKey]);
      }
    }

    // Seleccionar hint más relevante
    const selectedHint = this.selectBestHint(hints, userId, context);
    
    // Guardar en historial
    this.addHintToHistory(userId, selectedHint, context);

    return {
      hint: selectedHint,
      type: this.getHintType(context),
      priority: this.getHintPriority(context),
      timestamp: Date.now()
    };
  }

  /**
   * Genera instrucciones progresivas
   */
  generateProgressiveInstructions(userLevel, currentTask) {
    const instructions = {
      beginner: {
        structure: [
          '1. Empieza con un sujeto (I, you, she, etc.)',
          '2. Agrega el auxiliar correcto (was/were)',
          '3. Añade el verbo con -ing',
          '4. Completa con información adicional'
        ],
        tips: [
          'No te preocupes por ser perfecto',
          'Practica paso a paso',
          'Cada error es una oportunidad de aprender'
        ]
      },
      intermediate: {
        structure: [
          '1. Planifica tu oración completa',
          '2. Decide si necesitas conectores',
          '3. Verifica la concordancia sujeto-auxiliar',
          '4. Revisa que el contexto sea claro'
        ],
        tips: [
          'Experimenta con conectores (while, when, as)',
          'Combina Past Simple y Past Continuous',
          'Piensa en la relación temporal entre acciones'
        ]
      },
      advanced: {
        structure: [
          '1. Crea oraciones complejas con múltiples cláusulas',
          '2. Usa variedad de conectores y marcadores temporales',
          '3. Alterna entre tiempos según el contexto',
          '4. Enfócate en la fluidez y naturalidad'
        ],
        tips: [
          'Cuenta historias completas',
          'Usa Past Continuous para crear atmósfera',
          'Varía la estructura para mayor interés'
        ]
      }
    };

    return instructions[userLevel] || instructions.beginner;
  }

  /**
   * Evalúa respuesta del usuario en tutorial
   */
  evaluateUserResponse(userId, response, expectedAnswer, taskType) {
    const evaluation = {
      isCorrect: false,
      score: 0,
      feedback: '',
      suggestions: [],
      nextAction: 'retry'
    };

    switch (taskType) {
      case 'complete':
        evaluation.isCorrect = response.toLowerCase().trim() === expectedAnswer.toLowerCase();
        evaluation.score = evaluation.isCorrect ? 100 : 0;
        break;

      case 'transform':
        evaluation.isCorrect = response.toLowerCase().trim() === expectedAnswer.toLowerCase();
        evaluation.score = evaluation.isCorrect ? 100 : 0;
        break;

      case 'build':
        evaluation = this.evaluateSentenceConstruction(response, expectedAnswer);
        break;

      case 'free_write':
        evaluation = this.evaluateFreeWriting(response, expectedAnswer);
        break;

      case 'choose':
        evaluation.isCorrect = response === expectedAnswer;
        evaluation.score = evaluation.isCorrect ? 100 : 0;
        break;

      default:
        evaluation.score = 50; // Puntuación por participación
    }

    // Generar feedback
    evaluation.feedback = this.generateStepFeedback(evaluation, taskType);
    
    // Determinar siguiente acción
    if (evaluation.isCorrect || evaluation.score >= 70) {
      evaluation.nextAction = 'continue';
    } else if (evaluation.score >= 40) {
      evaluation.nextAction = 'hint';
    } else {
      evaluation.nextAction = 'retry';
    }

    return evaluation;
  }

  /**
   * Obtiene tutoriales disponibles
   */
  getAvailableTutorials(userLevel = 'beginner') {
    const tutorials = Object.values(TUTORIAL_STEPS);
    
    return tutorials
      .filter(tutorial => {
        if (userLevel === 'beginner') return tutorial.difficulty === 'beginner';
        if (userLevel === 'intermediate') return ['beginner', 'intermediate'].includes(tutorial.difficulty);
        return true; // Advanced users can access all
      })
      .map(tutorial => ({
        id: tutorial.id,
        title: tutorial.title,
        description: tutorial.description,
        difficulty: tutorial.difficulty,
        estimatedTime: tutorial.estimatedTime,
        steps: tutorial.steps.length
      }));
  }

  /**
   * Obtiene progreso del tutorial
   */
  getTutorialProgress(userId = 'anonymous') {
    const session = this.activeTutorials.get(userId);
    if (!session) return null;

    return {
      tutorialId: session.tutorial.id,
      currentStep: session.currentStep,
      totalSteps: session.tutorial.steps.length,
      completedSteps: session.completedSteps.length,
      percentage: Math.round((session.completedSteps.length / session.tutorial.steps.length) * 100),
      timeSpent: Date.now() - session.startTime,
      isCompleted: session.isCompleted
    };
  }

  /**
   * Funciones auxiliares
   */
  selectBestHint(hints, userId, context) {
    if (hints.length === 0) {
      return 'Sigue intentando, ¡puedes hacerlo!';
    }

    // Evitar repetir hints recientes
    const recentHints = this.getRecentHints(userId);
    const availableHints = hints.filter(hint => !recentHints.includes(hint));
    
    if (availableHints.length > 0) {
      return availableHints[Math.floor(Math.random() * availableHints.length)];
    }

    // Si todos los hints son recientes, usar uno aleatorio
    return hints[Math.floor(Math.random() * hints.length)];
  }

  getHintType(context) {
    if (context.errorType) return 'error_correction';
    if (context.progressLevel) return 'progress_guidance';
    if (context.connectorUsed) return 'context_help';
    return 'general_encouragement';
  }

  getHintPriority(context) {
    if (context.errorType) return 'high';
    if (context.progressLevel === 'just_started') return 'high';
    return 'medium';
  }

  addHintToHistory(userId, hint, context) {
    if (!this.hintHistory.has(userId)) {
      this.hintHistory.set(userId, []);
    }

    const history = this.hintHistory.get(userId);
    history.push({
      hint,
      context,
      timestamp: Date.now()
    });

    // Mantener solo los últimos 10 hints
    if (history.length > 10) {
      history.shift();
    }
  }

  getRecentHints(userId) {
    const history = this.hintHistory.get(userId) || [];
    const recentTime = Date.now() - (5 * 60 * 1000); // Últimos 5 minutos
    
    return history
      .filter(entry => entry.timestamp > recentTime)
      .map(entry => entry.hint);
  }

  evaluateSentenceConstruction(response, expectedAnswer) {
    const responseWords = response.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const expectedWords = expectedAnswer.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    let score = 0;
    let correctWords = 0;

    // Verificar palabras clave
    expectedWords.forEach(word => {
      if (responseWords.includes(word)) {
        correctWords++;
      }
    });

    score = Math.round((correctWords / expectedWords.length) * 100);

    return {
      isCorrect: score >= 80,
      score,
      feedback: score >= 80 ? '¡Excelente construcción!' : 'Revisa la estructura de la oración',
      suggestions: score < 80 ? ['Verifica que tengas todas las palabras clave', 'Revisa el orden de las palabras'] : []
    };
  }

  evaluateFreeWriting(response, requirements) {
    const words = response.split(/\s+/).filter(w => w.length > 0);
    let score = 0;
    const feedback = [];

    // Verificar longitud mínima
    if (requirements.minWords && words.length >= requirements.minWords) {
      score += 25;
    } else {
      feedback.push(`Necesitas al menos ${requirements.minWords} palabras`);
    }

    // Verificar requerimientos específicos
    if (requirements.requirements) {
      requirements.requirements.forEach(req => {
        if (this.checkRequirement(response, req)) {
          score += 25;
        } else {
          feedback.push(`Falta: ${this.getRequirementLabel(req)}`);
        }
      });
    }

    return {
      isCorrect: score >= 75,
      score,
      feedback: score >= 75 ? '¡Buena escritura libre!' : 'Revisa los requerimientos',
      suggestions: feedback
    };
  }

  checkRequirement(text, requirement) {
    const lowerText = text.toLowerCase();
    
    switch (requirement) {
      case 'subject':
        return /\b(i|you|he|she|it|we|they)\b/.test(lowerText);
      case 'auxiliary':
        return /\b(was|were)\b/.test(lowerText);
      case 'gerund':
        return /\w+ing\b/.test(lowerText);
      case 'connector':
        return /\b(while|when|as|before|after)\b/.test(lowerText);
      default:
        return false;
    }
  }

  getRequirementLabel(requirement) {
    const labels = {
      'subject': 'sujeto (I, you, she, etc.)',
      'auxiliary': 'auxiliar (was/were)',
      'gerund': 'gerundio (verbo + ing)',
      'connector': 'conector (while, when, as, etc.)'
    };
    return labels[requirement] || requirement;
  }

  generateStepFeedback(evaluation, taskType) {
    if (evaluation.isCorrect) {
      const positiveMessages = [
        '¡Excelente! Has completado este paso correctamente',
        '¡Perfecto! Entiendes el concepto muy bien',
        '¡Muy bien! Sigues progresando fantásticamente',
        '¡Correcto! Estás dominando Past Continuous'
      ];
      return positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
    } else {
      const encouragingMessages = [
        'Casi lo tienes, inténtalo una vez más',
        'Buen intento, revisa la estructura y prueba de nuevo',
        'Estás en el camino correcto, solo necesitas un pequeño ajuste',
        'No te preocupes, el aprendizaje requiere práctica'
      ];
      return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    }
  }

  getTutorialCompletionData(session) {
    const totalTime = Date.now() - session.startTime;
    const averageStepTime = totalTime / session.tutorial.steps.length;

    return {
      completed: true,
      tutorial: {
        id: session.tutorial.id,
        title: session.tutorial.title
      },
      stats: {
        totalTime,
        averageStepTime,
        stepsCompleted: session.completedSteps.length,
        totalSteps: session.tutorial.steps.length,
        hintsUsed: session.hints.length
      },
      achievements: this.calculateTutorialAchievements(session),
      nextRecommendations: this.getNextTutorialRecommendations(session)
    };
  }

  calculateTutorialAchievements(session) {
    const achievements = [];
    const totalTime = Date.now() - session.startTime;
    const minutes = totalTime / (1000 * 60);

    if (session.completedSteps.length === session.tutorial.steps.length) {
      achievements.push({
        id: 'tutorial_completed',
        name: 'Tutorial Completado',
        description: `Completaste ${session.tutorial.title}`,
        icon: '🎓'
      });
    }

    if (minutes < 10) {
      achievements.push({
        id: 'speed_learner',
        name: 'Aprendiz Rápido',
        description: 'Completaste el tutorial en menos de 10 minutos',
        icon: '⚡'
      });
    }

    if (session.hints.length === 0) {
      achievements.push({
        id: 'no_hints_needed',
        name: 'Independiente',
        description: 'Completaste sin necesidad de hints',
        icon: '🎯'
      });
    }

    return achievements;
  }

  getNextTutorialRecommendations(session) {
    const completed = session.tutorial.id;
    const recommendations = [];

    if (completed === 'past_continuous_basics') {
      recommendations.push({
        id: 'connectors_tutorial',
        title: 'Tutorial de Conectores',
        reason: 'Ahora que dominas lo básico, aprende a conectar ideas'
      });
    } else if (completed === 'connectors_tutorial') {
      recommendations.push({
        id: 'tense_differences',
        title: 'Past Simple vs Past Continuous',
        reason: 'Perfecciona tu comprensión de cuándo usar cada tiempo'
      });
    }

    return recommendations;
  }
}

module.exports = {
  GuidedPracticeService,
  TUTORIAL_STEPS,
  CONTEXTUAL_HINTS
};