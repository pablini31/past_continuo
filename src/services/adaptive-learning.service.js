// src/services/adaptive-learning.service.js

/**
 * ═══════════════════════════════════════════════════
 * 🧠 ADAPTIVE LEARNING SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Servicio para personalización del aprendizaje con
 * evaluación de nivel, sistema adaptativo y memoria de usuario
 */

/**
 * Configuración de niveles de habilidad
 */
const SKILL_LEVELS = {
  beginner: {
    name: 'Principiante',
    range: [0, 30],
    characteristics: {
      accuracy: [0, 40],
      speed: [0, 30],
      complexity: [0, 25]
    },
    recommendations: {
      focusAreas: ['basic_structure', 'simple_sentences'],
      practiceTypes: ['guided_tutorial', 'fill_blanks'],
      difficulty: 'easy',
      hintsFrequency: 'high'
    }
  },
  elementary: {
    name: 'Elemental',
    range: [31, 50],
    characteristics: {
      accuracy: [41, 60],
      speed: [31, 50],
      complexity: [26, 45]
    },
    recommendations: {
      focusAreas: ['auxiliary_verbs', 'gerunds'],
      practiceTypes: ['structured_practice', 'multiple_choice'],
      difficulty: 'easy-medium',
      hintsFrequency: 'medium'
    }
  },
  intermediate: {
    name: 'Intermedio',
    range: [51, 70],
    characteristics: {
      accuracy: [61, 75],
      speed: [51, 70],
      complexity: [46, 65]
    },
    recommendations: {
      focusAreas: ['connectors', 'tense_mixing'],
      practiceTypes: ['free_writing', 'sentence_building'],
      difficulty: 'medium',
      hintsFrequency: 'low'
    }
  },
  advanced: {
    name: 'Avanzado',
    range: [71, 85],
    characteristics: {
      accuracy: [76, 90],
      speed: [71, 85],
      complexity: [66, 85]
    },
    recommendations: {
      focusAreas: ['complex_structures', 'storytelling'],
      practiceTypes: ['creative_writing', 'error_correction'],
      difficulty: 'hard',
      hintsFrequency: 'minimal'
    }
  },
  expert: {
    name: 'Experto',
    range: [86, 100],
    characteristics: {
      accuracy: [91, 100],
      speed: [86, 100],
      complexity: [86, 100]
    },
    recommendations: {
      focusAreas: ['nuanced_usage', 'advanced_contexts'],
      practiceTypes: ['open_composition', 'peer_review'],
      difficulty: 'expert',
      hintsFrequency: 'none'
    }
  }
};

/**
 * Configuración de evaluación inicial
 */
const INITIAL_ASSESSMENT = {
  questions: [
    {
      id: 'basic_structure',
      type: 'complete',
      question: 'Completa: I ___ walking to school yesterday.',
      options: ['was', 'were', 'am', 'is'],
      correct: 'was',
      difficulty: 'beginner',
      skills: ['auxiliary_verbs', 'past_tense']
    },
    {
      id: 'gerund_formation',
      type: 'transform',
      question: 'Convierte "study" a gerundio:',
      correct: 'studying',
      difficulty: 'elementary',
      skills: ['gerund_formation', 'spelling']
    },
    {
      id: 'connector_usage',
      type: 'choose',
      question: 'I was reading ___ the phone rang.',
      options: ['while', 'when', 'as', 'during'],
      correct: 'when',
      difficulty: 'intermediate',
      skills: ['connectors', 'tense_mixing']
    },
    {
      id: 'complex_sentence',
      type: 'build',
      question: 'Construye una oración con: while / I / cook / she / study',
      correct: 'While I was cooking, she was studying',
      difficulty: 'advanced',
      skills: ['complex_structures', 'simultaneous_actions']
    },
    {
      id: 'error_identification',
      type: 'identify',
      question: 'Identifica el error: "I am walking yesterday when she called"',
      correct: 'am should be was',
      difficulty: 'expert',
      skills: ['error_detection', 'tense_consistency']
    }
  ]
};

/**
 * Configuración de adaptación de dificultad
 */
const DIFFICULTY_ADAPTATION = {
  // Factores que influyen en la dificultad
  factors: {
    accuracy: { weight: 0.4, threshold: 0.8 },
    speed: { weight: 0.3, threshold: 0.7 },
    consistency: { weight: 0.2, threshold: 0.75 },
    improvement: { weight: 0.1, threshold: 0.1 }
  },
  
  // Ajustes de dificultad
  adjustments: {
    increase: {
      conditions: { accuracy: '>= 0.85', speed: '>= 0.8', consistency: '>= 0.8' },
      changes: { difficulty: '+1', complexity: '+10%', hints: '-20%' }
    },
    decrease: {
      conditions: { accuracy: '<= 0.6', speed: '<= 0.5', consistency: '<= 0.6' },
      changes: { difficulty: '-1', complexity: '-15%', hints: '+30%' }
    },
    maintain: {
      conditions: 'default',
      changes: { difficulty: '0', complexity: '±5%', hints: '±10%' }
    }
  }
};

/**
 * Clase principal del servicio de aprendizaje adaptativo
 */
class AdaptiveLearningService {
  constructor() {
    this.userProfiles = new Map(); // Perfiles de usuario
    this.learningPaths = new Map(); // Rutas de aprendizaje personalizadas
    this.adaptationHistory = new Map(); // Historial de adaptaciones
  }

  /**
   * Evalúa el nivel inicial del estudiante
   */
  async evaluateInitialLevel(userId, responses = []) {
    const assessment = {
      userId,
      timestamp: Date.now(),
      responses,
      scores: {},
      overallScore: 0,
      recommendedLevel: 'beginner',
      strengths: [],
      weaknesses: [],
      learningPath: null
    };

    // Evaluar cada respuesta
    INITIAL_ASSESSMENT.questions.forEach((question, index) => {
      const userResponse = responses[index];
      if (userResponse) {
        const score = this.evaluateResponse(question, userResponse);
        assessment.scores[question.id] = score;
        
        // Analizar fortalezas y debilidades
        if (score.isCorrect) {
          assessment.strengths.push(...question.skills);
        } else {
          assessment.weaknesses.push(...question.skills);
        }
      }
    });

    // Calcular puntuación general
    const scores = Object.values(assessment.scores);
    if (scores.length > 0) {
      const totalScore = scores.reduce((sum, score) => sum + score.points, 0);
      const maxScore = scores.length * 100;
      assessment.overallScore = Math.min(100, Math.round((totalScore / maxScore) * 100));
    } else {
      assessment.overallScore = 0;
    }

    // Determinar nivel recomendado
    assessment.recommendedLevel = this.determineSkillLevel(assessment.overallScore);

    // Generar ruta de aprendizaje personalizada
    assessment.learningPath = this.generateLearningPath(assessment);

    // Guardar perfil del usuario
    this.createUserProfile(userId, assessment);

    return assessment;
  }

  /**
   * Crea sistema adaptativo de dificultad
   */
  adaptDifficulty(userId, recentPerformance) {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    const adaptation = {
      userId,
      timestamp: Date.now(),
      previousDifficulty: userProfile.currentDifficulty,
      newDifficulty: userProfile.currentDifficulty,
      factors: {},
      changes: {},
      reasoning: []
    };

    // Calcular factores de rendimiento
    adaptation.factors = this.calculatePerformanceFactors(recentPerformance);

    // Determinar ajustes necesarios
    const adjustmentType = this.determineAdjustmentType(adaptation.factors);
    adaptation.changes = DIFFICULTY_ADAPTATION.adjustments[adjustmentType].changes;

    // Aplicar cambios
    this.applyDifficultyChanges(userProfile, adaptation.changes);
    adaptation.newDifficulty = userProfile.currentDifficulty;

    // Generar explicación
    adaptation.reasoning = this.generateAdaptationReasoning(adjustmentType, adaptation.factors);

    // Guardar en historial
    this.saveAdaptationHistory(userId, adaptation);

    return adaptation;
  }

  /**
   * Implementa memoria de fortalezas y debilidades
   */
  updateUserMemory(userId, sessionData) {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    const memory = userProfile.memory;
    const { errors, successes, timeSpent, difficulty } = sessionData;

    // Actualizar fortalezas
    successes.forEach(success => {
      const skill = success.skill;
      if (!memory.strengths[skill]) {
        memory.strengths[skill] = { count: 0, confidence: 0, lastSeen: Date.now() };
      }
      memory.strengths[skill].count++;
      memory.strengths[skill].confidence = Math.min(100, memory.strengths[skill].confidence + 5);
      memory.strengths[skill].lastSeen = Date.now();
    });

    // Actualizar debilidades
    errors.forEach(error => {
      const skill = error.skill;
      if (!memory.weaknesses[skill]) {
        memory.weaknesses[skill] = { count: 0, severity: 0, lastSeen: Date.now(), attempts: 0 };
      }
      memory.weaknesses[skill].count++;
      memory.weaknesses[skill].severity = Math.min(100, memory.weaknesses[skill].severity + 10);
      memory.weaknesses[skill].lastSeen = Date.now();
      memory.weaknesses[skill].attempts++;
    });

    // Actualizar estadísticas generales
    memory.totalSessions++;
    memory.totalTimeSpent += timeSpent;
    memory.lastActivity = Date.now();

    // Recalcular nivel si es necesario
    this.recalculateUserLevel(userId);

    return memory;
  }

  /**
   * Genera recomendaciones personalizadas
   */
  generatePersonalizedRecommendations(userId) {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    const recommendations = {
      userId,
      timestamp: Date.now(),
      currentLevel: userProfile.skillLevel,
      focusAreas: [],
      practiceTypes: [],
      difficultySettings: {},
      learningGoals: [],
      estimatedTimeToNextLevel: 0
    };

    // Obtener recomendaciones base del nivel
    const levelConfig = SKILL_LEVELS[userProfile.skillLevel];
    recommendations.focusAreas = [...levelConfig.recommendations.focusAreas];
    recommendations.practiceTypes = [...levelConfig.recommendations.practiceTypes];
    recommendations.difficultySettings = { ...levelConfig.recommendations };

    // Personalizar basado en debilidades
    const topWeaknesses = this.getTopWeaknesses(userProfile.memory.weaknesses, 3);
    topWeaknesses.forEach(weakness => {
      if (!recommendations.focusAreas.includes(weakness.skill)) {
        recommendations.focusAreas.unshift(weakness.skill);
      }
    });

    // Ajustar tipos de práctica basado en fortalezas
    const topStrengths = this.getTopStrengths(userProfile.memory.strengths, 2);
    if (topStrengths.length >= 2) {
      recommendations.practiceTypes.push('challenge_mode');
    }

    // Generar objetivos de aprendizaje
    recommendations.learningGoals = this.generateLearningGoals(userProfile);

    // Estimar tiempo al siguiente nivel
    recommendations.estimatedTimeToNextLevel = this.estimateTimeToNextLevel(userProfile);

    return recommendations;
  }

  /**
   * Funciones auxiliares
   */
  evaluateResponse(question, userResponse) {
    const score = {
      questionId: question.id,
      isCorrect: false,
      points: 0,
      timeBonus: 0,
      feedback: ''
    };

    // Evaluar corrección
    switch (question.type) {
      case 'complete':
      case 'choose':
        score.isCorrect = userResponse.answer === question.correct;
        break;
      case 'transform':
        score.isCorrect = userResponse.answer.toLowerCase().trim() === question.correct.toLowerCase();
        break;
      case 'build':
        score.isCorrect = this.evaluateSentenceConstruction(userResponse.answer, question.correct);
        break;
      case 'identify':
        score.isCorrect = this.evaluateErrorIdentification(userResponse.answer, question.correct);
        break;
    }

    // Calcular puntos
    score.points = score.isCorrect ? 100 : 0;

    // Bonus por tiempo (si se completó rápido)
    if (userResponse.timeSpent && userResponse.timeSpent < 30000) { // menos de 30 segundos
      score.timeBonus = Math.max(0, 20 - Math.floor(userResponse.timeSpent / 1500));
      if (score.isCorrect) {
        score.points += score.timeBonus;
      }
    }

    return score;
  }

  determineSkillLevel(overallScore) {
    for (const [level, config] of Object.entries(SKILL_LEVELS)) {
      if (overallScore >= config.range[0] && overallScore <= config.range[1]) {
        return level;
      }
    }
    return 'beginner';
  }

  generateLearningPath(assessment) {
    const path = {
      userId: assessment.userId,
      currentLevel: assessment.recommendedLevel,
      milestones: [],
      estimatedDuration: '2-4 semanas',
      priority: 'high'
    };

    // Generar hitos basados en debilidades
    const uniqueWeaknesses = [...new Set(assessment.weaknesses)];
    uniqueWeaknesses.slice(0, 5).forEach((weakness, index) => {
      path.milestones.push({
        id: `milestone_${index + 1}`,
        skill: weakness,
        description: this.getSkillDescription(weakness),
        estimatedTime: '3-5 días',
        priority: index < 2 ? 'high' : 'medium'
      });
    });

    return path;
  }

  createUserProfile(userId, assessment) {
    const profile = {
      userId,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      skillLevel: assessment.recommendedLevel,
      currentDifficulty: SKILL_LEVELS[assessment.recommendedLevel].recommendations.difficulty,
      initialAssessment: assessment,
      memory: {
        strengths: {},
        weaknesses: {},
        totalSessions: 0,
        totalTimeSpent: 0,
        lastActivity: Date.now()
      },
      preferences: {
        hintsEnabled: true,
        feedbackLanguage: 'spanish',
        practiceReminders: true
      },
      goals: {
        targetLevel: this.getNextLevel(assessment.recommendedLevel),
        weeklyGoal: 5, // sesiones por semana
        dailyGoal: 30 // minutos por día
      }
    };

    // Inicializar memoria con datos de evaluación
    assessment.strengths.forEach(strength => {
      profile.memory.strengths[strength] = { count: 1, confidence: 60, lastSeen: Date.now() };
    });

    assessment.weaknesses.forEach(weakness => {
      profile.memory.weaknesses[weakness] = { count: 1, severity: 40, lastSeen: Date.now(), attempts: 0 };
    });

    this.userProfiles.set(userId, profile);
    return profile;
  }

  calculatePerformanceFactors(recentPerformance) {
    const factors = {};
    
    // Calcular precisión
    const totalAttempts = recentPerformance.length;
    const correctAttempts = recentPerformance.filter(p => p.isCorrect).length;
    factors.accuracy = totalAttempts > 0 ? correctAttempts / totalAttempts : 0;

    // Calcular velocidad (basada en tiempo promedio)
    const avgTime = recentPerformance.reduce((sum, p) => sum + (p.timeSpent || 30000), 0) / totalAttempts;
    factors.speed = Math.max(0, 1 - (avgTime / 60000)); // Normalizar a 0-1

    // Calcular consistencia (variación en el rendimiento)
    const accuracyVariation = this.calculateVariation(recentPerformance.map(p => p.isCorrect ? 1 : 0));
    factors.consistency = 1 - accuracyVariation;

    // Calcular mejora (comparar con sesiones anteriores)
    factors.improvement = this.calculateImprovement(recentPerformance);

    return factors;
  }

  determineAdjustmentType(factors) {
    const { accuracy, speed, consistency } = factors;
    
    // Verificar condiciones para aumentar dificultad
    if (accuracy >= 0.85 && speed >= 0.8 && consistency >= 0.8) {
      return 'increase';
    }
    
    // Verificar condiciones para disminuir dificultad
    if (accuracy <= 0.6 || speed <= 0.5 || consistency <= 0.6) {
      return 'decrease';
    }
    
    return 'maintain';
  }

  applyDifficultyChanges(userProfile, changes) {
    // Aplicar cambios de dificultad
    if (changes.difficulty === '+1') {
      userProfile.currentDifficulty = this.increaseDifficulty(userProfile.currentDifficulty);
    } else if (changes.difficulty === '-1') {
      userProfile.currentDifficulty = this.decreaseDifficulty(userProfile.currentDifficulty);
    }

    userProfile.lastUpdated = Date.now();
  }

  generateAdaptationReasoning(adjustmentType, factors) {
    const reasoning = [];
    
    switch (adjustmentType) {
      case 'increase':
        reasoning.push('Tu rendimiento ha sido excelente consistentemente');
        reasoning.push(`Precisión: ${Math.round(factors.accuracy * 100)}% - ¡Muy bien!`);
        reasoning.push('Es hora de un desafío mayor');
        break;
      case 'decrease':
        reasoning.push('Vamos a ajustar la dificultad para ayudarte a mejorar');
        reasoning.push(`Precisión: ${Math.round(factors.accuracy * 100)}% - Necesitas más práctica`);
        reasoning.push('Enfócate en dominar los conceptos básicos');
        break;
      case 'maintain':
        reasoning.push('Tu progreso es constante, mantén el buen trabajo');
        reasoning.push('La dificultad actual es perfecta para ti');
        break;
    }
    
    return reasoning;
  }

  saveAdaptationHistory(userId, adaptation) {
    if (!this.adaptationHistory.has(userId)) {
      this.adaptationHistory.set(userId, []);
    }
    
    const history = this.adaptationHistory.get(userId);
    history.push(adaptation);
    
    // Mantener solo los últimos 20 registros
    if (history.length > 20) {
      history.shift();
    }
  }

  recalculateUserLevel(userId) {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return;

    // Calcular puntuación basada en fortalezas y debilidades
    const strengthsScore = Object.values(userProfile.memory.strengths)
      .reduce((sum, strength) => sum + strength.confidence, 0);
    const weaknessesScore = Object.values(userProfile.memory.weaknesses)
      .reduce((sum, weakness) => sum + (100 - weakness.severity), 0);
    
    const totalScore = (strengthsScore + weaknessesScore) / 
      (Object.keys(userProfile.memory.strengths).length + Object.keys(userProfile.memory.weaknesses).length);

    const newLevel = this.determineSkillLevel(totalScore || 0);
    
    if (newLevel !== userProfile.skillLevel) {
      userProfile.skillLevel = newLevel;
      userProfile.lastUpdated = Date.now();
    }
  }

  getTopWeaknesses(weaknesses, limit = 3) {
    return Object.entries(weaknesses)
      .map(([skill, data]) => ({ skill, ...data }))
      .sort((a, b) => b.severity - a.severity)
      .slice(0, limit);
  }

  getTopStrengths(strengths, limit = 3) {
    return Object.entries(strengths)
      .map(([skill, data]) => ({ skill, ...data }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  generateLearningGoals(userProfile) {
    const goals = [];
    const weaknesses = this.getTopWeaknesses(userProfile.memory.weaknesses, 2);
    
    weaknesses.forEach(weakness => {
      goals.push({
        type: 'skill_improvement',
        skill: weakness.skill,
        description: `Mejorar en ${this.getSkillDescription(weakness.skill)}`,
        target: 'Reducir errores en 50%',
        timeframe: '1-2 semanas'
      });
    });

    goals.push({
      type: 'level_advancement',
      description: `Avanzar al nivel ${this.getNextLevel(userProfile.skillLevel)}`,
      target: 'Completar evaluación con 80%+ de precisión',
      timeframe: '2-4 semanas'
    });

    return goals;
  }

  estimateTimeToNextLevel(userProfile) {
    const currentLevel = userProfile.skillLevel;
    const nextLevel = this.getNextLevel(currentLevel);
    
    if (!nextLevel) return 0; // Ya está en el nivel máximo
    
    const weaknessCount = Object.keys(userProfile.memory.weaknesses).length;
    const strengthCount = Object.keys(userProfile.memory.strengths).length;
    
    // Estimación basada en fortalezas vs debilidades
    const ratio = strengthCount / (weaknessCount + 1);
    const baseTime = 14; // 2 semanas base
    
    return Math.round(baseTime / Math.max(0.5, ratio)); // días
  }

  // Funciones auxiliares adicionales
  getSkillDescription(skill) {
    const descriptions = {
      'auxiliary_verbs': 'verbos auxiliares (was/were)',
      'gerund_formation': 'formación de gerundios (-ing)',
      'connectors': 'conectores (while, when, as)',
      'tense_mixing': 'mezcla de tiempos verbales',
      'basic_structure': 'estructura básica de oraciones',
      'complex_structures': 'estructuras complejas',
      'error_detection': 'detección de errores'
    };
    return descriptions[skill] || skill;
  }

  getNextLevel(currentLevel) {
    const levels = Object.keys(SKILL_LEVELS);
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  }

  increaseDifficulty(current) {
    const difficulties = ['easy', 'easy-medium', 'medium', 'medium-hard', 'hard', 'expert'];
    const index = difficulties.indexOf(current);
    return index < difficulties.length - 1 ? difficulties[index + 1] : current;
  }

  decreaseDifficulty(current) {
    const difficulties = ['easy', 'easy-medium', 'medium', 'medium-hard', 'hard', 'expert'];
    const index = difficulties.indexOf(current);
    return index > 0 ? difficulties[index - 1] : current;
  }

  calculateVariation(values) {
    if (values.length < 2) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  calculateImprovement(recentPerformance) {
    if (recentPerformance.length < 4) return 0;
    
    const firstHalf = recentPerformance.slice(0, Math.floor(recentPerformance.length / 2));
    const secondHalf = recentPerformance.slice(Math.floor(recentPerformance.length / 2));
    
    const firstAccuracy = firstHalf.filter(p => p.isCorrect).length / firstHalf.length;
    const secondAccuracy = secondHalf.filter(p => p.isCorrect).length / secondHalf.length;
    
    return secondAccuracy - firstAccuracy;
  }

  evaluateSentenceConstruction(userAnswer, correctAnswer) {
    const userWords = userAnswer.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const correctWords = correctAnswer.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    const matchingWords = userWords.filter(word => correctWords.includes(word));
    return matchingWords.length / correctWords.length >= 0.8;
  }

  evaluateErrorIdentification(userAnswer, correctAnswer) {
    return userAnswer.toLowerCase().includes(correctAnswer.toLowerCase().split(' ')[0]);
  }

  /**
   * API pública del servicio
   */
  getUserProfile(userId) {
    return this.userProfiles.get(userId);
  }

  getAdaptationHistory(userId) {
    return this.adaptationHistory.get(userId) || [];
  }

  getLearningPath(userId) {
    return this.learningPaths.get(userId);
  }
}

module.exports = {
  AdaptiveLearningService,
  SKILL_LEVELS,
  INITIAL_ASSESSMENT,
  DIFFICULTY_ADAPTATION
};