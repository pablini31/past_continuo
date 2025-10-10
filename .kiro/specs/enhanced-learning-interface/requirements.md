# Requirements Document - Enhanced Learning Interface

## Introduction

Esta especificación define las mejoras necesarias para transformar la aplicación Past Continuous Builder en una herramienta de aprendizaje más efectiva y amigable. El objetivo es ayudar a los estudiantes a diferenciar entre Past Simple y Past Continuous, proporcionando feedback visual inmediato y explicaciones en español para una mejor comprensión.

## Requirements

### Requirement 1: Sistema de Iconos de Estructura Gramatical

**User Story:** Como estudiante, quiero ver iconos visuales que representen las partes de la estructura gramatical, para entender mejor cómo construir oraciones en pasado.

#### Acceptance Criteria

1. WHEN el usuario esté escribiendo una oración THEN el sistema SHALL mostrar iconos para cada parte de la estructura gramatical
2. WHEN el usuario complete correctamente una parte de la estructura THEN el icono correspondiente SHALL activarse (cambiar de gris a color)
3. WHEN una parte de la estructura esté incompleta o incorrecta THEN el icono SHALL permanecer en gris
4. IF la oración es Past Continuous THEN el sistema SHALL mostrar iconos para: Sujeto + was/were + verbo-ing + complemento
5. IF la oración es Past Simple THEN el sistema SHALL mostrar iconos para: Sujeto + verbo en pasado + complemento
6. WHEN el usuario use conectores (while, when, as) THEN el sistema SHALL mostrar iconos adicionales para la segunda parte de la oración

### Requirement 2: Feedback de Errores en Español

**User Story:** Como estudiante hispanohablante, quiero recibir explicaciones de errores en español, para entender mejor mis errores y cómo corregirlos.

#### Acceptance Criteria

1. WHEN el sistema detecte un error gramatical THEN SHALL mostrar la explicación en español
2. WHEN el usuario use un tiempo verbal incorrecto THEN el sistema SHALL explicar cuál es el tiempo correcto y por qué
3. WHEN el usuario use un conector inapropiado THEN el sistema SHALL sugerir el conector correcto con explicación
4. IF el usuario escribe "I am walking" en contexto pasado THEN el sistema SHALL mostrar "Error: Usa 'I was walking' para pasado continuo"
5. WHEN el sistema proporcione sugerencias THEN SHALL incluir ejemplos en español e inglés
6. WHEN el usuario cometa errores comunes THEN el sistema SHALL proporcionar tips específicos en español

### Requirement 3: Detección Inteligente de Contexto

**User Story:** Como estudiante, quiero que el sistema me ayude a elegir entre Past Simple y Past Continuous según el contexto, para aprender cuándo usar cada tiempo verbal.

#### Acceptance Criteria

1. WHEN el usuario escriba "while" THEN el sistema SHALL sugerir Past Continuous y explicar por qué
2. WHEN el usuario escriba "when" con acción de interrupción THEN el sistema SHALL sugerir Past Simple para la interrupción
3. WHEN el usuario escriba "when" con acción en progreso THEN el sistema SHALL sugerir Past Continuous para el contexto
4. WHEN el sistema detecte palabras clave temporales (yesterday, last night) THEN SHALL sugerir Past Simple
5. WHEN el sistema detecte indicadores de duración (all day, constantly) THEN SHALL sugerir Past Continuous
6. IF el contexto es ambiguo THEN el sistema SHALL explicar ambas opciones con ejemplos

### Requirement 4: Interfaz Amigable y Profesional

**User Story:** Como usuario, quiero una interfaz limpia y profesional que no sea demasiado llamativa, para poder concentrarme en el aprendizaje.

#### Acceptance Criteria

1. WHEN el usuario acceda a la aplicación THEN SHALL ver una interfaz con colores suaves y profesionales
2. WHEN el usuario interactúe con elementos THEN las animaciones SHALL ser sutiles y no distractoras
3. WHEN el sistema muestre feedback THEN SHALL usar colores apropiados (verde para correcto, naranja para advertencias, rojo para errores)
4. IF el usuario está escribiendo THEN la interfaz SHALL mantener el foco en el área de texto principal
5. WHEN el sistema muestre iconos de estructura THEN SHALL usar un diseño minimalista y claro
6. WHEN el usuario navegue por la aplicación THEN SHALL encontrar una experiencia consistente y intuitiva

### Requirement 5: Análisis en Tiempo Real Mejorado

**User Story:** Como estudiante, quiero recibir feedback inmediato mientras escribo, para corregir errores al momento y aprender más efectivamente.

#### Acceptance Criteria

1. WHEN el usuario escriba una palabra THEN el sistema SHALL analizar la estructura en tiempo real
2. WHEN el usuario complete un sujeto válido THEN el icono de sujeto SHALL activarse
3. WHEN el usuario escriba un verbo auxiliar correcto (was/were) THEN el icono correspondiente SHALL activarse
4. WHEN el usuario agregue "-ing" a un verbo THEN el icono de gerundio SHALL activarse
5. IF el usuario escribe un verbo en presente THEN el sistema SHALL mostrar sugerencia de corrección inmediata
6. WHEN el usuario pause de escribir por 2 segundos THEN el sistema SHALL mostrar sugerencias contextuales

### Requirement 6: Sistema de Corrección Inteligente

**User Story:** Como estudiante, quiero que el sistema me muestre cómo corregir mis errores específicos, para aprender de mis errores y mejorar.

#### Acceptance Criteria

1. WHEN el usuario escriba "I am walking yesterday" THEN el sistema SHALL sugerir "I was walking yesterday"
2. WHEN el usuario use un verbo irregular incorrectamente THEN el sistema SHALL mostrar la forma correcta
3. WHEN el usuario olvide agregar "-ing" en Past Continuous THEN el sistema SHALL resaltar la omisión
4. IF el usuario confunde "was" y "were" THEN el sistema SHALL explicar la diferencia con ejemplos
5. WHEN el sistema detecte errores de ortografía THEN SHALL ofrecer correcciones automáticas
6. WHEN el usuario acepte una corrección THEN el sistema SHALL explicar por qué esa es la forma correcta

### Requirement 7: Guías Contextuales en Español

**User Story:** Como estudiante, quiero recibir guías y tips en español mientras aprendo, para entender mejor las reglas gramaticales.

#### Acceptance Criteria

1. WHEN el usuario seleccione "while" THEN el sistema SHALL mostrar "Tip: 'While' se usa para acciones simultáneas en Past Continuous"
2. WHEN el usuario use Past Simple correctamente THEN el sistema SHALL mostrar "¡Bien! Past Simple para acciones completadas"
3. WHEN el usuario tenga dificultades THEN el sistema SHALL ofrecer ejemplos paso a paso en español
4. IF el usuario comete el mismo error repetidamente THEN el sistema SHALL ofrecer una mini-lección
5. WHEN el usuario progrese THEN el sistema SHALL mostrar mensajes de motivación en español
6. WHEN el usuario complete un ejercicio THEN el sistema SHALL resumir lo aprendido en español

### Requirement 8: Indicadores Visuales de Progreso

**User Story:** Como estudiante, quiero ver mi progreso de manera visual, para mantenerme motivado y saber en qué áreas necesito mejorar.

#### Acceptance Criteria

1. WHEN el usuario complete partes de la estructura THEN SHALL ver una barra de progreso visual
2. WHEN el usuario domine un conector THEN el sistema SHALL mostrar un indicador de logro
3. WHEN el usuario mejore su precisión THEN SHALL ver gráficos de progreso
4. IF el usuario tiene dificultades con un área específica THEN el sistema SHALL sugerir práctica adicional
5. WHEN el usuario alcance hitos THEN el sistema SHALL mostrar celebraciones sutiles
6. WHEN el usuario revise su historial THEN SHALL ver estadísticas claras de su aprendizaje

### Requirement 9: Modo de Práctica Guiada

**User Story:** Como estudiante principiante, quiero un modo guiado que me enseñe paso a paso, para aprender gradualmente sin sentirme abrumado.

#### Acceptance Criteria

1. WHEN el usuario sea nuevo THEN el sistema SHALL ofrecer un tutorial interactivo
2. WHEN el usuario esté en modo guiado THEN SHALL recibir instrucciones paso a paso
3. WHEN el usuario complete cada paso THEN el sistema SHALL confirmar antes de continuar
4. IF el usuario comete un error en modo guiado THEN el sistema SHALL explicar inmediatamente
5. WHEN el usuario domine los conceptos básicos THEN el sistema SHALL sugerir el modo libre
6. WHEN el usuario necesite ayuda THEN SHALL poder acceder a hints contextuales

### Requirement 10: Personalización del Aprendizaje

**User Story:** Como estudiante, quiero que el sistema se adapte a mi nivel y estilo de aprendizaje, para tener una experiencia personalizada.

#### Acceptance Criteria

1. WHEN el usuario inicie por primera vez THEN el sistema SHALL evaluar su nivel inicial
2. WHEN el usuario demuestre dominio THEN el sistema SHALL aumentar la dificultad gradualmente
3. WHEN el usuario tenga dificultades THEN el sistema SHALL proporcionar más apoyo
4. IF el usuario prefiere explicaciones detalladas THEN el sistema SHALL adaptarse a ese estilo
5. WHEN el usuario progrese THEN el sistema SHALL recordar sus fortalezas y debilidades
6. WHEN el usuario regrese THEN el sistema SHALL continuar desde donde lo dejó