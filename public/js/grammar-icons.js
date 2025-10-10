// public/js/grammar-icons.js

/**
 * ═══════════════════════════════════════════════════
 * 🎯 GRAMMAR ICONS COMPONENT
 * ═══════════════════════════════════════════════════
 * 
 * Componente para mostrar iconos de estructura gramatical
 * que se activan dinámicamente mientras el usuario escribe
 */

class GrammarIconsComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.icons = {};
    this.currentTenseType = null;
    this.completedParts = new Set();
    
    this.init();
  }

  /**
   * Inicializa el componente
   */
  init() {
    if (!this.container) {
      console.error('Grammar icons container not found');
      return;
    }

    this.createIconsHTML();
    this.setupEventListeners();
  }

  /**
   * Crea la estructura HTML de los iconos
   */
  createIconsHTML() {
    this.container.innerHTML = `
      <div class="grammar-icons-wrapper">
        <div class="grammar-icons-header">
          <h3 class="icons-title">📖 Estructura de la Oración</h3>
          <div class="tense-indicator">
            <span class="tense-label">Tiempo verbal:</span>
            <span class="tense-type" id="tense-type-display">Detectando...</span>
          </div>
        </div>
        
        <div class="grammar-icons-container">
          <!-- Past Continuous Icons -->
          <div class="icon-group past-continuous" id="past-continuous-group" style="display: none;">
            <div class="icon-group-title">Past Continuous</div>
            <div class="icons-row">
              <div class="grammar-icon" data-type="subject" data-tense="continuous">
                <div class="icon-symbol">👤</div>
                <div class="icon-label">Sujeto</div>
                <div class="icon-example">I, she, they</div>
              </div>
              
              <div class="grammar-icon" data-type="auxiliary" data-tense="continuous">
                <div class="icon-symbol">⚡</div>
                <div class="icon-label">was/were</div>
                <div class="icon-example">was, were</div>
              </div>
              
              <div class="grammar-icon" data-type="verb" data-tense="continuous">
                <div class="icon-symbol">🎯</div>
                <div class="icon-label">Verbo</div>
                <div class="icon-example">walk, study</div>
              </div>
              
              <div class="grammar-icon" data-type="gerund" data-tense="continuous">
                <div class="icon-symbol">🔄</div>
                <div class="icon-label">-ing</div>
                <div class="icon-example">walking, studying</div>
              </div>
              
              <div class="grammar-icon" data-type="complement" data-tense="continuous">
                <div class="icon-symbol">📝</div>
                <div class="icon-label">Complemento</div>
                <div class="icon-example">to school, at home</div>
              </div>
            </div>
          </div>

          <!-- Past Simple Icons -->
          <div class="icon-group past-simple" id="past-simple-group" style="display: none;">
            <div class="icon-group-title">Past Simple</div>
            <div class="icons-row">
              <div class="grammar-icon" data-type="subject" data-tense="simple">
                <div class="icon-symbol">👤</div>
                <div class="icon-label">Sujeto</div>
                <div class="icon-example">I, she, they</div>
              </div>
              
              <div class="grammar-icon" data-type="past-verb" data-tense="simple">
                <div class="icon-symbol">🎯</div>
                <div class="icon-label">Verbo Pasado</div>
                <div class="icon-example">walked, went, studied</div>
              </div>
              
              <div class="grammar-icon" data-type="complement" data-tense="simple">
                <div class="icon-symbol">📝</div>
                <div class="icon-label">Complemento</div>
                <div class="icon-example">to school, yesterday</div>
              </div>
            </div>
          </div>

          <!-- Connector Icon (appears for both) -->
          <div class="icon-group connector-group" id="connector-group" style="display: none;">
            <div class="icon-group-title">Conector</div>
            <div class="icons-row">
              <div class="grammar-icon" data-type="connector">
                <div class="icon-symbol">🔗</div>
                <div class="icon-label">while/when/as</div>
                <div class="icon-example">while, when, as</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="grammar-progress">
          <div class="progress-label">Progreso de la estructura:</div>
          <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
          </div>
          <div class="progress-text" id="progress-text">0%</div>
        </div>

        <!-- Tips Section -->
        <div class="grammar-tips" id="grammar-tips">
          <div class="tips-title">💡 Consejos:</div>
          <div class="tips-content" id="tips-content">
            Empieza escribiendo tu oración para ver los iconos activarse...
          </div>
        </div>
      </div>
    `;

    // Guardar referencias a los iconos
    this.icons = {
      subject: this.container.querySelector('[data-type="subject"]'),
      auxiliary: this.container.querySelector('[data-type="auxiliary"]'),
      verb: this.container.querySelector('[data-type="verb"]'),
      gerund: this.container.querySelector('[data-type="gerund"]'),
      pastVerb: this.container.querySelector('[data-type="past-verb"]'),
      complement: this.container.querySelector('[data-type="complement"]'),
      connector: this.container.querySelector('[data-type="connector"]')
    };
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    // Agregar tooltips a los iconos
    this.container.querySelectorAll('.grammar-icon').forEach(icon => {
      icon.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.target.closest('.grammar-icon'));
      });
      
      icon.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  /**
   * Actualiza los iconos basado en el análisis de estructura
   */
  updateIcons(structureAnalysis) {
    if (!structureAnalysis) return;

    const { tenseType, parts, completedParts, missingParts } = structureAnalysis;
    
    // Actualizar tipo de tiempo verbal
    this.updateTenseType(tenseType);
    
    // Mostrar grupo de iconos apropiado
    this.showRelevantIconGroup(tenseType);
    
    // Actualizar estado de cada icono
    this.updateIconStates(parts, completedParts);
    
    // Actualizar barra de progreso
    this.updateProgress(completedParts, tenseType);
    
    // Actualizar tips
    this.updateTips(structureAnalysis);
  }

  /**
   * Actualiza el indicador de tipo de tiempo verbal
   */
  updateTenseType(tenseType) {
    const tenseDisplay = document.getElementById('tense-type-display');
    if (!tenseDisplay) return;

    const tenseLabels = {
      'past_continuous': '🔄 Past Continuous',
      'past_simple': '⚡ Past Simple',
      'present_error': '❌ Presente (Error)',
      'unknown': '❓ Detectando...'
    };

    const tenseColors = {
      'past_continuous': '#4A90E2',
      'past_simple': '#7ED321', 
      'present_error': '#D0021B',
      'unknown': '#9B9B9B'
    };

    tenseDisplay.textContent = tenseLabels[tenseType] || tenseLabels.unknown;
    tenseDisplay.style.color = tenseColors[tenseType] || tenseColors.unknown;
    
    this.currentTenseType = tenseType;
  }

  /**
   * Muestra el grupo de iconos relevante
   */
  showRelevantIconGroup(tenseType) {
    const continuousGroup = document.getElementById('past-continuous-group');
    const simpleGroup = document.getElementById('past-simple-group');
    const connectorGroup = document.getElementById('connector-group');

    // Ocultar todos los grupos primero
    continuousGroup.style.display = 'none';
    simpleGroup.style.display = 'none';

    // Mostrar el grupo apropiado
    if (tenseType === 'past_continuous' || tenseType === 'present_error') {
      continuousGroup.style.display = 'block';
    } else if (tenseType === 'past_simple') {
      simpleGroup.style.display = 'block';
    } else {
      // Mostrar ambos si no está claro
      continuousGroup.style.display = 'block';
      simpleGroup.style.display = 'block';
    }
  }

  /**
   * Actualiza el estado de cada icono
   */
  updateIconStates(parts, completedParts) {
    // Resetear todos los iconos
    this.container.querySelectorAll('.grammar-icon').forEach(icon => {
      icon.classList.remove('active', 'error', 'missing');
      icon.classList.add('inactive');
    });

    // Activar iconos completados
    completedParts.forEach(partType => {
      this.activateIcon(partType, parts[partType]);
    });

    // Marcar iconos con errores
    Object.keys(parts).forEach(partType => {
      const part = parts[partType];
      if (part && !part.isValid) {
        this.markIconAsError(partType, part.error);
      }
    });

    // Mostrar conector si existe
    if (parts.connector) {
      document.getElementById('connector-group').style.display = 'block';
      this.activateIcon('connector', parts.connector);
    }
  }

  /**
   * Activa un icono específico
   */
  activateIcon(partType, partData) {
    let iconSelector = '';
    
    // Mapear tipos de partes a selectores
    const typeMapping = {
      'subject': '[data-type="subject"]',
      'auxiliary': '[data-type="auxiliary"]',
      'main_verb': '[data-type="past-verb"]',
      'gerund': '[data-type="gerund"]',
      'complement': '[data-type="complement"]',
      'connector': '[data-type="connector"]'
    };

    iconSelector = typeMapping[partType];
    if (!iconSelector) return;

    // Buscar el icono en el grupo activo
    let icon = null;
    if (this.currentTenseType === 'past_continuous') {
      icon = document.querySelector(`#past-continuous-group ${iconSelector}`);
    } else if (this.currentTenseType === 'past_simple') {
      icon = document.querySelector(`#past-simple-group ${iconSelector}`);
    }
    
    // Si no se encuentra en grupos específicos, buscar globalmente
    if (!icon) {
      icon = this.container.querySelector(iconSelector);
    }

    if (icon) {
      icon.classList.remove('inactive', 'error', 'missing');
      icon.classList.add('active');
      
      // Agregar animación de activación
      icon.style.animation = 'iconActivate 0.3s ease-out';
      setTimeout(() => {
        icon.style.animation = '';
      }, 300);

      // Actualizar ejemplo con el texto real
      if (partData && partData.text) {
        const example = icon.querySelector('.icon-example');
        if (example) {
          example.textContent = partData.text;
          example.style.fontWeight = 'bold';
        }
      }
    }
  }

  /**
   * Marca un icono como error
   */
  markIconAsError(partType, errorType) {
    const typeMapping = {
      'subject': '[data-type="subject"]',
      'auxiliary': '[data-type="auxiliary"]',
      'main_verb': '[data-type="past-verb"]',
      'gerund': '[data-type="gerund"]'
    };

    const iconSelector = typeMapping[partType];
    if (!iconSelector) return;

    const icon = this.container.querySelector(iconSelector);
    if (icon) {
      icon.classList.remove('inactive', 'active');
      icon.classList.add('error');
      
      // Agregar animación de error
      icon.style.animation = 'iconError 0.5s ease-out';
      setTimeout(() => {
        icon.style.animation = '';
      }, 500);
    }
  }

  /**
   * Actualiza la barra de progreso
   */
  updateProgress(completedParts, tenseType) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (!progressFill || !progressText) return;

    // Determinar partes requeridas según el tipo de tiempo
    let requiredParts = [];
    if (tenseType === 'past_continuous') {
      requiredParts = ['subject', 'auxiliary', 'gerund'];
    } else if (tenseType === 'past_simple') {
      requiredParts = ['subject', 'main_verb'];
    } else {
      requiredParts = ['subject', 'main_verb']; // Mínimo
    }

    // Calcular progreso
    const completedRequired = completedParts.filter(part => 
      requiredParts.includes(part)
    ).length;
    
    const percentage = requiredParts.length > 0 
      ? Math.round((completedRequired / requiredParts.length) * 100)
      : 0;

    // Actualizar visualización
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;

    // Cambiar color según el progreso
    if (percentage === 100) {
      progressFill.style.backgroundColor = '#7ED321'; // Verde
    } else if (percentage >= 50) {
      progressFill.style.backgroundColor = '#F5A623'; // Naranja
    } else {
      progressFill.style.backgroundColor = '#4A90E2'; // Azul
    }
  }

  /**
   * Actualiza los tips contextuales
   */
  updateTips(structureAnalysis) {
    const tipsContent = document.getElementById('tips-content');
    if (!tipsContent) return;

    const { tenseType, parts, errors, missingParts } = structureAnalysis;
    let tips = [];

    // Tips basados en errores
    if (errors && errors.length > 0) {
      errors.forEach(error => {
        if (error.type === 'present_in_past') {
          tips.push(`❌ Cambia "${error.detected}" por "${error.suggestion}" (usa pasado, no presente)`);
        } else if (error.type === 'missing_gerund') {
          tips.push('📝 Agrega "-ing" al verbo para Past Continuous');
        }
      });
    }

    // Tips basados en partes faltantes
    if (missingParts && missingParts.length > 0) {
      missingParts.forEach(missing => {
        if (missing === 'subject') {
          tips.push('👤 Agrega un sujeto (I, she, they, etc.)');
        } else if (missing === 'auxiliary') {
          tips.push('⚡ Agrega "was" o "were" para Past Continuous');
        } else if (missing === 'gerund') {
          tips.push('🔄 Agrega "-ing" al verbo');
        } else if (missing === 'main_verb') {
          tips.push('🎯 Agrega un verbo en pasado');
        }
      });
    }

    // Tips basados en conectores
    if (parts.connector) {
      const connector = parts.connector.text;
      if (connector === 'while') {
        tips.push('💡 "While" sugiere usar Past Continuous para acciones simultáneas');
      } else if (connector === 'when') {
        tips.push('💡 "When" puede usar Past Simple (interrupción) o Past Continuous (contexto)');
      } else if (connector === 'as') {
        tips.push('💡 "As" sugiere Past Continuous para acciones en desarrollo');
      }
    }

    // Tips de éxito
    if (tips.length === 0 && structureAnalysis.isValid) {
      tips.push('🎉 ¡Excelente! Tu estructura gramatical está perfecta');
    }

    // Mostrar tips o mensaje por defecto
    if (tips.length > 0) {
      tipsContent.innerHTML = tips.map(tip => `<div class="tip-item">${tip}</div>`).join('');
    } else {
      tipsContent.innerHTML = 'Sigue escribiendo para recibir consejos personalizados...';
    }
  }

  /**
   * Muestra tooltip para un icono
   */
  showTooltip(icon) {
    const type = icon.dataset.type;
    const tense = icon.dataset.tense;
    
    let tooltipText = '';
    
    if (type === 'subject') {
      tooltipText = 'El sujeto es quien realiza la acción (I, you, he, she, it, we, they)';
    } else if (type === 'auxiliary') {
      tooltipText = 'Auxiliar para Past Continuous: "was" (I/he/she/it) o "were" (you/we/they)';
    } else if (type === 'verb') {
      tooltipText = 'El verbo base que describe la acción (walk, study, cook, etc.)';
    } else if (type === 'gerund') {
      tooltipText = 'Forma -ing del verbo para Past Continuous (walking, studying, cooking)';
    } else if (type === 'past-verb') {
      tooltipText = 'Verbo en pasado para Past Simple (walked, studied, went, ate)';
    } else if (type === 'complement') {
      tooltipText = 'Información adicional (dónde, cuándo, cómo, qué)';
    } else if (type === 'connector') {
      tooltipText = 'Conectores para unir oraciones (while, when, as)';
    }

    // Crear y mostrar tooltip
    this.createTooltip(icon, tooltipText);
  }

  /**
   * Crea un tooltip
   */
  createTooltip(element, text) {
    // Remover tooltip existente
    this.hideTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'grammar-tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    // Posicionar tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    
    this.currentTooltip = tooltip;
  }

  /**
   * Oculta tooltip
   */
  hideTooltip() {
    if (this.currentTooltip) {
      this.currentTooltip.remove();
      this.currentTooltip = null;
    }
  }

  /**
   * Resetea todos los iconos
   */
  reset() {
    this.container.querySelectorAll('.grammar-icon').forEach(icon => {
      icon.classList.remove('active', 'error', 'missing');
      icon.classList.add('inactive');
      
      // Resetear ejemplos
      const example = icon.querySelector('.icon-example');
      if (example) {
        example.style.fontWeight = 'normal';
      }
    });

    // Resetear progreso
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    if (progressFill) progressFill.style.width = '0%';
    if (progressText) progressText.textContent = '0%';

    // Resetear tips
    const tipsContent = document.getElementById('tips-content');
    if (tipsContent) {
      tipsContent.innerHTML = 'Empieza escribiendo tu oración para ver los iconos activarse...';
    }

    // Ocultar grupos
    document.getElementById('past-continuous-group').style.display = 'none';
    document.getElementById('past-simple-group').style.display = 'none';
    document.getElementById('connector-group').style.display = 'none';

    this.currentTenseType = null;
    this.completedParts.clear();
  }
}

// Exportar para uso global
window.GrammarIconsComponent = GrammarIconsComponent;