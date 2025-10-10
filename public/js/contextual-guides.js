// public/js/contextual-guides.js

/**
 * ═══════════════════════════════════════════════════
 * 🎯 CONTEXTUAL GUIDES COMPONENT
 * ═══════════════════════════════════════════════════
 * 
 * Componente para mostrar guías contextuales, tips educativos
 * y mini-lecciones en tiempo real
 */
class ContextualGuidesComponent {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            showTips: true,
            showMotivation: true,
            showMiniLessons: true,
            maxTips: 3,
            autoUpdate: true,
            animationDuration: 300,
            ...options
        };

        this.currentGuide = null;
        this.userProgress = {
            correctSentences: 0,
            totalAttempts: 0,
            consecutiveCorrect: 0,
            sessionTime: Date.now(),
            level: 'beginner'
        };

        this.init();
    }

    /**
     * Inicializa el componente
     */
    init() {
        if (!this.container) {
            console.error('Contextual guides container not found');
            return;
        }

        this.createGuidesStructure();
        this.setupEventListeners();
        this.showWelcomeMessage();
    }

    /**
     * Crea la estructura HTML de las guías
     */
    createGuidesStructure() {
        this.container.innerHTML = `
            <div class="contextual-guides">
                <div class="guides-header">
                    <h3 class="guides-title">
                        <span class="guides-icon">🎯</span>
                        Guías de Aprendizaje
                    </h3>
                    <button class="guides-toggle" title="Minimizar/Expandir">
                        <span class="toggle-icon">−</span>
                    </button>
                </div>
                
                <div class="guides-content">
                    <!-- Tips educativos -->
                    <div class="tips-section" style="display: none;">
                        <div class="section-header">
                            <span class="section-icon">💡</span>
                            <span class="section-title">Tips Educativos</span>
                        </div>
                        <div class="tips-container"></div>
                    </div>

                    <!-- Mini-lección -->
                    <div class="mini-lesson-section" style="display: none;">
                        <div class="section-header">
                            <span class="section-icon">📚</span>
                            <span class="section-title">Mini-Lección</span>
                        </div>
                        <div class="mini-lesson-container"></div>
                    </div>

                    <!-- Mensaje motivacional -->
                    <div class="motivation-section" style="display: none;">
                        <div class="section-header">
                            <span class="section-icon">💪</span>
                            <span class="section-title">Motivación</span>
                        </div>
                        <div class="motivation-container"></div>
                    </div>

                    <!-- Próximos pasos -->
                    <div class="next-steps-section" style="display: none;">
                        <div class="section-header">
                            <span class="section-icon">🎯</span>
                            <span class="section-title">Próximos Pasos</span>
                        </div>
                        <div class="next-steps-container"></div>
                    </div>

                    <!-- Mensaje de bienvenida -->
                    <div class="welcome-message">
                        <div class="welcome-icon">🌟</div>
                        <div class="welcome-text">
                            <h4>¡Bienvenido al aprendizaje inteligente!</h4>
                            <p>Aquí aparecerán tips personalizados mientras practicas.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Referencias a elementos
        this.guidesContent = this.container.querySelector('.guides-content');
        this.tipsSection = this.container.querySelector('.tips-section');
        this.miniLessonSection = this.container.querySelector('.mini-lesson-section');
        this.motivationSection = this.container.querySelector('.motivation-section');
        this.nextStepsSection = this.container.querySelector('.next-steps-section');
        this.welcomeMessage = this.container.querySelector('.welcome-message');
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Toggle para minimizar/expandir
        const toggleButton = this.container.querySelector('.guides-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this.toggleGuides();
            });
        }

        // Clicks en tips para expandir
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.tip-item')) {
                this.expandTip(e.target.closest('.tip-item'));
            }
        });

        // Navegación en mini-lecciones
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('lesson-next')) {
                this.nextLessonStep();
            } else if (e.target.classList.contains('lesson-prev')) {
                this.prevLessonStep();
            } else if (e.target.classList.contains('lesson-close')) {
                this.closeMiniLesson();
            }
        });
    }

    /**
     * Muestra mensaje de bienvenida
     */
    showWelcomeMessage() {
        this.hideAllSections();
        this.welcomeMessage.style.display = 'block';
        this.animateIn(this.welcomeMessage);
    }

    /**
     * Actualiza las guías basadas en el análisis
     */
    async updateGuides(analysisResult, userContext = {}) {
        try {
            // Actualizar contexto del usuario
            this.updateUserContext(userContext);

            // Generar guía contextual completa
            const guide = await this.generateContextualGuide(analysisResult, this.userProgress);
            
            if (guide) {
                this.currentGuide = guide;
                this.displayGuide(guide);
            }

        } catch (error) {
            console.error('Error updating guides:', error);
            this.showErrorMessage();
        }
    }

    /**
     * Genera guía contextual usando la API
     */
    async generateContextualGuide(analysisResult, userContext) {
        try {
            const response = await fetch('/api/guides/contextual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({
                    analysisResult,
                    userContext
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate contextual guide');
            }

            const result = await response.json();
            return result.success ? result.data.guide : null;

        } catch (error) {
            console.error('API error generating guide:', error);
            return this.generateFallbackGuide(analysisResult);
        }
    }

    /**
     * Muestra la guía generada
     */
    displayGuide(guide) {
        this.hideAllSections();
        this.welcomeMessage.style.display = 'none';

        // Mostrar tips educativos
        if (guide.tips && guide.tips.length > 0 && this.options.showTips) {
            this.displayTips(guide.tips);
        }

        // Mostrar mini-lección si existe
        if (guide.miniLesson && this.options.showMiniLessons) {
            this.displayMiniLesson(guide.miniLesson);
        }

        // Mostrar motivación
        if (guide.motivation && this.options.showMotivation) {
            this.displayMotivation(guide.motivation);
        }

        // Mostrar próximos pasos
        if (guide.nextSteps && guide.nextSteps.length > 0) {
            this.displayNextSteps(guide.nextSteps);
        }
    }

    /**
     * Muestra tips educativos
     */
    displayTips(tips) {
        const container = this.tipsSection.querySelector('.tips-container');
        
        container.innerHTML = tips.map(tip => `
            <div class="tip-item" data-tip-id="${tip.id}">
                <div class="tip-header">
                    <span class="tip-title">${tip.title}</span>
                    <span class="tip-expand">+</span>
                </div>
                <div class="tip-message">${tip.message}</div>
                <div class="tip-details" style="display: none;">
                    ${tip.example ? `<div class="tip-example"><strong>Ejemplo:</strong> ${tip.example}</div>` : ''}
                    ${tip.explanation ? `<div class="tip-explanation">${tip.explanation}</div>` : ''}
                </div>
            </div>
        `).join('');

        this.showSection(this.tipsSection);
    }

    /**
     * Muestra mini-lección
     */
    displayMiniLesson(lesson) {
        const container = this.miniLessonSection.querySelector('.mini-lesson-container');
        
        container.innerHTML = `
            <div class="mini-lesson" data-lesson-id="${lesson.id}">
                <div class="lesson-header">
                    <h4 class="lesson-title">${lesson.title}</h4>
                    <div class="lesson-meta">
                        <span class="lesson-time">⏱️ ${lesson.estimatedTime}</span>
                        <span class="lesson-difficulty difficulty-${lesson.difficulty}">
                            ${this.getDifficultyLabel(lesson.difficulty)}
                        </span>
                    </div>
                </div>
                
                <div class="lesson-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <span class="progress-text">Paso 1 de ${lesson.steps.length}</span>
                </div>

                <div class="lesson-content">
                    <div class="lesson-step active" data-step="0">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h5 class="step-title">${lesson.steps[0].title}</h5>
                            <p class="step-text">${lesson.steps[0].content}</p>
                            ${lesson.steps[0].example ? `<div class="step-example">${lesson.steps[0].example}</div>` : ''}
                        </div>
                    </div>
                </div>

                <div class="lesson-navigation">
                    <button class="lesson-btn lesson-prev" disabled>← Anterior</button>
                    <button class="lesson-btn lesson-next">Siguiente →</button>
                    <button class="lesson-btn lesson-close">Cerrar</button>
                </div>
            </div>
        `;

        this.currentLessonStep = 0;
        this.showSection(this.miniLessonSection);
    }

    /**
     * Muestra mensaje motivacional
     */
    displayMotivation(motivation) {
        const container = this.motivationSection.querySelector('.motivation-container');
        
        container.innerHTML = `
            <div class="motivation-message priority-${motivation.priority}">
                <div class="motivation-icon">${motivation.icon}</div>
                <div class="motivation-content">
                    <div class="motivation-text">${motivation.message}</div>
                    ${motivation.stats ? `
                        <div class="motivation-stats">
                            <span class="stat-item">
                                <span class="stat-label">Precisión:</span>
                                <span class="stat-value">${motivation.stats.accuracy}%</span>
                            </span>
                            ${motivation.stats.improvement ? `
                                <span class="stat-item">
                                    <span class="stat-label">Mejora:</span>
                                    <span class="stat-value">+${motivation.stats.improvement}%</span>
                                </span>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        this.showSection(this.motivationSection);
    }

    /**
     * Muestra próximos pasos
     */
    displayNextSteps(steps) {
        const container = this.nextStepsSection.querySelector('.next-steps-container');
        
        container.innerHTML = `
            <div class="next-steps-list">
                ${steps.map((step, index) => `
                    <div class="step-item priority-${step.priority}">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-content">
                            <h5 class="step-title">${step.title}</h5>
                            <p class="step-description">${step.description}</p>
                            <div class="step-meta">
                                <span class="step-time">⏱️ ${step.estimatedTime}</span>
                                <span class="step-type">${this.getStepTypeLabel(step.type)}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.showSection(this.nextStepsSection);
    }

    /**
     * Expande un tip para mostrar detalles
     */
    expandTip(tipElement) {
        const details = tipElement.querySelector('.tip-details');
        const expandIcon = tipElement.querySelector('.tip-expand');
        
        if (details.style.display === 'none') {
            details.style.display = 'block';
            expandIcon.textContent = '−';
            this.animateIn(details);
        } else {
            details.style.display = 'none';
            expandIcon.textContent = '+';
        }
    }

    /**
     * Navega al siguiente paso de la mini-lección
     */
    nextLessonStep() {
        const lesson = this.miniLessonSection.querySelector('.mini-lesson');
        if (!lesson) return;

        const steps = lesson.querySelectorAll('.lesson-step');
        const totalSteps = steps.length;

        if (this.currentLessonStep < totalSteps - 1) {
            // Ocultar paso actual
            steps[this.currentLessonStep].classList.remove('active');
            
            // Mostrar siguiente paso
            this.currentLessonStep++;
            
            // Si no existe el paso, crearlo
            if (!steps[this.currentLessonStep]) {
                this.createLessonStep(this.currentLessonStep);
            } else {
                steps[this.currentLessonStep].classList.add('active');
            }
            
            this.updateLessonProgress();
            this.updateLessonNavigation();
        }
    }

    /**
     * Navega al paso anterior de la mini-lección
     */
    prevLessonStep() {
        if (this.currentLessonStep > 0) {
            const steps = this.miniLessonSection.querySelectorAll('.lesson-step');
            
            // Ocultar paso actual
            steps[this.currentLessonStep].classList.remove('active');
            
            // Mostrar paso anterior
            this.currentLessonStep--;
            steps[this.currentLessonStep].classList.add('active');
            
            this.updateLessonProgress();
            this.updateLessonNavigation();
        }
    }

    /**
     * Crea un paso de lección dinámicamente
     */
    createLessonStep(stepIndex) {
        if (!this.currentGuide?.miniLesson?.steps[stepIndex]) return;

        const step = this.currentGuide.miniLesson.steps[stepIndex];
        const lessonContent = this.miniLessonSection.querySelector('.lesson-content');
        
        const stepElement = document.createElement('div');
        stepElement.className = 'lesson-step active';
        stepElement.setAttribute('data-step', stepIndex);
        
        stepElement.innerHTML = `
            <div class="step-number">${stepIndex + 1}</div>
            <div class="step-content">
                <h5 class="step-title">${step.title}</h5>
                <p class="step-text">${step.content}</p>
                ${step.example ? `<div class="step-example">${step.example}</div>` : ''}
            </div>
        `;
        
        lessonContent.appendChild(stepElement);
    }

    /**
     * Actualiza la barra de progreso de la lección
     */
    updateLessonProgress() {
        const progressFill = this.miniLessonSection.querySelector('.progress-fill');
        const progressText = this.miniLessonSection.querySelector('.progress-text');
        
        if (this.currentGuide?.miniLesson) {
            const totalSteps = this.currentGuide.miniLesson.steps.length;
            const progress = ((this.currentLessonStep + 1) / totalSteps) * 100;
            
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `Paso ${this.currentLessonStep + 1} de ${totalSteps}`;
        }
    }

    /**
     * Actualiza la navegación de la lección
     */
    updateLessonNavigation() {
        const prevBtn = this.miniLessonSection.querySelector('.lesson-prev');
        const nextBtn = this.miniLessonSection.querySelector('.lesson-next');
        
        if (this.currentGuide?.miniLesson) {
            const totalSteps = this.currentGuide.miniLesson.steps.length;
            
            prevBtn.disabled = this.currentLessonStep === 0;
            nextBtn.disabled = this.currentLessonStep === totalSteps - 1;
            
            if (this.currentLessonStep === totalSteps - 1) {
                nextBtn.textContent = '✅ Completar';
            } else {
                nextBtn.textContent = 'Siguiente →';
            }
        }
    }

    /**
     * Cierra la mini-lección
     */
    closeMiniLesson() {
        this.miniLessonSection.style.display = 'none';
        this.currentLessonStep = 0;
        
        // Mostrar mensaje de completado si llegó al final
        if (this.currentGuide?.miniLesson) {
            const totalSteps = this.currentGuide.miniLesson.steps.length;
            if (this.currentLessonStep === totalSteps - 1) {
                this.showCompletionMessage();
            }
        }
    }

    /**
     * Muestra mensaje de completado
     */
    showCompletionMessage() {
        const container = this.motivationSection.querySelector('.motivation-container');
        
        container.innerHTML = `
            <div class="completion-message">
                <div class="completion-icon">🎉</div>
                <div class="completion-content">
                    <h4>¡Mini-lección completada!</h4>
                    <p>Has aprendido algo nuevo. ¡Sigue practicando!</p>
                </div>
            </div>
        `;
        
        this.showSection(this.motivationSection);
        
        // Auto-ocultar después de 3 segundos
        setTimeout(() => {
            this.motivationSection.style.display = 'none';
        }, 3000);
    }

    /**
     * Actualiza el contexto del usuario
     */
    updateUserContext(context) {
        this.userProgress = {
            ...this.userProgress,
            ...context,
            sessionTime: Date.now() - this.userProgress.sessionTime
        };
    }

    /**
     * Actualiza el progreso del usuario
     */
    async updateProgress(isCorrect, errors = []) {
        this.userProgress.totalAttempts++;
        
        if (isCorrect) {
            this.userProgress.correctSentences++;
            this.userProgress.consecutiveCorrect++;
        } else {
            this.userProgress.consecutiveCorrect = 0;
        }

        // Enviar actualización a la API
        try {
            await fetch('/api/guides/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({
                    userId: this.getUserId(),
                    progressData: {
                        isCorrect,
                        errors,
                        timestamp: Date.now()
                    }
                })
            });
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    }

    /**
     * Genera guía de fallback cuando la API falla
     */
    generateFallbackGuide(analysisResult) {
        const guide = {
            tips: [],
            motivation: null,
            nextSteps: []
        };

        // Tip básico según el tipo de tiempo
        if (analysisResult.tenseType === 'past_continuous') {
            guide.tips.push({
                id: 'fallback_pc',
                title: '🔄 Past Continuous',
                message: 'Usa "was/were + verbo-ing" para acciones en progreso en el pasado',
                example: 'I was studying when you called'
            });
        } else if (analysisResult.tenseType === 'past_simple') {
            guide.tips.push({
                id: 'fallback_ps',
                title: '✅ Past Simple',
                message: 'Usa verbos en pasado para acciones completadas',
                example: 'I studied English yesterday'
            });
        }

        // Mensaje motivacional básico
        guide.motivation = {
            type: 'encouragement',
            message: '¡Sigue practicando! Cada intento te acerca más al éxito',
            icon: '💪',
            priority: 'medium'
        };

        return guide;
    }

    /**
     * Funciones auxiliares
     */
    showSection(section) {
        section.style.display = 'block';
        this.animateIn(section);
    }

    hideAllSections() {
        [this.tipsSection, this.miniLessonSection, this.motivationSection, this.nextStepsSection]
            .forEach(section => section.style.display = 'none');
    }

    animateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            element.style.transition = `opacity ${this.options.animationDuration}ms ease, transform ${this.options.animationDuration}ms ease`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 10);
    }

    toggleGuides() {
        const content = this.guidesContent;
        const toggleIcon = this.container.querySelector('.toggle-icon');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggleIcon.textContent = '−';
        } else {
            content.style.display = 'none';
            toggleIcon.textContent = '+';
        }
    }

    getDifficultyLabel(difficulty) {
        const labels = {
            'easy': '🟢 Fácil',
            'medium': '🟡 Medio',
            'hard': '🔴 Difícil'
        };
        return labels[difficulty] || '🟡 Medio';
    }

    getStepTypeLabel(type) {
        const labels = {
            'correction': '🔧 Corrección',
            'completion': '📝 Completar',
            'practice': '💪 Práctica',
            'challenge': '🎯 Desafío'
        };
        return labels[type] || '📝 Tarea';
    }

    getUserId() {
        // En una implementación real, obtener del token o sesión
        return localStorage.getItem('userId') || 'anonymous';
    }

    showErrorMessage() {
        this.hideAllSections();
        this.welcomeMessage.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <div class="error-text">
                    <h4>Error al cargar las guías</h4>
                    <p>Inténtalo de nuevo en un momento.</p>
                </div>
            </div>
        `;
        this.welcomeMessage.style.display = 'block';
    }

    /**
     * Obtiene tip aleatorio
     */
    async getRandomTip(tenseType = 'past_continuous', level = 'basic') {
        try {
            const response = await fetch(`/api/guides/random-tip?tenseType=${tenseType}&level=${level}`);
            
            if (response.ok) {
                const result = await response.json();
                return result.data.tip;
            }
        } catch (error) {
            console.error('Error getting random tip:', error);
        }
        
        return null;
    }

    /**
     * Resetea las guías
     */
    reset() {
        this.hideAllSections();
        this.showWelcomeMessage();
        this.currentGuide = null;
        this.currentLessonStep = 0;
    }
}

// Exportar para uso global
window.ContextualGuidesComponent = ContextualGuidesComponent;