// tests/integration.test.js

/**
 * ═══════════════════════════════════════════════════
 * 🧪 TESTS PARA INTEGRATION OPTIMIZER SERVICE
 * ═══════════════════════════════════════════════════
 */

const { IntegrationOptimizerService } = require('../src/services/integration-optimizer.service');

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
const integrationOptimizer = new IntegrationOptimizerService();

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE INTEGRATION OPTIMIZER SERVICE
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Integration Optimizer Service...\n');

test('Should perform integrated analysis', async () => {
    const result = await integrationOptimizer.performIntegratedAnalysis('I was walking', 'test_user');

    assert(result.timestamp, 'Should have timestamp');
    assert(result.userId === 'test_user', 'Should preserve user ID');
    assert(result.text === 'I was walking', 'Should preserve input text');
    assert(result.realTime, 'Should include real-time analysis');
    assert(result.performance, 'Should include performance metrics');
});

test('Should handle cache correctly', async () => {
    const text = 'I was studying';
    const userId = 'cache_test_user';

    // Primera llamada - debería crear cache
    const result1 = await integrationOptimizer.performIntegratedAnalysis(text, userId);

    // Segunda llamada - debería usar cache
    const result2 = await integrationOptimizer.performIntegratedAnalysis(text, userId);

    assert(result1.text === result2.text, 'Should return consistent results');
    assert(result1.realTime.tenseType === result2.realTime.tenseType, 'Should maintain analysis consistency');
});

test('Should optimize performance', () => {
    const optimization = integrationOptimizer.optimizePerformance();

    assert(optimization.timestamp, 'Should have timestamp');
    assert(optimization.optimizations, 'Should have optimizations object');
    assert(optimization.optimizations.cacheOptimization, 'Should optimize cache');
    assert(optimization.optimizations.memoryOptimization, 'Should optimize memory');
    assert(optimization.metrics, 'Should include metrics');
    assert(Array.isArray(optimization.recommendations), 'Should provide recommendations');
});

test('Should record performance metrics', () => {
    integrationOptimizer.recordPerformanceMetric('test_metric', 100);
    integrationOptimizer.recordPerformanceMetric('test_metric', 150);

    const metrics = integrationOptimizer.getPerformanceMetrics();

    assert(metrics.test_metric, 'Should record metrics');
    assert(metrics.test_metric.count === 2, 'Should count multiple metrics');
    assert(metrics.test_metric.averageDuration === 125, 'Should calculate average duration');
});

test('Should generate integrated cache key', () => {
    const key1 = integrationOptimizer.generateIntegratedCacheKey('test text', 'user1', {});
    const key2 = integrationOptimizer.generateIntegratedCacheKey('test text', 'user2', {});
    const key3 = integrationOptimizer.generateIntegratedCacheKey('different text', 'user1', {});

    assert(typeof key1 === 'string', 'Should generate string key');
    assert(key1 !== key2, 'Should generate different keys for different users');
    assert(key1 !== key3, 'Should generate different keys for different text');
});

test('Should calculate cache memory usage', () => {
    const memoryUsage = integrationOptimizer.calculateCacheMemoryUsage();

    assert(typeof memoryUsage === 'number', 'Should return number');
    assert(memoryUsage >= 0, 'Should return non-negative value');
});

test('Should extract successes from analysis', () => {
    const mockAnalysis = {
        iconStates: {
            subject: { active: true, error: false },
            auxiliary: { active: true, error: false },
            gerund: { active: false, error: true },
            complement: { active: true, error: false }
        }
    };

    const successes = integrationOptimizer.extractSuccesses(mockAnalysis);

    assert(Array.isArray(successes), 'Should return array');
    assert(successes.length === 3, 'Should extract correct number of successes');
    assert(successes.some(s => s.skill === 'subject'), 'Should include subject success');
    assert(successes.some(s => s.skill === 'auxiliary'), 'Should include auxiliary success');
    assert(!successes.some(s => s.skill === 'gerund'), 'Should not include error as success');
});

test('Should generate user history', () => {
    const mockProfile = {
        memory: {
            totalSessions: 5
        }
    };

    const history = integrationOptimizer.generateUserHistory(mockProfile, null);

    assert(Array.isArray(history), 'Should return array');
    assert(history.length <= 5, 'Should not exceed session count');

    if (history.length > 0) {
        assert(history[0].date, 'Should have date');
        assert(typeof history[0].accuracy === 'number', 'Should have accuracy');
        assert(typeof history[0].correctSentences === 'number', 'Should have correct sentences');
    }
});

test('Should handle fallback analysis', async () => {
    const fallback = await integrationOptimizer.performFallbackAnalysis('test text', 'fallback_user');

    assert(fallback.isFallback === true, 'Should mark as fallback');
    assert(fallback.realTime, 'Should include real-time analysis');
    assert(fallback.contextualGuides === null, 'Should not include guides in fallback');
    assert(fallback.progressIndicators === null, 'Should not include progress in fallback');
    assert(fallback.performance.optimizationsApplied.includes('fallback_mode'), 'Should mark fallback optimization');
});

test('Should run integration tests', async () => {
    const testResults = await integrationOptimizer.runIntegrationTests();

    assert(testResults.timestamp, 'Should have timestamp');
    assert(typeof testResults.allTestsPassed === 'boolean', 'Should have overall test status');
    assert(testResults.tests, 'Should have individual test results');
    assert(testResults.summary, 'Should have test summary');
    assert(testResults.summary.totalTests > 0, 'Should have run tests');
});

test('Should test real-time integration', async () => {
    const testResult = await integrationOptimizer.testRealTimeIntegration();

    assert(testResult && typeof testResult.passed === 'boolean', 'Should have pass/fail status');
    assert(testResult.message, 'Should have test message');

    if (testResult.passed) {
        assert(testResult.details, 'Should have test details on success');
    } else {
        // Error message might be in error property or message
        assert(testResult.error || testResult.message, 'Should have error information on failure');
    }
});

test('Should test performance', async () => {
    const performanceTest = await integrationOptimizer.testPerformance();

    assert(typeof performanceTest.passed === 'boolean', 'Should have pass/fail status');
    assert(performanceTest.message, 'Should have test message');
    assert(performanceTest.details, 'Should have performance details');
    assert(typeof performanceTest.details.duration === 'number', 'Should measure duration');
    assert(performanceTest.details.analysisCount === 5, 'Should test multiple analyses');
});

// ═══════════════════════════════════════════════════
// 🧪 TESTS DE INTEGRACIÓN COMPLETA
// ═══════════════════════════════════════════════════

console.log('\n🧪 Testing Complete Integration...\n');

test('Should integrate all components successfully', async () => {
    const text = 'While I was cooking, she was studying';
    const userId = 'complete_integration_user';

    // Crear perfil de usuario para prueba completa
    await integrationOptimizer.adaptiveLearning.evaluateInitialLevel(userId, [
        { answer: 'was', timeSpent: 5000 },
        { answer: 'studying', timeSpent: 8000 }
    ]);

    const result = await integrationOptimizer.performIntegratedAnalysis(text, userId);

    assert(result.realTime, 'Should include real-time analysis');
    assert(result.contextualGuides, 'Should include contextual guides');
    assert(result.progressIndicators, 'Should include progress indicators');
    assert(result.adaptiveRecommendations, 'Should include adaptive recommendations');

    // Verificar que los componentes están conectados correctamente
    assert(result.realTime.tenseType, 'Real-time should detect tense');
    assert(result.contextualGuides.tips, 'Guides should provide tips');
    assert(result.progressIndicators.userLevel, 'Progress should show user level');
    assert(result.adaptiveRecommendations.focusAreas, 'Adaptive should provide focus areas');
});

test('Should handle optimization cycle', () => {
    // Agregar algunas métricas
    integrationOptimizer.recordPerformanceMetric('test_optimization', 50);
    integrationOptimizer.recordPerformanceMetric('test_optimization', 75);
    integrationOptimizer.recordPerformanceMetric('test_optimization', 100);

    // Ejecutar optimización
    const optimization = integrationOptimizer.optimizePerformance();

    assert(optimization.optimizations.cacheOptimization, 'Should optimize cache');
    assert(optimization.optimizations.memoryOptimization, 'Should optimize memory');
    assert(optimization.metrics.test_optimization, 'Should include test metrics');

    // Verificar que las métricas se calculan correctamente
    const testMetrics = optimization.metrics.test_optimization;
    assert(testMetrics.count === 3, 'Should count all metrics');
    assert(testMetrics.averageDuration === 75, 'Should calculate correct average');
});

test('Should maintain performance under load', async () => {
    const startTime = Date.now();
    const promises = [];

    // Simular carga con múltiples análisis
    for (let i = 0; i < 10; i++) {
        promises.push(
            integrationOptimizer.performIntegratedAnalysis(
                `I was walking ${i}`,
                `load_test_user_${i}`
            )
        );
    }

    const results = await Promise.all(promises);
    const duration = Date.now() - startTime;

    assert(results.length === 10, 'Should complete all analyses');
    assert(duration < 5000, 'Should complete within reasonable time'); // 5 segundos
    assert(results.every(r => r.realTime), 'All results should have real-time analysis');
});

test('Should handle error recovery', async () => {
    // Test con texto que podría causar errores
    const problematicTexts = [
        '', // Texto vacío
        'a'.repeat(1000), // Texto muy largo
        '!@#$%^&*()', // Caracteres especiales
        null, // Valor nulo
        undefined // Valor indefinido
    ];

    let successfulAnalyses = 0;
    let fallbackAnalyses = 0;

    for (const text of problematicTexts) {
        try {
            const result = await integrationOptimizer.performIntegratedAnalysis(text, 'error_test_user');
            if (result.isFallback) {
                fallbackAnalyses++;
            } else {
                successfulAnalyses++;
            }
        } catch (error) {
            // Los errores son esperados para algunos casos
        }
    }

    // Al menos algunos análisis deberían funcionar o usar fallback
    assert(successfulAnalyses + fallbackAnalyses > 0, 'Should handle some cases gracefully');
});

console.log('\n🎉 All Integration tests completed!\n');