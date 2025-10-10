// tests/spanish-feedback.test.js

/**
 * ═══════════════════════════════════════════════════
 * 🧪 TESTS PARA SPANISH FEEDBACK SERVICE
 * ═══════════════════════════════════════════════════
 */

const { SpanishFeedbackService } = require('../src/services/spanish-feedback.service');
const { EducationalTranslatorService } = require('../src/services/educational-translator.service');

// Función simple para tests
function test(description, testFunction) {
  try {
    testFunction();
    console.log(`✅ ${description}`);
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Instanciar servicios
const spanishFeedback = new SpanishFeedbackService();
const educationalTranslator = new EducationalTranslatorService();

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE SPANISH FEEDBACK SERVICE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Spanish Feedback Service...\n');

test('Should generate error feedback in Spanish', () => {
  const feedback = spanishFeedback.generateErrorFeedback('present_in_past', {
    detected: 'am walking'
  });
  
  assert(feedback.type === 'error', 'Should be error type');
  assert(feedback.message.includes('❌'), 'Should have error emoji');
  assert(feedback.message.includes('presente'), 'Should mention present tense in Spanish');
  assert(feedback.explanation, 'Should have explanation');
});

test('Should generate success feedback in Spanish', () => {
  const feedback = spanishFeedback.generateSuccessFeedback('correct_past_continuous');
  
  assert(feedback.type === 'success', 'Should be success type');
  assert(feedback.message.includes('🎉') || feedback.message.includes('✅'), 'Should have success emoji');
  assert(feedback.encouragement, 'Should have encouragement message');
});

test('Should generate tips in Spanish', () => {
  const tip = spanishFeedback.generateTip('while_usage');
  
  assert(tip.type === 'tip', 'Should be tip type');
  assert(tip.message.includes('💡'), 'Should have tip emoji');
  assert(tip.message.includes('While'), 'Should mention while connector');
  assert(tip.explanation, 'Should have explanation');
});

test('Should generate grammar explanations', () => {
  const explanation = spanishFeedback.generateGrammarExplanation('past_continuous_structure');
  
  assert(explanation.type === 'grammar', 'Should be grammar type');
  assert(explanation.title.includes('Past Continuous'), 'Should be about Past Continuous');
  assert(explanation.structure, 'Should have structure explanation');
  assert(explanation.examples && explanation.examples.length > 0, 'Should have examples');
});

test('Should generate corrections with explanations', () => {
  const correction = spanishFeedback.generateCorrection(
    'I am walking',
    'I was walking',
    'necesitas usar pasado, no presente'
  );
  
  assert(correction.type === 'correction', 'Should be correction type');
  assert(correction.original === 'I am walking', 'Should have original text');
  assert(correction.corrected === 'I was walking', 'Should have corrected text');
  assert(correction.reason, 'Should have reason for correction');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE EDUCATIONAL TRANSLATOR SERVICE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Educational Translator Service...\n');

test('Should translate auxiliary errors to Spanish', () => {
  const translation = educationalTranslator.translateError('auxiliary_error', {
    detected: 'am walking'
  });
  
  assert(translation.type === 'error', 'Should be error type');
  assert(translation.message.includes('presente'), 'Should explain present tense error');
  assert(translation.correction, 'Should provide correction');
});

test('Should provide connector tips', () => {
  const tip = educationalTranslator.getConnectorTip('while');
  
  assert(tip.type === 'tip', 'Should be tip type');
  assert(tip.connector === 'while', 'Should be about while connector');
  assert(tip.usage, 'Should have usage explanation');
  assert(tip.examples && tip.examples.length > 0, 'Should have examples');
});

test('Should provide time expression tips', () => {
  const tip = educationalTranslator.getTimeExpressionTip('yesterday');
  
  assert(tip.type === 'tip', 'Should be tip type');
  assert(tip.timeExpression === 'yesterday', 'Should be about yesterday');
  assert(tip.recommendedTense === 'Past Simple', 'Should recommend Past Simple');
  assert(tip.reason, 'Should have reason for recommendation');
});

test('Should generate grammar explanations', () => {
  const explanation = educationalTranslator.getGrammarExplanation('past_continuous');
  
  assert(explanation.type === 'grammar_explanation', 'Should be grammar explanation');
  assert(explanation.title.includes('Past Continuous'), 'Should be about Past Continuous');
  assert(explanation.definition, 'Should have definition');
  assert(explanation.structure, 'Should have structure');
  assert(explanation.uses && explanation.uses.length > 0, 'Should have uses');
});

test('Should explain detected structures', () => {
  const explanations = educationalTranslator.explainStructure({
    hasPastContinuous: true,
    hasPastSimple: false,
    hasConnector: true,
    connector: 'while'
  });
  
  assert(explanations.length > 0, 'Should have explanations');
  assert(explanations[0].type === 'structure_detected', 'Should detect structure');
  assert(explanations[0].message.includes('Past Continuous'), 'Should mention Past Continuous');
});

test('Should generate step-by-step corrections', () => {
  const errors = [
    {
      message: 'Error: presente en pasado',
      correction: 'I was walking',
      explanation: 'Usa was/were para pasado'
    }
  ];
  
  const stepByStep = educationalTranslator.generateStepByStepCorrection('I am walking', errors);
  
  assert(stepByStep.type === 'step_by_step_correction', 'Should be step by step correction');
  assert(stepByStep.originalSentence === 'I am walking', 'Should have original sentence');
  assert(stepByStep.steps.length > 0, 'Should have correction steps');
  assert(stepByStep.summary, 'Should have summary');
});

test('Should generate motivational feedback', () => {
  const userProgress = {
    correctSentences: 8,
    totalAttempts: 10,
    improvementAreas: ['auxiliary_verbs']
  };
  
  const motivation = educationalTranslator.generateMotivationalFeedback(userProgress);
  
  assert(motivation.type === 'motivational', 'Should be motivational type');
  assert(motivation.message, 'Should have motivational message');
  assert(motivation.encouragement, 'Should have encouragement');
  assert(motivation.accuracy === 80, 'Should calculate accuracy correctly');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE INTEGRACIÓN
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Integration...\n');

test('Should provide complete feedback for sentence analysis', () => {
  const analysis = {
    errors: [
      { type: 'present_in_past', context: { detected: 'am walking' } }
    ],
    successes: [
      { type: 'correct_past_simple', context: { verb: 'walked' } }
    ],
    connector: 'while',
    structure: { hasContinuous: true, hasSimple: true }
  };
  
  const completeFeedback = spanishFeedback.generateCompleteFeedback(analysis);
  
  assert(completeFeedback.errors.length > 0, 'Should have error feedback');
  assert(completeFeedback.successes.length > 0, 'Should have success feedback');
  assert(completeFeedback.tips.length > 0, 'Should have tips');
});

test('Should handle missing error types gracefully', () => {
  const feedback = spanishFeedback.generateErrorFeedback('unknown_error_type');
  
  assert(feedback.type === 'error', 'Should still be error type');
  assert(feedback.message, 'Should have generic error message');
});

test('Should provide motivational messages', () => {
  const message = spanishFeedback.getMotivationalMessage();
  
  assert(typeof message === 'string', 'Should be string');
  assert(message.length > 0, 'Should not be empty');
  assert(message.includes('!') || message.includes('🌟') || message.includes('💪'), 'Should be motivational');
});

console.log('\n🎉 All Spanish Feedback tests completed!\n');