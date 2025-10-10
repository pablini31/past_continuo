// tests/validator.test.js

/**
 * ═══════════════════════════════════════════════════
 * 🧪 TESTS PARA VALIDATOR
 * ═══════════════════════════════════════════════════
 */

const {
  validatePastContinuous,
  validatePastSimple,
  detectConnector,
  sanitizeSentence,
  validateSentenceWithRecommendation
} = require('../src/utils/validator');

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

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE PAST CONTINUOUS
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Past Continuous Validation...\n');

test('Should detect "was walking"', () => {
  assert(validatePastContinuous('I was walking'), 'Should detect was + verb-ing');
});

test('Should detect "were studying"', () => {
  assert(validatePastContinuous('They were studying'), 'Should detect were + verb-ing');
});

test('Should NOT detect present continuous', () => {
  assert(!validatePastContinuous('I am walking'), 'Should not detect present continuous');
});

test('Should NOT detect simple past', () => {
  assert(!validatePastContinuous('I walked'), 'Should not detect simple past');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE PAST SIMPLE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Past Simple Validation...\n');

test('Should detect regular past verbs', () => {
  assert(validatePastSimple('I walked to school'), 'Should detect -ed verbs');
});

test('Should detect irregular past verbs', () => {
  assert(validatePastSimple('I went home'), 'Should detect irregular verbs');
});

test('Should detect "was/were"', () => {
  assert(validatePastSimple('I was happy'), 'Should detect was/were');
});

test('Should NOT detect present tense', () => {
  assert(!validatePastSimple('I walk to school'), 'Should not detect present tense');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE CONNECTOR DETECTION
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Connector Detection...\n');

test('Should detect "while"', () => {
  assert(detectConnector('I was reading while she cooked') === 'while', 'Should detect while');
});

test('Should detect "when"', () => {
  assert(detectConnector('I was sleeping when he called') === 'when', 'Should detect when');
});

test('Should detect "as"', () => {
  assert(detectConnector('I saw him as I walked') === 'as', 'Should detect as');
});

test('Should return null for no connector', () => {
  assert(detectConnector('I walked to school') === null, 'Should return null');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE SENTENCE SANITIZATION
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Sentence Sanitization...\n');

test('Should trim whitespace', () => {
  assert(sanitizeSentence('  hello world  ') === 'hello world', 'Should trim spaces');
});

test('Should normalize multiple spaces', () => {
  assert(sanitizeSentence('hello    world') === 'hello world', 'Should normalize spaces');
});

test('Should remove special characters', () => {
  const result = sanitizeSentence('hello@#$%world');
  assert(!result.includes('@'), 'Should remove special chars');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE SENTENCE VALIDATION WITH RECOMMENDATION
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Complete Sentence Validation...\n');

test('Should validate correct sentence with while', () => {
  const result = validateSentenceWithRecommendation(
    'I was reading',
    'she was cooking',
    'while'
  );
  assert(result.overallValid, 'Should validate correct past continuous with while');
  assert(result.context.recommendation === 'continuous', 'Should recommend continuous for while');
});

test('Should validate mixed tenses with when', () => {
  const result = validateSentenceWithRecommendation(
    'I was sleeping',
    'the phone rang',
    'when'
  );
  assert(result.overallValid, 'Should validate mixed tenses with when');
});

test('Should detect invalid sentences', () => {
  const result = validateSentenceWithRecommendation(
    'I am reading',
    'she cooks',
    'while'
  );
  assert(!result.overallValid, 'Should detect present tense as invalid');
});

console.log('\n🎉 All tests completed!\n');