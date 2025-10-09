// public/js/ui-components.js

/**
 * ═══════════════════════════════════════════════════
 * 🎨 UI COMPONENTS
 * ═══════════════════════════════════════════════════
 * 
 * Componentes de interfaz minimalistas y profesionales
 * Animaciones sutiles y no distractoras
 */

/**
 * 🎴 Card Component - Componente de Tarjeta
 */
class UICard {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.options = {
      title: '',
      subtitle: '',
      content: '',
      actions: [],
      animated: true,
      ...options
    };
    
    this.render();
  }

  render() {
    if (!this.container) return;

    const cardHTML = `
      <div class="card ${this.options.animated ? 'animate-fade-in' : ''}">
        ${this.options.title || this.options.subtitle ? `
          <div class="card-header">
            ${this.options.title ? `<h3 class="card-title">${this.options.title}</h3>` : ''}
            ${this.options.subtitle ? `<p class="card-subtitle">${this.options.subtitle}</p>` : ''}
          </div>
        ` : ''}
        
        ${this.options.content ? `
          <div class="card-body">
            ${this.options.content}
          </div>
        ` : ''}
        
        ${this.options.actions && this.options.actions.length > 0 ? `
          <div class="card-footer">
            ${this.options.actions.map(action => `
              <button class="btn ${action.class || 'btn-primary'}" 
                      onclick="${action.onclick || ''}"
                      ${action.disabled ? 'disabled' : ''}>
                ${action.icon ? `<span class="btn-icon">${action.icon}</span>` : ''}
                ${action.text}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    this.container.innerHTML = cardHTML;
  }

  update(options) {
    this.options = { ...this.options, ...options };
    this.render();
  }
}

/**
 * 🔔 Toast Notification Component
 */
class UIToast {
  constructor() {
    this.container = this.createContainer();
    this.toasts = [];
  }

  createContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }
    return container;
  }

  show(message, type = 'info', duration = 4000) {
    const toastId = 'toast-' + Date.now();
    const iconMap = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `alert alert-${type} animate-slide-in`;
    toast.style.cssText = `
      cursor: pointer;
      transition: all 250ms ease-in-out;
    `;

    toast.innerHTML = `
      <div class="alert-icon">${iconMap[type] || iconMap.info}</div>
      <div class="alert-content">
        <div class="alert-message">${message}</div>
      </div>
    `;

    // Agregar evento de click para cerrar
    toast.addEventListener('click', () => this.hide(toastId));

    this.container.appendChild(toast);
    this.toasts.push(toastId);

    // Auto-hide después del tiempo especificado
    if (duration > 0) {
      setTimeout(() => this.hide(toastId), duration);
    }

    return toastId;
  }

  hide(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        this.toasts = this.toasts.filter(id => id !== toastId);
      }, 250);
    }
  }

  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

/**
 * 📊 Progress Bar Component
 */
class UIProgressBar {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.options = {
      value: 0,
      max: 100,
      type: 'primary',
      showLabel: true,
      animated: true,
      ...options
    };
    
    this.render();
  }

  render() {
    if (!this.container) return;

    const percentage = Math.round((this.options.value / this.options.max) * 100);
    
    const progressHTML = `
      <div class="progress-wrapper">
        ${this.options.showLabel ? `
          <div class="progress-label flex justify-between items-center mb-sm">
            <span class="text-sm text-secondary">${this.options.label || 'Progreso'}</span>
            <span class="text-sm font-medium">${percentage}%</span>
          </div>
        ` : ''}
        <div class="progress progress-${this.options.type}">
          <div class="progress-bar ${this.options.animated ? 'animate-fade-in' : ''}" 
               style="width: ${percentage}%"></div>
        </div>
      </div>
    `;

    this.container.innerHTML = progressHTML;
  }

  update(value, options = {}) {
    this.options = { ...this.options, ...options };
    this.options.value = value;
    this.render();
  }

  animate(targetValue, duration = 1000) {
    const startValue = this.options.value;
    const difference = targetValue - startValue;
    const startTime = Date.now();

    const animateStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (difference * easeOut);
      this.update(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animateStep);
      }
    };

    requestAnimationFrame(animateStep);
  }
}

/**
 * 🏷️ Badge Component
 */
class UIBadge {
  static create(text, type = 'primary', icon = null) {
    const badge = document.createElement('span');
    badge.className = `badge badge-${type}`;
    
    const content = `
      ${icon ? `<span class="badge-icon">${icon}</span>` : ''}
      ${text}
    `;
    
    badge.innerHTML = content;
    return badge;
  }

  static createSuccess(text, icon = '✅') {
    return this.create(text, 'success', icon);
  }

  static createError(text, icon = '❌') {
    return this.create(text, 'error', icon);
  }

  static createWarning(text, icon = '⚠️') {
    return this.create(text, 'warning', icon);
  }

  static createInfo(text, icon = 'ℹ️') {
    return this.create(text, 'primary', icon);
  }
}

/**
 * 🎯 Loading Spinner Component
 */
class UISpinner {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.options = {
      size: 'md',
      type: 'primary',
      text: '',
      ...options
    };
    
    this.isVisible = false;
  }

  show() {
    if (!this.container || this.isVisible) return;

    const sizeMap = {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem'
    };

    const spinnerHTML = `
      <div class="spinner-overlay animate-fade-in" style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        z-index: 10;
      ">
        <div class="spinner" style="
          width: ${sizeMap[this.options.size]};
          height: ${sizeMap[this.options.size]};
          border: 2px solid var(--gray-200);
          border-top: 2px solid var(--${this.options.type}-600);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        ${this.options.text ? `
          <div class="spinner-text text-sm text-secondary">${this.options.text}</div>
        ` : ''}
      </div>
    `;

    // Agregar keyframes si no existen
    if (!document.getElementById('spinner-styles')) {
      const style = document.createElement('style');
      style.id = 'spinner-styles';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    this.container.style.position = 'relative';
    this.container.insertAdjacentHTML('beforeend', spinnerHTML);
    this.isVisible = true;
  }

  hide() {
    if (!this.container || !this.isVisible) return;

    const overlay = this.container.querySelector('.spinner-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 250);
    }
    
    this.isVisible = false;
  }
}

/**
 * 🎨 Theme Manager
 */
class UIThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.applyTheme();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    if (this.currentTheme === 'dark') {
      document.documentElement.style.setProperty('--bg-primary', '#1f2937');
      document.documentElement.style.setProperty('--bg-secondary', '#374151');
      document.documentElement.style.setProperty('--text-primary', '#f9fafb');
      document.documentElement.style.setProperty('--text-secondary', '#d1d5db');
    } else {
      document.documentElement.style.setProperty('--bg-primary', '#f9fafb');
      document.documentElement.style.setProperty('--bg-secondary', '#ffffff');
      document.documentElement.style.setProperty('--text-primary', '#111827');
      document.documentElement.style.setProperty('--text-secondary', '#6b7280');
    }
  }

  toggle() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme();
    return this.currentTheme;
  }

  setTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme();
  }
}

/**
 * 🎭 Animation Utilities
 */
class UIAnimations {
  static fadeIn(element, duration = 250) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';
    element.style.transition = `all ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  static slideIn(element, direction = 'left', duration = 250) {
    const transforms = {
      left: 'translateX(-20px)',
      right: 'translateX(20px)',
      up: 'translateY(-20px)',
      down: 'translateY(20px)'
    };

    element.style.opacity = '0';
    element.style.transform = transforms[direction];
    element.style.transition = `all ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translate(0)';
    });
  }

  static pulse(element, duration = 1000) {
    element.style.animation = `pulse ${duration}ms ease-in-out`;
    
    setTimeout(() => {
      element.style.animation = '';
    }, duration);
  }

  static bounce(element) {
    element.style.animation = 'bounce 1s ease-in-out';
    
    setTimeout(() => {
      element.style.animation = '';
    }, 1000);
  }
}

/**
 * 🎪 Modal Component
 */
class UIModal {
  constructor(options = {}) {
    this.options = {
      title: '',
      content: '',
      size: 'md',
      closable: true,
      backdrop: true,
      ...options
    };
    
    this.isOpen = false;
    this.modal = null;
  }

  show() {
    if (this.isOpen) return;

    const sizeClasses = {
      sm: 'max-width: 400px;',
      md: 'max-width: 600px;',
      lg: 'max-width: 800px;',
      xl: 'max-width: 1000px;'
    };

    const modalHTML = `
      <div class="modal-overlay animate-fade-in" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1rem;
      ">
        <div class="modal-content card" style="
          ${sizeClasses[this.options.size]}
          width: 100%;
          margin: 0;
          animation: fadeIn 250ms ease-out;
        ">
          ${this.options.title ? `
            <div class="card-header flex justify-between items-center">
              <h3 class="card-title">${this.options.title}</h3>
              ${this.options.closable ? `
                <button class="btn btn-secondary btn-sm modal-close" style="
                  padding: 0.25rem 0.5rem;
                  min-height: auto;
                ">✕</button>
              ` : ''}
            </div>
          ` : ''}
          
          <div class="card-body">
            ${this.options.content}
          </div>
        </div>
      </div>
    `;

    this.modal = document.createElement('div');
    this.modal.innerHTML = modalHTML;
    document.body.appendChild(this.modal);

    // Event listeners
    if (this.options.closable) {
      const closeBtn = this.modal.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.hide());
      }
    }

    if (this.options.backdrop) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal.querySelector('.modal-overlay')) {
          this.hide();
        }
      });
    }

    this.isOpen = true;
  }

  hide() {
    if (!this.isOpen || !this.modal) return;

    const overlay = this.modal.querySelector('.modal-overlay');
    overlay.style.opacity = '0';
    
    setTimeout(() => {
      if (this.modal && this.modal.parentNode) {
        this.modal.parentNode.removeChild(this.modal);
      }
      this.modal = null;
      this.isOpen = false;
    }, 250);
  }

  update(options) {
    this.options = { ...this.options, ...options };
    if (this.isOpen) {
      this.hide();
      setTimeout(() => this.show(), 300);
    }
  }
}

// Instancia global del toast
window.UIToast = new UIToast();
window.UIThemeManager = new UIThemeManager();

// Exportar componentes
window.UICard = UICard;
window.UIProgressBar = UIProgressBar;
window.UIBadge = UIBadge;
window.UISpinner = UISpinner;
window.UIAnimations = UIAnimations;
window.UIModal = UIModal;