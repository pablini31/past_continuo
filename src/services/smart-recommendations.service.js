// src/services/smart-recommendations.service.js

/**
 * ═══════════════════════════════════════════════════
 * 🎯 SMART RECOMMENDATIONS SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Servicio que integra toda la inteligencia contextual
 * para proporcionar recomendaciones inteligentes
 */

const { ContextIntelligenceService } = require('./context-intelligence.service');
const { TemporalAnalysisService } = require('./temporal-analysis.service');
const { SpanishFeedbackService } = require('./spanish-feedback.service');
const { EducationalTranslatorService } = require('./educational-translator.service');

class SmartRecommendationsService {
  constructor() {
    this.contextIntelligence = new ContextIntelligenceService();
    this.temporalAnalysis = new TemporalAnalysisService();
    this.spanishFeedback = new SpanishFeedbackService();
    this.educationalTranslator = new EducationalTranslatorService();
  }

  /**
   * Genera recomendaciones inteligentes completas
   */
  generateSmartRecommendations(text, grammarStructure = {}) {
    const recommendations = {
      text: text,
      primaryRecommendation: 'either',
      confidence: 0,
      contextAnalysis: null,
      temporalAnalysis: null,
      smartTips: [],
      warnings: [],
      examples: [],
      reasoning: [],
      spanishExplanations: []
    };

    // Análisis contextual
    recommendations.contextAnalysis = this.contextIntelligence.analyzeContext(text, grammarStructure);
    
    // Análisis temporal
    recommendations.temporalAnalysis = this.temporalAnalysis.analyzeTemporalExpressions(text);
    
    // Combinar análisis para recomendación final
    this.combineAnalyses(recommendations);
    
    // Generar tips inteligentes
    this.generateSmartTips(recommendations);
    
    // Generar explicaciones en español
    this.generateSpanishExplanations(recommendations);
    
    // Generar ejemplos contextuales
    this.generateContextualExamples(recommendations);

    return recommendations;
  }

  /**
   * Combina los diferentes análisis para una recomendación final
   */
  combineAnalyses(recommendations) {
    const contextRec = recommendations.contextAnalysis.primaryRecommendation;
    const temporalRec = recommendations.temporalAnalysis.overallRecommendation;
    const contextConf = recommendations.contextAnalysis.confidence;
    const temporalConf = recommendations.temporalAnalysis.confidence;

    // Lógica de combinación ponderada
    if (contextConf > temporalConf) {
      recommendations.primaryRecommendation = contextRec;
      recommendations.confidence = contextConf;
    } else if (temporalConf > contextConf) {
      recommendations.primaryRecommendation = temporalRec;
      recommendations.confidence = temporalConf;
    } else {
      // Si ambos tienen confianza similar, priorizar según reglas
      if (contextRec === temporalRec) {
        recommendations.primaryRecommendation = contextRec;
        recommendations.confidence = (contextConf + temporalConf) / 2;
      } else {
        recommendations.primaryRecommendation = 'either';
        recommendations.confidence = Math.max(contextConf, temporalConf) * 0.7;
      }
    }

    // Combinar razonamientos
    recommendations.reasoning = [
      ...recommendations.contextAnalysis.reasoning,
      ...recommendations.temporalAnalysis.reasoning
    ];
  }

  /**
   * Genera tips inteligentes basados en el análisis
   */
  generateSmartTips(recommendations) {
    const tips = [];

    // Tips basados en la recomendación principal
    if (recommendations.primaryRecommendation === 'past_simple') {
      tips.push({
        type: 'primary_recommendation',
        icon: '⚡',
        title: 'Recomendación: Past Simple',
        message: 'El contexto sugiere usar Past Simple aquí',
        explanation: 'Para acciones completadas, momentos específicos o eventos puntuales',
        pattern: 'Sujeto + verbo en pasado',
        examples: ['I walked to school', 'She finished her homework', 'They arrived at 8 PM']
      });
    } else if (recommendations.primaryRecommendation === 'past_continuous') {
      tips.push({
        type: 'primary_recommendation',
        icon: '🔄',
        title: 'Recomendación: Past Continuous',
        message: 'El contexto sugiere usar Past Continuous aquí',
        explanation: 'Para acciones en progreso, duración extendida o acciones simultáneas',
        pattern: 'Sujeto + was/were + verbo-ing',
        examples: ['I was walking to school', 'She was doing her homework', 'They were arriving']
      });
    } else if (recommendations.primaryRecommendation === 'mixed') {
      tips.push({
        type: 'primary_recommendation',
        icon: '🔀',
        title: 'Recomendación: Combinar tiempos',
        message: 'El contexto sugiere combinar Past Simple y Past Continuous',
        explanation: 'Para mostrar interrupciones o acciones simultáneas',
        pattern: 'Past Continuous + when/while + Past Simple',
        examples: ['I was walking when it started to rain', 'While she was studying, I was cooking']
      });
    }

    // Tips específicos por conectores detectados
    const connectors = recommendations.contextAnalysis.contextFactors.filter(f => f.type === 'connector');
    connectors.forEach(connector => {
      const connectorTip = this.contextIntelligence.getConnectorRecommendation(connector.value);
      tips.push({
        type: 'connector_specific',
        icon: '🔗',
        title: `Conector "${connector.value}"`,
        message: connectorTip.explanation,
        examples: connectorTip.examples || [],
        confidence: connectorTip.confidence
      });
    });

    // Tips temporales específicos
    const temporalRecs = this.temporalAnalysis.generateTemporalRecommendations(recommendations.temporalAnalysis);
    tips.push(...temporalRecs.map(rec => ({
      type: 'temporal_specific',
      icon: rec.type === 'temporal_duration' ? '⏳' : rec.type === 'temporal_sudden' ? '⚡' : '⏰',
      title: rec.message,
      message: rec.suggestion,
      examples: rec.examples
    })));

    recommendations.smartTips = tips;
  }

  /**
   * Genera explicaciones en español
   */
  generateSpanishExplanations(recommendations) {
    const explanations = [];

    // Explicación principal
    if (recommendations.primaryRecommendation !== 'either') {
      const mainExplanation = this.generateMainExplanation(recommendations);
      explanations.push(mainExplanation);
    }

    // Explicaciones específicas por factor
    recommendations.reasoning.forEach(reason => {
      explanations.push({
        type: 'factor_explanation',
        factor: reason.factor,
        explanation: reason.explanation,
        confidence: Math.round(reason.confidence * 100) + '%'
      });
    });

    // Advertencias en español
    recommendations.contextAnalysis.warnings.forEach(warning => {
      explanations.push({
        type: 'warning',
        message: warning.message,
        suggestion: warning.suggestion
      });
    });

    recommendations.spanishExplanations = explanations;
  }

  /**
   * Genera la explicación principal en español
   */
  generateMainExplanation(recommendations) {
    const confidence = Math.round(recommendations.confidence * 100);
    let explanation = '';

    if (recommendations.primaryRecommendation === 'past_simple') {
      explanation = `Con ${confidence}% de confianza, recomiendo usar **Past Simple** aquí. `;
      explanation += 'El contexto indica acciones completadas, momentos específicos o eventos puntuales.';
    } else if (recommendations.primaryRecommendation === 'past_continuous') {
      explanation = `Con ${confidence}% de confianza, recomiendo usar **Past Continuous** aquí. `;
      explanation += 'El contexto indica acciones en progreso, duración extendida o simultaneidad.';
    } else if (recommendations.primaryRecommendation === 'mixed') {
      explanation = `Con ${confidence}% de confianza, recomiendo **combinar ambos tiempos**. `;
      explanation += 'El contexto sugiere una mezcla apropiada para mostrar interrupciones o acciones simultáneas.';
    }

    return {
      type: 'main_explanation',
      message: explanation,
      confidence: confidence,
      recommendation: recommendations.primaryRecommendation
    };
  }

  /**
   * Genera ejemplos contextuales específicos
   */
  generateContextualExamples(recommendations) {
    const examples = [];

    // Ejemplos basados en conectores detectados
    const connectors = recommendations.contextAnalysis.contextFactors.filter(f => f.type === 'connector');
    connectors.forEach(connector => {
      if (connector.value === 'while') {
        examples.push({
          type: 'connector_example',
          connector: 'while',
          correct: 'While I was studying, she was cooking dinner',
          spanish: 'Mientras yo estudiaba, ella cocinaba la cena',
          explanation: 'Dos acciones simultáneas en progreso'
        });
      } else if (connector.value === 'when') {
        examples.push({
          type: 'connector_example',
          connector: 'when',
          correct: 'I was sleeping when the phone rang',
          spanish: 'Yo estaba durmiendo cuando sonó el teléfono',
          explanation: 'Acción en progreso interrumpida por acción puntual'
        });
      } else if (connector.value === 'as') {
        examples.push({
          type: 'connector_example',
          connector: 'as',
          correct: 'As the sun was setting, we were walking home',
          spanish: 'Mientras el sol se ponía, caminábamos a casa',
          explanation: 'Acciones que se desarrollan simultáneamente'
        });
      }
    });

    // Ejemplos basados en marcadores temporales
    const timeMarkers = recommendations.temporalAnalysis.specificMoments;
    timeMarkers.forEach(marker => {
      examples.push({
        type: 'temporal_example',
        marker: marker.expression,
        correct: `${marker.expression.charAt(0).toUpperCase() + marker.expression.slice(1)} I walked to school`,
        explanation: `"${marker.expression}" indica momento específico → Past Simple`
      });
    });

    const durationMarkers = recommendations.temporalAnalysis.durationExpressions;
    durationMarkers.forEach(marker => {
      examples.push({
        type: 'temporal_example',
        marker: marker.expression,
        correct: `I was working ${marker.expression}`,
        explanation: `"${marker.expression}" indica duración → Past Continuous`
      });
    });

    recommendations.examples = examples;
  }

  /**
   * Analiza un conector específico y proporciona recomendaciones
   */
  analyzeConnectorUsage(connector, sentence) {
    const analysis = {
      connector: connector,
      sentence: sentence,
      recommendation: 'either',
      confidence: 0,
      explanation: '',
      examples: [],
      tips: []
    };

    if (connector === 'while') {
      analysis.recommendation = 'past_continuous';
      analysis.confidence = 0.9;
      analysis.explanation = '"While" conecta acciones simultáneas, típicamente en Past Continuous';
      analysis.examples = [
        'While I was reading, she was cooking',
        'While it was raining, we were inside'
      ];
      analysis.tips = [
        'Usa Past Continuous en ambas partes de la oración',
        'Evita Past Simple con "while" para acciones simultáneas'
      ];
    } else if (connector === 'when') {
      const whenContext = this.contextIntelligence.analyzeWhenContext(sentence);
      analysis.recommendation = whenContext.recommendation;
      analysis.confidence = 0.7;
      analysis.explanation = whenContext.explanation;
      analysis.examples = [
        'I was sleeping when the phone rang (interrupción)',
        'When I was young, I lived in Mexico (contexto)'
      ];
    } else if (connector === 'as') {
      analysis.recommendation = 'past_continuous';
      analysis.confidence = 0.85;
      analysis.explanation = '"As" sugiere acciones que se desarrollan simultáneamente';
      analysis.examples = [
        'As the sun was setting, we were walking',
        'As time was passing, I was learning'
      ];
    }

    return analysis;
  }

  /**
   * Proporciona feedback correctivo inteligente
   */
  generateCorrectiveFeedback(originalText, detectedErrors, grammarStructure) {
    const feedback = {
      originalText: originalText,
      errors: detectedErrors,
      corrections: [],
      explanations: [],
      improvedVersions: []
    };

    // Generar correcciones específicas
    detectedErrors.forEach(error => {
      if (error.type === 'present_in_past') {
        feedback.corrections.push({
          type: 'tense_correction',
          original: error.detected,
          corrected: error.suggestion,
          explanation: `Cambia "${error.detected}" por "${error.suggestion}" porque estamos hablando del pasado`,
          rule: 'En contexto pasado, usa was/were en lugar de am/is/are'
        });
      }
    });

    // Generar versiones mejoradas
    const recommendations = this.generateSmartRecommendations(originalText, grammarStructure);
    if (recommendations.primaryRecommendation !== 'either') {
      feedback.improvedVersions.push({
        version: this.generateImprovedVersion(originalText, recommendations),
        explanation: `Versión mejorada usando ${recommendations.primaryRecommendation}`,
        confidence: recommendations.confidence
      });
    }

    return feedback;
  }

  /**
   * Genera una versión mejorada del texto
   */
  generateImprovedVersion(originalText, recommendations) {
    // Esta es una implementación básica
    // En una versión más avanzada, usaríamos NLP más sofisticado
    let improvedText = originalText;

    // Aplicar correcciones básicas
    if (recommendations.primaryRecommendation === 'past_continuous') {
      improvedText = improvedText.replace(/\b(I|you|we|they)\s+am\b/gi, '$1 was');
      improvedText = improvedText.replace(/\b(he|she|it)\s+is\b/gi, '$1 was');
      improvedText = improvedText.replace(/\b(you|we|they)\s+are\b/gi, '$1 were');
    }

    return improvedText;
  }
}

module.exports = {
  SmartRecommendationsService
};