# 🎓 Past Continuous Builder

Una aplicación web interactiva para practicar los tiempos pasados en inglés (Past Simple y Past Continuous) con análisis inteligente en tiempo real.

## 🆕 Nuevas Funcionalidades - Smart Practice

### ✨ Interfaz de Escritura Libre
- **Caja de texto única y centrada** donde puedes escribir libremente en inglés
- **Sin estructura predefinida** - escribe como te sientas natural
- **Análisis en tiempo real** mientras escribes (como las sugerencias de YouTube)

### 🔍 Detección Automática e Inteligente
- **Reconocimiento automático** de Past Simple y Past Continuous
- **Sugerencias contextuales** que aparecen dinámicamente según lo que escribes
- **Recomendaciones específicas** basadas en conectores (while, when, as)

### 📊 Feedback Inteligente
- **Análisis en vivo** con indicadores visuales de gramática
- **Puntuación en tiempo real** con contadores de palabras y oraciones
- **Feedback detallado** al finalizar con ejemplos específicos

## 🚀 Cómo Usar Smart Practice

1. **Navega a Smart Practice** desde la página principal
2. **Escribe libremente** en la caja de texto grande
3. **Observa las sugerencias** que aparecen mientras escribes
4. **Mira los indicadores** de gramática en tiempo real
5. **Haz clic en "Analyze"** para obtener feedback completo

## 🎯 Ejemplos de Uso

### Escritura Libre
```
Yesterday I was walking when I saw my friend. 
She was studying in the library while I was shopping.
We talked for hours and then went home.
```

### Lo que detecta automáticamente:
- ✅ Past Continuous: "was walking", "was studying"  
- ✅ Past Simple: "saw", "talked", "went"
- 💡 Conectores: "when", "while", "then"
- 📊 Puntuación: Puntos base + bonus por uso apropiado

## 🧠 Sistema de Recomendaciones Inteligente

### Basado en Conectores
- **"while"** → Sugiere Past Continuous para acciones simultáneas
- **"when"** → Sugiere Past Simple para interrupciones, Continuous para contexto
- **"as"** → Sugiere Past Continuous para acciones en desarrollo

### Basado en Contexto
- **Palabras clave temporales** (yesterday, last night) → Past Simple
- **Indicadores de duración** (all day, constantly) → Past Continuous
- **Interrupciones** (suddenly, immediately) → Past Simple

## 🛠️ Instalación y Configuración

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
# Copiar y editar el archivo .env
cp .env.example .env
```

3. **Iniciar el servidor:**
```bash
npm start
# o para desarrollo con auto-reload:
npm run dev
```

4. **Abrir en el navegador:**
```
http://localhost:3000
```

## 📚 Rutas Principales

- `/` - Página principal con ambos modos
- `/smart-practice` - Modo inteligente de escritura libre  
- `/practice` - Modo clásico estructurado
- `/api/practice/live-analyze` - Análisis en tiempo real
- `/api/practice/full-analyze` - Análisis completo con puntuación

## 🔧 Características Técnicas

### Backend
- **Node.js + Express** para el servidor
- **JWT** para autenticación
- **Validación en tiempo real** con regex avanzados
- **Sistema de puntuación** con bonus contextuales

### Frontend
- **Análisis dinámico** con debounce para performance
- **Indicadores visuales** de gramática en tiempo real
- **Interfaz responsive** y centrada en UX
- **Sugerencias contextualmente relevantes**

### Análisis Inteligente
- **Detección de patrones** Past Simple/Continuous
- **Análisis contextual** basado en conectores
- **Puntuación adaptativa** según uso apropiado
- **Feedback educativo** específico y útil

## 🎖️ Sistema de Puntuación

### Puntos Base
- **10 puntos** por oración gramaticalmente correcta
- **5 puntos bonus** por usar el tiempo verbal recomendado
- **10 puntos bonus** por textos de más de 50 palabras
- **5 puntos bonus** por usar múltiples conectores

### Niveles de Precisión
- **90%+** → "Outstanding! Excellent past tenses!"
- **70-89%** → "Great job! Good grammar with room for improvement"
- **50-69%** → "Good effort! Keep practicing past tenses"
- **<50%** → "Keep practicing! Focus on was/were + verb-ing"

## 🔮 Funcionalidades Futuras

- [ ] Integración con bases de datos (MongoDB/MySQL)
- [ ] Sistema de rachas y badges
- [ ] Leaderboards y competencias
- [ ] Más tiempos verbales (Present Perfect, etc.)
- [ ] Modo colaborativo multiplayer
- [ ] Integración con APIs de traducción

## 🐛 Resolución de Problemas

### El servidor no inicia
- Verifica que tengas `JWT_SECRET` en tu archivo `.env`
- Asegúrate de que el puerto 3000 esté libre

### Las sugerencias no aparecen
- Escribe al menos 20 caracteres para activar el análisis
- Espera 1.5 segundos después de parar de escribir

### Análisis incorrecto
- El sistema está optimizado para inglés - evita mezclar idiomas
- Usa oraciones completas con sujeto y verbo

## 📞 Soporte

Si encuentras problemas o tienes sugerencias, puedes:
- Revisar la consola del navegador para errores
- Verificar el endpoint `/api/health` para status del servidor
- Consultar los logs del servidor en la terminal

---

**¡Disfruta aprendiendo inglés de manera inteligente! 🎉**
