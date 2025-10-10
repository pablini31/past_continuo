// tests/adaptive-learning.test.js

/**
 * ═══════════════════════════════════════════════════
 * 🧪 TESTS PARA ADAPTIVE LEARNING SERVICE
 * ═══════════════════════════════════════════════════
 */

const { AdaptiveLearningService } = require('../src/services/adaptive-learning.service');

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
const adaptiveLearning = new AdaptiveLearningService();

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE ADAPTIVE LEARNING SERVICE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Adaptive Learning Service...\n');

test('Should evaluate initial level correctly', async () => {
  const responses = [
    { answer: 'was', timeSpent: 5000 },
    { answer: 'studying', timeSpent: 8000 },
    { answer: 'when', timeSpent: 12000 },
    { answer: 'While I was cooking, she was studying', timeSpent: 25000 },
    { answer: 'am should be was', timeSpent: 15000 }
  ];

  const assessment = await adaptiveLearning.evaluateInitialLevel('test_user', responses);
  
  assert(assessment.userId === 'test_user', 'Should preserve user ID');
  assert(assessment.overallScore >= 0 && assessment.overallScore <= 100, 'Should have valid overall score');
  assert(assessment.recommendedLevel, 'Should recommend a level');
  assert(Array.isArray(assessment.strengths), 'Should identify strengths');
  assert(Array.isArray(assessment.weaknesses), 'Should identify weaknesses');
  assert(assessment.learningPath, 'Should generate learning path');
});

test('Should create user profile after evaluation', async () => {
  const responses = [
    { answer: 'was', timeSpent: 5000 },
    { answer: 'studying', timeSpent: 8000 }
  ];

  await adaptiveLearning.evaluateInitialLevel('profile_test_user', responses);
  const profile = adaptiveLearning.getUserProfile('profile_test_user');
  
  assert(profile !== undefined, 'Should create user profile');
  assert(profile.userId === 'profile_test_user', 'Should have correct user ID');
  assert(profile.skillLevel, 'Should have skill level');
  assert(profile.memory, 'Should have memory object');
  assert(profile.preferences, 'Should have preferences');
  assert(profile.goals, 'Should have goals');
});

test('Should adapt difficulty based on performance', async () => {
  // Crear perfil primero
  await adaptiveLearning.evaluateInitialLevel('difficulty_test_user', [
    { answer: 'was', timeSpent: 5000 }
  ]);

  const highPerformance = [
    { isCorrect: true, timeSpent: 5000 },
    { isCorrect: true, timeSpent: 4000 },
    { isCorrect: true, timeSpent: 3000 },
    { isCorrect: true, timeSpent: 4500 },
    { isCorrect: true, timeSpent: 3500 }
  ];

  const adaptation = adaptiveLearning.adaptDifficulty('difficulty_test_user', highPerformance);
  
  assert(adaptation.userId === 'difficulty_test_user', 'Should have correct user ID');
  assert(adaptation.factors, 'Should calculate performance factors');
  assert(adaptation.factors.accuracy >= 0 && adaptation.factors.accuracy <= 1, 'Should have valid accuracy');
  assert(adaptation.reasoning, 'Should provide reasoning');
  assert(Array.isArray(adaptation.reasoning), 'Reasoning should be array');
});

test('Should update user memory correctly', async () => {
  // Crear perfil primero
  await adaptiveLearning.evaluateInitialLevel('memory_test_user', [
    { answer: 'was', timeSpent: 5000 }
  ]);

  const sessionData = {
    errors: [
      { skill: 'auxiliary_verbs' },
      { skill: 'gerund_formation' }
    ],
    successes: [
      { skill: 'basic_structure' },
      { skill: 'connectors' }
    ],
    timeSpent: 300000, // 5 minutos
    difficulty: 'medium'
  };

  const memory = adaptiveLearning.updateUserMemory('memory_test_user', sessionData);
  
  assert(memory.totalSessions > 0, 'Should increment session count');
  assert(memory.totalTimeSpent > 0, 'Should track time spent');
  assert(memory.strengths['basic_structure'], 'Should record strengths');
  assert(memory.weaknesses['auxiliary_verbs'], 'Should record weaknesses');
});

test('Should generate personalized recommendations', async () => {
  // Crear perfil con datos específicos
  await adaptiveLearning.evaluateInitialLevel('recommendations_test_user', [
    { answer: 'was', timeSpent: 5000 },
    { answer: 'wrong', timeSpent: 15000 }
  ]);

  const recommendations = adaptiveLearning.generatePersonalizedRecommendations('recommendations_test_user');
  
  assert(recommendations.userId === 'recommendations_test_user', 'Should have correct user ID');
  assert(recommendations.currentLevel, 'Should have current level');
  assert(Array.isArray(recommendations.focusAreas), 'Should have focus areas');
  assert(Array.isArray(recommendations.practiceTypes), 'Should have practice types');
  assert(Array.isArray(recommendations.learningGoals), 'Should have learning goals');
  assert(typeof recommendations.estimatedTimeToNextLevel === 'number', 'Should estimate time to next level');
});

test('Should handle performance factors calculation', async () => {
  const performance = [
    { isCorrect: true, timeSpent: 5000 },
    { isCorrect: false, timeSpent: 15000 },
    { isCorrect: true, timeSpent: 8000 },
    { isCorrect: true, timeSpent: 6000 }
  ];

  // Crear perfil primero
  await adaptiveLearning.evaluateInitialLevel('factors_test_user', [
    { answer: 'was', timeSpent: 5000 }
  ]);

  const factors = adaptiveLearning.calculatePerformanceFactors(performance);
  
  assert(typeof factors.accuracy === 'number', 'Should calculate accuracy');
  assert(factors.accuracy >= 0 && factors.accuracy <= 1, 'Accuracy should be between 0 and 1');
  assert(typeof factors.speed === 'number', 'Should calculate speed');
  assert(typeof factors.consistency === 'number', 'Should calculate consistency');
  assert(typeof factors.improvement === 'number', 'Should calculate improvement');
});

test('Should determine skill level correctly', () => {
  const beginnerScore = 25;
  const intermediateScore = 60;
  const expertScore = 95;

  const beginnerLevel = adaptiveLearning.determineSkillLevel(beginnerScore);
  const intermediateLevel = adaptiveLearning.determineSkillLevel(intermediateScore);
  const expertLevel = adaptiveLearning.determineSkillLevel(expertScore);

  assert(beginnerLevel === 'beginner', 'Should identify beginner level');
  assert(intermediateLevel === 'intermediate', 'Should identify intermediate level');
  assert(expertLevel === 'expert', 'Should identify expert level');
});

test('Should handle learning path generation', async () => {
  const assessment = {
    userId: 'path_test_user',
    recommendedLevel: 'intermediate',
    strengths: ['basic_structure'],
    weaknesses: ['auxiliary_verbs', 'gerund_formation', 'connectors']
  };

  const path = adaptiveLearning.generateLearningPath(assessment);
  
  assert(path.userId === 'path_test_user', 'Should have correct user ID');
  assert(path.currentLevel === 'intermediate', 'Should have correct level');
  assert(Array.isArray(path.milestones), 'Should have milestones');
  assert(path.milestones.length > 0, 'Should have at least one milestone');
  assert(path.estimatedDuration, 'Should have estimated duration');
});

test('Should evaluate different response types', () => {
  const completeQuestion = {
    id: 'test_complete',
    type: 'complete',
    correct: 'was'
  };

  const transformQuestion = {
    id: 'test_transform',
    type: 'transform',
    correct: 'studying'
  };

  const correctResponse = { answer: 'was', timeSpent: 5000 };
  const incorrectResponse = { answer: 'were', timeSpent: 8000 };
  const transformResponse = { answer: 'studying', timeSpent: 6000 };

  const correctScore = adaptiveLearning.evaluateResponse(completeQuestion, correctResponse);
  const incorrectScore = adaptiveLearning.evaluateResponse(completeQuestion, incorrectResponse);
  const transformScore = adaptiveLearning.evaluateResponse(transformQuestion, transformResponse);

  assert(correctScore.isCorrect === true, 'Should identify correct answer');
  assert(correctScore.points >= 100, 'Should give at least full points for correct answer');
  assert(incorrectScore.isCorrect === false, 'Should identify incorrect answer');
  assert(incorrectScore.points === 0, 'Should give zero points for incorrect answer');
  assert(transformScore.isCorrect === true, 'Should handle transform questions');
});

test('Should handle difficulty adjustments', () => {
  const currentDifficulty = 'medium';
  
  const increased = adaptiveLearning.increaseDifficulty(currentDifficulty);
  const decreased = adaptiveLearning.decreaseDifficulty(currentDifficulty);
  
  assert(increased !== currentDifficulty, 'Should increase difficulty');
  assert(decreased !== currentDifficulty, 'Should decrease difficulty');
  
  // Test boundaries
  const maxDifficulty = 'expert';
  const minDifficulty = 'easy';
  
  const maxIncreased = adaptiveLearning.increaseDifficulty(maxDifficulty);
  const minDecreased = adaptiveLearning.decreaseDifficulty(minDifficulty);
  
  assert(maxIncreased === maxDifficulty, 'Should not increase beyond maximum');
  assert(minDecreased === minDifficulty, 'Should not decrease below minimum');
});

test('Should calculate learning goals correctly', async () => {
  // Crear perfil con debilidades específicas
  await adaptiveLearning.evaluateInitialLevel('goals_test_user', [
    { answer: 'wrong', timeSpent: 15000 }
  ]);

  // Agregar algunas debilidades
  const sessionData = {
    errors: [
      { skill: 'auxiliary_verbs' },
      { skill: 'gerund_formation' }
    ],
    successes: [],
    timeSpent: 300000,
    difficulty: 'easy'
  };

  adaptiveLearning.updateUserMemory('goals_test_user', sessionData);
  
  const profile = adaptiveLearning.getUserProfile('goals_test_user');
  const goals = adaptiveLearning.generateLearningGoals(profile);
  
  assert(Array.isArray(goals), 'Should return array of goals');
  assert(goals.length > 0, 'Should have at least one goal');
  assert(goals.some(goal => goal.type === 'skill_improvement'), 'Should have skill improvement goals');
  assert(goals.some(goal => goal.type === 'level_advancement'), 'Should have level advancement goal');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE INTEGRACIÓN
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Adaptive Learning Integration...\n');

test('Should handle complete learning cycle', async () => {
  const userId = 'integration_test_user';
  
  // 1. Evaluación inicial
  const responses = [
    { answer: 'was', timeSpent: 5000 },
    { answer: 'studying', timeSpent: 8000 },
    { answer: 'when', timeSpent: 12000 }
  ];
  
  const assessment = await adaptiveLearning.evaluateInitialLevel(userId, responses);
  assert(assessment.recommendedLevel, 'Should complete initial assessment');
  
  // 2. Actualizar memoria con sesión de práctica
  const sessionData = {
    errors: [{ skill: 'auxiliary_verbs' }],
    successes: [{ skill: 'basic_structure' }],
    timeSpent: 600000,
    difficulty: 'easy'
  };
  
  const memory = adaptiveLearning.updateUserMemory(userId, sessionData);
  assert(memory.totalSessions === 1, 'Should track session');
  
  // 3. Adaptar dificultad
  const performance = [
    { isCorrect: true, timeSpent: 5000 },
    { isCorrect: true, timeSpent: 4000 },
    { isCorrect: false, timeSpent: 15000 }
  ];
  
  const adaptation = adaptiveLearning.adaptDifficulty(userId, performance);
  assert(adaptation.factors, 'Should adapt difficulty');
  
  // 4. Generar recomendaciones
  const recommendations = adaptiveLearning.generatePersonalizedRecommendations(userId);
  assert(recommendations.focusAreas.length > 0, 'Should provide recommendations');
  
  // 5. Verificar perfil actualizado
  const profile = adaptiveLearning.getUserProfile(userId);
  assert(profile.memory.totalSessions === 1, 'Should maintain consistent state');
});

test('Should handle edge cases gracefully', async () => {
  // Test con respuestas vacías
  const emptyAssessment = await adaptiveLearning.evaluateInitialLevel('empty_test_user', []);
  assert(emptyAssessment.overallScore === 0, 'Should handle empty responses');
  
  // Test con rendimiento vacío
  try {
    adaptiveLearning.adaptDifficulty('nonexistent_user', []);
    assert(false, 'Should throw error for nonexistent user');
  } catch (error) {
    assert(error.message.includes('not found'), 'Should throw appropriate error');
  }
  
  // Test con datos de sesión mínimos
  await adaptiveLearning.evaluateInitialLevel('minimal_test_user', [
    { answer: 'was', timeSpent: 5000 }
  ]);
  
  const minimalSession = {
    errors: [],
    successes: [],
    timeSpent: 0,
    difficulty: 'easy'
  };
  
  const minimalMemory = adaptiveLearning.updateUserMemory('minimal_test_user', minimalSession);
  assert(minimalMemory.totalSessions === 1, 'Should handle minimal session data');
});

console.log('\n🎉 All Adaptive Learning tests completed!\n');