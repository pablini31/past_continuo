// src/services/context-intelligence.service.js

/**
 * ═══════════════════════════════════════════════════
 * 🧠 CONTEXT INTELLIGENCE SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Motor de inteligencia contextual que analiza el contexto
 * y proporciona recomendaciones inteligentes sobre cuándo
 * usar Past Simple vs Past Continuous
 */

/**
 * Patrones contextuales para análisis inteligente
 */
const CONTEXT_PATTERNS = {
  // Conectores y sus implicaciones contextuales
  connectors: {
    'while': {
      primaryRecommendation: 'past_continuous',
      confidence: 0.9,
      reason: 'while_simultaneous_actions',
      explanation: '"While" indica acciones simultáneas, típicamente en progreso',
      examples: [
        {
          english: 'While I was studying, she was cooking',
          spanish: 'Mientras yo estudiaba, ella cocinaba',
          pattern: 'While + Past Continuous, Past Continuous'
        }
      ],
      commonMistakes: [
        {
          wrong: 'While I studied, she cooked',
          correct: 'While I was studying, she was cooking',
          explanation: 'Con "while" es mejor usar Past Continuous para mostrar acciones en progreso simultáneo'
        }
      ]
    },
    
    'when': {
      primaryRecommendation: 'context_dependent',
      confidence: 0.7,
      reason: 'when_flexible_usage',
      explanation: '"When" puede usar ambos tiempos según el contexto específico',
      patterns: [
        {
          type: 'interruption',
          recommendation: 'mixed',
          pattern: 'Past Continuous + when + Past Simple',
          example: 'I was sleeping when the phone rang',
          explanation: 'Acción en progreso interrumpida por acción puntual'
        },
        {
          type: 'context_setting',
          recommendation: 'past_continuous',
          pattern: 'When + Past Continuous, Past Simple',
          example: 'When I was young, I lived in Mexico',
          explanation: 'Contexto temporal para una situación'
        },
        {
          type: 'sequence',
          recommendation: 'past_simple',
          pattern: 'When + Past Simple, Past Simple',
          example: 'When I arrived, she left',
          explanation: 'Secuencia de acciones completadas'
        }
      ]
    },
    
    'as': {
      primaryRecommendation: 'past_continuous',
      confidence: 0.85,
      reason: 'as_simultaneous_development',
      explanation: '"As" sugiere acciones que se desarrollan simultáneamente',
      examples: [
        {
          english: 'As the sun was setting, we were walking home',
          spanish: 'Mientras el sol se ponía, caminábamos a casa',
          pattern: 'As + Past Continuous, Past Continuous'
        }
      ]
    }
  },

  // Marcadores temporales y sus implicaciones
  timeMarkers: {
    // Marcadores que sugieren Past Simple
    past_simple_indicators: {
      'yesterday': {
        confidence: 0.8,
        reason: 'specific_past_moment',
        explanation: 'Momento específico completado en el pasado'
      },
      'last night': {
        confidence: 0.8,
        reason: 'specific_past_moment',
        explanation: 'Momento específico completado en el pasado'
      },
      'last week': {
        confidence: 0.8,
        reason: 'specific_past_period',
        explanation: 'Período específico completado en el pasado'
      },
      'ago': {
        confidence: 0.9,
        reason: 'completed_past_reference',
        explanation: 'Referencia a tiempo completado en el pasado'
      },
      'suddenly': {
        confidence: 0.95,
        reason: 'sudden_action',
        explanation: 'Acción súbita, típicamente Past Simple'
      },
      'immediately': {
        confidence: 0.9,
        reason: 'immediate_action',
        explanation: 'Acción inmediata, típicamente Past Simple'
      },
      'then': {
        confidence: 0.7,
        reason: 'sequence_marker',
        explanation: 'Marcador de secuencia, sugiere Past Simple'
      },
      'finally': {
        confidence: 0.8,
        reason: 'conclusion_marker',
        explanation: 'Marcador de conclusión, sugiere Past Simple'
      }
    },

    // Marcadores que sugieren Past Continuous
    past_continuous_indicators: {
      'all day': {
        confidence: 0.9,
        reason: 'extended_duration',
        explanation: 'Duración extendida, típicamente Past Continuous'
      },
      'all night': {
        confidence: 0.9,
        reason: 'extended_duration',
        explanation: 'Duración extendida, típicamente Past Continuous'
      },
      'constantly': {
        confidence: 0.95,
        reason: 'continuous_action',
        explanation: 'Acción continua, definitivamente Past Continuous'
      },
      'continuously': {
        confidence: 0.95,
        reason: 'continuous_action',
        explanation: 'Acción continua, definitivamente Past Continuous'
      },
      'at that time': {
        confidence: 0.85,
        reason: 'specific_moment_in_progress',
        explanation: 'Momento específico con acción en progreso'
      },
      'at 3 o\'clock': {
        confidence: 0.8,
        reason: 'specific_time_in_progress',
        explanation: 'Hora específica con acción en progreso'
      },
      'still': {
        confidence: 0.8,
        reason: 'ongoing_action',
        explanation: 'Acción que continuaba, sugiere Past Continuous'
      }
    }
  },

  // Palabras clave que indican tipo de acción
  actionTypes: {
    // Verbos que típicamente van con Past Continuous
    continuous_verbs: {
      'sleep': { confidence: 0.7, reason: 'state_verb' },
      'work': { confidence: 0.8, reason: 'activity_verb' },
      'study': { confidence: 0.8, reason: 'activity_verb' },
      'cook': { confidence: 0.8, reason: 'activity_verb' },
      'walk': { confidence: 0.8, reason: 'activity_verb' },
      'run': { confidence: 0.8, reason: 'activity_verb' },
      'drive': { confidence: 0.8, reason: 'activity_verb' },
      'watch': { confidence: 0.7, reason: 'activity_verb' },
      'listen': { confidence: 0.7, reason: 'activity_verb' },
      'wait': { confidence: 0.9, reason: 'duration_verb' },
      'rain': { confidence: 0.9, reason: 'weather_verb' },
      'snow': { confidence: 0.9, reason: 'weather_verb' }
    },

    // Verbos que típicamente van con Past Simple
    simple_verbs: {
      'arrive': { confidence: 0.9, reason: 'punctual_verb' },
      'leave': { confidence: 0.9, reason: 'punctual_verb' },
      'start': { confidence: 0.8, reason: 'punctual_verb' },
      'finish': { confidence: 0.8, reason: 'punctual_verb' },
      'stop': { confidence: 0.8, reason: 'punctual_verb' },
      'find': { confidence: 0.8, reason: 'achievement_verb' },
      'lose': { confidence: 0.8, reason: 'achievement_verb' },
      'win': { confidence: 0.8, reason: 'achievement_verb' },
      'decide': { confidence: 0.8, reason: 'mental_verb' },
      'realize': { confidence: 0.8, reason: 'mental_verb' },
      'remember': { confidence: 0.8, reason: 'mental_verb' },
      'forget': { confidence: 0.8, reason: 'mental_verb' },
      'die': { confidence: 0.95, reason: 'punctual_verb' },
      'born': { confidence: 0.95, reason: 'punctual_verb' }
    }
  },

  // Patrones de interrupción
  interruptionPatterns: {
    'phone rang': { confidence: 0.9, type: 'interruption' },
    'doorbell rang': { confidence: 0.9, type: 'interruption' },
    'alarm went off': { confidence: 0.9, type: 'interruption' },
    'someone knocked': { confidence: 0.9, type: 'interruption' },
    'lights went out': { confidence: 0.9, type: 'interruption' },
    'started to rain': { confidence: 0.8, type: 'interruption' },
    'earthquake happened': { confidence: 0.95, type: 'interruption' }
  }
};

/**
 * Clase principal del motor de inteligencia contextual
 */
class ContextIntelligenceService {

  /**
   * Analiza el contexto completo de una oración o texto
   */
  analyzeContext(text, detectedStructure = {}) {
    const analysis = {
      text: text,
      recommendations: [],
      contextFactors: [],
      confidence: 0,
      primaryRecommendation: 'either',
      reasoning: [],
      tips: [],
      warnings: []
    };

    // Normalizar texto para análisis
    const normalizedText = text.toLowerCase().trim();
    
    // Analizar conectores
    this.analyzeConnectors(normalizedText, analysis);
    
    // Analizar marcadores temporales
    this.analyzeTimeMarkers(normalizedText, analysis);
    
    // Analizar tipos de acción
    this.analyzeActionTypes(normalizedText, analysis);
    
    // Analizar patrones de interrupción
    this.analyzeInterruptionPatterns(normalizedText, analysis);
    
    // Analizar estructura detectada
    this.analyzeDetectedStructure(detectedStructure, analysis);
    
    // Calcular recomendación final
    this.calculateFinalRecommendation(analysis);
    
    // Generar tips contextuales
    this.generateContextualTips(analysis);
    
    return analysis;
  }

  /**
   * Analiza conectores en el texto
   */
  analyzeConnectors(text, analysis) {
    Object.keys(CONTEXT_PATTERNS.connectors).forEach(connector => {
      if (text.includes(connector)) {
        const connectorData = CONTEXT_PATTERNS.connectors[connector];
        
        analysis.contextFactors.push({
          type: 'connector',
          value: connector,
          confidence: connectorData.confidence,
          recommendation: connectorData.primaryRecommendation,
          reason: connectorData.reason
        });

        analysis.reasoning.push({
          factor: `Conector "${connector}"`,
          recommendation: connectorData.primaryRecommendation,
          explanation: connectorData.explanation,
          confidence: connectorData.confidence
        });

        // Agregar tips específicos del conector
        if (connectorData.examples) {
          analysis.tips.push({
            type: 'connector_usage',
            connector: connector,
            examples: connectorData.examples,
            commonMistakes: connectorData.commonMistakes
          });
        }
      }
    });
  }

  /**
   * Analiza marcadores temporales
   */
  analyzeTimeMarkers(text, analysis) {
    // Analizar marcadores de Past Simple
    Object.keys(CONTEXT_PATTERNS.timeMarkers.past_simple_indicators).forEach(marker => {
      if (text.includes(marker)) {
        const markerData = CONTEXT_PATTERNS.timeMarkers.past_simple_indicators[marker];
        
        analysis.contextFactors.push({
          type: 'time_marker',
          value: marker,
          confidence: markerData.confidence,
          recommendation: 'past_simple',
          reason: markerData.reason
        });

        analysis.reasoning.push({
          factor: `Marcador temporal "${marker}"`,
          recommendation: 'past_simple',
          explanation: markerData.explanation,
          confidence: markerData.confidence
        });
      }
    });

    // Analizar marcadores de Past Continuous
    Object.keys(CONTEXT_PATTERNS.timeMarkers.past_continuous_indicators).forEach(marker => {
      if (text.includes(marker)) {
        const markerData = CONTEXT_PATTERNS.timeMarkers.past_continuous_indicators[marker];
        
        analysis.contextFactors.push({
          type: 'time_marker',
          value: marker,
          confidence: markerData.confidence,
          recommendation: 'past_continuous',
          reason: markerData.reason
        });

        analysis.reasoning.push({
          factor: `Marcador temporal "${marker}"`,
          recommendation: 'past_continuous',
          explanation: markerData.explanation,
          confidence: markerData.confidence
        });
      }
    });
  }

  /**
   * Analiza tipos de acción basados en verbos
   */
  analyzeActionTypes(text, analysis) {
    const words = text.split(/\s+/);

    // Analizar verbos que sugieren Past Continuous
    Object.keys(CONTEXT_PATTERNS.actionTypes.continuous_verbs).forEach(verb => {
      if (words.some(word => word.includes(verb))) {
        const verbData = CONTEXT_PATTERNS.actionTypes.continuous_verbs[verb];
        
        analysis.contextFactors.push({
          type: 'verb_type',
          value: verb,
          confidence: verbData.confidence,
          recommendation: 'past_continuous',
          reason: verbData.reason
        });

        analysis.reasoning.push({
          factor: `Verbo "${verb}"`,
          recommendation: 'past_continuous',
          explanation: `Verbo de ${verbData.reason}, típicamente usado en Past Continuous`,
          confidence: verbData.confidence
        });
      }
    });

    // Analizar verbos que sugieren Past Simple
    Object.keys(CONTEXT_PATTERNS.actionTypes.simple_verbs).forEach(verb => {
      if (words.some(word => word.includes(verb))) {
        const verbData = CONTEXT_PATTERNS.actionTypes.simple_verbs[verb];
        
        analysis.contextFactors.push({
          type: 'verb_type',
          value: verb,
          confidence: verbData.confidence,
          recommendation: 'past_simple',
          reason: verbData.reason
        });

        analysis.reasoning.push({
          factor: `Verbo "${verb}"`,
          recommendation: 'past_simple',
          explanation: `Verbo de ${verbData.reason}, típicamente usado en Past Simple`,
          confidence: verbData.confidence
        });
      }
    });
  }

  /**
   * Analiza patrones de interrupción
   */
  analyzeInterruptionPatterns(text, analysis) {
    Object.keys(CONTEXT_PATTERNS.interruptionPatterns).forEach(pattern => {
      if (text.includes(pattern)) {
        const patternData = CONTEXT_PATTERNS.interruptionPatterns[pattern];
        
        analysis.contextFactors.push({
          type: 'interruption_pattern',
          value: pattern,
          confidence: patternData.confidence,
          recommendation: 'mixed',
          reason: 'interruption_scenario'
        });

        analysis.reasoning.push({
          factor: `Patrón de interrupción "${pattern}"`,
          recommendation: 'mixed',
          explanation: 'Escenario de interrupción: usa Past Continuous para la acción en progreso y Past Simple para la interrupción',
          confidence: patternData.confidence
        });

        analysis.tips.push({
          type: 'interruption_tip',
          pattern: pattern,
          explanation: 'En interrupciones: "I was [verb-ing] when [interruption happened]"',
          example: `I was sleeping when the ${pattern}`
        });
      }
    });
  }

  /**
   * Analiza la estructura ya detectada
   */
  analyzeDetectedStructure(structure, analysis) {
    if (!structure || !structure.parts) return;

    // Si ya hay auxiliares de presente, es un error claro
    if (structure.parts.auxiliary && structure.parts.auxiliary.type === 'present_auxiliary') {
      analysis.warnings.push({
        type: 'present_in_past_context',
        message: 'Detecté auxiliares de presente en contexto pasado',
        suggestion: `Cambia "${structure.parts.auxiliary.text}" por "${structure.parts.auxiliary.text === 'am' ? 'was' : structure.parts.auxiliary.text === 'is' ? 'was' : 'were'}"`
      });
    }

    // Si hay gerundio sin auxiliar apropiado
    if (structure.parts.gerund && !structure.parts.auxiliary) {
      analysis.warnings.push({
        type: 'gerund_without_auxiliary',
        message: 'Detecté gerundio sin auxiliar apropiado',
        suggestion: 'Agrega "was" o "were" antes del verbo con -ing'
      });
    }

    // Si hay mezcla inconsistente de tiempos
    if (structure.parts.auxiliary && structure.parts.mainVerb && 
        structure.parts.auxiliary.type === 'past_auxiliary' && 
        structure.parts.mainVerb.type === 'regular_past') {
      analysis.warnings.push({
        type: 'tense_mixing',
        message: 'Mezclas Past Continuous y Past Simple incorrectamente',
        suggestion: 'Usa "was/were + verbo-ing" O "verbo en pasado", no ambos'
      });
    }
  }

  /**
   * Calcula la recomendación final basada en todos los factores
   */
  calculateFinalRecommendation(analysis) {
    const votes = {
      past_simple: 0,
      past_continuous: 0,
      mixed: 0
    };

    let totalConfidence = 0;
    let factorCount = 0;

    // Contar votos ponderados por confianza
    analysis.contextFactors.forEach(factor => {
      const weight = factor.confidence;
      
      if (factor.recommendation === 'past_simple') {
        votes.past_simple += weight;
      } else if (factor.recommendation === 'past_continuous') {
        votes.past_continuous += weight;
      } else if (factor.recommendation === 'mixed') {
        votes.mixed += weight;
      }
      
      totalConfidence += weight;
      factorCount++;
    });

    // Calcular confianza promedio
    analysis.confidence = factorCount > 0 ? totalConfidence / factorCount : 0;

    // Determinar recomendación ganadora
    const maxVotes = Math.max(votes.past_simple, votes.past_continuous, votes.mixed);
    
    if (maxVotes === 0) {
      analysis.primaryRecommendation = 'either';
    } else if (votes.past_simple === maxVotes) {
      analysis.primaryRecommendation = 'past_simple';
    } else if (votes.past_continuous === maxVotes) {
      analysis.primaryRecommendation = 'past_continuous';
    } else {
      analysis.primaryRecommendation = 'mixed';
    }

    // Ajustar confianza si hay conflictos
    if (votes.past_simple > 0 && votes.past_continuous > 0) {
      analysis.confidence *= 0.7; // Reducir confianza si hay conflicto
    }
  }

  /**
   * Genera tips contextuales específicos
   */
  generateContextualTips(analysis) {
    // Tip basado en la recomendación principal
    if (analysis.primaryRecommendation === 'past_simple') {
      analysis.tips.push({
        type: 'primary_recommendation',
        message: '⚡ Recomendación: Usa Past Simple aquí',
        explanation: 'El contexto sugiere acciones completadas o puntuales',
        pattern: 'Sujeto + verbo en pasado',
        examples: ['I walked', 'She studied', 'They went']
      });
    } else if (analysis.primaryRecommendation === 'past_continuous') {
      analysis.tips.push({
        type: 'primary_recommendation',
        message: '🔄 Recomendación: Usa Past Continuous aquí',
        explanation: 'El contexto sugiere acciones en progreso o duración',
        pattern: 'Sujeto + was/were + verbo-ing',
        examples: ['I was walking', 'She was studying', 'They were going']
      });
    } else if (analysis.primaryRecommendation === 'mixed') {
      analysis.tips.push({
        type: 'primary_recommendation',
        message: '🔀 Recomendación: Combina ambos tiempos',
        explanation: 'El contexto sugiere una mezcla apropiada de tiempos',
        pattern: 'Past Continuous + when/while + Past Simple',
        examples: ['I was walking when it started to rain']
      });
    }

    // Tips adicionales basados en factores específicos
    const hasConnector = analysis.contextFactors.some(f => f.type === 'connector');
    const hasTimeMarker = analysis.contextFactors.some(f => f.type === 'time_marker');
    
    if (!hasConnector && !hasTimeMarker) {
      analysis.tips.push({
        type: 'enhancement_suggestion',
        message: '💡 Sugerencia: Agrega contexto temporal',
        explanation: 'Considera agregar "while", "when", "yesterday", etc. para mayor claridad',
        examples: ['Yesterday I...', 'While I was...', 'When she arrived...']
      });
    }
  }

  /**
   * Obtiene recomendación específica para un conector
   */
  getConnectorRecommendation(connector) {
    const connectorData = CONTEXT_PATTERNS.connectors[connector];
    if (!connectorData) {
      return {
        recommendation: 'either',
        confidence: 0.5,
        explanation: 'Conector no reconocido, ambos tiempos pueden ser apropiados'
      };
    }

    return {
      recommendation: connectorData.primaryRecommendation,
      confidence: connectorData.confidence,
      explanation: connectorData.explanation,
      examples: connectorData.examples,
      patterns: connectorData.patterns
    };
  }

  /**
   * Detecta el contexto de "when" específicamente
   */
  analyzeWhenContext(text) {
    const normalizedText = text.toLowerCase();
    
    // Buscar patrones de interrupción
    const interruptionWords = ['suddenly', 'immediately', 'rang', 'knocked', 'happened', 'started', 'stopped'];
    const hasInterruption = interruptionWords.some(word => normalizedText.includes(word));
    
    if (hasInterruption) {
      return {
        type: 'interruption',
        recommendation: 'mixed',
        explanation: 'Patrón de interrupción detectado: usa Past Continuous para la acción en progreso y Past Simple para la interrupción',
        pattern: 'I was [verb-ing] when [interruption happened]'
      };
    }

    // Buscar patrones de contexto temporal
    const contextWords = ['young', 'child', 'student', 'lived', 'worked'];
    const hasContext = contextWords.some(word => normalizedText.includes(word));
    
    if (hasContext) {
      return {
        type: 'context_setting',
        recommendation: 'past_continuous',
        explanation: 'Contexto temporal detectado: usa Past Continuous para establecer el escenario',
        pattern: 'When I was [context], I [action]'
      };
    }

    return {
      type: 'general',
      recommendation: 'either',
      explanation: '"When" puede usar ambos tiempos según el contexto específico',
      pattern: 'Depende del contexto'
    };
  }

  /**
   * Genera explicación detallada de la recomendación
   */
  generateDetailedExplanation(analysis) {
    let explanation = `Basado en el análisis contextual (confianza: ${Math.round(analysis.confidence * 100)}%):\n\n`;
    
    // Agregar factores principales
    if (analysis.reasoning.length > 0) {
      explanation += "Factores detectados:\n";
      analysis.reasoning.forEach((reason, index) => {
        explanation += `${index + 1}. ${reason.factor}: ${reason.explanation} (${Math.round(reason.confidence * 100)}% confianza)\n`;
      });
      explanation += "\n";
    }

    // Agregar recomendación final
    explanation += `Recomendación final: ${analysis.primaryRecommendation}\n`;
    
    // Agregar advertencias si las hay
    if (analysis.warnings.length > 0) {
      explanation += "\nAdvertencias:\n";
      analysis.warnings.forEach((warning, index) => {
        explanation += `⚠️ ${warning.message}\n   Sugerencia: ${warning.suggestion}\n`;
      });
    }

    return explanation;
  }
}

module.exports = {
  ContextIntelligenceService,
  CONTEXT_PATTERNS
};