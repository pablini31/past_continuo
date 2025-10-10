// src/config/spanish-messages.js

/**
 * ═══════════════════════════════════════════════════
 * 🇪🇸 DICCIONARIO DE MENSAJES EN ESPAÑOL
 * ═══════════════════════════════════════════════════
 * 
 * Mensajes educativos contextuales para ayudar a los estudiantes
 * a entender y corregir sus errores en inglés
 */

/**
 * Mensajes específicos para errores comunes de estudiantes hispanohablantes
 */
const COMMON_ERRORS = {
  // Errores con auxiliares
  auxiliary_errors: {
    'am_in_past': {
      spanish: "❌ Error: 'am' es presente, usa 'was' para pasado",
      english: "Error: 'am' is present tense, use 'was' for past",
      correction: "I am → I was",
      example: "I am walking → I was walking"
    },
    'is_in_past': {
      spanish: "❌ Error: 'is' es presente, usa 'was' para pasado",
      english: "Error: 'is' is present tense, use 'was' for past", 
      correction: "He/She/It is → He/She/It was",
      example: "She is cooking → She was cooking"
    },
    'are_in_past': {
      spanish: "❌ Error: 'are' es presente, usa 'were' para pasado",
      english: "Error: 'are' is present tense, use 'were' for past",
      correction: "You/We/They are → You/We/They were",
      example: "They are playing → They were playing"
    },
    'wrong_was_were': {
      spanish: "⚠️ Cuidado: Revisa si usas 'was' o 'were' correctamente",
      english: "Warning: Check if you're using 'was' or 'were' correctly",
      rule: "I/He/She/It → was | You/We/They → were",
      examples: [
        "I was (✓) | I were (✗)",
        "You were (✓) | You was (✗)",
        "They were (✓) | They was (✗)"
      ]
    }
  },

  // Errores con gerundios
  gerund_errors: {
    'missing_ing': {
      spanish: "📝 Falta: Agrega '-ing' al verbo en Past Continuous",
      english: "Missing: Add '-ing' to the verb in Past Continuous",
      pattern: "was/were + verbo-ing",
      examples: [
        "I was walk → I was walking",
        "She was cook → She was cooking",
        "They were play → They were playing"
      ]
    },
    'double_ing': {
      spanish: "🔄 Error: No agregues '-ing' dos veces",
      english: "Error: Don't add '-ing' twice",
      correction: "Remove extra '-ing'",
      example: "I was walkinging → I was walking"
    },
    'ing_in_simple': {
      spanish: "⚡ Error: Past Simple no usa '-ing'",
      english: "Error: Past Simple doesn't use '-ing'",
      correction: "Use past form without '-ing'",
      example: "I walking yesterday → I walked yesterday"
    }
  },

  // Errores con verbos irregulares
  irregular_verb_errors: {
    'goed_went': {
      spanish: "🔄 Error: 'go' en pasado es 'went', no 'goed'",
      english: "Error: Past of 'go' is 'went', not 'goed'",
      correction: "goed → went",
      example: "I goed to school → I went to school"
    },
    'eated_ate': {
      spanish: "🔄 Error: 'eat' en pasado es 'ate', no 'eated'",
      english: "Error: Past of 'eat' is 'ate', not 'eated'",
      correction: "eated → ate",
      example: "I eated pizza → I ate pizza"
    },
    'catched_caught': {
      spanish: "🔄 Error: 'catch' en pasado es 'caught', no 'catched'",
      english: "Error: Past of 'catch' is 'caught', not 'catched'",
      correction: "catched → caught",
      example: "I catched the ball → I caught the ball"
    }
  },

  // Errores de mezcla de tiempos
  tense_mixing: {
    'present_past_mix': {
      spanish: "⚡ Inconsistencia: Mezclas presente y pasado en la misma oración",
      english: "Inconsistency: You're mixing present and past in the same sentence",
      tip: "Mantén el mismo tiempo verbal en toda la oración",
      example: "I was walk and eat → I was walking and eating"
    },
    'simple_continuous_mix': {
      spanish: "🔄 Inconsistencia: Mezclas Past Simple y Past Continuous incorrectamente",
      english: "Inconsistency: You're mixing Past Simple and Past Continuous incorrectly",
      tip: "Usa Past Continuous para acciones en progreso, Past Simple para acciones completadas",
      example: "I was walked to school → I walked to school OR I was walking to school"
    }
  }
};

/**
 * Mensajes de éxito y motivación
 */
const SUCCESS_MESSAGES = {
  perfect_structure: [
    "🎉 ¡Perfecto! Estructura gramatical excelente",
    "👏 ¡Muy bien! Dominas esta estructura",
    "🌟 ¡Excelente! Tu gramática está mejorando",
    "✨ ¡Genial! Oración perfectamente construida"
  ],
  
  good_connector: [
    "🔗 ¡Excelente elección de conector!",
    "💡 ¡Perfecto uso de '{connector}'!",
    "🎯 ¡Muy bien! Conector apropiado para el contexto",
    "👍 ¡Genial! Sabes cuándo usar '{connector}'"
  ],

  improvement: [
    "📈 ¡Mejorando! Cada vez lo haces mejor",
    "🚀 ¡Progreso! Tu inglés está avanzando",
    "💪 ¡Sigue así! Estás en el camino correcto",
    "🎯 ¡Bien! Estás aprendiendo de tus errores"
  ]
};

/**
 * Tips educativos específicos por contexto
 */
const EDUCATIONAL_TIPS = {
  connectors: {
    while: {
      usage: "💡 'While' conecta dos acciones que ocurren al mismo tiempo",
      pattern: "While + Past Continuous, Past Continuous",
      examples: [
        {
          english: "While I was studying, she was cooking",
          spanish: "Mientras yo estudiaba, ella cocinaba",
          note: "Ambas acciones ocurren simultáneamente"
        },
        {
          english: "While it was raining, we were inside",
          spanish: "Mientras llovía, estábamos adentro",
          note: "Dos situaciones en progreso al mismo tiempo"
        }
      ],
      common_mistake: "No uses 'while' con Past Simple para acciones puntuales"
    },

    when: {
      usage: "⚡ 'When' puede conectar acciones de diferentes maneras",
      patterns: [
        "When + Past Simple, Past Continuous (interrupción)",
        "When + Past Continuous, Past Simple (contexto)"
      ],
      examples: [
        {
          english: "I was sleeping when the phone rang",
          spanish: "Yo estaba durmiendo cuando sonó el teléfono",
          note: "El teléfono interrumpe el sueño"
        },
        {
          english: "When I was young, I lived in Mexico",
          spanish: "Cuando era joven, vivía en México",
          note: "Contexto temporal para una situación"
        }
      ],
      tip: "Piensa si hay interrupción (Past Simple) o contexto (Past Continuous)"
    },

    as: {
      usage: "🔄 'As' muestra acciones que se desarrollan juntas",
      pattern: "As + Past Continuous, Past Continuous",
      examples: [
        {
          english: "As the sun was setting, we were walking home",
          spanish: "Mientras el sol se ponía, caminábamos a casa",
          note: "Dos acciones en desarrollo simultáneo"
        },
        {
          english: "As I was getting older, I was learning more",
          spanish: "Mientras me hacía mayor, aprendía más",
          note: "Procesos paralelos en el tiempo"
        }
      ],
      tip: "'As' es más formal que 'while' pero similar en uso"
    }
  },

  time_expressions: {
    yesterday: {
      tense: "Past Simple",
      reason: "Indica un momento específico completado",
      examples: [
        "Yesterday I walked to school",
        "Yesterday I was walking when it started to rain"
      ]
    },
    'last night': {
      tense: "Past Simple",
      reason: "Momento específico en el pasado",
      examples: [
        "Last night I watched a movie",
        "Last night I was watching TV when you called"
      ]
    },
    'all day': {
      tense: "Past Continuous",
      reason: "Indica duración extendida",
      examples: [
        "I was working all day",
        "It was raining all day"
      ]
    },
    'at 3 o\'clock': {
      tense: "Past Continuous",
      reason: "Momento específico, acción en progreso",
      examples: [
        "At 3 o'clock I was studying",
        "At 3 o'clock she was cooking"
      ]
    }
  }
};

/**
 * Explicaciones gramaticales detalladas
 */
const GRAMMAR_EXPLANATIONS = {
  past_continuous: {
    title: "📖 Past Continuous (Pasado Continuo)",
    definition: "Describe acciones que estaban en progreso en un momento específico del pasado",
    structure: {
      affirmative: "Sujeto + was/were + verbo-ing + complemento",
      negative: "Sujeto + wasn't/weren't + verbo-ing + complemento",
      question: "Was/Were + sujeto + verbo-ing + complemento?"
    },
    uses: [
      {
        use: "Acción en progreso en momento específico",
        example: "At 8 PM, I was watching TV",
        spanish: "A las 8 PM, yo estaba viendo TV"
      },
      {
        use: "Acciones simultáneas en el pasado",
        example: "While I was cooking, she was studying",
        spanish: "Mientras yo cocinaba, ella estudiaba"
      },
      {
        use: "Acción interrumpida por otra",
        example: "I was sleeping when the phone rang",
        spanish: "Yo estaba durmiendo cuando sonó el teléfono"
      }
    ],
    time_markers: ["while", "when", "as", "at that time", "all day", "constantly"]
  },

  past_simple: {
    title: "📖 Past Simple (Pasado Simple)",
    definition: "Describe acciones completadas en un momento específico del pasado",
    structure: {
      affirmative: "Sujeto + verbo en pasado + complemento",
      negative: "Sujeto + didn't + verbo base + complemento",
      question: "Did + sujeto + verbo base + complemento?"
    },
    uses: [
      {
        use: "Acción completada en el pasado",
        example: "I walked to school yesterday",
        spanish: "Yo caminé a la escuela ayer"
      },
      {
        use: "Secuencia de acciones pasadas",
        example: "I woke up, had breakfast, and went to work",
        spanish: "Me desperté, desayuné y fui al trabajo"
      },
      {
        use: "Acción que interrumpe otra",
        example: "The phone rang while I was sleeping",
        spanish: "El teléfono sonó mientras yo dormía"
      }
    ],
    time_markers: ["yesterday", "last week", "ago", "in 2020", "when", "then", "suddenly"]
  }
};

module.exports = {
  COMMON_ERRORS,
  SUCCESS_MESSAGES,
  EDUCATIONAL_TIPS,
  GRAMMAR_EXPLANATIONS
};