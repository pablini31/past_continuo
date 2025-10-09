// tests/contextual-guides.test.js

/**
 * ═══════════════════════════════════════════════════
 * 🧪 TESTS PARA CONTEXTUAL GUIDES SERVICE
 * ═══════════════════════════════════════════════════
 */

const { ContextualGuidesService } = require('../src/services/contextual-guides.service');

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
const guidesService = new ContextualGuidesService();

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE CONTEXTUAL GUIDES SERVICE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Contextual Guides Service...\n');

test('Should determine user level correctly', () => {
  assert(guidesService.determineUserLevel('advanced') === 'advanced', 'Should use explicit level');
  assert(guidesService.determineUserLevel(null, 3) === 'basic', 'Should determine basic level');
  assert(guidesService.determineUserLevel(null, 10) === 'intermediate', 'Should determine intermediate level');
  assert(guidesService.determineUserLevel(null, 20) === 'advanced', 'Should determine advanced level');
});

test('Should determine progress level correctly', () => {
  assert(guidesService.determineProgressLevel(2, 10) === 'beginner', 'Low accuracy should be beginner');
  assert(guidesService.determineProgressLevel(7, 10) === 'intermediate', 'Medium accuracy should be intermediate');
  assert(guidesService.determineProgressLevel(18, 20) === 'advanced', 'High accuracy should be advanced');
});

test('Should generate educational tips', () => {
  const context = {
    tenseType: 'past_continuous',
    userLevel: 'basic',
    errors: [],
    completedSentences: 3
  };

  const tips = guidesService.generateEducationalTips(context);
  
  assert(Array.isArray(tips), 'Should return array of tips');
  assert(tips.length > 0, 'Should generate at least one tip');
  assert(tips.length <= 3, 'Should not exceed maximum tips');
  assert(tips[0].title, 'Tips should have title');
  assert(tips[0].message, 'Tips should have message');
});

test('Should generate tips for different tense types', () => {
  const pastContinuousTips = guidesService.generateEducationalTips({
    tenseType: 'past_continuous',
    userLevel: 'basic'
  });

  const pastSimpleTips = guidesService.generateEducationalTips({
    tenseType: 'past_simple',
    userLevel: 'basic'
  });

  assert(pastContinuousTips.length > 0, 'Should generate past continuous tips');
  assert(pastSimpleTips.length > 0, 'Should generate past simple tips');
  assert(pastContinuousTips[0].title !== pastSimpleTips[0].title, 'Tips should be different for different tenses');
});

test('Should generate mini-lesson for errors', () => {
  const lesson = guidesService.generateMiniLesson('present_in_past', { level: 'beginner' });
  
  assert(lesson !== null, 'Should generate lesson for valid error type');
  assert(lesson.title, 'Lesson should have title');
  assert(lesson.steps, 'Lesson should have steps');
  assert(lesson.steps.length > 0, 'Lesson should have at least one step');
  assert(lesson.difficulty, 'Lesson should have difficulty level');
  assert(lesson.estimatedTime, 'Lesson should have estimated time');
});

test('Should return null for invalid error type', () => {
  const lesson = guidesService.generateMiniLesson('invalid_error_type');
  
  assert(lesson === null, 'Should return null for invalid error type');
});

test('Should generate motivational messages', () => {
  const context = {
    correctSentences: 1,
    totalAttempts: 1,
    consecutiveCorrect: 1
  };

  const motivation = guidesService.generateMotivationalMessage(context);
  
  assert(motivation.type, 'Should have message type');
  assert(motivation.message, 'Should have message text');
  assert(motivation.icon, 'Should have icon');
  assert(motivation.priority, 'Should have priority level');
});

test('Should generate achievement messages', () => {
  const firstCorrect = guidesService.generateMotivationalMessage({
    correctSentences: 1,
    totalAttempts: 1
  });

  const fiveCorrect = guidesService.generateMotivationalMessage({
    correctSentences: 5,
    totalAttempts: 6
  });

  assert(firstCorrect.type === 'achievement', 'First correct should be achievement');
  assert(fiveCorrect.type === 'achievement', 'Five correct should be achievement');
  assert(firstCorrect.priority === 'high', 'Achievements should have high priority');
});

test('Should generate contextual guide', () => {
  const analysisResult = {
    tenseType: 'past_continuous',
    errors: [{ type: 'present_in_past', message: 'Wrong auxiliary' }],
    completionPercentage: 75
  };

  const userContext = {
    level: 'intermediate',
    completedSentences: 8,
    errorHistory: { 'present_in_past': 2 }
  };

  const guide = guidesService.generateContextualGuide(analysisResult, userContext);
  
  assert(guide.tips, 'Guide should have tips');
  assert(guide.motivation, 'Guide should have motivation');
  assert(guide.nextSteps, 'Guide should have next steps');
  assert(guide.context, 'Guide should have context');
  assert(guide.timestamp, 'Guide should have timestamp');
});

test('Should identify primary error correctly', () => {
  const errors = [
    { type: 'missing_gerund' },
    { type: 'present_in_past' },
    { type: 'wrong_auxiliary' }
  ];

  const primaryError = guidesService.identifyPrimaryError(errors);
  
  assert(primaryError === 'present_in_past', 'Should prioritize present_in_past error');
});

test('Should detect recurrent errors', () => {
  const userContext = {
    errorHistory: {
      'present_in_past': 3,
      'missing_gerund': 1
    }
  };

  const isRecurrent = guidesService.isRecurrentError('present_in_past', userContext);
  const isNotRecurrent = guidesService.isRecurrentError('missing_gerund', userContext);
  
  assert(isRecurrent === true, 'Should detect recurrent error');
  assert(isNotRecurrent === false, 'Should not detect non-recurrent error');
});

test('Should calculate lesson difficulty', () => {
  const easyDifficulty = guidesService.calculateLessonDifficulty('present_in_past');
  const mediumDifficulty = guidesService.calculateLessonDifficulty('wrong_auxiliary');
  const defaultDifficulty = guidesService.calculateLessonDifficulty('unknown_error');
  
  assert(easyDifficulty === 'easy', 'Should calculate easy difficulty');
  assert(mediumDifficulty === 'medium', 'Should calculate medium difficulty');
  assert(defaultDifficulty === 'medium', 'Should default to medium difficulty');
});

test('Should generate next steps', () => {
  const analysisResult = {
    tenseType: 'past_continuous',
    errors: [{ type: 'missing_gerund' }],
    completionPercentage: 60
  };

  const userContext = {
    level: 'basic',
    completedSentences: 3
  };

  const nextSteps = guidesService.generateNextSteps(analysisResult, userContext);
  
  assert(Array.isArray(nextSteps), 'Should return array of steps');
  assert(nextSteps.length > 0, 'Should generate at least one step');
  assert(nextSteps.length <= 3, 'Should not exceed maximum steps');
  assert(nextSteps[0].type, 'Steps should have type');
  assert(nextSteps[0].title, 'Steps should have title');
  assert(nextSteps[0].description, 'Steps should have description');
  assert(nextSteps[0].priority, 'Steps should have priority');
});

test('Should update user progress', () => {
  const userId = 'test_user_123';
  const progressData = {
    isCorrect: true,
    errors: [{ type: 'missing_gerund' }]
  };

  const updatedProgress = guidesService.updateUserProgress(userId, progressData);
  
  assert(updatedProgress.totalSentences === 1, 'Should increment total sentences');
  assert(updatedProgress.correctSentences === 1, 'Should increment correct sentences');
  assert(updatedProgress.errorHistory['missing_gerund'] === 1, 'Should track error history');
  assert(updatedProgress.level, 'Should have user level');
  assert(updatedProgress.lastActivity, 'Should update last activity');
});

test('Should get user stats', () => {
  const userId = 'test_user_123';
  
  // First update some progress
  guidesService.updateUserProgress(userId, { isCorrect: false, errors: [] });
  guidesService.updateUserProgress(userId, { isCorrect: true, errors: [] });
  
  const stats = guidesService.getUserStats(userId);
  
  assert(stats.totalSentences >= 2, 'Should track total sentences');
  assert(stats.correctSentences >= 1, 'Should track correct sentences');
  assert(stats.errorHistory, 'Should have error history');
  assert(stats.level, 'Should have user level');
  assert(stats.lastActivity, 'Should have last activity timestamp');
});

test('Should handle unknown user stats', () => {
  const stats = guidesService.getUserStats('unknown_user');
  
  assert(stats.totalSentences === 0, 'Should return default stats for unknown user');
  assert(stats.correctSentences === 0, 'Should return zero correct sentences');
  assert(Object.keys(stats.errorHistory).length === 0, 'Should return empty error history');
  assert(stats.level === 'beginner', 'Should default to beginner level');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE INTEGRACIÓN
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Contextual Guides Integration...\n');

test('Should generate complete guide for beginner', () => {
  const analysisResult = {
    tenseType: 'past_continuous',
    errors: [{ type: 'present_in_past', message: 'Wrong auxiliary' }],
    completionPercentage: 50,
    criticalErrors: []
  };

  const userContext = {
    level: 'beginner',
    completedSentences: 2,
    errorHistory: {}
  };

  const guide = guidesService.generateContextualGuide(analysisResult, userContext);
  
  assert(guide.tips.length > 0, 'Should provide tips for beginner');
  assert(guide.motivation, 'Should provide motivation');
  assert(guide.nextSteps.length > 0, 'Should provide next steps');
  assert(guide.context.userLevel === 'beginner', 'Should determine correct user level');
});

test('Should generate guide with mini-lesson for recurrent error', () => {
  const analysisResult = {
    tenseType: 'past_continuous',
    errors: [{ type: 'present_in_past', message: 'Wrong auxiliary' }],
    completionPercentage: 70
  };

  const userContext = {
    level: 'intermediate',
    completedSentences: 10,
    errorHistory: { 'present_in_past': 3 } // Recurrent error
  };

  const guide = guidesService.generateContextualGuide(analysisResult, userContext);
  
  assert(guide.miniLesson !== null, 'Should provide mini-lesson for recurrent error');
  assert(guide.miniLesson.title.includes('Auxiliares'), 'Should be about auxiliaries');
  assert(guide.tips.length > 0, 'Should still provide tips');
});

test('Should handle perfect sentence', () => {
  const analysisResult = {
    tenseType: 'past_continuous',
    errors: [],
    completionPercentage: 100,
    criticalErrors: []
  };

  const userContext = {
    level: 'advanced',
    completedSentences: 25,
    errorHistory: {}
  };

  const guide = guidesService.generateContextualGuide(analysisResult, userContext);
  
  assert(guide.tips.length > 0, 'Should provide tips even for perfect sentences');
  assert(guide.motivation, 'Should provide positive motivation');
  assert(guide.miniLesson === null, 'Should not provide mini-lesson for perfect sentence');
});

console.log('\n🎉 All Contextual Guides tests completed!\n');