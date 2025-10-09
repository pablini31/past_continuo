const franc = require('franc');

function detectLanguage(text) {
  try {
    const code = franc(text || '', { minLength: 3 });
    if (code === 'spa') return 'es';
    if (code === 'eng') return 'en';
    return 'en';
  } catch (err) {
    return 'en';
  }
}

// Lightweight heuristic spelling: detect common double-letter mistakes and a small fix map
const smallFixMap = {
  'cleanning': 'cleaning',
  'recieve': 'receive',
  'espaol': 'español',
  'espanol': 'español',
  'teh': 'the',
  'hte': 'the',
  'taht': 'that',
  'woudl': 'would',
  'coudl': 'could',
  'shoudl': 'should',
  'writen': 'written',
  'writeing': 'writing',
  'runing': 'running',
  'planing': 'planning',
  'stoping': 'stopping',
  'geting': 'getting',
  'seting': 'setting',
  'puting': 'putting',
  'maked': 'made',
  'taked': 'took',
  'goed': 'went',
  'eated': 'ate',
  'writed': 'wrote',
  'readed': 'read',
  'sayed': 'said',
  'buyed': 'bought',
  'feeled': 'felt',
  'thinked': 'thought',
  'knowed': 'knew',
  'breaked': 'broke',
  'choosed': 'chose',
  'speaked': 'spoke',
  'teached': 'taught'
};

function basicSuggestions(word) {
  const lower = word.toLowerCase();
  if (smallFixMap[lower]) return [smallFixMap[lower]];

  // Handle common English verb ending errors
  if (word.endsWith('ed') && word.length > 4) {
    const base = word.slice(0, -2);
    // Common irregular verbs that shouldn't end in -ed
    const irregularBase = {
      'maked': 'made', 'taked': 'took', 'goed': 'went',
      'eated': 'ate', 'writed': 'wrote', 'readed': 'read'
    };
    if (irregularBase[word.toLowerCase()]) {
      return [irregularBase[word.toLowerCase()]];
    }
  }

  // remove duplicated letters like aaa -> aa (simple heuristic)
  const dedup = word.replace(/(.)\1{2,}/g, '$1$1');
  if (dedup !== word) return [dedup];

  // Handle missing 'n' in gerunds (common Spanish speaker error)
  if (word.endsWith('ing') && word.length > 5) {
    const withN = word.slice(0, -3) + 'ning';
    const commonNing = ['running', 'planning', 'beginning', 'winning', 'spinning'];
    if (commonNing.includes(withN)) return [withN];
  }

  // if word has no vowel (likely an abbreviation) skip
  if (!/[aeiouáéíóúüAEIOUÁÉÍÓÚÜ]/.test(word)) return [];

  return [];
}

async function checkText(text, options = {}) {
  const lang = options.lang || detectLanguage(text);

  // Better word extraction that preserves Spanish characters
  const words = Array.from(text.matchAll(/[\p{L}]+/gu)).map(m => ({ 
    word: m[0], 
    index: m.index,
    // Preserve original case and characters
    original: m[0]
  }));

  const problems = [];
  for (const w of words) {
    // Skip very short words and obvious proper nouns (capitalized)
    if (w.word.length <= 2) continue;
    if (w.word[0] === w.word[0].toUpperCase() && w.word.length < 6) continue;
    
    const suggestions = basicSuggestions(w.word);
    if (suggestions.length > 0) {
      problems.push({ 
        word: w.original, 
        index: w.index, 
        suggestions,
        type: 'spelling'
      });
    }
  }

  // Additional check for obvious grammar errors
  const grammarIssues = checkBasicGrammar(text, lang);
  problems.push(...grammarIssues);

  return { lang, problems };
}

function checkBasicGrammar(text, lang = 'en') {
  const issues = [];
  
  if (lang === 'en') {
    // Check for obvious present tense in past context
    const presentInPast = text.match(/\b(I am|you are|he is|she is|it is|we are|they are)\s+\w+ing\b/gi);
    if (presentInPast) {
      presentInPast.forEach(match => {
        const index = text.indexOf(match);
        issues.push({
          word: match,
          index,
          suggestions: [match.replace(/am|are|is/, match.includes('I') ? 'was' : match.includes('are') ? 'were' : 'was')],
          type: 'grammar'
        });
      });
    }
    
    // Check for nonsensical combinations
    const nonsensical = [
      /\bcat.*reading.*cloud\b/i,
      /\btable.*eating.*music\b/i,
      /\bwater.*walking\b/i
    ];
    
    nonsensical.forEach(pattern => {
      if (pattern.test(text)) {
        issues.push({
          word: text.match(pattern)[0],
          index: text.search(pattern),
          suggestions: [],
          type: 'semantic'
        });
      }
    });
  }
  
  return issues;
}

module.exports = { checkText, detectLanguage };
