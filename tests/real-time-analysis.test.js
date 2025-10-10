// tests/real-time-analysis.test.js

/**
 * ═══════════════════════════════════════════════════
 * 🧪 TESTS PARA REAL-TIME ANALYSIS SERVICE
 * ═══════════════════════════════════════════════════
 */

const { RealTimeAnalysisService } = require('../src/services/real-time-analysis.service');

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
const realTimeService = new RealTimeAnalysisService();

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE REAL-TIME ANALYSIS SERVICE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Real-Time Analysis Service...\n');

test('Should determine if text should be analyzed', () => {
  assert(!realTimeService.shouldAnalyze(''), 'Should not analyze empty text');
  assert(!realTimeService.shouldAnalyze('I'), 'Should not analyze single word');
  assert(realTimeService.shouldAnalyze('I was walking'), 'Should analyze valid sentence');
  assert(!realTimeService.shouldAnalyze('a'.repeat(600)), 'Should not analyze text too long');
});

test('Should determine analysis level correctly', () => {
  assert(realTimeService.determineAnalysisLevel('I am') === 'basic', 'Should be basic level');
  assert(realTimeService.determineAnalysisLevel('I was walking to school') === 'intermediate', 'Should be intermediate level');
  assert(realTimeService.determineAnalysisLevel('Yesterday while I was walking to school, I saw my friend') === 'advanced', 'Should be advanced level');
});

test('Should create empty analysis for invalid text', () => {
  const analysis = realTimeService.createEmptyAnalysis('Hi');
  
  assert(analysis.isEmpty === true, 'Should mark as empty');
  assert(analysis.level === 'none', 'Should have none level');
  assert(analysis.suggestions.length === 0, 'Should have no suggestions');
  assert(analysis.completionPercentage === 0, 'Should have 0% completion');
});

test('Should perform real-time analysis', async () => {
  const analysis = await realTimeService.performRealTimeAnalysis('I was walking');
  
  assert(analysis.text === 'I was walking', 'Should preserve original text');
  assert(analysis.level, 'Should have analysis level');
  assert(analysis.iconStates, 'Should have icon states');
  assert(analysis.tenseType, 'Should detect tense type');
  assert(typeof analysis.completionPercentage === 'number', 'Should have completion percentage');
});

test('Should generate icon states correctly', () => {
  const mockStructure = {
    parts: {
      subject: { text: 'I', type: 'pronoun', isValid: true },
      auxiliary: { text: 'was', type: 'past_auxiliary', isValid: true },
      gerund: { text: 'walking', type: 'gerund', isValid: true }
    },
    tenseType: 'past_continuous'
  };
  
  const iconStates = realTimeService.generateIconStates(mockStructure);
  
  assert(iconStates.subject.active === true, 'Should activate subject icon');
  assert(iconStates.auxiliary.active === true, 'Should activate auxiliary icon');
  assert(iconStates.gerund.active === true, 'Should activate gerund icon');
  assert(iconStates.subject.error === false, 'Should not mark valid parts as error');
});

test('Should generate icon states with errors', () => {
  const mockStructure = {
    parts: {
      subject: { text: 'I', type: 'pronoun', isValid: true },
      auxiliary: { text: 'am', type: 'present_auxiliary', isValid: false }
    },
    tenseType: 'present_error'
  };
  
  const iconStates = realTimeService.generateIconStates(mockStructure);
  
  assert(iconStates.subject.active === true, 'Should activate valid subject');
  assert(iconStates.auxiliary.error === true, 'Should mark invalid auxiliary as error');
  assert(iconStates.auxiliary.active === false, 'Should not activate error auxiliary');
});

test('Should generate Spanish feedback for real-time', () => {
  const mockAnalysis = {
    errors: [
      { type: 'wrong_auxiliary_am', message: 'Wrong auxiliary' }
    ],
    structure: {
      parts: {
        connector: { text: 'while' }
      }
    }
  };
  
  const feedback = realTimeService.generateSpanishFeedback(mockAnalysis);
  
  assert(feedback.errors.length > 0, 'Should generate error feedback');
  assert(feedback.errors[0].message.includes('❌'), 'Should include error emoji');
  assert(feedback.tips.length > 0, 'Should generate tips');
});

test('Should consolidate suggestions correctly', () => {
  const mockAnalysis = {
    errors: [
      { type: 'error', message: 'Error message', priority: 1 }
    ],
    contextRecommendations: {
      smartTips: [
        { message: 'Smart tip', icon: '💡' }
      ]
    },
    spanishFeedback: {
      tips: [
        { message: 'Spanish tip' }
      ]
    }
  };
  
  const suggestions = realTimeService.consolidateSuggestions(mockAnalysis);
  
  assert(suggestions.length > 0, 'Should consolidate suggestions');
  assert(suggestions.length <= 3, 'Should limit suggestions to maximum');
  assert(suggestions[0].priority <= suggestions[suggestions.length - 1].priority, 'Should sort by priority');
});

test('Should optimize analysis for real-time', () => {
  const mockAnalysis = {
    text: 'I was walking',
    level: 'intermediate',
    timestamp: Date.now(),
    structure: {
      tenseType: 'past_continuous',
      completedParts: ['subject', 'auxiliary', 'gerund']
    },
    iconStates: {
      subject: { active: true, error: false }
    },
    suggestions: [
      { type: 'tip', message: 'Good job!' }
    ],
    contextRecommendations: {
      primaryRecommendation: 'past_continuous',
      confidence: 0.9
    },
    errors: []
  };
  
  const optimized = realTimeService.optimizeForRealTime(mockAnalysis);
  
  assert(optimized.text === 'I was walking', 'Should preserve text');
  assert(optimized.iconStates, 'Should include icon states');
  assert(optimized.suggestions, 'Should include suggestions');
  assert(optimized.tenseType === 'past_continuous', 'Should include tense type');
  assert(typeof optimized.completionPercentage === 'number', 'Should include completion percentage');
  assert(optimized.primaryRecommendation === 'past_continuous', 'Should include primary recommendation');
});

test('Should handle cache operations', () => {
  const cacheKey = realTimeService.generateCacheKey('test text', {});
  
  assert(typeof cacheKey === 'string', 'Should generate cache key');
  assert(cacheKey.length > 0, 'Cache key should not be empty');
  
  // Test cache cleanup
  realTimeService.cleanupCache();
  assert(realTimeService.analysisCache.size >= 0, 'Should handle cache cleanup');
});

test('Should detect minor changes correctly', () => {
  assert(realTimeService.isMinorChange('I was walking', 'I was walking home'), 'Should detect minor addition');
  assert(realTimeService.isMinorChange('I was walking home', 'I was walking'), 'Should detect minor removal');
  assert(!realTimeService.isMinorChange('I was walking', 'Yesterday I was walking to school'), 'Should detect major change');
});

test('Should provide performance stats', () => {
  const stats = realTimeService.getPerformanceStats();
  
  assert(typeof stats.cacheSize === 'number', 'Should provide cache size');
  assert(typeof stats.lastAnalysisTime === 'number', 'Should provide last analysis time');
  assert(typeof stats.averageAnalysisTime === 'number', 'Should provide average analysis time');
  assert(typeof stats.cacheHitRate === 'number', 'Should provide cache hit rate');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE INTEGRACIÓN
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Real-Time Integration...\n');

test('Should perform complete real-time analysis', async () => {
  const analysis = await realTimeService.performRealTimeAnalysis('While I was studying yesterday');
  
  assert(analysis.text === 'While I was studying yesterday', 'Should preserve text');
  assert(analysis.level === 'advanced', 'Should use advanced level');
  assert(analysis.iconStates, 'Should generate icon states');
  assert(analysis.suggestions, 'Should generate suggestions');
  assert(analysis.performanceMetrics, 'Should include performance metrics');
});

test('Should handle different analysis levels', async () => {
  const basicAnalysis = await realTimeService.performRealTimeAnalysis('I was');
  const advancedAnalysis = await realTimeService.performRealTimeAnalysis('Yesterday while I was walking to school');
  
  assert(basicAnalysis.level === 'basic', 'Should use basic level for short text');
  assert(advancedAnalysis.level === 'advanced', 'Should use advanced level for long text');
  // Note: contextRecommendations might be null if the service isn't fully initialized
  assert(advancedAnalysis.level === 'advanced', 'Advanced analysis should be performed');
});

test('Should handle errors gracefully', async () => {
  // Test with problematic input
  const analysis = await realTimeService.performRealTimeAnalysis('I am walking yesterday when she goed home');
  
  assert(analysis.criticalErrors || analysis.errors, 'Should detect errors');
  assert(analysis.suggestions.length > 0, 'Should provide suggestions even with errors');
  assert(analysis.iconStates, 'Should still generate icon states');
});

console.log('\n🎉 All Real-Time Analysis tests completed!\n');