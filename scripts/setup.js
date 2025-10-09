#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════
 * 🚀 SETUP SCRIPT
 * ═══════════════════════════════════════════════════
 * 
 * Script para configurar el proyecto automáticamente
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('');
console.log('═══════════════════════════════════════════════════');
console.log('🎓 PAST CONTINUOUS BUILDER - SETUP');
console.log('═══════════════════════════════════════════════════');
console.log('');

// Función para ejecutar comandos
function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

// Función para crear directorio si no existe
function ensureDirectory(dirPath, description) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created ${description}: ${dirPath}`);
  } else {
    console.log(`✅ ${description} already exists: ${dirPath}`);
  }
}

// Función para verificar archivo
function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} exists: ${filePath}`);
    return true;
  } else {
    console.log(`⚠️  ${description} missing: ${filePath}`);
    return false;
  }
}

async function setup() {
  try {
    console.log('🔍 Checking project structure...\n');

    // Verificar directorios importantes
    const directories = [
      { path: 'src', desc: 'Source directory' },
      { path: 'src/config', desc: 'Config directory' },
      { path: 'src/controllers', desc: 'Controllers directory' },
      { path: 'src/middlewares', desc: 'Middlewares directory' },
      { path: 'src/routes', desc: 'Routes directory' },
      { path: 'src/services', desc: 'Services directory' },
      { path: 'src/utils', desc: 'Utils directory' },
      { path: 'public', desc: 'Public directory' },
      { path: 'views', desc: 'Views directory' },
      { path: 'tests', desc: 'Tests directory' },
      { path: 'logs', desc: 'Logs directory' }
    ];

    directories.forEach(dir => {
      ensureDirectory(dir.path, dir.desc);
    });

    console.log('');

    // Verificar archivos importantes
    const files = [
      { path: '.env', desc: 'Environment file' },
      { path: 'package.json', desc: 'Package file' },
      { path: 'src/app.js', desc: 'Main app file' },
      { path: 'server.js', desc: 'Server entry point' }
    ];

    let allFilesExist = true;
    files.forEach(file => {
      if (!checkFile(file.path, file.desc)) {
        allFilesExist = false;
      }
    });

    if (!allFilesExist) {
      console.log('\n⚠️  Some important files are missing. Please check the project structure.');
    }

    console.log('');

    // Verificar Node.js y npm
    console.log('🔍 Checking system requirements...\n');
    
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      console.log(`✅ Node.js version: ${nodeVersion}`);
    } catch (error) {
      console.log('❌ Node.js not found. Please install Node.js first.');
      process.exit(1);
    }

    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      console.log(`✅ npm version: ${npmVersion}`);
    } catch (error) {
      console.log('❌ npm not found. Please install npm first.');
      process.exit(1);
    }

    console.log('');

    // Instalar dependencias si es necesario
    if (!fs.existsSync('node_modules')) {
      runCommand('npm install', 'Installing dependencies');
    } else {
      console.log('✅ Dependencies already installed');
    }

    console.log('');

    // Ejecutar tests
    console.log('🧪 Running tests...\n');
    try {
      runCommand('npm test', 'Running test suite');
    } catch (error) {
      console.log('⚠️  Tests failed, but setup will continue...');
    }

    console.log('');

    // Verificar que el servidor puede iniciar
    console.log('🚀 Checking server startup...\n');
    
    // Crear un proceso hijo para probar el servidor
    const { spawn } = require('child_process');
    
    return new Promise((resolve) => {
      const serverProcess = spawn('node', ['server.js'], {
        stdio: 'pipe',
        env: { ...process.env, PORT: '3001' } // Usar puerto diferente para test
      });

      let serverStarted = false;
      
      const timeout = setTimeout(() => {
        if (!serverStarted) {
          serverProcess.kill();
          console.log('⚠️  Server startup test timed out');
          resolve();
        }
      }, 5000);

      serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Servidor iniciado exitosamente')) {
          serverStarted = true;
          clearTimeout(timeout);
          serverProcess.kill();
          console.log('✅ Server can start successfully');
          resolve();
        }
      });

      serverProcess.stderr.on('data', (data) => {
        const error = data.toString();
        if (error.includes('EADDRINUSE')) {
          console.log('⚠️  Port 3001 is in use, but server code seems OK');
        } else {
          console.log('⚠️  Server startup issue:', error.trim());
        }
        clearTimeout(timeout);
        serverProcess.kill();
        resolve();
      });

      serverProcess.on('error', (error) => {
        clearTimeout(timeout);
        console.log('❌ Server startup failed:', error.message);
        resolve();
      });
    });

  } catch (error) {
    console.log('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Función principal
async function main() {
  await setup();
  
  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log('🎉 SETUP COMPLETED!');
  console.log('═══════════════════════════════════════════════════');
  console.log('');
  console.log('📋 Next steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Open: http://localhost:3000');
  console.log('   3. Start coding! 🚀');
  console.log('');
  console.log('📚 Useful commands:');
  console.log('   npm run dev     - Start development server');
  console.log('   npm test        - Run tests');
  console.log('   npm start       - Start production server');
  console.log('');
  console.log('📖 Check DEVELOPMENT.md for more information');
  console.log('');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setup, main };