// tests/grammar-structure.test.js

/**
 * ═══════════════════════════════════════════════════
 * 🧪 TESTS PARA GRAMMAR STRUCTURE SERVICE
 * ═══════════════════════════════════════════════════
 */

const { GrammarStructureService } = require('../src/services/grammar-structure.service');
const { ErrorDetectionService } = require('../src/services/error-detection.service');

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
const grammarAnalyzer = new GrammarStructureService();
const errorDetector = new ErrorDetectionService();

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE GRAMMAR STRUCTURE SERVICE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Grammar Structure Service...\n');

test('Should detect subject in simple sentence', () => {
  const structure = grammarAnalyzer.analyzeStructure('I was walking');
  
  assert(structure.parts.subject, 'Should detect subject');
  assert(structure.parts.subject.text === 'i', 'Should detect "I" as subject');
  assert(structure.parts.subject.type === 'pronoun', 'Should identify as pronoun');
  assert(structure.completedParts.includes('subject'), 'Should mark subject as completed');
});

test('Should detect auxiliary verbs correctly', () => {
  const structure1 = grammarAnalyzer.analyzeStructure('I was walking');
  const structure2 = grammarAnalyzer.analyzeStructure('They were running');
  
  assert(structure1.parts.auxiliary.text === 'was', 'Should detect "was"');
  assert(structure1.parts.auxiliary.isValid, 'Should mark "was" as valid');
  assert(structure2.parts.auxiliary.text === 'were', 'Should detect "were"');
  assert(structure2.parts.auxiliary.isValid, 'Should mark "were" as valid');
});

test('Should detect present auxiliary as error', () => {
  const structure = grammarAnalyzer.analyzeStructure('I am walking');
  
  assert(structure.parts.auxiliary.text === 'am', 'Should detect "am"');
  assert(!structure.parts.auxiliary.isValid, 'Should mark "am" as invalid');
  assert(structure.parts.auxiliary.error === 'present_in_past', 'Should identify error type');
  assert(structure.errors.length > 0, 'Should have errors');
});

test('Should detect gerunds correctly', () => {
  const structure = grammarAnalyzer.analyzeStructure('I was walking to school');
  
  assert(structure.parts.gerund, 'Should detect gerund');
  assert(structure.parts.gerund.text === 'walking', 'Should detect "walking"');
  assert(structure.parts.gerund.baseVerb === 'walk', 'Should identify base verb');
  assert(structure.completedParts.includes('gerund'), 'Should mark gerund as completed');
});

test('Should detect past simple verbs', () => {
  const structure1 = grammarAnalyzer.analyzeStructure('I walked to school');
  const structure2 = grammarAnalyzer.analyzeStructure('She went home');
  
  assert(structure1.parts.mainVerb.text === 'walked', 'Should detect regular past verb');
  assert(structure1.parts.mainVerb.type === 'regular_past', 'Should identify as regular past');
  assert(structure2.parts.mainVerb.text === 'went', 'Should detect irregular past verb');
  assert(structure2.parts.mainVerb.type === 'irregular_past', 'Should identify as irregular past');
});

test('Should determine tense type correctly', () => {
  const structure1 = grammarAnalyzer.analyzeStructure('I was walking');
  const structure2 = grammarAnalyzer.analyzeStructure('I walked');
  const structure3 = grammarAnalyzer.analyzeStructure('I am walking');
  
  assert(structure1.tenseType === 'past_continuous', 'Should identify Past Continuous');
  assert(structure2.tenseType === 'past_simple', 'Should identify Past Simple');
  assert(structure3.tenseType === 'present_error', 'Should identify present error');
});

test('Should detect connectors', () => {
  const structure1 = grammarAnalyzer.analyzeStructure('I was walking while she was cooking');
  const structure2 = grammarAnalyzer.analyzeStructure('When I arrived, she was sleeping');
  
  assert(structure1.parts.connector.text === 'while', 'Should detect "while"');
  assert(structure2.parts.connector.text === 'when', 'Should detect "when"');
});

test('Should detect time markers', () => {
  const structure1 = grammarAnalyzer.analyzeStructure('Yesterday I walked to school');
  const structure2 = grammarAnalyzer.analyzeStructure('I was working all day');
  
  assert(structure1.parts.timeMarker.text === 'yesterday', 'Should detect "yesterday"');
  assert(structure1.parts.timeMarker.suggestedTense === 'past_simple', 'Should suggest Past Simple');
  assert(structure2.parts.timeMarker.text === 'all day', 'Should detect "all day"');
  assert(structure2.parts.timeMarker.suggestedTense === 'past_continuous', 'Should suggest Past Continuous');
});

test('Should calculate completion percentage', () => {
  const structure1 = grammarAnalyzer.analyzeStructure('I was walking');
  const structure2 = grammarAnalyzer.analyzeStructure('I was');
  
  const completion1 = grammarAnalyzer.calculateCompletionPercentage(structure1);
  const completion2 = grammarAnalyzer.calculateCompletionPercentage(structure2);
  
  assert(completion1 === 100, 'Complete sentence should be 100%');
  assert(completion2 < 100, 'Incomplete sentence should be less than 100%');
});

test('Should generate recommendations', () => {
  const structure = grammarAnalyzer.analyzeStructure('I am walking');
  const recommendations = grammarAnalyzer.generateRecommendations(structure);
  
  assert(recommendations.length > 0, 'Should have recommendations');
  assert(recommendations[0].type === 'correction', 'Should suggest correction');
  assert(recommendations[0].message.includes('am'), 'Should mention the error');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE ERROR DETECTION SERVICE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Error Detection Service...\n');

test('Should detect auxiliary errors', () => {
  const result1 = errorDetector.detectAllErrors('I am walking');
  const result2 = errorDetector.detectAllErrors('They was running');
  
  assert(result1.hasErrors, 'Should detect "am" error');
  assert(result1.errors[0].type === 'wrong_auxiliary_am', 'Should identify auxiliary error type');
  assert(result2.hasErrors, 'Should detect "was" with "they" error');
  assert(result2.correctedSentence.includes('were'), 'Should correct to "were"');
});

test('Should detect missing gerund errors', () => {
  const result = errorDetector.detectAllErrors('I was walk to school');
  
  assert(result.hasErrors, 'Should detect missing gerund');
  assert(result.errors[0].type === 'missing_gerund', 'Should identify gerund error');
  assert(result.correctedSentence.includes('walking'), 'Should add -ing');
});

test('Should detect irregular verb errors', () => {
  const result1 = errorDetector.detectAllErrors('I goed to school');
  const result2 = errorDetector.detectAllErrors('She eated pizza');
  
  assert(result1.hasErrors, 'Should detect "goed" error');
  assert(result1.correctedSentence.includes('went'), 'Should correct to "went"');
  assert(result2.hasErrors, 'Should detect "eated" error');
  assert(result2.correctedSentence.includes('ate'), 'Should correct to "ate"');
});

test('Should detect tense mixing errors', () => {
  const result = errorDetector.detectAllErrors('I was walked');
  
  assert(result.hasErrors, 'Should detect tense mixing');
  assert(result.errors[0].type === 'continuous_simple_mix', 'Should identify mixing error');
  assert(result.correctedSentence.includes('walking'), 'Should correct to gerund');
});

test('Should analyze error severity', () => {
  const errors = [
    { type: 'wrong_auxiliary_am' },
    { type: 'missing_gerund' },
    { type: 'spelling_errors' }
  ];
  
  const severity = errorDetector.analyzeErrorSeverity(errors);
  
  assert(severity.critical === 1, 'Should identify critical errors');
  assert(severity.high === 1, 'Should identify high severity errors');
  assert(severity.low === 1, 'Should identify low severity errors');
  assert(severity.total === 3, 'Should count total errors');
});

test('Should generate error report', () => {
  const report = errorDetector.generateErrorReport('I am walking and goed home');
  
  assert(report.hasErrors, 'Should detect errors');
  assert(report.errorCount > 0, 'Should count errors');
  assert(report.correctedSentence, 'Should provide corrected sentence');
  assert(report.overallFeedback, 'Should provide overall feedback');
  assert(report.recommendations.length > 0, 'Should provide recommendations');
});

test('Should provide error explanations', () => {
  const explanation = errorDetector.getErrorExplanation('wrong_auxiliary_am');
  const example = errorDetector.getErrorExample('wrong_auxiliary_am');
  
  assert(typeof explanation === 'string', 'Should provide explanation');
  assert(explanation.length > 0, 'Explanation should not be empty');
  assert(example.wrong && example.correct, 'Should provide example');
});

test('Should generate recommendations based on errors', () => {
  const errors = [
    { type: 'wrong_auxiliary_am' },
    { type: 'missing_gerund' }
  ];
  
  const recommendations = errorDetector.generateRecommendations(errors);
  
  assert(recommendations.length > 0, 'Should provide recommendations');
  assert(recommendations.some(r => r.type === 'study_tip'), 'Should include study tips');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE INTEGRACIÓN
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Integration...\n');

test('Should analyze complex sentences', () => {
  const sentence = 'While I am walking, she goed to the store';
  const structure = grammarAnalyzer.analyzeStructure(sentence);
  const errors = errorDetector.detectAllErrors(sentence);
  
  assert(structure.parts.connector.text === 'while', 'Should detect connector');
  assert(errors.hasErrors, 'Should detect multiple errors');
  assert(errors.errors.length >= 2, 'Should find multiple error types');
});

test('Should handle perfect sentences', () => {
  const sentence = 'I was walking while she was cooking dinner';
  const structure = grammarAnalyzer.analyzeStructure(sentence);
  const errors = errorDetector.detectAllErrors(sentence);
  
  assert(structure.isValid, 'Should validate correct structure');
  assert(!errors.hasErrors, 'Should not find errors in correct sentence');
  assert(structure.completedParts.length > 0, 'Should identify completed parts');
});

test('Should provide comprehensive analysis', () => {
  const sentence = 'Yesterday I am walking when she goed home';
  const structure = grammarAnalyzer.analyzeStructure(sentence);
  const errorReport = errorDetector.generateErrorReport(sentence);
  
  assert(structure.parts.timeMarker, 'Should detect time marker');
  assert(structure.errors.length > 0, 'Should detect structure errors');
  assert(errorReport.hasErrors, 'Should detect pattern errors');
  assert(errorReport.severity.critical > 0, 'Should identify critical errors');
});

console.log('\n🎉 All Grammar Structure tests completed!\n');