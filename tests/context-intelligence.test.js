// tests/context-intelligence.test.js

/**
 * ═══════════════════════════════════════════════════
 * 🧪 TESTS PARA CONTEXT INTELLIGENCE SERVICE
 * ═══════════════════════════════════════════════════
 */

const { ContextIntelligenceService } = require('../src/services/context-intelligence.service');
const { TemporalAnalysisService } = require('../src/services/temporal-analysis.service');
const { SmartRecommendationsService } = require('../src/services/smart-recommendations.service');

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
const contextIntelligence = new ContextIntelligenceService();
const temporalAnalysis = new TemporalAnalysisService();
const smartRecommendations = new SmartRecommendationsService();

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE CONTEXT INTELLIGENCE SERVICE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Context Intelligence Service...\n');

test('Should analyze "while" connector correctly', () => {
  const analysis = contextIntelligence.analyzeContext('While I was studying, she was cooking');
  
  assert(analysis.primaryRecommendation === 'past_continuous', 'Should recommend Past Continuous for while');
  assert(analysis.confidence > 0.8, 'Should have high confidence for while');
  assert(analysis.contextFactors.some(f => f.type === 'connector' && f.value === 'while'), 'Should detect while connector');
});

test('Should analyze "when" connector with interruption', () => {
  const analysis = contextIntelligence.analyzeContext('I was sleeping when the phone rang');
  
  assert(analysis.contextFactors.some(f => f.type === 'connector' && f.value === 'when'), 'Should detect when connector');
  assert(analysis.contextFactors.some(f => f.type === 'interruption_pattern'), 'Should detect interruption pattern');
});

test('Should analyze temporal markers correctly', () => {
  const analysis1 = contextIntelligence.analyzeContext('Yesterday I walked to school');
  const analysis2 = contextIntelligence.analyzeContext('I was working all day');
  
  assert(analysis1.contextFactors.some(f => f.type === 'time_marker' && f.recommendation === 'past_simple'), 'Should recommend Past Simple for yesterday');
  assert(analysis2.contextFactors.some(f => f.type === 'time_marker' && f.recommendation === 'past_continuous'), 'Should recommend Past Continuous for all day');
});

test('Should detect verb types correctly', () => {
  const analysis1 = contextIntelligence.analyzeContext('I was waiting for the bus');
  const analysis2 = contextIntelligence.analyzeContext('She arrived at the station');
  
  assert(analysis1.contextFactors.some(f => f.type === 'verb_type' && f.recommendation === 'past_continuous'), 'Should recommend Past Continuous for waiting');
  assert(analysis2.contextFactors.some(f => f.type === 'verb_type' && f.recommendation === 'past_simple'), 'Should recommend Past Simple for arrived');
});

test('Should provide reasoning for recommendations', () => {
  const analysis = contextIntelligence.analyzeContext('While I was studying yesterday');
  
  assert(analysis.reasoning.length > 0, 'Should provide reasoning');
  assert(analysis.reasoning.some(r => r.factor.includes('while')), 'Should include while in reasoning');
  assert(analysis.reasoning.some(r => r.factor.includes('yesterday')), 'Should include yesterday in reasoning');
});

test('Should generate contextual tips', () => {
  const analysis = contextIntelligence.analyzeContext('While I study, she cooks');
  
  assert(analysis.tips.length > 0, 'Should generate tips');
  assert(analysis.tips.some(t => t.type === 'connector_usage'), 'Should include connector usage tips');
});

test('Should handle mixed recommendations', () => {
  const analysis = contextIntelligence.analyzeContext('I was walking while she went home');
  
  // Should detect conflicting signals and adjust confidence
  assert(analysis.confidence < 1.0, 'Should have reduced confidence for mixed signals');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE TEMPORAL ANALYSIS SERVICE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Temporal Analysis Service...\n');

test('Should detect specific time moments', () => {
  const analysis = temporalAnalysis.analyzeTemporalExpressions('Yesterday at 3 o\'clock I went home');
  
  assert(analysis.specificMoments.length > 0, 'Should detect specific moments');
  assert(analysis.specificMoments.some(m => m.expression === 'yesterday'), 'Should detect yesterday');
  assert(analysis.overallRecommendation === 'past_simple', 'Should recommend Past Simple');
});

test('Should detect duration expressions', () => {
  const analysis = temporalAnalysis.analyzeTemporalExpressions('I was working all day constantly');
  
  assert(analysis.durationExpressions.length > 0, 'Should detect duration expressions');
  assert(analysis.durationExpressions.some(d => d.expression === 'all day'), 'Should detect all day');
  assert(analysis.durationExpressions.some(d => d.expression === 'constantly'), 'Should detect constantly');
  assert(analysis.overallRecommendation === 'past_continuous', 'Should recommend Past Continuous');
});

test('Should detect sudden actions', () => {
  const analysis = temporalAnalysis.analyzeTemporalExpressions('Suddenly the door opened immediately');
  
  assert(analysis.suddenActions.length > 0, 'Should detect sudden actions');
  assert(analysis.suddenActions.some(s => s.expression === 'suddenly'), 'Should detect suddenly');
  assert(analysis.suddenActions.some(s => s.expression === 'immediately'), 'Should detect immediately');
  assert(analysis.overallRecommendation === 'past_simple', 'Should recommend Past Simple');
});

test('Should calculate confidence correctly', () => {
  const analysis1 = temporalAnalysis.analyzeTemporalExpressions('Yesterday I walked');
  const analysis2 = temporalAnalysis.analyzeTemporalExpressions('I was working');
  
  assert(analysis1.confidence > 0, 'Should have confidence for yesterday');
  assert(analysis2.confidence === 0, 'Should have no confidence without temporal markers');
});

test('Should detect time patterns', () => {
  const patterns = temporalAnalysis.detectTimePatterns('At 3:30 PM on January 15th in 2020');
  
  assert(patterns.clockTime, 'Should detect clock time');
  assert(patterns.datePattern, 'Should detect date pattern');
  assert(patterns.yearPattern, 'Should detect year pattern');
});

test('Should analyze event sequences', () => {
  const sequence = temporalAnalysis.analyzeEventSequence('First I studied, then I played, finally I slept');
  
  assert(sequence.length > 0, 'Should detect sequence markers');
  assert(sequence.some(s => s.marker === 'first'), 'Should detect first');
  assert(sequence.some(s => s.marker === 'then'), 'Should detect then');
  assert(sequence.some(s => s.marker === 'finally'), 'Should detect finally');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE SMART RECOMMENDATIONS SERVICE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Smart Recommendations Service...\n');

test('Should generate comprehensive smart recommendations', () => {
  const recommendations = smartRecommendations.generateSmartRecommendations('While I was studying yesterday');
  
  assert(recommendations.primaryRecommendation, 'Should have primary recommendation');
  assert(recommendations.confidence > 0, 'Should have confidence score');
  assert(recommendations.contextAnalysis, 'Should include context analysis');
  assert(recommendations.temporalAnalysis, 'Should include temporal analysis');
  assert(recommendations.smartTips.length > 0, 'Should generate smart tips');
});

test('Should combine analyses correctly', () => {
  const recommendations = smartRecommendations.generateSmartRecommendations('Yesterday I was working all day');
  
  // Should handle conflicting temporal signals
  assert(recommendations.reasoning.length > 0, 'Should provide combined reasoning');
  assert(recommendations.confidence <= 1.0, 'Should have reasonable confidence');
});

test('Should generate smart tips with icons', () => {
  const recommendations = smartRecommendations.generateSmartRecommendations('While I was cooking');
  
  assert(recommendations.smartTips.length > 0, 'Should generate tips');
  assert(recommendations.smartTips.some(t => t.icon), 'Should include icons in tips');
  assert(recommendations.smartTips.some(t => t.title), 'Should include titles in tips');
});

test('Should generate Spanish explanations', () => {
  const recommendations = smartRecommendations.generateSmartRecommendations('Yesterday I walked');
  
  assert(recommendations.spanishExplanations.length > 0, 'Should generate Spanish explanations');
  assert(recommendations.spanishExplanations.some(e => e.type === 'main_explanation'), 'Should include main explanation');
});

test('Should generate contextual examples', () => {
  const recommendations = smartRecommendations.generateSmartRecommendations('While I was studying, when the phone rang');
  
  assert(recommendations.examples.length > 0, 'Should generate examples');
  assert(recommendations.examples.some(e => e.type === 'connector_example'), 'Should include connector examples');
});

test('Should analyze specific connectors', () => {
  const whileAnalysis = smartRecommendations.analyzeConnectorUsage('while', 'While I was reading');
  const whenAnalysis = smartRecommendations.analyzeConnectorUsage('when', 'When the phone rang');
  
  assert(whileAnalysis.recommendation === 'past_continuous', 'Should recommend Past Continuous for while');
  assert(whileAnalysis.confidence > 0.8, 'Should have high confidence for while');
  assert(whenAnalysis.recommendation, 'Should have recommendation for when');
  assert(whenAnalysis.examples.length > 0, 'Should provide examples for when');
});

test('Should generate corrective feedback', () => {
  const feedback = smartRecommendations.generateCorrectiveFeedback(
    'I am walking yesterday',
    [{ type: 'present_in_past', detected: 'am', suggestion: 'was' }],
    {}
  );
  
  assert(feedback.corrections.length > 0, 'Should generate corrections');
  assert(feedback.corrections[0].original === 'am', 'Should identify original error');
  assert(feedback.corrections[0].corrected === 'was', 'Should provide correction');
  assert(feedback.corrections[0].explanation, 'Should provide explanation');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE INTEGRACIÓN
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Integration...\n');

test('Should handle complex sentences with multiple factors', () => {
  const recommendations = smartRecommendations.generateSmartRecommendations(
    'Yesterday while I was studying all day, suddenly the phone rang'
  );
  
  assert(recommendations.contextAnalysis.contextFactors.length > 0, 'Should detect multiple context factors');
  assert(recommendations.temporalAnalysis.reasoning.length > 0, 'Should detect temporal factors');
  assert(recommendations.primaryRecommendation, 'Should provide final recommendation');
});

test('Should provide consistent recommendations across services', () => {
  const text = 'While I was cooking dinner';
  
  const contextAnalysis = contextIntelligence.analyzeContext(text);
  const smartRecs = smartRecommendations.generateSmartRecommendations(text);
  
  assert(contextAnalysis.primaryRecommendation === smartRecs.primaryRecommendation, 
    'Should have consistent recommendations');
});

test('Should handle edge cases gracefully', () => {
  const emptyAnalysis = smartRecommendations.generateSmartRecommendations('');
  const shortAnalysis = smartRecommendations.generateSmartRecommendations('I go');
  
  assert(emptyAnalysis.primaryRecommendation === 'either', 'Should handle empty text');
  assert(shortAnalysis.confidence >= 0, 'Should handle short text');
});

test('Should provide educational value', () => {
  const recommendations = smartRecommendations.generateSmartRecommendations('While I study, she cooks');
  
  assert(recommendations.smartTips.some(t => t.explanation), 'Should provide educational explanations');
  assert(recommendations.examples.some(e => e.explanation), 'Should explain examples');
  assert(recommendations.spanishExplanations.length > 0, 'Should provide Spanish explanations');
});

console.log('\n🎉 All Context Intelligence tests completed!\n');