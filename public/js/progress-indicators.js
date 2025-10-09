// public/js/progress-indicators.js

/**
 * ═══════════════════════════════════════════════════
 * 📊 PROGRESS INDICATORS COMPONENT
 * ═══════════════════════════════════════════════════
 * 
 * Componente para mostrar indicadores visuales de progreso,
 * barras de progreso, badges y gráficos de aprendizaje
 */

class ProgressIndicatorsComponent {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            showGrammarProgress: true,
            showAchievements: true,
            showLearningGraphs: true,
            showUserLevel: true,
            animationDuration: 500,
            updateInterval: 1000,
            ...options
        };

        this.currentProgress = null;
        this.animationQueue = [];
        this.isAnimating = false;

        this.init();
    }

    /**
     * Inicializa el componente
     */
    init() {
        if (!this.container) {
            console.error('Progress indicators container not found');
            return;
        }

        this.createProgressStructure();
        this.setupEventListeners();
        this.showInitialState();
    }

    /**
     * Crea la estructura HTML de los indicadores
     */
    createProgressStructure() {
        this.container.innerHTML = `
            <div class="progress-indicators">
                <!-- Nivel del usuario -->
                <div class="user-level-section">
                    <div class="level-header">
                        <span class="level-icon">🎯</span>
                        <span class="level-title">Tu Nivel</span>
                    </div>
                    <div class="level-content">
                        <div class="level-badge">
                            <span class="level-emoji">🌱</span>
                            <span class="level-name">Principiante</span>
                        </div>
                        <div class="level-progress">
                            <div class="level-bar">
                                <div class="level-fill" style="width: 0%"></div>
                            </div>
                            <div class="level-text">0 / 10 oraciones</div>
                        </div>
                    </div>
                </div>

                <!-- Progreso gramatical -->
                <div class="grammar-progress-section">
                    <div class="section-header">
                        <span class="section-icon">📝</span>
                        <span class="section-title">Estructura Gramatical</span>
                    </div>
                    <div class="grammar-progress-content">
                        <div class="grammar-bar">
                            <div class="grammar-fill" style="width: 0%"></div>
                            <div class="grammar-percentage">0%</div>
                        </div>
                        <div class="grammar-parts"></div>
                        <div class="grammar-message">Empieza a escribir para ver tu progreso</div>
                    </div>
                </div>

                <!-- Logros y badges -->
                <div class="achievements-section">
                    <div class="section-header">
                        <span class="section-icon">🏆</span>
                        <span class="section-title">Logros</span>
                        <span class="achievements-count">0 / 0</span>
                    </div>
                    <div class="achievements-content">
                        <div class="earned-badges"></div>
                        <div class="next-milestones"></div>
                    </div>
                </div>

                <!-- Estadísticas -->
                <div class="stats-section">
                    <div class="section-header">
                        <span class="section-icon">📊</span>
                        <span class="section-title">Estadísticas</span>
                    </div>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value">0%</div>
                            <div class="stat-label">Precisión</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">0</div>
                            <div class="stat-label">Oraciones</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">0</div>
                            <div class="stat-label">Racha</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">0m</div>
                            <div class="stat-label">Tiempo</div>
                        </div>
                    </div>
                </div>

                <!-- Motivación -->
                <div class="motivation-section">
                    <div class="motivation-content">
                        <div class="motivation-icon">🌟</div>
                        <div class="motivation-text">
                            <div class="motivation-message">¡Comienza tu aventura de aprendizaje!</div>
                            <div class="motivation-encouragement">Cada oración te acerca más al éxito</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Referencias a elementos
        this.levelSection = this.container.querySelector('.user-level-section');
        this.grammarSection = this.container.querySelector('.grammar-progress-section');
        this.achievementsSection = this.container.querySelector('.achievements-section');
        this.statsSection = this.container.querySelector('.stats-section');
        this.motivationSection = this.container.querySelector('.motivation-section');
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Click en badges para mostrar detalles
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.badge-item')) {
                this.showBadgeDetails(e.target.closest('.badge-item'));
            }
        });

        // Hover en partes gramaticales
        this.container.addEventListener('mouseenter', (e) => {
            if (e.target.closest('.grammar-part')) {
                this.showPartTooltip(e.target.closest('.grammar-part'));
            }
        }, true);

        this.container.addEventListener('mouseleave', (e) => {
            if (e.target.closest('.grammar-part')) {
                this.hidePartTooltip();
            }
        }, true);
    }

    /**
     * Muestra estado inicial
     */
    showInitialState() {
        this.updateUserLevel({
            current: 'beginner',
            name: 'Principiante',
            icon: '🌱',
            progress: 0,
            remaining: 10,
            percentage: 0
        });

        this.updateStats({
            accuracy: 0,
            totalSentences: 0,
            currentStreak: 0,
            practiceTime: 0
        });
    }

    /**
     * Actualiza todos los indicadores de progreso
     */
    updateProgress(progressData) {
        this.currentProgress = progressData;

        if (progressData.userLevel && this.options.showUserLevel) {
            this.updateUserLevel(progressData.userLevel);
        }

        if (progressData.grammarProgress && this.options.showGrammarProgress) {
            this.updateGrammarProgress(progressData.grammarProgress);
        }

        if (progressData.achievements && this.options.showAchievements) {
            this.updateAchievements(progressData.achievements);
        }

        if (progressData.stats) {
            this.updateStats(progressData.stats);
        }

        if (progressData.motivation) {
            this.updateMotivation(progressData.motivation);
        }

        // Procesar animaciones en cola
        this.processAnimationQueue();
    }

    /**
     * Actualiza el nivel del usuario
     */
    updateUserLevel(levelData) {
        const levelBadge = this.levelSection.querySelector('.level-badge');
        const levelEmoji = levelBadge.querySelector('.level-emoji');
        const levelName = levelBadge.querySelector('.level-name');
        const levelFill = this.levelSection.querySelector('.level-fill');
        const levelText = this.levelSection.querySelector('.level-text');

        // Animar cambio de nivel si es diferente
        const currentLevel = levelName.textContent;
        if (currentLevel !== levelData.name) {
            this.animateLevelUp(levelData);
        }

        levelEmoji.textContent = levelData.icon;
        levelName.textContent = levelData.name;
        levelText.textContent = `${levelData.progress} / ${levelData.progress + levelData.remaining} oraciones`;

        // Animar barra de progreso
        this.animateProgressBar(levelFill, levelData.percentage);
    }

    /**
     * Actualiza el progreso gramatical
     */
    updateGrammarProgress(grammarData) {
        const grammarFill = this.grammarSection.querySelector('.grammar-fill');
        const grammarPercentage = this.grammarSection.querySelector('.grammar-percentage');
        const grammarParts = this.grammarSection.querySelector('.grammar-parts');
        const grammarMessage = this.grammarSection.querySelector('.grammar-message');

        // Actualizar porcentaje
        grammarPercentage.textContent = `${grammarData.percentage}%`;
        grammarMessage.textContent = grammarData.message;

        // Animar barra de progreso
        this.animateProgressBar(grammarFill, grammarData.percentage, grammarData.color);

        // Actualizar partes gramaticales
        grammarParts.innerHTML = grammarData.parts.map(part => `
            <div class="grammar-part ${part.status}" data-part="${part.name}">
                <span class="part-icon">${part.icon}</span>
                <span class="part-label">${part.label}</span>
                <span class="part-status-icon">${this.getStatusIcon(part.status)}</span>
            </div>
        `).join('');

        // Animar partes completadas
        grammarData.parts.forEach((part, index) => {
            if (part.completed) {
                setTimeout(() => {
                    const partElement = grammarParts.children[index];
                    if (partElement) {
                        partElement.classList.add('animate-complete');
                    }
                }, index * 100);
            }
        });
    }

    /**
     * Actualiza los logros y badges
     */
    updateAchievements(achievementsData) {
        const earnedBadges = this.achievementsSection.querySelector('.earned-badges');
        const nextMilestones = this.achievementsSection.querySelector('.next-milestones');
        const achievementsCount = this.achievementsSection.querySelector('.achievements-count');

        // Actualizar contador
        achievementsCount.textContent = `${achievementsData.totalEarned} / ${achievementsData.totalAvailable}`;

        // Mostrar badges ganados
        earnedBadges.innerHTML = `
            <div class="badges-header">Badges Ganados</div>
            <div class="badges-grid">
                ${achievementsData.earned.slice(0, 6).map(badge => `
                    <div class="badge-item earned" data-badge-id="${badge.id}">
                        <div class="badge-icon" style="background-color: ${badge.color}">${badge.icon}</div>
                        <div class="badge-name">${badge.name}</div>
                        <div class="badge-rarity ${badge.rarity}">${badge.rarity}</div>
                    </div>
                `).join('')}
                ${achievementsData.earned.length > 6 ? `
                    <div class="badge-item more">
                        <div class="badge-icon">+${achievementsData.earned.length - 6}</div>
                        <div class="badge-name">Más badges</div>
                    </div>
                ` : ''}
            </div>
        `;

        // Mostrar próximos hitos
        if (achievementsData.nextMilestones.length > 0) {
            nextMilestones.innerHTML = `
                <div class="milestones-header">Próximos Logros</div>
                <div class="milestones-list">
                    ${achievementsData.nextMilestones.map(milestone => `
                        <div class="milestone-item">
                            <div class="milestone-progress">
                                <div class="milestone-bar">
                                    <div class="milestone-fill" style="width: ${(milestone.progress / milestone.target) * 100}%"></div>
                                </div>
                                <div class="milestone-text">${milestone.progress} / ${milestone.target}</div>
                            </div>
                            <div class="milestone-info">
                                <div class="milestone-name">${milestone.badge}</div>
                                <div class="milestone-description">${milestone.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            nextMilestones.innerHTML = `
                <div class="milestones-header">¡Todos los logros desbloqueados!</div>
                <div class="milestones-complete">🎉 ¡Increíble trabajo!</div>
            `;
        }

        // Animar nuevos badges
        this.animateNewBadges(achievementsData.earned);
    }

    /**
     * Actualiza las estadísticas
     */
    updateStats(statsData) {
        const statItems = this.statsSection.querySelectorAll('.stat-item');
        
        const stats = [
            { value: `${statsData.accuracy}%`, label: 'Precisión' },
            { value: statsData.totalSentences, label: 'Oraciones' },
            { value: statsData.currentStreak, label: 'Racha' },
            { value: this.formatTime(statsData.practiceTime), label: 'Tiempo' }
        ];

        stats.forEach((stat, index) => {
            if (statItems[index]) {
                const valueElement = statItems[index].querySelector('.stat-value');
                const labelElement = statItems[index].querySelector('.stat-label');
                
                // Animar cambio de valor
                this.animateStatValue(valueElement, stat.value);
                labelElement.textContent = stat.label;
            }
        });
    }

    /**
     * Actualiza la motivación
     */
    updateMotivation(motivationData) {
        const motivationIcon = this.motivationSection.querySelector('.motivation-icon');
        const motivationMessage = this.motivationSection.querySelector('.motivation-message');
        const motivationEncouragement = this.motivationSection.querySelector('.motivation-encouragement');

        motivationIcon.textContent = motivationData.icon;
        motivationIcon.style.color = motivationData.color;
        motivationMessage.textContent = motivationData.message;
        motivationEncouragement.textContent = motivationData.encouragement;

        // Animar sección de motivación
        this.animateMotivation();
    }

    /**
     * Animaciones
     */
    animateProgressBar(element, percentage, color = '#4299e1') {
        if (!element) return;

        element.style.backgroundColor = color;
        element.style.transition = `width ${this.options.animationDuration}ms ease`;
        element.style.width = `${Math.min(percentage, 100)}%`;
    }

    animateLevelUp(levelData) {
        const levelBadge = this.levelSection.querySelector('.level-badge');
        
        // Efecto de level up
        levelBadge.classList.add('level-up-animation');
        
        // Mostrar notificación
        this.showLevelUpNotification(levelData);
        
        setTimeout(() => {
            levelBadge.classList.remove('level-up-animation');
        }, this.options.animationDuration);
    }

    animateNewBadges(earnedBadges) {
        // Animar solo badges recién ganados (últimos 5 minutos)
        const recentBadges = earnedBadges.filter(badge => 
            Date.now() - badge.earnedAt < 5 * 60 * 1000
        );

        recentBadges.forEach((badge, index) => {
            setTimeout(() => {
                this.showBadgeEarnedNotification(badge);
            }, index * 500);
        });
    }

    animateStatValue(element, newValue) {
        if (!element) return;

        const oldValue = element.textContent;
        if (oldValue !== newValue.toString()) {
            element.classList.add('stat-update');
            element.textContent = newValue;
            
            setTimeout(() => {
                element.classList.remove('stat-update');
            }, this.options.animationDuration);
        }
    }

    animateMotivation() {
        const motivationContent = this.motivationSection.querySelector('.motivation-content');
        motivationContent.classList.add('motivation-pulse');
        
        setTimeout(() => {
            motivationContent.classList.remove('motivation-pulse');
        }, this.options.animationDuration);
    }

    /**
     * Notificaciones
     */
    showLevelUpNotification(levelData) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">🎉</div>
                <div class="notification-text">
                    <div class="notification-title">¡Nivel Subido!</div>
                    <div class="notification-message">Ahora eres ${levelData.name}</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => notification.classList.add('show'), 100);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    showBadgeEarnedNotification(badge) {
        const notification = document.createElement('div');
        notification.className = 'badge-earned-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-badge" style="background-color: ${badge.color}">
                    ${badge.icon}
                </div>
                <div class="notification-text">
                    <div class="notification-title">¡Badge Ganado!</div>
                    <div class="notification-message">${badge.name}</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => notification.classList.add('show'), 100);

        // Remover después de 4 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 4000);
    }

    /**
     * Tooltips y detalles
     */
    showPartTooltip(partElement) {
        const partName = partElement.dataset.part;
        const tooltip = document.createElement('div');
        tooltip.className = 'part-tooltip';
        tooltip.textContent = this.getPartTooltipText(partName);

        document.body.appendChild(tooltip);

        // Posicionar tooltip
        const rect = partElement.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;

        this.currentTooltip = tooltip;
    }

    hidePartTooltip() {
        if (this.currentTooltip) {
            document.body.removeChild(this.currentTooltip);
            this.currentTooltip = null;
        }
    }

    showBadgeDetails(badgeElement) {
        const badgeId = badgeElement.dataset.badgeId;
        // Implementar modal con detalles del badge
        console.log('Showing details for badge:', badgeId);
    }

    /**
     * Funciones auxiliares
     */
    getStatusIcon(status) {
        const icons = {
            'completed': '✅',
            'error': '❌',
            'missing': '⭕'
        };
        return icons[status] || '⭕';
    }

    getPartTooltipText(partName) {
        const tooltips = {
            'subject': 'El sujeto es quien realiza la acción (I, you, he, she, etc.)',
            'auxiliary': 'El auxiliar indica el tiempo (was/were para Past Continuous)',
            'gerund': 'El gerundio es el verbo + ing (walking, studying, etc.)',
            'main_verb': 'El verbo principal en pasado (walked, studied, etc.)',
            'complement': 'Información adicional sobre la acción',
            'connector': 'Palabras que conectan ideas (while, when, as, etc.)'
        };
        return tooltips[partName] || 'Parte de la estructura gramatical';
    }

    formatTime(milliseconds) {
        const minutes = Math.floor(milliseconds / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return '0m';
        }
    }

    processAnimationQueue() {
        if (this.isAnimating || this.animationQueue.length === 0) return;

        this.isAnimating = true;
        const animation = this.animationQueue.shift();
        
        animation();
        
        setTimeout(() => {
            this.isAnimating = false;
            this.processAnimationQueue();
        }, this.options.animationDuration);
    }

    /**
     * API para actualizar progreso desde otros componentes
     */
    updateGrammarProgressOnly(grammarData) {
        if (this.options.showGrammarProgress) {
            this.updateGrammarProgress(grammarData);
        }
    }

    updateUserStats(statsData) {
        this.updateStats(statsData);
    }

    addAchievement(badge) {
        this.showBadgeEarnedNotification(badge);
    }

    /**
     * Resetea todos los indicadores
     */
    reset() {
        this.currentProgress = null;
        this.animationQueue = [];
        this.isAnimating = false;
        this.showInitialState();
    }

    /**
     * Obtiene el progreso actual
     */
    getCurrentProgress() {
        return this.currentProgress;
    }
}

// Exportar para uso global
window.ProgressIndicatorsComponent = ProgressIndicatorsComponent;