// src/utils/logger.js

/**
 * ═══════════════════════════════════════════════════
 * 📝 LOGGING UTILITY
 * ═══════════════════════════════════════════════════
 * 
 * Sistema de logging centralizado para la aplicación
 */

const fs = require('fs');
const path = require('path');

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Niveles de log
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const LOG_COLORS = {
  ERROR: '\x1b[31m', // Rojo
  WARN: '\x1b[33m',  // Amarillo
  INFO: '\x1b[36m',  // Cian
  DEBUG: '\x1b[37m', // Blanco
  RESET: '\x1b[0m'   // Reset
};

class Logger {
  constructor(level = 'INFO') {
    this.level = LOG_LEVELS[level] || LOG_LEVELS.INFO;
    this.logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  writeToFile(formattedMessage) {
    try {
      fs.appendFileSync(this.logFile, formattedMessage + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  log(level, message, meta = {}) {
    const levelValue = LOG_LEVELS[level];
    
    if (levelValue <= this.level) {
      const formattedMessage = this.formatMessage(level, message, meta);
      
      // Console output con colores
      const color = LOG_COLORS[level] || LOG_COLORS.RESET;
      console.log(`${color}${formattedMessage}${LOG_COLORS.RESET}`);
      
      // File output
      this.writeToFile(formattedMessage);
    }
  }

  error(message, meta = {}) {
    this.log('ERROR', message, meta);
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }

  // Método especial para requests HTTP
  request(req, res, responseTime) {
    const meta = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    };

    const level = res.statusCode >= 400 ? 'WARN' : 'INFO';
    this.log(level, `HTTP Request`, meta);
  }

  // Método para errores de aplicación
  appError(error, context = {}) {
    const meta = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...context
    };

    this.error('Application Error', meta);
  }

  // Método para eventos de práctica
  practice(userId, action, details = {}) {
    const meta = {
      userId,
      action,
      ...details
    };

    this.info('Practice Event', meta);
  }

  // Método para eventos de autenticación
  auth(action, details = {}) {
    const meta = {
      action,
      timestamp: new Date().toISOString(),
      ...details
    };

    this.info('Auth Event', meta);
  }
}

// Crear instancia global
const logger = new Logger(process.env.LOG_LEVEL || 'INFO');

// Middleware para logging automático de requests
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    logger.request(req, res, responseTime);
  });
  
  next();
};

module.exports = {
  logger,
  requestLogger,
  Logger
};