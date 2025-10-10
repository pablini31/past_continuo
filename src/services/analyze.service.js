const spellService = require('./spell.service');
const nlp = require('compromise');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();

/**
 * Simple semantic checks: flag improbable verb-object pairs
 */
async function semanticChecks(text) {
  const doc = nlp(text);
  const verbs = doc.verbs().out('array');
  const nouns = doc.nouns().out('array');

  const issues = [];

  // Simple heuristic: if verb is 'read' or similar, object should be 'book/text/article'
  for (const v of verbs) {
    const lower = v.toLowerCase();
    if (lower.includes('read')) {
      // check if any noun is plausibly readable
      const hasReadable = nouns.some(n => /book|text|article|paper|novel|magazine|story/i.test(n));
      if (!hasReadable) {
        issues.push({ type: 'semantic', message: `Unlikely object for verb '${v}'. Consider using 'book', 'text', or similar.` });
      }
    }
  }

  // Check animacy for simple cases (using WordPOS to check if noun could be animate)
  for (const n of nouns.slice(0,10)) {
    try {
      const isNoun = await wordpos.isNoun(n);
      // We won't attempt deep animacy, just return placeholder
      if (!isNoun) continue;
    } catch (err) {
      // ignore
    }
  }

  return issues;
}

async function analyzeText(text) {
  // 1. Spell check
  const spell = await spellService.checkText(text);

  // 2. Semantic heuristics
  const semantic = await semanticChecks(text);

  // 3. Basic stats
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  return {
    stats: {
      words: words.length,
      sentences: sentences.length,
      lang: spell.lang
    },
    spellProblems: spell.problems,
    semanticIssues: semantic
  };
}

module.exports = { analyzeText };
