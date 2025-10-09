// src/services/temporal-analysis.service.js

/**
 * ═══════════════════════════════════════════════════
 * ⏰ TEMPORAL ANALYSIS SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Servicio especializado en análisis temporal
 * Detecta patrones temporales y contextuales en el texto
 */

/**
 * Diccionario de expresiones temporales
 */
const TEMPORAL_EXPRESSIONS = {
  // Expresiones que indican momento específico (Past Simple)
  specific_moments: {
    'yesterday': { weight: 0.9, type: 'specific_day' },
    'last night': { weight: 0.9, type: 'specific_time' },
    'last week': { weight: 0.8, type: 'specific_period' },
    'last month': { weight: 0.8, type: 'specific_period' },
    'last year': { weight: 0.8, type: 'specific_period' },
    'this morning': { weight: 0.7, type: 'specific_time' },
    'at 3 o\'clock': { weight: 0.8, type: 'specific_time' },
    'at midnight': { weight: 0.8, type: 'specific_time' },
    'in 2020': { weight: 0.9, type: 'specific_year' },
    'ago': { weight: 0.9, type: 'time_reference' }
  },

  // Expresiones que indican duración (Past Continuous)
  duration_expressions: {
    'all day': { weight: 0.95, type: 'extended_duration' },
    'all night': { weight: 0.95, type: 'extended_duration' },
    'all morning': { weight: 0.9, type: 'extended_duration' },
    'all afternoon': { weight: 0.9, type: 'extended_duration' },
    'all evening': { weight: 0.9, type: 'extended_duration' },
    'for hours': { weight: 0.9, type: 'duration' },
    'for a long time': { weight: 0.9, type: 'duration' },
    'constantly': { weight: 0.95, type: 'continuous' },
    'continuously': { weight: 0.95, type: 'continuous' },
    'repeatedly': { weight: 0.8, type: 'repetitive' }
  },

  // Expresiones que indican acciones súbitas (Past Simple)
  sudden_actions: {
    'suddenly': { weight: 0.95, type: 'sudden' },
    'immediately': { weight: 0.9, type: 'immediate' },
    'instantly': { weight: 0.9, type: 'immediate' },
    'at once': { weight: 0.8, type: 'immediate' },
    'right away': { weight: 0.8, type: 'immediate' },
    'quickly': { weight: 0.7, type: 'fast_action' }
  }
};/**

 * Clase principal del analizador temporal
 */
class TemporalAnalysisService {

  /**
   * Analiza expresiones temporales en el texto
   */
  analyzeTemporalExpressions(text) {
    const normalizedText = text.toLowerCase();
    const analysis = {
      specificMoments: [],
      durationExpressions: [],
      suddenActions: [],
      overallRecommendation: 'either',
      confidence: 0,
      reasoning: []
    };

    // Analizar momentos específicos
    this.detectSpecificMoments(normalizedText, analysis);
    
    // Analizar expresiones de duración
    this.detectDurationExpressions(normalizedText, analysis);
    
    // Analizar acciones súbitas
    this.detectSuddenActions(normalizedText, analysis);
    
    // Calcular recomendación general
    this.calculateTemporalRecommendation(analysis);

    return analysis;
  }

  /**
   * Detecta momentos específicos en el texto
   */
  detectSpecificMoments(text, analysis) {
    Object.keys(TEMPORAL_EXPRESSIONS.specific_moments).forEach(expression => {
      if (text.includes(expression)) {
        const data = TEMPORAL_EXPRESSIONS.specific_moments[expression];
        analysis.specificMoments.push({
          expression: expression,
          weight: data.weight,
          type: data.type,
          recommendation: 'past_simple'
        });

        analysis.reasoning.push({
          factor: `"${expression}"`,
          recommendation: 'past_simple',
          explanation: `Expresión temporal específica (${data.type})`,
          confidence: data.weight
        });
      }
    });
  }

  /**
   * Detecta expresiones de duración
   */
  detectDurationExpressions(text, analysis) {
    Object.keys(TEMPORAL_EXPRESSIONS.duration_expressions).forEach(expression => {
      if (text.includes(expression)) {
        const data = TEMPORAL_EXPRESSIONS.duration_expressions[expression];
        analysis.durationExpressions.push({
          expression: expression,
          weight: data.weight,
          type: data.type,
          recommendation: 'past_continuous'
        });

        analysis.reasoning.push({
          factor: `"${expression}"`,
          recommendation: 'past_continuous',
          explanation: `Expresión de duración (${data.type})`,
          confidence: data.weight
        });
      }
    });
  }

  /**
   * Detecta acciones súbitas
   */
  detectSuddenActions(text, analysis) {
    Object.keys(TEMPORAL_EXPRESSIONS.sudden_actions).forEach(expression => {
      if (text.includes(expression)) {
        const data = TEMPORAL_EXPRESSIONS.sudden_actions[expression];
        analysis.suddenActions.push({
          expression: expression,
          weight: data.weight,
          type: data.type,
          recommendation: 'past_simple'
        });

        analysis.reasoning.push({
          factor: `"${expression}"`,
          recommendation: 'past_simple',
          explanation: `Acción súbita (${data.type})`,
          confidence: data.weight
        });
      }
    });
  }

  /**
   * Calcula la recomendación temporal general
   */
  calculateTemporalRecommendation(analysis) {
    let simpleScore = 0;
    let continuousScore = 0;
    let totalWeight = 0;

    // Sumar pesos de momentos específicos y acciones súbitas (Past Simple)
    [...analysis.specificMoments, ...analysis.suddenActions].forEach(item => {
      simpleScore += item.weight;
      totalWeight += item.weight;
    });

    // Sumar pesos de expresiones de duración (Past Continuous)
    analysis.durationExpressions.forEach(item => {
      continuousScore += item.weight;
      totalWeight += item.weight;
    });

    // Calcular confianza y recomendación
    if (totalWeight === 0) {
      analysis.overallRecommendation = 'either';
      analysis.confidence = 0;
    } else {
      analysis.confidence = Math.max(simpleScore, continuousScore) / totalWeight;
      
      if (simpleScore > continuousScore) {
        analysis.overallRecommendation = 'past_simple';
      } else if (continuousScore > simpleScore) {
        analysis.overallRecommendation = 'past_continuous';
      } else {
        analysis.overallRecommendation = 'either';
        analysis.confidence *= 0.5; // Reducir confianza en caso de empate
      }
    }
  }

  /**
   * Detecta patrones de tiempo específicos
   */
  detectTimePatterns(text) {
    const patterns = {
      clockTime: /\b(at\s+)?\d{1,2}(:\d{2})?\s*(am|pm|o'clock)\b/gi,
      datePattern: /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(st|nd|rd|th)?\b/gi,
      yearPattern: /\bin\s+\d{4}\b/gi,
      agePattern: /\bwhen\s+i\s+was\s+\d+\b/gi
    };

    const detected = {};
    
    Object.keys(patterns).forEach(patternName => {
      const matches = text.match(patterns[patternName]);
      if (matches) {
        detected[patternName] = matches;
      }
    });

    return detected;
  }

  /**
   * Analiza la secuencia temporal de eventos
   */
  analyzeEventSequence(text) {
    const sequenceMarkers = {
      first: ['first', 'firstly', 'to begin with', 'initially'],
      then: ['then', 'next', 'after that', 'afterwards'],
      finally: ['finally', 'lastly', 'in the end', 'eventually']
    };

    const sequence = [];
    const normalizedText = text.toLowerCase();

    Object.keys(sequenceMarkers).forEach(position => {
      sequenceMarkers[position].forEach(marker => {
        if (normalizedText.includes(marker)) {
          sequence.push({
            position: position,
            marker: marker,
            recommendation: 'past_simple',
            reason: 'sequence_marker'
          });
        }
      });
    });

    return sequence;
  }

  /**
   * Genera recomendaciones temporales específicas
   */
  generateTemporalRecommendations(analysis) {
    const recommendations = [];

    // Recomendaciones basadas en expresiones detectadas
    if (analysis.specificMoments.length > 0) {
      recommendations.push({
        type: 'temporal_specific',
        message: '⏰ Detecté expresiones de tiempo específico',
        suggestion: 'Usa Past Simple para acciones completadas en momentos específicos',
        examples: analysis.specificMoments.map(m => `"${m.expression}" → Past Simple`)
      });
    }

    if (analysis.durationExpressions.length > 0) {
      recommendations.push({
        type: 'temporal_duration',
        message: '⏳ Detecté expresiones de duración',
        suggestion: 'Usa Past Continuous para acciones que duraron un tiempo',
        examples: analysis.durationExpressions.map(d => `"${d.expression}" → Past Continuous`)
      });
    }

    if (analysis.suddenActions.length > 0) {
      recommendations.push({
        type: 'temporal_sudden',
        message: '⚡ Detecté indicadores de acciones súbitas',
        suggestion: 'Usa Past Simple para acciones rápidas o súbitas',
        examples: analysis.suddenActions.map(s => `"${s.expression}" → Past Simple`)
      });
    }

    return recommendations;
  }
}

module.exports = {
  TemporalAnalysisService,
  TEMPORAL_EXPRESSIONS
};