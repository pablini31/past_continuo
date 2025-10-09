// src/services/progress-indicators.service.js

/**
 * ═══════════════════════════════════════════════════
 * 📊 PROGRESS INDICATORS SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Servicio para generar indicadores visuales de progreso,
 * barras de progreso, badges y gráficos de aprendizaje
 */

/**
 * Configuración de badges y logros
 */
const ACHIEVEMENT_BADGES = {
  // Badges por cantidad de oraciones correctas
  sentences: {
    first_sentence: {
      id: 'first_sentence',
      name: 'Primera Oración',
      description: 'Completaste tu primera oración correcta',
      icon: '🌱',
      color: '#48bb78',
      requirement: 1,
      rarity: 'common'
    },
    five_sentences: {
      id: 'five_sentences',
      name: 'En Marcha',
      description: '5 oraciones correctas completadas',
      icon: '🚀',
      color: '#4299e1',
      requirement: 5,
      rarity: 'common'
    },
    ten_sentences: {
      id: 'ten_sentences',
      name: 'Progreso Sólido',
      description: '10 oraciones correctas completadas',
      icon: '💪',
      color: '#ed8936',
      requirement: 10,
      rarity: 'uncommon'
    },
    twenty_five_sentences: {
      id: 'twenty_five_sentences',
      name: 'Estudiante Dedicado',
      description: '25 oraciones correctas completadas',
      icon: '🎓',
      color: '#9f7aea',
      requirement: 25,
      rarity: 'rare'
    },
    fifty_sentences: {
      id: 'fifty_sentences',
      name: 'Maestro del Inglés',
      description: '50 oraciones correctas completadas',
      icon: '👑',
      color: '#f6ad55',
      requirement: 50,
      rarity: 'epic'
    },
    hundred_sentences: {
      id: 'hundred_sentences',
      name: 'Leyenda Gramatical',
      description: '100 oraciones correctas completadas',
      icon: '🏆',
      color: '#ffd700',
      requirement: 100,
      rarity: 'legendary'
    }
  },

  // Badges por precisión
  accuracy: {
    perfectionist: {
      id: 'perfectionist',
      name: 'Perfeccionista',
      description: '100% de precisión en 10 oraciones consecutivas',
      icon: '💎',
      color: '#38b2ac',
      requirement: { accuracy: 100, consecutive: 10 },
      rarity: 'rare'
    },
    high_accuracy: {
      id: 'high_accuracy',
      name: 'Alta Precisión',
      description: 'Mantén 90% de precisión en 20 oraciones',
      icon: '🎯',
      color: '#4299e1',
      requirement: { accuracy: 90, total: 20 },
      rarity: 'uncommon'
    },
    consistent: {
      id: 'consistent',
      name: 'Consistente',
      description: '80% de precisión en 50 oraciones',
      icon: '⚡',
      color: '#ed8936',
      requirement: { accuracy: 80, total: 50 },
      rarity: 'common'
    }
  },

  // Badges por tiempo de práctica
  dedication: {
    daily_practice: {
      id: 'daily_practice',
      name: 'Práctica Diaria',
      description: 'Practica durante 7 días consecutivos',
      icon: '📅',
      color: '#48bb78',
      requirement: { days: 7 },
      rarity: 'uncommon'
    },
    marathon: {
      id: 'marathon',
      name: 'Maratón de Aprendizaje',
      description: 'Practica por más de 1 hora seguida',
      icon: '🏃‍♂️',
      color: '#9f7aea',
      requirement: { minutes: 60 },
      rarity: 'rare'
    },
    night_owl: {
      id: 'night_owl',
      name: 'Búho Nocturno',
      description: 'Practica después de las 10 PM',
      icon: '🦉',
      color: '#4a5568',
      requirement: { hour: 22 },
      rarity: 'uncommon'
    }
  },

  // Badges por tipos de errores superados
  improvement: {
    auxiliary_master: {
      id: 'auxiliary_master',
      name: 'Maestro de Auxiliares',
      description: 'Supera 10 errores de auxiliares consecutivos',
      icon: '⚡',
      color: '#f6ad55',
      requirement: { errorType: 'wrong_auxiliary', fixed: 10 },
      rarity: 'rare'
    },
    gerund_expert: {
      id: 'gerund_expert',
      name: 'Experto en Gerundios',
      description: 'Domina el uso de gerundios (-ing)',
      icon: '🔄',
      color: '#38b2ac',
      requirement: { errorType: 'missing_gerund', fixed: 15 },
      rarity: 'rare'
    },
    tense_master: {
      id: 'tense_master',
      name: 'Maestro de Tiempos',
      description: 'Supera errores de tiempo verbal',
      icon: '⏰',
      color: '#9f7aea',
      requirement: { errorType: 'present_in_past', fixed: 20 },
      rarity: 'epic'
    }
  }
};

/**
 * Configuración de niveles de progreso
 */
const PROGRESS_LEVELS = {
  beginner: {
    name: 'Principiante',
    icon: '🌱',
    color: '#48bb78',
    range: [0, 10],
    description: 'Aprendiendo los conceptos básicos'
  },
  elementary: {
    name: 'Elemental',
    icon: '📚',
    color: '#4299e1',
    range: [11, 25],
    description: 'Construyendo bases sólidas'
  },
  intermediate: {
    name: 'Intermedio',
    icon: '🎯',
    color: '#ed8936',
    range: [26, 50],
    description: 'Desarrollando fluidez'
  },
  advanced: {
    name: 'Avanzado',
    icon: '🚀',
    color: '#9f7aea',
    range: [51, 100],
    description: 'Dominando estructuras complejas'
  },
  expert: {
    name: 'Experto',
    icon: '👑',
    color: '#f6ad55',
    range: [101, 200],
    description: 'Maestría en Past Continuous'
  },
  master: {
    name: 'Maestro',
    icon: '🏆',
    color: '#ffd700',
    range: [201, Infinity],
    description: 'Perfección gramatical'
  }
};

/**
 * Clase principal del servicio de indicadores de progreso
 */
class ProgressIndicatorsService {
  constructor() {
    this.userProgress = new Map(); // Cache de progreso por usuario
    this.sessionStats = new Map(); // Estadísticas de sesión
  }

  /**
   * Genera barra de progreso de estructura gramatical
   */
  generateGrammarProgressBar(analysisResult) {
    const { tenseType, iconStates, completionPercentage } = analysisResult;
    
    // Determinar partes requeridas según el tipo de tiempo
    const requiredParts = this.getRequiredParts(tenseType);
    const completedParts = this.getCompletedParts(iconStates);
    
    const progressBar = {
      type: 'grammar_structure',
      tenseType,
      totalParts: requiredParts.length,
      completedParts: completedParts.length,
      percentage: completionPercentage || 0,
      parts: requiredParts.map(part => ({
        name: part,
        label: this.getPartLabel(part),
        icon: this.getPartIcon(part),
        completed: completedParts.includes(part),
        status: this.getPartStatus(part, iconStates)
      })),
      color: this.getProgressColor(completionPercentage || 0),
      message: this.getProgressMessage(completionPercentage || 0, tenseType)
    };

    return progressBar;
  }

  /**
   * Genera sistema de badges y logros
   */
  generateAchievementBadges(userStats) {
    const {
      correctSentences = 0,
      totalSentences = 0,
      consecutiveCorrect = 0,
      sessionTime = 0,
      errorHistory = {},
      practiceStreak = 0
    } = userStats;

    const earnedBadges = [];
    const availableBadges = [];
    const nextMilestones = [];

    // Verificar badges por cantidad de oraciones
    Object.values(ACHIEVEMENT_BADGES.sentences).forEach(badge => {
      if (correctSentences >= badge.requirement) {
        earnedBadges.push({
          ...badge,
          earnedAt: Date.now(),
          category: 'sentences'
        });
      } else {
        availableBadges.push({
          ...badge,
          progress: correctSentences,
          remaining: badge.requirement - correctSentences,
          category: 'sentences'
        });
      }
    });

    // Verificar badges por precisión
    const accuracy = totalSentences > 0 ? (correctSentences / totalSentences) * 100 : 0;
    Object.values(ACHIEVEMENT_BADGES.accuracy).forEach(badge => {
      const req = badge.requirement;
      let earned = false;

      if (req.accuracy && req.consecutive) {
        earned = accuracy >= req.accuracy && consecutiveCorrect >= req.consecutive;
      } else if (req.accuracy && req.total) {
        earned = accuracy >= req.accuracy && totalSentences >= req.total;
      }

      if (earned) {
        earnedBadges.push({
          ...badge,
          earnedAt: Date.now(),
          category: 'accuracy'
        });
      } else {
        availableBadges.push({
          ...badge,
          progress: Math.min(accuracy, consecutiveCorrect || totalSentences),
          category: 'accuracy'
        });
      }
    });

    // Verificar badges por dedicación
    Object.values(ACHIEVEMENT_BADGES.dedication).forEach(badge => {
      const req = badge.requirement;
      let earned = false;

      if (req.days) {
        earned = practiceStreak >= req.days;
      } else if (req.minutes) {
        earned = sessionTime >= req.minutes * 60 * 1000; // Convertir a ms
      } else if (req.hour) {
        const currentHour = new Date().getHours();
        earned = currentHour >= req.hour;
      }

      if (earned) {
        earnedBadges.push({
          ...badge,
          earnedAt: Date.now(),
          category: 'dedication'
        });
      } else {
        availableBadges.push({
          ...badge,
          category: 'dedication'
        });
      }
    });

    // Verificar badges por mejora
    Object.values(ACHIEVEMENT_BADGES.improvement).forEach(badge => {
      const req = badge.requirement;
      const errorCount = errorHistory[req.errorType] || 0;
      const fixedCount = errorHistory[`${req.errorType}_fixed`] || 0;

      if (fixedCount >= req.fixed) {
        earnedBadges.push({
          ...badge,
          earnedAt: Date.now(),
          category: 'improvement'
        });
      } else {
        availableBadges.push({
          ...badge,
          progress: fixedCount,
          remaining: req.fixed - fixedCount,
          category: 'improvement'
        });
      }
    });

    // Generar próximos hitos
    availableBadges
      .sort((a, b) => (a.remaining || 0) - (b.remaining || 0))
      .slice(0, 3)
      .forEach(badge => {
        nextMilestones.push({
          badge: badge.name,
          description: badge.description,
          progress: badge.progress || 0,
          target: badge.requirement,
          remaining: badge.remaining || 0
        });
      });

    return {
      earned: earnedBadges.sort((a, b) => b.earnedAt - a.earnedAt),
      available: availableBadges,
      nextMilestones,
      totalEarned: earnedBadges.length,
      totalAvailable: Object.keys(ACHIEVEMENT_BADGES).reduce((sum, category) => 
        sum + Object.keys(ACHIEVEMENT_BADGES[category]).length, 0
      )
    };
  }

  /**
   * Genera gráficos de progreso de aprendizaje
   */
  generateLearningGraphs(userHistory) {
    const graphs = {
      accuracy: this.generateAccuracyGraph(userHistory),
      progress: this.generateProgressGraph(userHistory),
      errors: this.generateErrorsGraph(userHistory),
      streaks: this.generateStreaksGraph(userHistory)
    };

    return graphs;
  }

  /**
   * Calcula el nivel actual del usuario
   */
  calculateUserLevel(correctSentences) {
    for (const [levelKey, level] of Object.entries(PROGRESS_LEVELS)) {
      if (correctSentences >= level.range[0] && correctSentences <= level.range[1]) {
        return {
          current: levelKey,
          ...level,
          progress: correctSentences - level.range[0],
          remaining: level.range[1] - correctSentences,
          percentage: Math.round(((correctSentences - level.range[0]) / (level.range[1] - level.range[0])) * 100)
        };
      }
    }

    // Si supera todos los niveles, devolver el máximo
    const masterLevel = PROGRESS_LEVELS.master;
    return {
      current: 'master',
      ...masterLevel,
      progress: correctSentences,
      remaining: 0,
      percentage: 100
    };
  }

  /**
   * Genera indicadores de progreso completos
   */
  generateCompleteProgressIndicators(analysisResult, userStats, userHistory = []) {
    const indicators = {
      timestamp: Date.now(),
      
      // Barra de progreso gramatical
      grammarProgress: this.generateGrammarProgressBar(analysisResult),
      
      // Sistema de badges
      achievements: this.generateAchievementBadges(userStats),
      
      // Nivel del usuario
      userLevel: this.calculateUserLevel(userStats.correctSentences || 0),
      
      // Gráficos de aprendizaje
      learningGraphs: this.generateLearningGraphs(userHistory),
      
      // Estadísticas generales
      stats: {
        accuracy: userStats.totalSentences > 0 ? 
          Math.round((userStats.correctSentences / userStats.totalSentences) * 100) : 0,
        totalSentences: userStats.totalSentences || 0,
        correctSentences: userStats.correctSentences || 0,
        currentStreak: userStats.consecutiveCorrect || 0,
        bestStreak: userStats.bestStreak || 0,
        practiceTime: userStats.totalPracticeTime || 0,
        practiceStreak: userStats.practiceStreak || 0
      },
      
      // Motivación y próximos objetivos
      motivation: this.generateMotivationalProgress(userStats),
      
      // Recomendaciones de mejora
      recommendations: this.generateProgressRecommendations(analysisResult, userStats)
    };

    return indicators;
  }

  /**
   * Funciones auxiliares
   */
  getRequiredParts(tenseType) {
    const parts = {
      'past_continuous': ['subject', 'auxiliary', 'gerund'],
      'past_simple': ['subject', 'main_verb'],
      'unknown': ['subject', 'main_verb']
    };
    return parts[tenseType] || parts.unknown;
  }

  getCompletedParts(iconStates) {
    if (!iconStates) return [];
    return Object.keys(iconStates).filter(key => iconStates[key].active);
  }

  getPartLabel(part) {
    const labels = {
      'subject': 'Sujeto',
      'auxiliary': 'Auxiliar',
      'gerund': 'Gerundio',
      'main_verb': 'Verbo Principal',
      'complement': 'Complemento',
      'connector': 'Conector'
    };
    return labels[part] || part;
  }

  getPartIcon(part) {
    const icons = {
      'subject': '👤',
      'auxiliary': '⚡',
      'main_verb': '🎯',
      'gerund': '🔄',
      'complement': '📝',
      'connector': '🔗'
    };
    return icons[part] || '📝';
  }

  getPartStatus(part, iconStates) {
    if (!iconStates || !iconStates[part]) return 'missing';
    if (iconStates[part].error) return 'error';
    if (iconStates[part].active) return 'completed';
    return 'missing';
  }

  getProgressColor(percentage) {
    if (percentage >= 90) return '#48bb78'; // Verde
    if (percentage >= 70) return '#ed8936'; // Naranja
    if (percentage >= 50) return '#4299e1'; // Azul
    return '#e53e3e'; // Rojo
  }

  getProgressColor(percentage) {
    if (percentage >= 90) return '#48bb78'; // Verde
    if (percentage >= 70) return '#ed8936'; // Naranja
    if (percentage >= 50) return '#4299e1'; // Azul
    return '#e53e3e'; // Rojo
  }

  getProgressMessage(percentage, tenseType) {
    const tenseLabel = tenseType === 'past_continuous' ? 'Past Continuous' : 'Past Simple';
    
    if (percentage >= 90) return `¡Excelente! Dominas la estructura de ${tenseLabel}`;
    if (percentage >= 70) return `¡Muy bien! Casi completas la estructura de ${tenseLabel}`;
    if (percentage >= 50) return `¡Buen progreso! Sigue completando la estructura`;
    return `Continúa escribiendo para completar la estructura`;
  }

  generateAccuracyGraph(userHistory) {
    const last30Days = userHistory.slice(-30);
    const dataPoints = last30Days.map((session, index) => ({
      day: index + 1,
      accuracy: session.accuracy || 0,
      date: session.date
    }));

    return {
      type: 'line',
      title: 'Precisión en los últimos 30 días',
      data: dataPoints,
      average: dataPoints.reduce((sum, point) => sum + point.accuracy, 0) / dataPoints.length || 0,
      trend: this.calculateTrend(dataPoints.map(p => p.accuracy))
    };
  }

  generateProgressGraph(userHistory) {
    const dataPoints = userHistory.map((session, index) => ({
      session: index + 1,
      correctSentences: session.correctSentences || 0,
      totalSentences: session.totalSentences || 0,
      date: session.date
    }));

    return {
      type: 'bar',
      title: 'Progreso de oraciones correctas',
      data: dataPoints,
      total: dataPoints.reduce((sum, point) => sum + point.correctSentences, 0)
    };
  }

  generateErrorsGraph(userHistory) {
    const errorTypes = {};
    userHistory.forEach(session => {
      if (session.errors) {
        session.errors.forEach(error => {
          errorTypes[error.type] = (errorTypes[error.type] || 0) + 1;
        });
      }
    });

    const dataPoints = Object.entries(errorTypes).map(([type, count]) => ({
      errorType: type,
      count,
      label: this.getErrorLabel(type)
    }));

    return {
      type: 'pie',
      title: 'Distribución de errores',
      data: dataPoints.sort((a, b) => b.count - a.count)
    };
  }

  generateStreaksGraph(userHistory) {
    const streaks = [];
    let currentStreak = 0;
    
    userHistory.forEach(session => {
      if (session.accuracy >= 80) {
        currentStreak++;
      } else {
        if (currentStreak > 0) {
          streaks.push(currentStreak);
        }
        currentStreak = 0;
      }
    });
    
    if (currentStreak > 0) {
      streaks.push(currentStreak);
    }

    return {
      type: 'bar',
      title: 'Rachas de alta precisión (80%+)',
      data: streaks.map((streak, index) => ({
        streak: index + 1,
        length: streak
      })),
      bestStreak: Math.max(...streaks, 0),
      averageStreak: streaks.reduce((sum, streak) => sum + streak, 0) / streaks.length || 0
    };
  }

  generateMotivationalProgress(userStats) {
    const { correctSentences = 0, totalSentences = 0 } = userStats;
    const accuracy = totalSentences > 0 ? (correctSentences / totalSentences) * 100 : 0;

    let message = '';
    let icon = '';
    let color = '';

    if (accuracy >= 90) {
      message = '¡Increíble! Tu precisión es excepcional';
      icon = '🌟';
      color = '#ffd700';
    } else if (accuracy >= 80) {
      message = '¡Excelente trabajo! Mantén esa precisión';
      icon = '🎯';
      color = '#48bb78';
    } else if (accuracy >= 70) {
      message = '¡Buen progreso! Sigue mejorando';
      icon = '💪';
      color = '#4299e1';
    } else {
      message = '¡Sigue practicando! Cada intento cuenta';
      icon = '🌱';
      color = '#ed8936';
    }

    return {
      message,
      icon,
      color,
      encouragement: this.getEncouragementMessage(correctSentences)
    };
  }

  generateProgressRecommendations(analysisResult, userStats) {
    const recommendations = [];
    const { errors = [], completionPercentage = 0 } = analysisResult;
    const { errorHistory = {} } = userStats;

    // Recomendaciones basadas en errores recurrentes
    Object.entries(errorHistory).forEach(([errorType, count]) => {
      if (count >= 3) {
        recommendations.push({
          type: 'error_focus',
          title: `Enfócate en ${this.getErrorLabel(errorType)}`,
          description: `Has cometido este error ${count} veces. Practica más este concepto.`,
          priority: 'high',
          action: 'practice_specific_error'
        });
      }
    });

    // Recomendaciones basadas en completitud
    if (completionPercentage < 70) {
      recommendations.push({
        type: 'structure_completion',
        title: 'Completa la estructura gramatical',
        description: 'Enfócate en completar todas las partes de la oración.',
        priority: 'medium',
        action: 'focus_on_structure'
      });
    }

    // Recomendaciones basadas en nivel
    const userLevel = this.calculateUserLevel(userStats.correctSentences || 0);
    if (userLevel.current === 'beginner') {
      recommendations.push({
        type: 'level_progression',
        title: 'Practica oraciones básicas',
        description: 'Domina la estructura básica antes de avanzar a oraciones complejas.',
        priority: 'medium',
        action: 'practice_basics'
      });
    }

    return recommendations.slice(0, 3); // Máximo 3 recomendaciones
  }

  calculateTrend(values) {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  getErrorLabel(errorType) {
    const labels = {
      'present_in_past': 'Presente en Pasado',
      'wrong_auxiliary': 'Auxiliar Incorrecto',
      'missing_gerund': 'Gerundio Faltante',
      'base_verb_in_past': 'Verbo Base en Pasado'
    };
    return labels[errorType] || errorType;
  }

  getEncouragementMessage(correctSentences) {
    if (correctSentences >= 100) return '¡Eres una leyenda del inglés!';
    if (correctSentences >= 50) return '¡Tu dedicación es inspiradora!';
    if (correctSentences >= 25) return '¡Estás en el camino correcto!';
    if (correctSentences >= 10) return '¡Excelente progreso!';
    if (correctSentences >= 5) return '¡Sigue así, vas muy bien!';
    return '¡Cada paso cuenta en tu aprendizaje!';
  }
}

module.exports = {
  ProgressIndicatorsService,
  ACHIEVEMENT_BADGES,
  PROGRESS_LEVELS
};