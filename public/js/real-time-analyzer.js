// public/js/real-time-analyzer.js

/**
 * ═══════════════════════════════════════════════════
 * 🔍 REAL-TIME ANALYZER
 * ═══════════════════════════════════════════════════
 * 
 * Analizador en tiempo real que conecta el input del usuario
 * con el análisis de estructura y los iconos visuales
 */

class RealTimeAnalyzer {
    constructor(textInputId, grammarIconsId, feedbackContainerId) {
        this.textInput = document.getElementById(textInputId);
        this.grammarIcons = new GrammarIconsComponent(grammarIconsId);
        this.feedbackContainer = document.getElementById(feedbackContainerId);

        this.debounceTimer = null;
        this.lastAnalysis = null;
        this.isAnalyzing = false;

        this.init();
    }

    /**
     * Inicializa el analizador
     */
    init() {
        if (!this.textInput) {
            console.error('Text input element not found');
            return;
        }

        this.setupEventListeners();
        this.showInitialState();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Análisis en tiempo real mientras escribe
        this.textInput.addEventListener('input', (e) => {
            this.handleTextInput(e.target.value);
        });

        // Análisis inmediato al hacer focus
        this.textInput.addEventListener('focus', () => {
            if (this.textInput.value.trim()) {
                this.analyzeText(this.textInput.value);
            }
        });

        // Limpiar al perder focus si está vacío
        this.textInput.addEventListener('blur', () => {
            if (!this.textInput.value.trim()) {
                this.reset();
            }
        });

        // Análisis al presionar Enter
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.performFullAnalysis();
            }
        });
    }

    /**
     * Maneja el input de texto con debounce
     */
    handleTextInput(text) {
        // Limpiar timer anterior
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Si el texto está vacío, resetear inmediatamente
        if (!text.trim()) {
            this.reset();
            return;
        }

        // Análisis inmediato para iconos básicos si es cambio menor
        if (this.lastAnalysis && this.isMinorChange(this.lastAnalysis.original || '', text)) {
            this.performQuickIconUpdate(text);
        }

        // Análisis completo con debounce
        this.debounceTimer = setTimeout(() => {
            this.analyzeText(text);
        }, 500); // 500ms de delay
    }

    /**
     * Determina si es un cambio menor
     */
    isMinorChange(oldText, newText) {
        const oldWords = oldText.split(/\s+/).filter(w => w.length > 0);
        const newWords = newText.split(/\s+/).filter(w => w.length > 0);
        
        // Si la diferencia es solo 1-2 palabras, es cambio menor
        const wordDiff = Math.abs(oldWords.length - newWords.length);
        return wordDiff <= 2 && Math.abs(oldText.length - newText.length) <= 10;
    }

    /**
     * Actualización rápida de iconos para cambios menores
     */
    async performQuickIconUpdate(text) {
        try {
            const response = await fetch('/api/real-time/icons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({ text })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Actualizar solo los iconos sin feedback completo
                    this.grammarIcons.updateTenseType(result.data.tenseType);
                    this.grammarIcons.showRelevantIconGroup(result.data.tenseType);
                    
                    // Actualizar progreso
                    const completedParts = Object.keys(result.data.iconStates).filter(key => 
                        result.data.iconStates[key].active
                    );
                    this.grammarIcons.updateProgress(completedParts, result.data.tenseType);
                }
            }
        } catch (error) {
            console.error('Quick icon update failed:', error);
            // Fallar silenciosamente, el análisis completo se ejecutará después
        }
    }

    /**
     * Analiza el texto y actualiza los iconos
     */
    async analyzeText(text) {
        if (this.isAnalyzing || !text.trim()) return;

        this.isAnalyzing = true;
        this.showAnalyzingState();

        try {
            // Simular análisis de estructura (en producción sería una llamada a la API)
            const structureAnalysis = await this.performStructureAnalysis(text);

            // Actualizar iconos con el análisis
            this.grammarIcons.updateIcons(structureAnalysis);

            // Mostrar feedback en tiempo real
            this.showLiveFeedback(structureAnalysis);

            this.lastAnalysis = structureAnalysis;

        } catch (error) {
            console.error('Error analyzing text:', error);
            this.showErrorState();
        } finally {
            this.isAnalyzing = false;
        }
    }

    /**
     * Realiza análisis de estructura usando la nueva API de tiempo real
     */
    async performStructureAnalysis(text) {
        try {
            const response = await fetch('/api/real-time/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const result = await response.json();
            
            if (result.success) {
                return this.convertApiResponseToStructure(result.data.analysis);
            } else {
                throw new Error(result.message || 'Analysis failed');
            }
        } catch (error) {
            console.error('Structure analysis error:', error);
            // Fallback al análisis simulado
            return this.performFallbackAnalysis(text);
        }
    }

    /**
     * Convierte la respuesta de la API al formato esperado
     */
    convertApiResponseToStructure(analysis) {
        return {
            original: analysis.text,
            words: [],
            parts: this.convertIconStatesToParts(analysis.iconStates),
            tenseType: analysis.tenseType,
            isValid: analysis.criticalErrors.length === 0,
            errors: analysis.criticalErrors,
            completedParts: Object.keys(analysis.iconStates).filter(key => analysis.iconStates[key].active),
            missingParts: Object.keys(analysis.iconStates).filter(key => !analysis.iconStates[key].active)
        };
    }

    /**
     * Convierte estados de iconos a partes de estructura
     */
    convertIconStatesToParts(iconStates) {
        const parts = {};
        
        Object.keys(iconStates).forEach(iconType => {
            const state = iconStates[iconType];
            if (state.active) {
                parts[iconType] = {
                    text: iconType,
                    type: state.type,
                    isValid: !state.error
                };
            }
        });
        
        return parts;
    }

    /**
     * Análisis de fallback cuando la API falla
     */
    async performFallbackAnalysis(text) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 100));

        // Análisis básico simulado
        const words = text.toLowerCase().split(/\s+/);
        const analysis = {
            original: text,
            words: words,
            parts: {},
            tenseType: 'unknown',
            isValid: false,
            errors: [],
            completedParts: [],
            missingParts: []
        };

        // Detectar sujeto
        const subjects = ['i', 'you', 'he', 'she', 'it', 'we', 'they'];
        const subjectFound = words.find(word => subjects.includes(word));
        if (subjectFound) {
            analysis.parts.subject = {
                text: subjectFound,
                type: 'pronoun',
                isValid: true
            };
            analysis.completedParts.push('subject');
        }

        // Detectar auxiliares
        if (words.includes('was') || words.includes('were')) {
            const auxiliary = words.includes('was') ? 'was' : 'were';
            analysis.parts.auxiliary = {
                text: auxiliary,
                type: 'past_auxiliary',
                isValid: true,
                isCorrectTense: true
            };
            analysis.completedParts.push('auxiliary');
            analysis.tenseType = 'past_continuous';
        } else if (words.includes('am') || words.includes('is') || words.includes('are')) {
            const auxiliary = words.find(w => ['am', 'is', 'are'].includes(w));
            analysis.parts.auxiliary = {
                text: auxiliary,
                type: 'present_auxiliary',
                isValid: false,
                isCorrectTense: false,
                error: 'present_in_past'
            };
            analysis.errors.push({
                type: 'present_in_past',
                detected: auxiliary,
                suggestion: auxiliary === 'am' ? 'was' : auxiliary === 'is' ? 'was' : 'were'
            });
            analysis.tenseType = 'present_error';
        }

        // Detectar gerundios
        const gerundWords = words.filter(word => word.endsWith('ing') && word.length > 4);
        if (gerundWords.length > 0) {
            analysis.parts.gerund = {
                text: gerundWords[0],
                type: 'gerund',
                isValid: true,
                baseVerb: gerundWords[0].slice(0, -3)
            };
            analysis.completedParts.push('gerund');
        }

        // Detectar verbos en pasado simple
        const pastVerbs = ['went', 'came', 'saw', 'did', 'had', 'got', 'took', 'made', 'said', 'walked', 'worked', 'played', 'studied'];
        const pastVerbFound = words.find(word => pastVerbs.includes(word) || word.endsWith('ed'));
        if (pastVerbFound && analysis.tenseType === 'unknown') {
            analysis.parts.main_verb = {
                text: pastVerbFound,
                type: pastVerbFound.endsWith('ed') ? 'regular_past' : 'irregular_past',
                isValid: true,
                tense: 'past_simple'
            };
            analysis.completedParts.push('main_verb');
            analysis.tenseType = 'past_simple';
        }

        // Detectar conectores
        const connectors = ['while', 'when', 'as'];
        const connectorFound = words.find(word => connectors.includes(word));
        if (connectorFound) {
            analysis.parts.connector = {
                text: connectorFound,
                type: 'connector',
                isValid: true
            };
            analysis.completedParts.push('connector');
        }

        // Detectar complemento
        if (words.length > 3) {
            analysis.parts.complement = {
                text: 'detected',
                isValid: true
            };
            analysis.completedParts.push('complement');
        }

        // Validar estructura completa
        if (analysis.tenseType === 'past_continuous') {
            analysis.isValid = analysis.parts.subject && analysis.parts.auxiliary &&
                analysis.parts.auxiliary.isValid && analysis.parts.gerund;
            if (!analysis.parts.gerund) {
                analysis.missingParts.push('gerund');
            }
        } else if (analysis.tenseType === 'past_simple') {
            analysis.isValid = analysis.parts.subject && analysis.parts.main_verb;
        }

        if (!analysis.parts.subject) {
            analysis.missingParts.push('subject');
        }

        return analysis;
    }

    /**
     * Realiza análisis completo (llamada a la API)
     */
    async performFullAnalysis() {
        const text = this.textInput.value.trim();
        if (!text) return;

        this.showAnalyzingState();

        try {
            const response = await fetch('/api/practice/live-analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const result = await response.json();

            if (result.success) {
                this.showFullAnalysisResult(result.data.analysis);
            } else {
                throw new Error(result.message || 'Analysis failed');
            }

        } catch (error) {
            console.error('Full analysis error:', error);
            this.showErrorState();
        }
    }

    /**
     * Muestra el estado inicial
     */
    showInitialState() {
        this.grammarIcons.reset();
        if (this.feedbackContainer) {
            this.feedbackContainer.innerHTML = `
        <div class="feedback-initial">
          <div class="feedback-icon">✍️</div>
          <div class="feedback-text">Empieza a escribir tu oración en inglés...</div>
          <div class="feedback-hint">Los iconos se activarán conforme escribas</div>
        </div>
      `;
        }
    }

    /**
     * Muestra estado de análisis
     */
    showAnalyzingState() {
        if (this.feedbackContainer) {
            this.feedbackContainer.innerHTML = `
        <div class="feedback-analyzing">
          <div class="feedback-icon">🔍</div>
          <div class="feedback-text">Analizando estructura...</div>
        </div>
      `;
        }
    }

    /**
     * Muestra feedback en tiempo real
     */
    showLiveFeedback(analysis) {
        if (!this.feedbackContainer) return;

        let feedbackHTML = '';

        // Mostrar errores si los hay
        if (analysis.errors && analysis.errors.length > 0) {
            feedbackHTML += '<div class="feedback-errors">';
            analysis.errors.forEach(error => {
                if (error.type === 'present_in_past') {
                    feedbackHTML += `
            <div class="feedback-item error">
              <span class="feedback-icon">❌</span>
              <span class="feedback-text">Cambia "${error.detected}" por "${error.suggestion}" (usa pasado)</span>
            </div>
          `;
                }
            });
            feedbackHTML += '</div>';
        }

        // Mostrar progreso
        const completionPercentage = this.calculateCompletionPercentage(analysis);
        if (completionPercentage > 0) {
            feedbackHTML += `
        <div class="feedback-progress">
          <div class="feedback-item success">
            <span class="feedback-icon">📈</span>
            <span class="feedback-text">Progreso: ${completionPercentage}% completado</span>
          </div>
        </div>
      `;
        }

        // Mostrar tips
        if (analysis.parts.connector) {
            const connector = analysis.parts.connector.text;
            let tip = '';
            if (connector === 'while') {
                tip = '"While" sugiere usar Past Continuous para acciones simultáneas';
            } else if (connector === 'when') {
                tip = '"When" puede usar Past Simple (interrupción) o Past Continuous (contexto)';
            } else if (connector === 'as') {
                tip = '"As" sugiere Past Continuous para acciones en desarrollo';
            }

            if (tip) {
                feedbackHTML += `
          <div class="feedback-tips">
            <div class="feedback-item tip">
              <span class="feedback-icon">💡</span>
              <span class="feedback-text">${tip}</span>
            </div>
          </div>
        `;
            }
        }

        // Si no hay contenido específico, mostrar mensaje de progreso
        if (!feedbackHTML) {
            feedbackHTML = `
        <div class="feedback-progress">
          <div class="feedback-item neutral">
            <span class="feedback-icon">✍️</span>
            <span class="feedback-text">Sigue escribiendo...</span>
          </div>
        </div>
      `;
        }

        this.feedbackContainer.innerHTML = feedbackHTML;
    }

    /**
     * Muestra resultado de análisis completo
     */
    showFullAnalysisResult(analysis) {
        if (!this.feedbackContainer) return;

        let resultHTML = `
      <div class="feedback-complete">
        <div class="feedback-header">
          <h4>📊 Análisis Completo</h4>
        </div>
    `;

        // Mostrar puntuación si está disponible
        if (analysis.confidenceScore !== undefined) {
            resultHTML += `
        <div class="feedback-score">
          <div class="score-label">Puntuación:</div>
          <div class="score-value">${analysis.confidenceScore}%</div>
        </div>
      `;
        }

        // Mostrar feedback español si está disponible
        if (analysis.spanishFeedback) {
            if (analysis.spanishFeedback.errors.length > 0) {
                resultHTML += '<div class="feedback-errors">';
                analysis.spanishFeedback.errors.forEach(error => {
                    resultHTML += `
            <div class="feedback-item error">
              <span class="feedback-icon">❌</span>
              <span class="feedback-text">${error.message}</span>
            </div>
          `;
                });
                resultHTML += '</div>';
            }

            if (analysis.spanishFeedback.tips.length > 0) {
                resultHTML += '<div class="feedback-tips">';
                analysis.spanishFeedback.tips.forEach(tip => {
                    resultHTML += `
            <div class="feedback-item tip">
              <span class="feedback-icon">💡</span>
              <span class="feedback-text">${tip.message}</span>
            </div>
          `;
                });
                resultHTML += '</div>';
            }
        }

        resultHTML += '</div>';
        this.feedbackContainer.innerHTML = resultHTML;
    }

    /**
     * Muestra estado de error
     */
    showErrorState() {
        if (this.feedbackContainer) {
            this.feedbackContainer.innerHTML = `
        <div class="feedback-error">
          <div class="feedback-icon">⚠️</div>
          <div class="feedback-text">Error al analizar el texto</div>
          <div class="feedback-hint">Inténtalo de nuevo</div>
        </div>
      `;
        }
    }

    /**
     * Calcula el porcentaje de completitud
     */
    calculateCompletionPercentage(analysis) {
        if (!analysis.completedParts || analysis.completedParts.length === 0) {
            return 0;
        }

        let requiredParts = [];
        if (analysis.tenseType === 'past_continuous') {
            requiredParts = ['subject', 'auxiliary', 'gerund'];
        } else if (analysis.tenseType === 'past_simple') {
            requiredParts = ['subject', 'main_verb'];
        } else {
            requiredParts = ['subject', 'main_verb'];
        }

        const completedRequired = analysis.completedParts.filter(part =>
            requiredParts.includes(part)
        ).length;

        return Math.round((completedRequired / requiredParts.length) * 100);
    }

    /**
     * Resetea el analizador
     */
    reset() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.grammarIcons.reset();
        this.showInitialState();
        this.lastAnalysis = null;
    }

    /**
     * Obtiene el último análisis
     */
    getLastAnalysis() {
        return this.lastAnalysis;
    }
}

// Exportar para uso global
window.RealTimeAnalyzer = RealTimeAnalyzer;