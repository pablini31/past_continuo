// src/app.js

/**
 * ═══════════════════════════════════════════════════
 * 🎓 PAST CONTINUOUS BUILDER - Express Configuration
 * ═══════════════════════════════════════════════════
 * 
 * Este archivo configura toda la aplicación Express:
 * - Middlewares de seguridad
 * - Parsers de body
 * - Rutas de la API
 * - Manejo de errores
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

// Importar middlewares personalizados
const errorMiddleware = require('./middlewares/error.middleware');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const practiceRoutes = require('./routes/practice.routes');
const userRoutes = require('./routes/user.routes');
const suggestionRoutes = require('./routes/suggestion.routes');

const app = express();

// ═══════════════════════════════════════════════════
// 🛡️ SECURITY MIDDLEWARES
// ═══════════════════════════════════════════════════

/**
 * Helmet: Protege la app de vulnerabilidades web conocidas
 * Configura varios HTTP headers de seguridad
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Permite CSS inline
      scriptSrc: ["'self'", "'unsafe-inline'"], // Permite JS inline (cambiar en producción)
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

/**
 * CORS: Permite peticiones desde el frontend
 * En producción, especifica los dominios permitidos
 */
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://tu-dominio.com' 
    : 'http://localhost:3000',
  credentials: true // Permite cookies
}));

// ═══════════════════════════════════════════════════
// 📝 LOGGING MIDDLEWARE
// ═══════════════════════════════════════════════════

/**
 * Morgan: Logger de peticiones HTTP
 * Formato 'dev': GET /api/users 200 15.123 ms
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined')); // Más detallado para producción
}

// ═══════════════════════════════════════════════════
// 🔧 BODY PARSERS & COOKIES
// ═══════════════════════════════════════════════════

/**
 * Express JSON: Parsea body en formato JSON
 * Límite de 10mb para prevenir ataques DoS
 */
app.use(express.json({ limit: '10mb' }));

/**
 * URL Encoded: Parsea formularios HTML
 * extended: true permite objetos anidados
 */
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Cookie Parser: Parsea cookies de las peticiones
 * Necesario para JWT en cookies
 */
app.use(cookieParser());

// ═══════════════════════════════════════════════════
// 📁 STATIC FILES
// ═══════════════════════════════════════════════════

/**
 * Sirve archivos estáticos desde /public
 * Accesibles directamente: http://localhost:3000/css/styles.css
 */
app.use(express.static(path.join(__dirname, '../public')));

/**
 * Sirve las vistas HTML
 */
app.use('/views', express.static(path.join(__dirname, '../views')));

// ═══════════════════════════════════════════════════
// 🏠 HOME ROUTE
// ═══════════════════════════════════════════════════

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Additional view routes
app.get('/login', (req, res) => {
  res.redirect('/views/login.html');
});

app.get('/register', (req, res) => {
  res.redirect('/views/register.html');
});

app.get('/practice', (req, res) => {
  res.redirect('/views/practice.html');
});

// ═══════════════════════════════════════════════════
// 🔍 HEALTH CHECK
// ═══════════════════════════════════════════════════

/**
 * Endpoint para verificar que el servidor está funcionando
 * Útil para monitoreo y deployment
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime()
  });
});

// ═══════════════════════════════════════════════════
// 📡 API INFO
// ═══════════════════════════════════════════════════

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🎓 Past Continuous Builder API',
    version: '1.0.0',
    description: 'Interactive web app for practicing Past Continuous tense',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me'
      },
      practice: {
        submit: 'POST /api/practice/submit',
        history: 'GET /api/practice/history',
        stats: 'GET /api/practice/stats'
      },
      suggestions: {
        get: 'GET /api/suggestions/:connector',
        random: 'GET /api/suggestions/random'
      },
      user: {
        profile: 'GET /api/users/profile',
        progress: 'GET /api/users/progress',
        leaderboard: 'GET /api/users/leaderboard'
      }
    },
    documentation: 'https://github.com/tu-usuario/past-continuous-builder'
  });
});

// ═══════════════════════════════════════════════════
// 🛣️ API ROUTES
// ═══════════════════════════════════════════════════

/**
 * Montamos las rutas de la API
 * Todas las rutas empiezan con /api
 */

// Montar las rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suggestions', suggestionRoutes);

// ═══════════════════════════════════════════════════
// ❌ 404 HANDLER
// ═══════════════════════════════════════════════════

/**
 * Captura todas las rutas no encontradas
 * Debe ir DESPUÉS de todas las rutas definidas
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '🔍 Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// ═══════════════════════════════════════════════════
// ⚠️ ERROR HANDLER
// ═══════════════════════════════════════════════════

/**
 * Middleware global de manejo de errores
 * Captura TODOS los errores de la aplicación
 * Debe ir AL FINAL de todos los middlewares
 */
app.use(errorMiddleware);

// ═══════════════════════════════════════════════════
// 📤 EXPORT
// ═══════════════════════════════════════════════════

module.exports = app;