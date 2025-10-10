# 🛠️ Development Guide - Past Continuous Builder

Esta guía te ayudará a entender y contribuir al proyecto de manera efectiva.

## 📁 Estructura del Proyecto

```
past_continuo/
├── 📁 src/                    # Código fuente principal
│   ├── 📁 config/            # Configuraciones y constantes
│   ├── 📁 controllers/       # Controladores HTTP (lógica de rutas)
│   ├── 📁 middlewares/       # Middlewares personalizados
│   ├── 📁 models/            # Modelos de datos (futuro: DB schemas)
│   ├── 📁 routes/            # Definición de rutas de la API
│   ├── 📁 services/          # Lógica de negocio
│   ├── 📁 utils/             # Utilidades y helpers
│   └── 📄 app.js             # Configuración principal de Express
├── 📁 public/                # Archivos estáticos (CSS, JS, imágenes)
├── 📁 views/                 # Templates HTML
├── 📁 tests/                 # Tests unitarios y de integración
├── 📁 logs/                  # Archivos de log (generados automáticamente)
├── 📄 server.js              # Punto de entrada de la aplicación
├── 📄 package.json           # Dependencias y scripts
└── 📄 .env                   # Variables de entorno (no subir a git)
```

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Ejecutar tests
npm test

# Linting (cuando esté configurado)
npm run lint

# Setup completo del proyecto
npm run setup
```

## 🧪 Testing

### Ejecutar Tests
```bash
npm test
```

### Agregar Nuevos Tests
1. Crear archivo en `/tests/`
2. Seguir el patrón de `validator.test.js`
3. Usar las funciones `test()` y `assert()` incluidas

### Ejemplo de Test
```javascript
test('Should validate past continuous', () => {
  assert(validatePastContinuous('I was walking'), 'Should detect was + verb-ing');
});
```

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Práctica
- `POST /api/practice/submit` - Enviar oración (modo clásico)
- `POST /api/practice/live-analyze` - Análisis en tiempo real
- `POST /api/practice/full-analyze` - Análisis completo con puntuación
- `GET /api/practice/history` - Historial de oraciones
- `GET /api/practice/stats` - Estadísticas del usuario

### Sugerencias
- `GET /api/suggestions` - Todas las sugerencias
- `GET /api/suggestions/:connector` - Sugerencias por conector
- `GET /api/suggestions/search?q=query` - Buscar sugerencias

## 🔧 Configuración

### Variables de Entorno (.env)
```bash
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_here
LOG_LEVEL=INFO
```

### Constantes Importantes
- `CONNECTORS`: ['while', 'when', 'as']
- `POINTS.CORRECT_SENTENCE`: 10 puntos base
- `VALIDATION.MIN_SENTENCE_LENGTH`: 10 caracteres mínimo

## 🎯 Flujo de Desarrollo

### 1. Agregar Nueva Funcionalidad
1. **Planificar**: Define qué vas a construir
2. **Rutas**: Agrega endpoints en `/routes/`
3. **Controlador**: Maneja HTTP en `/controllers/`
4. **Servicio**: Lógica de negocio en `/services/`
5. **Utilidades**: Helpers en `/utils/` si es necesario
6. **Tests**: Agrega tests para tu funcionalidad
7. **Frontend**: Actualiza vistas si es necesario

### 2. Debugging
- Usa `console.log()` o el logger: `logger.info('mensaje')`
- Revisa logs en `/logs/app-YYYY-MM-DD.log`
- Usa el endpoint `/api/health` para verificar el servidor

### 3. Validación de Oraciones
El sistema usa regex para detectar:
- **Past Continuous**: `was/were + verb-ing`
- **Past Simple**: verbos irregulares + verbos regulares con `-ed`
- **Conectores**: while, when, as

## 🎮 Sistema de Gamificación

### Puntos
- Oración correcta: 10 puntos
- Gramática perfecta: 15 puntos
- Bonus por racha: 5 puntos
- Texto largo (50+ palabras): 10 puntos

### Badges
- `FIRST_SENTENCE`: Primera oración completada
- `STREAK_7`: 7 días consecutivos
- `GRAMMAR_GURU`: 95% precisión en 50 oraciones
- `CONNECTOR_MASTER`: Dominar los 3 conectores

## 🔍 Análisis Inteligente

### Live Analysis
- Se ejecuta cada 1.5 segundos mientras escribes
- Detecta patrones en tiempo real
- Ofrece sugerencias contextuales

### Full Analysis
- Análisis completo al finalizar
- Calcula puntuación total
- Proporciona feedback detallado
- Actualiza progreso del usuario

## 🛡️ Seguridad

### Rate Limiting
- API general: 100 requests/15min
- Autenticación: 5 intentos/15min
- Práctica: 30 requests/minuto

### Validación
- Sanitización de inputs
- Validación de longitud
- Escape de caracteres especiales

## 📝 Logging

### Niveles
- `ERROR`: Errores críticos
- `WARN`: Advertencias
- `INFO`: Información general
- `DEBUG`: Información detallada

### Uso
```javascript
const { logger } = require('./utils/logger');

logger.info('Usuario completó ejercicio', { userId: 123, points: 25 });
logger.error('Error en validación', { error: err.message });
```

## 🔮 Próximas Funcionalidades

### Prioridad Alta
- [ ] Integración con MongoDB/MySQL
- [ ] Sistema de usuarios persistente
- [ ] Leaderboards globales
- [ ] Más tipos de ejercicios

### Prioridad Media
- [ ] Modo colaborativo
- [ ] Integración con APIs de traducción
- [ ] Análisis de voz (speech-to-text)
- [ ] Modo offline

### Prioridad Baja
- [ ] Temas personalizables
- [ ] Exportar progreso
- [ ] Integración con redes sociales

## 🐛 Troubleshooting

### El servidor no inicia
1. Verifica que tengas Node.js instalado
2. Ejecuta `npm install`
3. Verifica que el puerto 3000 esté libre
4. Revisa el archivo `.env`

### Los tests fallan
1. Verifica que todas las dependencias estén instaladas
2. Ejecuta `npm test` desde la raíz del proyecto
3. Revisa los mensajes de error específicos

### Problemas con npm
1. Limpia caché: `npm cache clean --force`
2. Elimina `node_modules` y `package-lock.json`
3. Ejecuta `npm install` nuevamente

## 📞 Contribuir

1. **Fork** el repositorio
2. **Crea** una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** tus cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. **Abre** un Pull Request

## 📚 Recursos Útiles

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [JavaScript Style Guide](https://github.com/airbnb/javascript)
- [REST API Design](https://restfulapi.net/)

---

¡Happy coding! 🎉