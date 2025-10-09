// run-all-tests.js

/**
 * ═══════════════════════════════════════════════════
 * 🧪 RUN ALL TESTS
 * ═══════════════════════════════════════════════════
 * 
 * Script para ejecutar todas las pruebas del proyecto
 */

const { execSync } = require('child_process');
const path = require('path');

const testFiles = [
  'tests/real-time-analysis.test.js',
  'tests/contextual-guides.test.js',
  'tests/progress-indicators.test.js',
  'tests/guided-practice.test.js',
  'tests/adaptive-learning.test.js',
  'tests/integration.test.js'
];

console.log('🧪 Ejecutando todas las pruebas del proyecto...\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

testFiles.forEach((testFile, index) => {
  console.log(`\n📋 Ejecutando: ${testFile}`);
  console.log('═'.repeat(50));
  
  try {
    const output = execSync(`node ${testFile}`, { 
      encoding: 'utf8',
      cwd: __dirname
    });
    
    console.log(output);
    
    // Contar tests
    const matches = output.match(/✅/g);
    if (matches) {
      const testsInFile = matches.length;
      totalTests += testsInFile;
      passedTests += testsInFile;
      console.log(`✅ ${testsInFile} pruebas pasaron en ${testFile}`);
    }
    
  } catch (error) {
    console.error(`❌ Error ejecutando ${testFile}:`);
    console.error(error.stdout || error.message);
    failedTests++;
  }
});

console.log('\n' + '═'.repeat(60));
console.log('📊 RESUMEN DE PRUEBAS');
console.log('═'.repeat(60));
console.log(`✅ Pruebas pasadas: ${passedTests}`);
console.log(`❌ Pruebas fallidas: ${failedTests}`);
console.log(`📊 Total de pruebas: ${totalTests}`);
console.log(`📈 Porcentaje de éxito: ${totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%`);

if (failedTests === 0) {
  console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
  process.exit(0);
} else {
  console.log('\n⚠️ Algunas pruebas fallaron. Revisa los errores arriba.');
  process.exit(1);
}