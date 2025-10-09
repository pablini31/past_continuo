# Design Document - Enhanced Learning Interface

## Overview

Este diseño transforma la aplicación Past Continuous Builder en una herramienta de aprendizaje interactiva y visual que ayuda a los estudiantes a dominar los tiempos pasados en inglés mediante feedback inmediato, iconos de estructura gramatical y explicaciones en español.

## Architecture

### Frontend Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Learning Interface                    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────┐ │
│  │ Grammar Icons   │  │ Real-time       │  │ Spanish  │ │
│  │ Component       │  │ Analyzer        │  │ Feedback │ │
│  └─────────────────┘  └─────────────────┘  └──────────┘ │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────┐ │
│  │ Text Input      │  │ Progress        │  │ Guided   │ │
│  │ Handler         │  │ Tracker         │  │ Mode     │ │
│  └─────────────────┘  └─────────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Backend Services
```
┌─────────────────────────────────────────────────────────┐
│                   Enhanced Services                     │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────┐ │
│  │ Grammar         │  │ Spanish         │  │ Context  │ │
│  │ Structure       │  │ Translation     │  │ Analysis │ │
│  │ Analyzer        │  │ Service         │  │ Service  │ │
│  └─────────────────┘  └─────────────────┘  └──────────┘ │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────┐ │
│  │ Error           │  │ Learning        │  │ Progress │ │
│  │ Correction      │  │ Path            │  │ Tracking │ │
│  │ Engine          │  │ Manager         │  │ Service  │ │
│  └─────────────────┘  └─────────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Grammar Structure Icons Component

**Purpose:** Mostrar iconos visuales que representen la estructura gramatical y se activen conforme el usuario escribe.

**Interface:**
```javascript
interface GrammarIcon {
  type: 'subject' | 'auxiliary' | 'verb' | 'gerund' | 'complement' | 'connector';
  isActive: boolean;
  isRequired: boolean;
  tooltip: string; // En español
}

interface GrammarStructure {
  tenseType: 'past_continuous' | 'past_simple';
  icons: GrammarIcon[];
  completionPercentage: number;
}
```

**Visual Design:**
- **Sujeto:** 👤 (persona)
- **Was/Were:** ⚡ (auxiliar)
- **Verbo:** 🎯 (acción)
- **-ing:** 🔄 (gerundio)
- **Complemento:** 📝 (información adicional)
- **Conector:** 🔗 (while, when, as)

### 2. Spanish Feedback System

**Purpose:** Proporcionar explicaciones de errores y sugerencias en español.

**Interface:**
```javascript
interface SpanishFeedback {
  type: 'error' | 'warning' | 'success' | 'tip';
  message: string; // En español
  englishExample: string;
  spanishExplanation: string;
  correction?: string;
  rule?: string;
}
```

**Error Messages Examples:**
```javascript
const errorMessages = {
  presentInPast: {
    message: "❌ Error: Estás usando presente, pero necesitas pasado",
    correction: "Cambia 'am/is/are' por 'was/were'",
    example: "I am walking → I was walking"
  },
  wrongAuxiliary: {
    message: "⚠️ Cuidado: Verifica el auxiliar was/were",
    correction: "Usa 'was' con I/he/she/it y 'were' con you/we/they",
    example: "I were walking → I was walking"
  },
  missingGerund: {
    message: "📝 Falta: Agrega '-ing' al verbo para Past Continuous",
    correction: "El Past Continuous necesita verbo + ing",
    example: "I was walk → I was walking"
  }
};
```

### 3. Real-time Grammar Analyzer

**Purpose:** Analizar la estructura gramatical en tiempo real mientras el usuario escribe.

**Interface:**
```javascript
interface GrammarAnalysis {
  sentence: string;
  detectedStructure: GrammarStructure;
  errors: SpanishFeedback[];
  suggestions: SpanishFeedback[];
  contextRecommendation: 'past_simple' | 'past_continuous' | 'both';
  completedParts: string[];
  nextExpectedPart: string;
}
```

**Analysis Flow:**
1. **Tokenize** la oración en palabras
2. **Identify** sujeto, verbo, auxiliares
3. **Validate** estructura según el tiempo verbal
4. **Generate** feedback en español
5. **Update** iconos de estado

### 4. Context Intelligence Engine

**Purpose:** Determinar cuándo usar Past Simple vs Past Continuous basado en el contexto.

**Context Rules:**
```javascript
const contextRules = {
  connectors: {
    'while': {
      recommendation: 'past_continuous',
      explanation: "'While' indica acciones simultáneas, usa Past Continuous",
      example: "While I was studying, she was cooking"
    },
    'when': {
      recommendation: 'mixed',
      explanation: "'When' puede usar ambos tiempos según el contexto",
      examples: {
        interruption: "I was sleeping when the phone rang",
        simultaneous: "When I was young, I lived in Mexico"
      }
    },
    'as': {
      recommendation: 'past_continuous',
      explanation: "'As' sugiere acciones en desarrollo simultáneo",
      example: "As the sun was setting, we were walking home"
    }
  },
  timeIndicators: {
    'yesterday': 'past_simple',
    'last night': 'past_simple',
    'all day': 'past_continuous',
    'constantly': 'past_continuous',
    'suddenly': 'past_simple'
  }
};
```

### 5. Enhanced UI Components

**Purpose:** Crear una interfaz amigable y profesional que facilite el aprendizaje.

**Design System:**
```css
:root {
  /* Colores profesionales y suaves */
  --primary-color: #4A90E2;      /* Azul suave */
  --success-color: #7ED321;      /* Verde natural */
  --warning-color: #F5A623;      /* Naranja suave */
  --error-color: #D0021B;        /* Rojo claro */
  --neutral-color: #9B9B9B;      /* Gris medio */
  --background: #FAFBFC;         /* Fondo muy claro */
  --text-primary: #2C3E50;       /* Texto principal */
  --text-secondary: #7F8C8D;     /* Texto secundario */
  
  /* Espaciado consistente */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Tipografía */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
}
```

**Component Structure:**
```html
<div class="learning-interface">
  <!-- Grammar Structure Icons -->
  <div class="grammar-icons">
    <div class="icon-group">
      <span class="grammar-icon subject" data-active="true">👤</span>
      <span class="grammar-icon auxiliary" data-active="false">⚡</span>
      <span class="grammar-icon verb" data-active="false">🎯</span>
      <span class="grammar-icon gerund" data-active="false">🔄</span>
    </div>
  </div>
  
  <!-- Main Input Area -->
  <div class="input-container">
    <textarea class="sentence-input" placeholder="Escribe tu oración aquí..."></textarea>
    <div class="real-time-feedback"></div>
  </div>
  
  <!-- Spanish Feedback Panel -->
  <div class="feedback-panel">
    <div class="feedback-item success">
      <span class="feedback-icon">✅</span>
      <span class="feedback-text">¡Excelente! Usaste Past Continuous correctamente</span>
    </div>
  </div>
</div>
```

## Data Models

### Grammar Structure Model
```javascript
class GrammarStructure {
  constructor(tenseType) {
    this.tenseType = tenseType; // 'past_continuous' | 'past_simple'
    this.requiredParts = this.getRequiredParts(tenseType);
    this.completedParts = new Set();
    this.errors = [];
    this.suggestions = [];
  }
  
  getRequiredParts(tenseType) {
    if (tenseType === 'past_continuous') {
      return ['subject', 'auxiliary', 'verb', 'gerund'];
    } else {
      return ['subject', 'past_verb'];
    }
  }
  
  updateCompletion(detectedParts) {
    this.completedParts = new Set(detectedParts);
    return this.getCompletionPercentage();
  }
  
  getCompletionPercentage() {
    return (this.completedParts.size / this.requiredParts.length) * 100;
  }
}
```

### Spanish Feedback Model
```javascript
class SpanishFeedback {
  constructor(type, messageKey, context = {}) {
    this.type = type; // 'error' | 'warning' | 'success' | 'tip'
    this.message = this.getMessage(messageKey, context);
    this.timestamp = new Date();
    this.context = context;
  }
  
  getMessage(key, context) {
    const messages = {
      error_present_in_past: `❌ Error: Estás usando presente ("${context.detected}"), pero necesitas pasado`,
      success_correct_structure: `✅ ¡Perfecto! Estructura de ${context.tense} correcta`,
      tip_while_usage: `💡 Tip: "While" se usa para acciones simultáneas en Past Continuous`,
      warning_wrong_auxiliary: `⚠️ Cuidado: Usa "was" con I/he/she/it y "were" con you/we/they`
    };
    return messages[key] || 'Mensaje no encontrado';
  }
}
```

### Learning Progress Model
```javascript
class LearningProgress {
  constructor(userId) {
    this.userId = userId;
    this.masteredConcepts = new Set();
    this.strugglingAreas = new Map();
    this.sessionStats = {
      correctSentences: 0,
      totalAttempts: 0,
      conceptsLearned: 0
    };
  }
  
  updateProgress(concept, isCorrect) {
    if (isCorrect) {
      this.masteredConcepts.add(concept);
      this.sessionStats.correctSentences++;
    } else {
      const struggles = this.strugglingAreas.get(concept) || 0;
      this.strugglingAreas.set(concept, struggles + 1);
    }
    this.sessionStats.totalAttempts++;
  }
  
  getRecommendations() {
    const recommendations = [];
    
    // Recomendar práctica adicional para áreas problemáticas
    for (const [concept, struggles] of this.strugglingAreas) {
      if (struggles >= 3) {
        recommendations.push({
          type: 'practice',
          concept,
          message: `Practica más con ${concept} - has tenido ${struggles} errores`
        });
      }
    }
    
    return recommendations;
  }
}
```

## Error Handling

### Grammar Error Detection
```javascript
class GrammarErrorDetector {
  detectErrors(sentence, expectedStructure) {
    const errors = [];
    
    // Error: Usar presente en contexto pasado
    if (this.hasPresentTense(sentence) && expectedStructure.includes('past')) {
      errors.push(new SpanishFeedback('error', 'error_present_in_past', {
        detected: this.getPresentVerbs(sentence)
      }));
    }
    
    // Error: Auxiliar incorrecto
    if (this.hasWrongAuxiliary(sentence)) {
      errors.push(new SpanishFeedback('error', 'warning_wrong_auxiliary'));
    }
    
    // Error: Falta gerundio en Past Continuous
    if (expectedStructure === 'past_continuous' && !this.hasGerund(sentence)) {
      errors.push(new SpanishFeedback('error', 'missing_gerund', {
        suggestion: this.suggestGerund(sentence)
      }));
    }
    
    return errors;
  }
}
```

### User Experience Error Handling
- **Conexión perdida:** Guardar progreso localmente
- **Análisis fallido:** Mostrar mensaje amigable en español
- **Carga lenta:** Mostrar indicadores de progreso
- **Errores de validación:** Explicar claramente qué corregir

## Testing Strategy

### Unit Tests
- **Grammar Structure Analyzer:** Validar detección de estructuras
- **Spanish Feedback Generator:** Verificar mensajes correctos
- **Context Intelligence:** Probar recomendaciones de tiempo verbal
- **Error Detection:** Confirmar identificación de errores comunes

### Integration Tests
- **Real-time Analysis:** Verificar análisis mientras se escribe
- **Icon Activation:** Confirmar activación correcta de iconos
- **Feedback Display:** Validar mostrar feedback en español
- **Progress Tracking:** Verificar seguimiento de progreso

### User Experience Tests
- **Usabilidad:** Interfaz intuitiva para estudiantes
- **Accesibilidad:** Compatible con lectores de pantalla
- **Responsividad:** Funciona en móviles y tablets
- **Performance:** Análisis rápido sin lag perceptible

### Educational Effectiveness Tests
- **Learning Outcomes:** Medir mejora en comprensión
- **Error Reduction:** Verificar disminución de errores comunes
- **Engagement:** Medir tiempo de uso y satisfacción
- **Retention:** Evaluar retención de conceptos aprendidos

## Implementation Phases

### Phase 1: Core Grammar Analysis (2 weeks)
- Implementar detección de estructura gramatical
- Crear sistema de iconos básico
- Desarrollar feedback en español
- Tests unitarios básicos

### Phase 2: Real-time Interface (2 weeks)
- Análisis en tiempo real
- Activación de iconos dinámicos
- Interfaz visual mejorada
- Integración con backend

### Phase 3: Context Intelligence (1 week)
- Motor de recomendaciones contextuales
- Detección de conectores
- Sugerencias inteligentes
- Validación de reglas

### Phase 4: Learning Experience (1 week)
- Modo de práctica guiada
- Sistema de progreso
- Personalización de aprendizaje
- Pulimiento de UX

### Phase 5: Testing & Optimization (1 week)
- Tests de integración completos
- Optimización de performance
- Validación educativa
- Preparación para producción