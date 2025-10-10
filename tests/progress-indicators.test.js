// tests/progress-indicators.test.js

/**
 * ═══════════════════════════════════════════════════
 * 🧪 TESTS PARA PROGRESS INDICATORS SERVICE
 * ═══════════════════════════════════════════════════
 */

const { ProgressIndicatorsService } = require('../src/services/progress-indicators.service');

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
const progressService = new ProgressIndicatorsService();

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE PROGRESS INDICATORS SERVICE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Progress Indicators Service...\n');

test('Should generate grammar progress bar', () => {
  const analysisResult = {
    tenseType: 'past_continuous',
    iconStates: {
      subject: { active: true, error: false },
      auxiliary: { active: true, error: false },
      gerund: { active: false, error: false }
    },
    completionPercentage: 67
  };

  const progressBar = progressService.generateGrammarProgressBar(analysisResult);
  
  assert(progressBar.type === 'grammar_structure', 'Should have correct type');
  assert(progressBar.tenseType === 'past_continuous', 'Should preserve tense type');
  assert(progressBar.percentage === 67, 'Should preserve completion percentage');
  assert(progressBar.parts.length > 0, 'Should have grammar parts');
  assert(progressBar.color, 'Should have progress color');
  assert(progressBar.message, 'Should have progress message');
});

test('Should get required parts for different tenses', () => {
  const pastContinuousParts = progressService.getRequiredParts('past_continuous');
  const pastSimpleParts = progressService.getRequiredParts('past_simple');
  const unknownParts = progressService.getRequiredParts('unknown');

  assert(pastContinuousParts.includes('subject'), 'Past continuous should require subject');
  assert(pastContinuousParts.includes('auxiliary'), 'Past continuous should require auxiliary');
  assert(pastContinuousParts.includes('gerund'), 'Past continuous should require gerund');
  
  assert(pastSimpleParts.includes('subject'), 'Past simple should require subject');
  assert(pastSimpleParts.includes('main_verb'), 'Past simple should require main verb');
  
  assert(unknownParts.length > 0, 'Unknown tense should have default parts');
});

test('Should get completed parts from icon states', () => {
  const iconStates = {
    subject: { active: true, error: false },
    auxiliary: { active: false, error: true },
    gerund: { active: true, error: false }
  };

  const completedParts = progressService.getCompletedParts(iconStates);
  
  assert(completedParts.includes('subject'), 'Should include active subject');
  assert(completedParts.includes('gerund'), 'Should include active gerund');
  assert(!completedParts.includes('auxiliary'), 'Should not include inactive auxiliary');
});

test('Should calculate user level correctly', () => {
  const beginnerLevel = progressService.calculateUserLevel(5);
  const intermediateLevel = progressService.calculateUserLevel(30);
  const expertLevel = progressService.calculateUserLevel(150);

  assert(beginnerLevel.current === 'beginner', 'Should identify beginner level');
  assert(beginnerLevel.progress === 5, 'Should calculate correct progress');
  assert(beginnerLevel.remaining === 5, 'Should calculate remaining correctly');

  assert(intermediateLevel.current === 'intermediate', 'Should identify intermediate level');
  assert(expertLevel.current === 'expert', 'Should identify expert level');
});

test('Should generate achievement badges', () => {
  const userStats = {
    correctSentences: 5,
    totalSentences: 6,
    consecutiveCorrect: 3,
    sessionTime: 30 * 60 * 1000, // 30 minutes
    errorHistory: {
      'present_in_past': 2,
      'missing_gerund': 1
    },
    practiceStreak: 3
  };

  const achievements = progressService.generateAchievementBadges(userStats);
  
  assert(achievements.earned.length > 0, 'Should have earned badges');
  assert(achievements.available.length > 0, 'Should have available badges');
  assert(achievements.nextMilestones.length > 0, 'Should have next milestones');
  assert(achievements.totalEarned >= 0, 'Should count earned badges');
  assert(achievements.totalAvailable > 0, 'Should count total available badges');
});

test('Should identify earned sentence badges', () => {
  const userStats = {
    correctSentences: 10,
    totalSentences: 12,
    consecutiveCorrect: 5,
    sessionTime: 0,
    errorHistory: {},
    practiceStreak: 1
  };

  const achievements = progressService.generateAchievementBadges(userStats);
  
  // Should have earned first_sentence, five_sentences, and ten_sentences
  const earnedIds = achievements.earned.map(badge => badge.id);
  assert(earnedIds.includes('first_sentence'), 'Should earn first sentence badge');
  assert(earnedIds.includes('five_sentences'), 'Should earn five sentences badge');
  assert(earnedIds.includes('ten_sentences'), 'Should earn ten sentences badge');
  assert(!earnedIds.includes('twenty_five_sentences'), 'Should not earn twenty five sentences badge yet');
});

test('Should generate learning graphs', () => {
  const userHistory = [
    { accuracy: 80, correctSentences: 3, totalSentences: 4, errors: [{ type: 'missing_gerund' }], date: '2023-01-01' },
    { accuracy: 90, correctSentences: 5, totalSentences: 6, errors: [], date: '2023-01-02' },
    { accuracy: 85, correctSentences: 4, totalSentences: 5, errors: [{ type: 'wrong_auxiliary' }], date: '2023-01-03' }
  ];

  const graphs = progressService.generateLearningGraphs(userHistory);
  
  assert(graphs.accuracy, 'Should have accuracy graph');
  assert(graphs.progress, 'Should have progress graph');
  assert(graphs.errors, 'Should have errors graph');
  assert(graphs.streaks, 'Should have streaks graph');
  
  assert(graphs.accuracy.type === 'line', 'Accuracy should be line graph');
  assert(graphs.progress.type === 'bar', 'Progress should be bar graph');
  assert(graphs.errors.type === 'pie', 'Errors should be pie graph');
  assert(graphs.streaks.type === 'bar', 'Streaks should be bar graph');
});

test('Should generate complete progress indicators', () => {
  const analysisResult = {
    tenseType: 'past_continuous',
    iconStates: {
      subject: { active: true, error: false },
      auxiliary: { active: true, error: false }
    },
    completionPercentage: 67
  };

  const userStats = {
    correctSentences: 8,
    totalSentences: 10,
    consecutiveCorrect: 3,
    sessionTime: 15 * 60 * 1000,
    errorHistory: {},
    practiceStreak: 2
  };

  const userHistory = [
    { accuracy: 80, correctSentences: 4, totalSentences: 5, date: '2023-01-01' }
  ];

  const indicators = progressService.generateCompleteProgressIndicators(analysisResult, userStats, userHistory);
  
  assert(indicators.grammarProgress, 'Should have grammar progress');
  assert(indicators.achievements, 'Should have achievements');
  assert(indicators.userLevel, 'Should have user level');
  assert(indicators.learningGraphs, 'Should have learning graphs');
  assert(indicators.stats, 'Should have stats');
  assert(indicators.motivation, 'Should have motivation');
  assert(indicators.recommendations, 'Should have recommendations');
  assert(indicators.timestamp, 'Should have timestamp');
});

test('Should generate motivational progress', () => {
  const highAccuracyStats = {
    correctSentences: 18,
    totalSentences: 20
  };

  const lowAccuracyStats = {
    correctSentences: 3,
    totalSentences: 10
  };

  const highMotivation = progressService.generateMotivationalProgress(highAccuracyStats);
  const lowMotivation = progressService.generateMotivationalProgress(lowAccuracyStats);
  
  assert(highMotivation.message, 'Should have motivational message');
  assert(highMotivation.icon, 'Should have motivational icon');
  assert(highMotivation.color, 'Should have motivational color');
  assert(highMotivation.encouragement, 'Should have encouragement');
  
  assert(lowMotivation.message !== highMotivation.message, 'Should have different messages for different accuracy');
});

test('Should generate progress recommendations', () => {
  const analysisResult = {
    errors: [{ type: 'missing_gerund' }],
    completionPercentage: 50
  };

  const userStats = {
    correctSentences: 3,
    errorHistory: {
      'present_in_past': 4, // Recurrent error
      'missing_gerund': 2
    }
  };

  const recommendations = progressService.generateProgressRecommendations(analysisResult, userStats);
  
  assert(Array.isArray(recommendations), 'Should return array of recommendations');
  assert(recommendations.length > 0, 'Should have recommendations');
  assert(recommendations.length <= 3, 'Should not exceed maximum recommendations');
  
  const hasErrorFocus = recommendations.some(rec => rec.type === 'error_focus');
  assert(hasErrorFocus, 'Should recommend focusing on recurrent errors');
});

test('Should get correct part labels and icons', () => {
  const subjectLabel = progressService.getPartLabel('subject');
  const auxiliaryIcon = progressService.getPartIcon('auxiliary');
  const unknownLabel = progressService.getPartLabel('unknown_part');

  assert(subjectLabel === 'Sujeto', 'Should return correct Spanish label');
  assert(auxiliaryIcon === '⚡', 'Should return correct icon');
  assert(unknownLabel === 'unknown_part', 'Should return original for unknown parts');
});

test('Should get correct part status', () => {
  const iconStates = {
    subject: { active: true, error: false },
    auxiliary: { active: false, error: true },
    gerund: { active: false, error: false }
  };

  const completedStatus = progressService.getPartStatus('subject', iconStates);
  const errorStatus = progressService.getPartStatus('auxiliary', iconStates);
  const missingStatus = progressService.getPartStatus('gerund', iconStates);
  const unknownStatus = progressService.getPartStatus('unknown', iconStates);

  assert(completedStatus === 'completed', 'Should identify completed parts');
  assert(errorStatus === 'error', 'Should identify error parts');
  assert(missingStatus === 'missing', 'Should identify missing parts');
  assert(unknownStatus === 'missing', 'Should default to missing for unknown parts');
});

test('Should get progress colors correctly', () => {
  const highColor = progressService.getProgressColor(95);
  const mediumColor = progressService.getProgressColor(75);
  const lowColor = progressService.getProgressColor(55);
  const veryLowColor = progressService.getProgressColor(25);

  assert(highColor === '#48bb78', 'Should return green for high progress');
  assert(mediumColor === '#ed8936', 'Should return orange for medium progress');
  assert(lowColor === '#4299e1', 'Should return blue for low progress');
  assert(veryLowColor === '#e53e3e', 'Should return red for very low progress');
});

test('Should calculate trend correctly', () => {
  const improvingValues = [60, 65, 70, 75, 80];
  const decliningValues = [80, 75, 70, 65, 60];
  const stableValues = [70, 72, 68, 71, 69];

  const improvingTrend = progressService.calculateTrend(improvingValues);
  const decliningTrend = progressService.calculateTrend(decliningValues);
  const stableTrend = progressService.calculateTrend(stableValues);

  assert(improvingTrend === 'improving', 'Should detect improving trend');
  assert(decliningTrend === 'declining', 'Should detect declining trend');
  assert(stableTrend === 'stable', 'Should detect stable trend');
});

test('Should get error labels correctly', () => {
  const presentInPastLabel = progressService.getErrorLabel('present_in_past');
  const wrongAuxiliaryLabel = progressService.getErrorLabel('wrong_auxiliary');
  const unknownErrorLabel = progressService.getErrorLabel('unknown_error');

  assert(presentInPastLabel === 'Presente en Pasado', 'Should return correct Spanish error label');
  assert(wrongAuxiliaryLabel === 'Auxiliar Incorrecto', 'Should return correct auxiliary error label');
  assert(unknownErrorLabel === 'unknown_error', 'Should return original for unknown errors');
});

test('Should get encouragement messages', () => {
  const beginnerMessage = progressService.getEncouragementMessage(3);
  const intermediateMessage = progressService.getEncouragementMessage(15);
  const expertMessage = progressService.getEncouragementMessage(75);

  assert(typeof beginnerMessage === 'string', 'Should return string message');
  assert(typeof intermediateMessage === 'string', 'Should return string message');
  assert(typeof expertMessage === 'string', 'Should return string message');
  assert(beginnerMessage !== expertMessage, 'Should have different messages for different levels');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE INTEGRACIÓN
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Progress Indicators Integration...\n');

test('Should handle complete workflow for beginner', () => {
  const analysisResult = {
    tenseType: 'past_continuous',
    iconStates: {
      subject: { active: true, error: false }
    },
    completionPercentage: 33
  };

  const userStats = {
    correctSentences: 2,
    totalSentences: 3,
    consecutiveCorrect: 1,
    sessionTime: 5 * 60 * 1000,
    errorHistory: {},
    practiceStreak: 1
  };

  const indicators = progressService.generateCompleteProgressIndicators(analysisResult, userStats, []);
  
  assert(indicators.userLevel.current === 'beginner', 'Should identify as beginner');
  assert(indicators.stats.accuracy > 0, 'Should calculate accuracy');
  assert(indicators.achievements.earned.length > 0, 'Should have earned some badges');
  assert(indicators.motivation.message, 'Should provide motivation');
});

test('Should handle complete workflow for advanced user', () => {
  const analysisResult = {
    tenseType: 'past_continuous',
    iconStates: {
      subject: { active: true, error: false },
      auxiliary: { active: true, error: false },
      gerund: { active: true, error: false }
    },
    completionPercentage: 100
  };

  const userStats = {
    correctSentences: 75,
    totalSentences: 80,
    consecutiveCorrect: 10,
    sessionTime: 60 * 60 * 1000, // 1 hour
    errorHistory: {
      'present_in_past': 5,
      'present_in_past_fixed': 15
    },
    practiceStreak: 7
  };

  const indicators = progressService.generateCompleteProgressIndicators(analysisResult, userStats, []);
  
  assert(indicators.userLevel.current === 'advanced', 'Should identify as advanced');
  assert(indicators.stats.accuracy >= 90, 'Should have high accuracy');
  assert(indicators.achievements.earned.length > 5, 'Should have earned many badges');
  assert(indicators.grammarProgress.percentage === 100, 'Should show complete grammar');
});

test('Should handle user with recurrent errors', () => {
  const analysisResult = {
    tenseType: 'past_continuous',
    errors: [{ type: 'present_in_past' }],
    completionPercentage: 60
  };

  const userStats = {
    correctSentences: 12,
    totalSentences: 20,
    errorHistory: {
      'present_in_past': 8, // Many errors of same type
      'wrong_auxiliary': 3
    }
  };

  const indicators = progressService.generateCompleteProgressIndicators(analysisResult, userStats, []);
  
  const hasErrorRecommendation = indicators.recommendations.some(rec => 
    rec.type === 'error_focus' && rec.title.includes('Presente en Pasado')
  );
  assert(hasErrorRecommendation, 'Should recommend focusing on recurrent error');
});

console.log('\n🎉 All Progress Indicators tests completed!\n');