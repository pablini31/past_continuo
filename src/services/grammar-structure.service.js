// src/services/grammar-structure.service.js

/**
 * ═══════════════════════════════════════════════════
 * 🔍 GRAMMAR STRUCTURE ANALYZER SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Servicio avanzado para analizar la estructura gramatical
 * Detecta sujetos, verbos, auxiliares, gerundios y complementos
 */

/**
 * Patrones de detección gramatical
 */
const GRAMMAR_PATTERNS = {
  // Sujetos comunes
  subjects: {
    pronouns: ['I', 'you', 'he', 'she', 'it', 'we', 'they'],
    demonstratives: ['this', 'that', 'these', 'those'],
    articles: ['the', 'a', 'an'],
    possessives: ['my', 'your', 'his', 'her', 'its', 'our', 'their'],
    quantifiers: ['some', 'many', 'few', 'several', 'all', 'most']
  },

  // Auxiliares para Past Continuous
  auxiliaries: {
    past: ['was', 'were'],
    present: ['am', 'is', 'are'], // Para detectar errores
    negative: ['wasn\'t', 'weren\'t']
  },

  // Verbos irregulares comunes en pasado
  irregularVerbs: [
    'went', 'came', 'saw', 'did', 'had', 'got', 'took', 'made', 'said', 'told',
    'gave', 'found', 'left', 'thought', 'felt', 'knew', 'heard', 'ate', 'drank',
    'wrote', 'read', 'bought', 'sold', 'broke', 'spoke', 'ran', 'drove', 'rode',
    'flew', 'swam', 'sang', 'rang', 'began', 'won', 'lost', 'met', 'put', 'let',
    'set', 'cut', 'hit', 'hurt', 'cost', 'shut', 'quit', 'split', 'spread'
  ],

  // Conectores
  connectors: ['while', 'when', 'as', 'before', 'after', 'until', 'since'],

  // Marcadores temporales
  timeMarkers: {
    past_simple: ['yesterday', 'last night', 'last week', 'last month', 'last year', 'ago', 'in 2020'],
    past_continuous: ['all day', 'all night', 'constantly', 'continuously', 'at that time', 'at 3 o\'clock']
  }
};

/**
 * Clase principal del analizador de estructura gramatical
 */
class GrammarStructureService {

  /**
   * Analiza la estructura completa de una oración
   */
  analyzeStructure(sentence) {
    const cleanSentence = this.cleanSentence(sentence);
    const words = this.tokenize(cleanSentence);
    
    const structure = {
      original: sentence,
      cleaned: cleanSentence,
      words: words,
      parts: {
        subject: null,
        auxiliary: null,
        mainVerb: null,
        gerund: null,
        complement: null,
        connector: null,
        timeMarker: null
      },
      tenseType: null,
      isValid: false,
      errors: [],
      completedParts: [],
      missingParts: []
    };

    // Detectar cada parte de la estructura
    this.detectSubject(words, structure);
    this.detectAuxiliary(words, structure);
    this.detectMainVerb(words, structure);
    this.detectGerund(words, structure);
    this.detectComplement(words, structure);
    this.detectConnector(words, structure);
    this.detectTimeMarker(words, structure);

    // Determinar tipo de tiempo verbal
    this.determineTenseType(structure);

    // Validar estructura completa
    this.validateStructure(structure);

    // Identificar partes completadas y faltantes
    this.identifyCompletedParts(structure);

    return structure;
  }

  /**
   * Limpia y normaliza la oración
   */
  cleanSentence(sentence) {
    return sentence
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?'-]/g, '')
      .toLowerCase();
  }

  /**
   * Tokeniza la oración en palabras
   */
  tokenize(sentence) {
    return sentence
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map((word, index) => ({
        text: word,
        original: word,
        index: index,
        type: null,
        isDetected: false
      }));
  }

  /**
   * Detecta el sujeto de la oración
   */
  detectSubject(words, structure) {
    for (let i = 0; i < words.length; i++) {
      const word = words[i].text.toLowerCase();
      
      // Pronombres personales
      if (GRAMMAR_PATTERNS.subjects.pronouns.map(p => p.toLowerCase()).includes(word)) {
        structure.parts.subject = {
          text: word,
          type: 'pronoun',
          position: i,
          isValid: true
        };
        words[i].type = 'subject';
        words[i].isDetected = true;
        return;
      }

      // Sustantivos con artículos
      if (GRAMMAR_PATTERNS.subjects.articles.includes(word) && i + 1 < words.length) {
        const nextWord = words[i + 1].text;
        structure.parts.subject = {
          text: `${word} ${nextWord}`,
          type: 'noun_phrase',
          position: i,
          isValid: true
        };
        words[i].type = 'article';
        words[i].isDetected = true;
        words[i + 1].type = 'subject';
        words[i + 1].isDetected = true;
        return;
      }

      // Nombres propios (primera letra mayúscula en original)
      if (word.charAt(0) === word.charAt(0).toUpperCase() && word.length > 1) {
        structure.parts.subject = {
          text: word,
          type: 'proper_noun',
          position: i,
          isValid: true
        };
        words[i].type = 'subject';
        words[i].isDetected = true;
        return;
      }
    }
  }

  /**
   * Detecta auxiliares (was, were, am, is, are)
   */
  detectAuxiliary(words, structure) {
    for (let i = 0; i < words.length; i++) {
      const word = words[i].text;
      
      // Auxiliares de pasado (correctos)
      if (GRAMMAR_PATTERNS.auxiliaries.past.includes(word)) {
        structure.parts.auxiliary = {
          text: word,
          type: 'past_auxiliary',
          position: i,
          isValid: true,
          isCorrectTense: true
        };
        words[i].type = 'auxiliary';
        words[i].isDetected = true;
        return;
      }

      // Auxiliares de presente (errores)
      if (GRAMMAR_PATTERNS.auxiliaries.present.includes(word)) {
        structure.parts.auxiliary = {
          text: word,
          type: 'present_auxiliary',
          position: i,
          isValid: false,
          isCorrectTense: false,
          error: 'present_in_past'
        };
        words[i].type = 'auxiliary';
        words[i].isDetected = true;
        structure.errors.push({
          type: 'present_in_past',
          position: i,
          detected: word,
          suggestion: word === 'am' ? 'was' : word === 'is' ? 'was' : 'were'
        });
        return;
      }

      // Auxiliares negativos
      if (GRAMMAR_PATTERNS.auxiliaries.negative.includes(word)) {
        structure.parts.auxiliary = {
          text: word,
          type: 'negative_auxiliary',
          position: i,
          isValid: true,
          isCorrectTense: true
        };
        words[i].type = 'auxiliary';
        words[i].isDetected = true;
        return;
      }
    }
  }

  /**
   * Detecta el verbo principal
   */
  detectMainVerb(words, structure) {
    for (let i = 0; i < words.length; i++) {
      const word = words[i].text;
      
      // Saltar si ya es auxiliar
      if (words[i].type === 'auxiliary') continue;

      // Verbos irregulares en pasado
      if (GRAMMAR_PATTERNS.irregularVerbs.includes(word)) {
        structure.parts.mainVerb = {
          text: word,
          type: 'irregular_past',
          position: i,
          isValid: true,
          tense: 'past_simple'
        };
        words[i].type = 'main_verb';
        words[i].isDetected = true;
        return;
      }

      // Verbos regulares en pasado (-ed)
      if (word.endsWith('ed') && word.length > 3) {
        structure.parts.mainVerb = {
          text: word,
          type: 'regular_past',
          position: i,
          isValid: true,
          tense: 'past_simple'
        };
        words[i].type = 'main_verb';
        words[i].isDetected = true;
        return;
      }

      // Verbos base (posibles errores)
      if (this.isBaseVerb(word)) {
        structure.parts.mainVerb = {
          text: word,
          type: 'base_verb',
          position: i,
          isValid: false,
          tense: 'present',
          error: 'base_verb_in_past'
        };
        words[i].type = 'main_verb';
        words[i].isDetected = true;
        structure.errors.push({
          type: 'base_verb_in_past',
          position: i,
          detected: word,
          suggestion: this.suggestPastForm(word)
        });
        return;
      }
    }
  }

  /**
   * Detecta gerundios (-ing)
   */
  detectGerund(words, structure) {
    for (let i = 0; i < words.length; i++) {
      const word = words[i].text;
      
      // Saltar si ya es otro tipo
      if (words[i].isDetected) continue;

      // Palabras terminadas en -ing
      if (word.endsWith('ing') && word.length > 4) {
        structure.parts.gerund = {
          text: word,
          type: 'gerund',
          position: i,
          isValid: true,
          baseVerb: word.slice(0, -3) // Remover -ing
        };
        words[i].type = 'gerund';
        words[i].isDetected = true;
        return;
      }
    }
  }

  /**
   * Detecta complementos (resto de la oración)
   */
  detectComplement(words, structure) {
    const complementWords = words
      .filter(word => !word.isDetected)
      .map(word => word.text);

    if (complementWords.length > 0) {
      structure.parts.complement = {
        text: complementWords.join(' '),
        words: complementWords,
        isValid: true
      };
    }
  }

  /**
   * Detecta conectores
   */
  detectConnector(words, structure) {
    for (let i = 0; i < words.length; i++) {
      const word = words[i].text;
      
      if (GRAMMAR_PATTERNS.connectors.includes(word)) {
        structure.parts.connector = {
          text: word,
          type: 'connector',
          position: i,
          isValid: true
        };
        words[i].type = 'connector';
        words[i].isDetected = true;
        return;
      }
    }
  }

  /**
   * Detecta marcadores temporales
   */
  detectTimeMarker(words, structure) {
    const sentence = words.map(w => w.text).join(' ');
    
    // Marcadores de Past Simple
    for (const marker of GRAMMAR_PATTERNS.timeMarkers.past_simple) {
      if (sentence.includes(marker)) {
        structure.parts.timeMarker = {
          text: marker,
          type: 'past_simple_marker',
          suggestedTense: 'past_simple'
        };
        return;
      }
    }

    // Marcadores de Past Continuous
    for (const marker of GRAMMAR_PATTERNS.timeMarkers.past_continuous) {
      if (sentence.includes(marker)) {
        structure.parts.timeMarker = {
          text: marker,
          type: 'past_continuous_marker',
          suggestedTense: 'past_continuous'
        };
        return;
      }
    }
  }

  /**
   * Determina el tipo de tiempo verbal
   */
  determineTenseType(structure) {
    const { auxiliary, mainVerb, gerund } = structure.parts;

    // Past Continuous: was/were + gerund
    if (auxiliary && auxiliary.type === 'past_auxiliary' && gerund) {
      structure.tenseType = 'past_continuous';
      return;
    }

    // Past Simple: verbo en pasado
    if (mainVerb && (mainVerb.type === 'irregular_past' || mainVerb.type === 'regular_past')) {
      structure.tenseType = 'past_simple';
      return;
    }

    // Error: presente en contexto pasado
    if (auxiliary && auxiliary.type === 'present_auxiliary') {
      structure.tenseType = 'present_error';
      return;
    }

    // Indeterminado
    structure.tenseType = 'unknown';
  }

  /**
   * Valida la estructura completa
   */
  validateStructure(structure) {
    const { subject, auxiliary, mainVerb, gerund, tenseType } = structure.parts;

    // Validaciones básicas
    if (!subject) {
      structure.errors.push({
        type: 'missing_subject',
        message: 'Falta el sujeto de la oración'
      });
    }

    // Validaciones por tipo de tiempo
    if (tenseType === 'past_continuous') {
      if (!auxiliary || !auxiliary.isValid) {
        structure.errors.push({
          type: 'invalid_auxiliary',
          message: 'Auxiliar incorrecto para Past Continuous'
        });
      }
      if (!gerund) {
        structure.errors.push({
          type: 'missing_gerund',
          message: 'Falta el gerundio (-ing) para Past Continuous'
        });
      }
    } else if (tenseType === 'past_simple') {
      if (!mainVerb || !mainVerb.isValid) {
        structure.errors.push({
          type: 'invalid_main_verb',
          message: 'Verbo incorrecto para Past Simple'
        });
      }
    }

    // La estructura es válida si no hay errores
    structure.isValid = structure.errors.length === 0;
  }

  /**
   * Identifica partes completadas y faltantes
   */
  identifyCompletedParts(structure) {
    const { subject, auxiliary, mainVerb, gerund, complement } = structure.parts;
    const { tenseType } = structure;

    // Partes completadas
    if (subject && subject.isValid) structure.completedParts.push('subject');
    if (auxiliary && auxiliary.isValid) structure.completedParts.push('auxiliary');
    if (mainVerb && mainVerb.isValid) structure.completedParts.push('main_verb');
    if (gerund) structure.completedParts.push('gerund');
    if (complement) structure.completedParts.push('complement');

    // Partes faltantes según el tipo de tiempo
    if (tenseType === 'past_continuous') {
      if (!subject || !subject.isValid) structure.missingParts.push('subject');
      if (!auxiliary || !auxiliary.isValid) structure.missingParts.push('auxiliary');
      if (!gerund) structure.missingParts.push('gerund');
    } else if (tenseType === 'past_simple') {
      if (!subject || !subject.isValid) structure.missingParts.push('subject');
      if (!mainVerb || !mainVerb.isValid) structure.missingParts.push('main_verb');
    }
  }

  /**
   * Verifica si una palabra es un verbo base
   */
  isBaseVerb(word) {
    const commonBaseVerbs = [
      'walk', 'talk', 'work', 'play', 'study', 'cook', 'read', 'write',
      'eat', 'drink', 'sleep', 'run', 'jump', 'sing', 'dance', 'watch',
      'listen', 'speak', 'learn', 'teach', 'help', 'call', 'visit'
    ];
    return commonBaseVerbs.includes(word);
  }

  /**
   * Sugiere la forma en pasado de un verbo
   */
  suggestPastForm(baseVerb) {
    const irregularForms = {
      'go': 'went',
      'come': 'came',
      'see': 'saw',
      'eat': 'ate',
      'drink': 'drank',
      'run': 'ran',
      'sing': 'sang',
      'write': 'wrote',
      'read': 'read',
      'speak': 'spoke',
      'teach': 'taught',
      'catch': 'caught'
    };

    return irregularForms[baseVerb] || `${baseVerb}ed`;
  }

  /**
   * Genera recomendaciones basadas en la estructura
   */
  generateRecommendations(structure) {
    const recommendations = [];
    const { tenseType, parts, errors } = structure;

    // Recomendaciones basadas en errores
    errors.forEach(error => {
      switch (error.type) {
        case 'present_in_past':
          recommendations.push({
            type: 'correction',
            message: `Cambia "${error.detected}" por "${error.suggestion}"`,
            reason: 'Necesitas usar tiempo pasado, no presente'
          });
          break;
        case 'missing_gerund':
          recommendations.push({
            type: 'addition',
            message: 'Agrega "-ing" al verbo para Past Continuous',
            reason: 'El Past Continuous requiere verbo + ing'
          });
          break;
        case 'base_verb_in_past':
          recommendations.push({
            type: 'correction',
            message: `Cambia "${error.detected}" por "${error.suggestion}"`,
            reason: 'Usa la forma en pasado del verbo'
          });
          break;
      }
    });

    // Recomendaciones basadas en marcadores temporales
    if (parts.timeMarker) {
      const marker = parts.timeMarker;
      if (marker.suggestedTense !== tenseType) {
        recommendations.push({
          type: 'tense_suggestion',
          message: `"${marker.text}" sugiere usar ${marker.suggestedTense}`,
          reason: `Esta expresión temporal es típica de ${marker.suggestedTense}`
        });
      }
    }

    return recommendations;
  }

  /**
   * Calcula el porcentaje de completitud de la estructura
   */
  calculateCompletionPercentage(structure) {
    const { tenseType, completedParts } = structure;
    
    let requiredParts = [];
    if (tenseType === 'past_continuous') {
      requiredParts = ['subject', 'auxiliary', 'gerund'];
    } else if (tenseType === 'past_simple') {
      requiredParts = ['subject', 'main_verb'];
    } else {
      requiredParts = ['subject', 'main_verb']; // Mínimo requerido
    }

    const completedRequired = completedParts.filter(part => 
      requiredParts.includes(part)
    ).length;

    return Math.round((completedRequired / requiredParts.length) * 100);
  }
}

module.exports = {
  GrammarStructureService,
  GRAMMAR_PATTERNS
};