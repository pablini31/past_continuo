// public/js/spell-client.js
// Lightweight client spell helper: does local highlighting (using nspell) and also calls server
// NOTE: nspell on client requires dictionary files; here we use server-side analyze endpoint primarily.

function debounce(fn, wait) {
  let t;
  return function(...args){
    clearTimeout(t);
    t = setTimeout(()=>fn.apply(this,args), wait);
  };
}

async function sendLiveAnalyze(text) {
  try {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const res = await fetch('/api/practice/live-analyze', {
      method: 'POST',
      headers,
      body: JSON.stringify({ text })
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (err) {
    console.error('Live analyze error', err);
    return null;
  }
}

function initLiveSpell(textarea, ui) {
  const debounced = debounce(async () => {
    const text = textarea.value;
    if (!text || text.trim().length < 5) {
      ui.clearSpellProblems();
      return;
    }
    
    try {
      const result = await sendLiveAnalyze(text);
      if (!result || !result.success) {
        console.error('Analysis failed:', result?.message);
        return;
      }
      
      const details = result.data?.analysis;
      if (!details) return;
      
      // Show spell problems if any
      if (details.detailed?.spellProblems?.length > 0) {
        ui.showSpellProblems(details.detailed.spellProblems);
      } else {
        ui.clearSpellProblems();
      }
      
      // Show quick grammar feedback
      if (details.quick) {
        ui.showQuick(details.quick);
      }
    } catch (err) {
      console.error('Live analysis error:', err);
    }
  }, 700);

  textarea.addEventListener('input', debounced);
}

// Export for browser (no module.exports in browser)
if (typeof window !== 'undefined') {
  window.initLiveSpell = initLiveSpell;
}
