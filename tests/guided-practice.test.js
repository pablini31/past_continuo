// tests/guided-practice.test.js

/**
 * ═══════════════════════════════════════════════════
 * 🧪 TESTS PARA GUIDED PRACTICE SERVICE
 * ═══════════════════════════════════════════════════
 */

const { GuidedPracticeService } = require('../src/services/guided-practice.service');

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
const guidedPractice = new GuidedPracticeService();

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE GUIDED PRACTICE SERVICE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Guided Practice Service...\n');

test('Should get available tutorials', () => {
  const beginnerTutorials = guidedPractice.getAvailableTutorials('beginner');
  const intermediateTutorials = guidedPractice.getAvailableTutorials('intermediate');
  const advancedTutorials = guidedPractice.getAvailableTutorials('advanced');

  assert(Array.isArray(beginnerTutorials), 'Should return array for beginner');
  assert(Array.isArray(intermediateTutorials), 'Should return array for intermediate');
  assert(Array.isArray(advancedTutorials), 'Should return array for advanced');
  
  assert(beginnerTutorials.length > 0, 'Should have beginner tutorials');
  assert(intermediateTutorials.length >= beginnerTutorials.length, 'Intermediate should have at least beginner tutorials');
  assert(advancedTutorials.length >= intermediateTutorials.length, 'Advanced should have all tutorials');
});

test('Should start tutorial successfully', () => {
  const tutorialData = guidedPractice.startTutorial('past_continuous_basics', 'test_user');
  
  assert(tutorialData.tutorial, 'Should have tutorial info');
  assert(tutorialData.step, 'Should have step info');
  assert(tutorialData.progress, 'Should have progress info');
  assert(tutorialData.navigation, 'Should have navigation info');
  
  assert(tutorialData.step.number === 1, 'Should start at step 1');
  assert(tutorialData.progress.percentage >= 0, 'Should have valid percentage');
});

test('Should generate contextual hints', () => {
  const errorContext = {
    errorType: 'present_in_past',
    progressLevel: 'just_started',
    userInput: 'I am walking'
  };

  const hint = guidedPractice.generateContextualHint('test_user', errorContext);
  
  assert(hint.hint, 'Should have hint text');
  assert(hint.type, 'Should have hint type');
  assert(hint.priority, 'Should have hint priority');
  assert(hint.timestamp, 'Should have timestamp');
});

test('Should generate progressive instructions', () => {
  const beginnerInstructions = guidedPractice.generateProgressiveInstructions('beginner', 'basic_structure');
  const intermediateInstructions = guidedPractice.generateProgressiveInstructions('intermediate', 'complex_structure');
  
  assert(beginnerInstructions.structure, 'Should have structure instructions');
  assert(beginnerInstructions.tips, 'Should have tips');
  assert(Array.isArray(beginnerInstructions.structure), 'Structure should be array');
  assert(Array.isArray(beginnerInstructions.tips), 'Tips should be array');
  
  assert(intermediateInstructions.structure.length > 0, 'Should have intermediate instructions');
});

test('Should evaluate user responses', () => {
  const completeTask = guidedPractice.evaluateUserResponse('test_user', 'was', 'was', 'complete');
  const incorrectTask = guidedPractice.evaluateUserResponse('test_user', 'were', 'was', 'complete');
  
  assert(completeTask.isCorrect === true, 'Should identify correct answer');
  assert(completeTask.score === 100, 'Should give full score for correct answer');
  assert(completeTask.nextAction === 'continue', 'Should continue on correct answer');
  
  assert(incorrectTask.isCorrect === false, 'Should identify incorrect answer');
  assert(incorrectTask.score === 0, 'Should give zero score for incorrect answer');
  assert(incorrectTask.nextAction === 'retry', 'Should retry on incorrect answer');
});

test('Should navigate tutorial steps', () => {
  // Start tutorial
  guidedPractice.startTutorial('past_continuous_basics', 'nav_test_user');
  
  // Go to next step
  const step2 = guidedPractice.nextStep('nav_test_user', { isCorrect: true, score: 100 });
  assert(step2.step.number === 2, 'Should advance to step 2');
  
  // Go back
  const step1 = guidedPractice.previousStep('nav_test_user');
  assert(step1.step.number === 1, 'Should go back to step 1');
});

test('Should track tutorial progress', () => {
  guidedPractice.startTutorial('past_continuous_basics', 'progress_test_user');
  
  const initialProgress = guidedPractice.getTutorialProgress('progress_test_user');
  assert(initialProgress.currentStep === 1, 'Should start at step 1');
  assert(initialProgress.completedSteps === 0, 'Should have no completed steps initially');
  
  // Complete a step
  guidedPractice.nextStep('progress_test_user', { isCorrect: true, score: 100 });
  
  const updatedProgress = guidedPractice.getTutorialProgress('progress_test_user');
  assert(updatedProgress.currentStep === 2, 'Should advance current step');
  assert(updatedProgress.completedSteps === 1, 'Should have one completed step');
});

test('Should handle tutorial completion', () => {
  guidedPractice.startTutorial('past_continuous_basics', 'completion_test_user');
  
  // Complete all steps (assuming 5 steps in basic tutorial)
  for (let i = 0; i < 5; i++) {
    const result = guidedPractice.nextStep('completion_test_user', { isCorrect: true, score: 100 });
    if (result.completed) {
      assert(result.completed === true, 'Should mark as completed');
      assert(result.stats, 'Should have completion stats');
      assert(result.achievements, 'Should have achievements');
      break;
    }
  }
});

test('Should handle invalid tutorial', () => {
  try {
    guidedPractice.startTutorial('invalid_tutorial', 'error_test_user');
    assert(false, 'Should throw error for invalid tutorial');
  } catch (error) {
    assert(error.message.includes('not found'), 'Should throw appropriate error message');
  }
});

test('Should handle no active tutorial', () => {
  try {
    guidedPractice.nextStep('no_tutorial_user');
    assert(false, 'Should throw error when no active tutorial');
  } catch (error) {
    assert(error.message.includes('No active tutorial'), 'Should throw appropriate error message');
  }
});

console.log('\n🎉 All Guided Practice tests completed!\n');