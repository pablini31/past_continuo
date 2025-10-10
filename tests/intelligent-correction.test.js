// tests/intelligent-correction.test.js

/**
 * ═══════════════════════════════════════════════════
 * 🧪 TESTS PARA INTELLIGENT CORRECTION SERVICE
 * ═══════════════════════════════════════════════════
 */

const { IntelligentCorrectionService } = require('../src/services/intelligent-correction.service');

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

// Instanciar servicio
const correctionService = new IntelligentCorrectionService();

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE CORRECCIÓN INTELIGENTE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Intelligent Correction Service...\n');

test('Should detect auxiliary errors (am/is/are in past)', () => {
  const corrections = correctionService.generateIntelligentCorrections('I am walking yesterday');
  
  assert(corrections.errors.length > 0, 'Should detect auxiliary error');
  assert(corrections.errors[0].type === 'wrong_auxiliary_am', 'Should identify am error');
  assert(corrections.errors[0].correction === 'was', 'Should suggest "was" correction');
  assert(corrections.correctedText.includes('was'), 'Should apply correction to text');
});

test('Should detect missing gerund errors', () => {
  const corrections = correctionService.generateIntelligentCorrections('I was walk to school');
  
  assert(corrections.errors.length > 0, 'Should detect missing gerund');
  assert(corrections.errors[0].type === 'missing_gerund', 'Should identify missing gerund');
  assert(corrections.correctedText.includes('walking'), 'Should add -ing to verb');
});

test('Should detect irregular verb errors', () => {
  const corrections = correctionService.generateIntelligentCorrections('Yesterday I goed to school');
  
  assert(corrections.errors.length > 0, 'Should detect irregular verb error');
  assert(corrections.errors[0].type === 'irregular_verb_error', 'Should identify irregular verb error');
  assert(corrections.errors[0].correction === 'went', 'Should suggest "went"');
  assert(corrections.correctedText.includes('went'), 'Should correct to "went"');
});

test('Should detect structure errors (subject-auxiliary disagreement)', () => {
  const corrections = correctionService.generateIntelligentCorrections('I were walking');
  
  assert(corrections.errors.length > 0, 'Should detect structure error');
  assert(corrections.errors[0].type === 'subject_auxiliary_disagreement', 'Should identify disagreement');
  assert(corrections.correctedText.includes('I was'), 'Should correct to "I was"');
});

test('Should detect plural auxiliary errors', () => {
  const corrections = correctionService.generateIntelligentCorrections('They was playing');
  
  assert(corrections.errors.length > 0, 'Should detect plural auxiliary error');
  assert(corrections.errors[0].type === 'plural_auxiliary_error', 'Should identify plural error');
  assert(corrections.correctedText.includes('were'), 'Should correct to "were"');
});

test('Should generate contextual suggestions for connectors', () => {
  const corrections = correctionService.generateIntelligentCorrections('While I went to school');
  
  assert(corrections.suggestions.length > 0, 'Should generate suggestions');
  const connectorSuggestion = corrections.suggestions.find(s => s.type === 'connector_tense_mismatch');
  assert(connectorSuggestion, 'Should suggest connector-tense mismatch');
  assert(connectorSuggestion.message.toLowerCase().includes('while'), 'Should mention "while" in suggestion');
});

test('Should calculate correction confidence', () => {
  const corrections = correctionService.generateIntelligentCorrections('I am walking');
  
  assert(typeof corrections.confidence === 'number', 'Should have confidence score');
  assert(corrections.confidence >= 0 && corrections.confidence <= 1, 'Confidence should be between 0 and 1');
});

test('Should apply automatic corrections with high confidence', () => {
  const originalText = 'I am walking and she is running';
  const corrections = correctionService.generateIntelligentCorrections(originalText);
  
  assert(corrections.correctionApplied === true, 'Should apply corrections');
  assert(corrections.correctedText !== originalText, 'Corrected text should be different');
  assert(corrections.correctedText.includes('was'), 'Should correct "am" to "was"');
  assert(corrections.correctedText.includes('was'), 'Should correct "is" to "was"');
});

test('Should handle multiple errors in same text', () => {
  const corrections = correctionService.generateIntelligentCorrections('I am walk and she is run yesterday');
  
  assert(corrections.errors.length >= 2, 'Should detect multiple errors');
  
  // Verificar tipos de errores detectados
  const errorTypes = corrections.errors.map(e => e.type);
  assert(errorTypes.includes('wrong_auxiliary_am'), 'Should detect "am" error');
  assert(errorTypes.includes('wrong_auxiliary_is'), 'Should detect "is" error');
});

test('Should generate style improvements', () => {
  const corrections = correctionService.generateIntelligentCorrections('I was walking and I was talking');
  
  const styleImprovement = corrections.improvements.find(i => i.type === 'style_improvement');
  assert(styleImprovement, 'Should suggest style improvement for repetitive structure');
});

test('Should suggest adding time context when missing', () => {
  const corrections = correctionService.generateIntelligentCorrections('I was walking');
  
  const contextSuggestion = corrections.improvements.find(i => i.type === 'context_enhancement');
  assert(contextSuggestion, 'Should suggest adding time context');
});

test('Should update correction statistics', () => {
  correctionService.resetStats();
  
  correctionService.generateIntelligentCorrections('I am walking');
  correctionService.generateIntelligentCorrections('She is running');
  
  const stats = correctionService.getCorrectionStats();
  
  assert(stats.totalCorrections === 2, 'Should track total corrections');
  assert(stats.successfulCorrections >= 0, 'Should track successful corrections');
  assert(stats.errorTypes['wrong_auxiliary_am'] >= 1, 'Should track error types');
  assert(typeof stats.successRate === 'number', 'Should calculate success rate');
});

test('Should handle text without errors gracefully', () => {
  const corrections = correctionService.generateIntelligentCorrections('Yesterday I went to school');
  
  assert(corrections.errors.length === 0, 'Should not detect errors in correct text');
  assert(corrections.correctedText === corrections.originalText, 'Should not change correct text');
  assert(corrections.confidence === 1.0, 'Should have high confidence for correct text');
});

test('Should provide Spanish explanations', () => {
  const corrections = correctionService.generateIntelligentCorrections('I am walking');
  
  assert(corrections.errors.length > 0, 'Should have errors to explain');
  assert(corrections.errors[0].explanation, 'Should have explanation');
  assert(typeof corrections.errors[0].explanation === 'string', 'Explanation should be string');
  assert(corrections.errors[0].explanation.length > 0, 'Explanation should not be empty');
});

test('Should categorize errors correctly', () => {
  const corrections = correctionService.generateIntelligentCorrections('I am walking and she goed home');
  
  const categories = corrections.errors.map(e => e.category);
  assert(categories.includes('auxiliary'), 'Should categorize auxiliary errors');
  assert(categories.includes('irregular_verb'), 'Should categorize irregular verb errors');
});

test('Should assign severity levels', () => {
  const corrections = correctionService.generateIntelligentCorrections('I am walking');
  
  assert(corrections.errors.length > 0, 'Should have errors');
  assert(corrections.errors[0].severity, 'Should assign severity');
  assert(['low', 'medium', 'high'].includes(corrections.errors[0].severity), 'Should use valid severity levels');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE INTEGRACIÓN
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Intelligent Correction Integration...\n');

test('Should work with complex sentences', () => {
  const complexText = 'While I am walking to school yesterday, my friend goed to the store and she is running';
  const corrections = correctionService.generateIntelligentCorrections(complexText);
  
  assert(corrections.errors.length >= 3, 'Should detect multiple errors in complex sentence');
  assert(corrections.correctionApplied, 'Should apply corrections');
  assert(corrections.correctedText !== complexText, 'Should modify complex text');
  assert(corrections.confidence > 0, 'Should have confidence score');
});

test('Should handle edge cases', () => {
  // Texto vacío
  let corrections = correctionService.generateIntelligentCorrections('');
  assert(corrections.errors.length === 0, 'Should handle empty text');
  
  // Texto muy corto
  corrections = correctionService.generateIntelligentCorrections('I');
  assert(corrections.errors.length === 0, 'Should handle very short text');
  
  // Solo espacios
  corrections = correctionService.generateIntelligentCorrections('   ');
  assert(corrections.errors.length === 0, 'Should handle whitespace-only text');
});

test('Should maintain original text structure', () => {
  const originalText = 'Yesterday, I am walking to school.';
  const corrections = correctionService.generateIntelligentCorrections(originalText);
  
  assert(corrections.correctedText.includes('Yesterday,'), 'Should preserve punctuation');
  assert(corrections.correctedText.endsWith('.'), 'Should preserve sentence ending');
  assert(corrections.correctedText.includes('school'), 'Should preserve original words');
});

console.log('\n🎉 All Intelligent Correction tests completed!\n');