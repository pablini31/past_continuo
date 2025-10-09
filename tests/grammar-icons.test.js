// tests/grammar-icons.test.js

/**
 * ═══════════════════════════════════════════════════
 * 🧪 TESTS PARA GRAMMAR ICONS COMPONENT
 * ═══════════════════════════════════════════════════
 */

// Simular DOM para testing
const { JSDOM } = require('jsdom');

// Crear DOM simulado
const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <body>
      <div id="test-container"></div>
    </body>
  </html>
`);

global.window = dom.window;
global.document = dom.window.document;

// Cargar el componente
const fs = require('fs');
const path = require('path');
const grammarIconsCode = fs.readFileSync(
  path.join(__dirname, '../public/js/grammar-icons.js'), 
  'utf8'
);

// Evaluar el código en el contexto global
eval(grammarIconsCode);

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
// 🧪 TESTS DE GRAMMAR ICONS COMPONENT
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Grammar Icons Component...\n');

test('Should create GrammarIconsComponent instance', () => {
  const component = new window.GrammarIconsComponent('test-container');
  assert(component instanceof window.GrammarIconsComponent, 'Should create instance');
  assert(component.container, 'Should have container reference');
});

test('Should create HTML structure', () => {
  const component = new window.GrammarIconsComponent('test-container');
  const container = document.getElementById('test-container');
  
  assert(container.querySelector('.grammar-icons-wrapper'), 'Should create wrapper');
  assert(container.querySelector('.grammar-icons-header'), 'Should create header');
  assert(container.querySelector('.grammar-icons-container'), 'Should create icons container');
  assert(container.querySelector('.grammar-progress'), 'Should create progress section');
  assert(container.querySelector('.grammar-tips'), 'Should create tips section');
});

test('Should have icon groups for different tenses', () => {
  const component = new window.GrammarIconsComponent('test-container');
  const container = document.getElementById('test-container');
  
  assert(container.querySelector('#past-continuous-group'), 'Should have Past Continuous group');
  assert(container.querySelector('#past-simple-group'), 'Should have Past Simple group');
  assert(container.querySelector('#connector-group'), 'Should have Connector group');
});

test('Should have all required icons', () => {
  const component = new window.GrammarIconsComponent('test-container');
  const container = document.getElementById('test-container');
  
  // Past Continuous icons
  const continuousGroup = container.querySelector('#past-continuous-group');
  assert(continuousGroup.querySelector('[data-type="subject"]'), 'Should have subject icon');
  assert(continuousGroup.querySelector('[data-type="auxiliary"]'), 'Should have auxiliary icon');
  assert(continuousGroup.querySelector('[data-type="verb"]'), 'Should have verb icon');
  assert(continuousGroup.querySelector('[data-type="gerund"]'), 'Should have gerund icon');
  assert(continuousGroup.querySelector('[data-type="complement"]'), 'Should have complement icon');
  
  // Past Simple icons
  const simpleGroup = container.querySelector('#past-simple-group');
  assert(simpleGroup.querySelector('[data-type="subject"]'), 'Should have subject icon');
  assert(simpleGroup.querySelector('[data-type="past-verb"]'), 'Should have past verb icon');
  assert(simpleGroup.querySelector('[data-type="complement"]'), 'Should have complement icon');
  
  // Connector icon
  assert(container.querySelector('[data-type="connector"]'), 'Should have connector icon');
});

test('Should update tense type display', () => {
  const component = new window.GrammarIconsComponent('test-container');
  
  component.updateTenseType('past_continuous');
  const tenseDisplay = document.getElementById('tense-type-display');
  assert(tenseDisplay.textContent.includes('Past Continuous'), 'Should show Past Continuous');
  
  component.updateTenseType('past_simple');
  assert(tenseDisplay.textContent.includes('Past Simple'), 'Should show Past Simple');
});

test('Should show relevant icon group based on tense', () => {
  const component = new window.GrammarIconsComponent('test-container');
  
  // Test Past Continuous
  component.showRelevantIconGroup('past_continuous');
  const continuousGroup = document.getElementById('past-continuous-group');
  const simpleGroup = document.getElementById('past-simple-group');
  
  assert(continuousGroup.style.display === 'block', 'Should show Past Continuous group');
  assert(simpleGroup.style.display === 'none', 'Should hide Past Simple group');
  
  // Test Past Simple
  component.showRelevantIconGroup('past_simple');
  assert(continuousGroup.style.display === 'none', 'Should hide Past Continuous group');
  assert(simpleGroup.style.display === 'block', 'Should show Past Simple group');
});

test('Should activate icons correctly', () => {
  const component = new window.GrammarIconsComponent('test-container');
  component.currentTenseType = 'past_continuous';
  component.showRelevantIconGroup('past_continuous');
  
  // Activate subject icon
  component.activateIcon('subject', { text: 'I', isValid: true });
  
  const subjectIcon = document.querySelector('#past-continuous-group [data-type="subject"]');
  assert(subjectIcon.classList.contains('active'), 'Should activate subject icon');
  assert(!subjectIcon.classList.contains('inactive'), 'Should remove inactive class');
});

test('Should mark icons as error', () => {
  const component = new window.GrammarIconsComponent('test-container');
  component.currentTenseType = 'past_continuous';
  component.showRelevantIconGroup('past_continuous');
  
  // Mark auxiliary as error
  component.markIconAsError('auxiliary', 'present_in_past');
  
  const auxiliaryIcon = document.querySelector('#past-continuous-group [data-type="auxiliary"]');
  assert(auxiliaryIcon.classList.contains('error'), 'Should mark auxiliary as error');
  assert(!auxiliaryIcon.classList.contains('active'), 'Should not be active');
});

test('Should update progress bar', () => {
  const component = new window.GrammarIconsComponent('test-container');
  
  // Test with completed parts
  const completedParts = ['subject', 'auxiliary', 'gerund'];
  component.updateProgress(completedParts, 'past_continuous');
  
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  
  assert(progressFill.style.width === '100%', 'Should show 100% progress');
  assert(progressText.textContent === '100%', 'Should display 100%');
});

test('Should update tips based on structure analysis', () => {
  const component = new window.GrammarIconsComponent('test-container');
  
  const mockAnalysis = {
    tenseType: 'past_continuous',
    parts: {
      connector: { text: 'while' }
    },
    errors: [
      { type: 'present_in_past', detected: 'am', suggestion: 'was' }
    ],
    missingParts: ['gerund'],
    isValid: false
  };
  
  component.updateTips(mockAnalysis);
  
  const tipsContent = document.getElementById('tips-content');
  const tipsHTML = tipsContent.innerHTML.toLowerCase();
  assert(tipsHTML.includes('while') || tipsHTML.includes('conector'), 'Should include connector tip');
  assert(tipsHTML.includes('am') || tipsHTML.includes('was'), 'Should include error tip');
  assert(tipsHTML.includes('-ing') || tipsHTML.includes('gerund'), 'Should include missing part tip');
});

test('Should reset all icons and state', () => {
  const component = new window.GrammarIconsComponent('test-container');
  
  // First activate some icons
  component.currentTenseType = 'past_continuous';
  component.showRelevantIconGroup('past_continuous');
  component.activateIcon('subject', { text: 'I', isValid: true });
  
  // Then reset
  component.reset();
  
  const allIcons = document.querySelectorAll('.grammar-icon');
  allIcons.forEach(icon => {
    assert(icon.classList.contains('inactive'), 'All icons should be inactive');
    assert(!icon.classList.contains('active'), 'No icons should be active');
    assert(!icon.classList.contains('error'), 'No icons should have errors');
  });
  
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  assert(progressFill.style.width === '0%', 'Progress should be reset');
  assert(progressText.textContent === '0%', 'Progress text should be reset');
});

test('Should handle complete structure analysis update', () => {
  const component = new window.GrammarIconsComponent('test-container');
  
  const mockStructureAnalysis = {
    tenseType: 'past_continuous',
    parts: {
      subject: { text: 'I', type: 'pronoun', isValid: true },
      auxiliary: { text: 'was', type: 'past_auxiliary', isValid: true },
      gerund: { text: 'walking', type: 'gerund', isValid: true },
      connector: { text: 'while', type: 'connector', isValid: true }
    },
    completedParts: ['subject', 'auxiliary', 'gerund'],
    missingParts: [],
    errors: [],
    isValid: true
  };
  
  component.updateIcons(mockStructureAnalysis);
  
  // Check that tense type is updated
  const tenseDisplay = document.getElementById('tense-type-display');
  assert(tenseDisplay.textContent.includes('Past Continuous'), 'Should update tense type');
  
  // Check that relevant group is shown
  const continuousGroup = document.getElementById('past-continuous-group');
  assert(continuousGroup.style.display === 'block', 'Should show Past Continuous group');
  
  // Check that connector group is shown
  const connectorGroup = document.getElementById('connector-group');
  assert(connectorGroup.style.display === 'block', 'Should show connector group');
  
  // Check progress
  const progressText = document.getElementById('progress-text');
  assert(progressText.textContent === '100%', 'Should show complete progress');
});

console.log('\n🎉 All Grammar Icons tests completed!\n');