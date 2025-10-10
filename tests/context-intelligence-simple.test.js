// tests/context-intelligence-simple.test.js

/**
 * ═══════════════════════════════════════════════════
 * 🧪 SIMPLE TESTS PARA CONTEXT INTELLIGENCE
 * ═══════════════════════════════════════════════════
 */

const { ContextIntelligenceService } = require('../src/services/context-intelligence.service');
const { SmartRecommendationsService } = require('../src/services/smart-recommendations.service');

console.log('\n🧪 Testing Context Intelligence (Simple)...\n');

// Test 1: While connector
try {
  const contextService = new ContextIntelligenceService();
  const result = contextService.analyzeContext('While I was studying');
  
  if (result.primaryRecommendation === 'past_continuous') {
    console.log('✅ While connector test passed');
  } else {
    console.log('❌ While connector test failed');
  }
} catch (error) {
  console.log('❌ While connector test error:', error.message);
}

// Test 2: Yesterday marker
try {
  const contextService = new ContextIntelligenceService();
  const result = contextService.analyzeContext('Yesterday I walked');
  
  if (result.contextFactors.some(f => f.type === 'time_marker')) {
    console.log('✅ Yesterday marker test passed');
  } else {
    console.log('❌ Yesterday marker test failed');
  }
} catch (error) {
  console.log('❌ Yesterday marker test error:', error.message);
}

// Test 3: Smart Recommendations
try {
  const smartService = new SmartRecommendationsService();
  const result = smartService.generateSmartRecommendations('While I was cooking');
  
  if (result.smartTips && result.smartTips.length > 0) {
    console.log('✅ Smart recommendations test passed');
  } else {
    console.log('❌ Smart recommendations test failed');
  }
} catch (error) {
  console.log('❌ Smart recommendations test error:', error.message);
}

// Test 4: Connector analysis
try {
  const smartService = new SmartRecommendationsService();
  const result = smartService.analyzeConnectorUsage('when', 'When the phone rang');
  
  if (result.recommendation && result.confidence > 0) {
    console.log('✅ Connector analysis test passed');
  } else {
    console.log('❌ Connector analysis test failed');
  }
} catch (error) {
  console.log('❌ Connector analysis test error:', error.message);
}

console.log('\n🎉 Simple Context Intelligence tests completed!\n');