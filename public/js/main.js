// public/js/main.js

/**
 * ═══════════════════════════════════════════════════
 * � UNIFIED THEME SYSTEM - Final Implementation
 * ═══════════════════════════════════════════════════
 * 
 * Sistema de temas definitivo basado en data-theme
 * Compatible con todas las páginas del sitio
 */

const THEME_KEY = 'past-continuo-theme';

/**
 * Detecta la preferencia del sistema del usuario
 * @returns {string} 'dark' | 'light'
 */
function getSystemPreference() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * Obtiene el tema guardado o usa la preferencia del sistema
 * @returns {string} 'dark' | 'light'
 */
function getSavedTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved && (saved === 'dark' || saved === 'light')) {
    return saved;
  }
  return getSystemPreference();
}

/**
 * Aplica el tema a toda la página
 * @param {string} theme - 'dark' | 'light'
 */
function applyTheme(theme) {
  // Aplicar data-theme al documento
  document.documentElement.setAttribute('data-theme', theme);
  
  // Actualizar todos los botones de tema
  updateThemeButtons(theme);
  
  // Guardar en localStorage
  localStorage.setItem(THEME_KEY, theme);
  
  console.log(`Theme applied: ${theme}`);
}

/**
 * Actualiza los iconos de todos los botones de tema
 * @param {string} theme - 'dark' | 'light'
 */
function updateThemeButtons(theme) {
  const themeButtons = document.querySelectorAll('.theme-toggle');
  
  themeButtons.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      if (theme === 'light') {
        // En tema claro, mostrar luna (para cambiar a oscuro)
        icon.className = 'fas fa-moon';
        btn.title = 'Cambiar a modo oscuro';
        btn.setAttribute('aria-label', 'Cambiar a modo oscuro');
      } else {
        // En tema oscuro, mostrar sol (para cambiar a claro)
        icon.className = 'fas fa-sun';
        btn.title = 'Cambiar a modo claro';
        btn.setAttribute('aria-label', 'Cambiar a modo claro');
      }
    }
  });
}

/**
 * Alterna entre tema claro y oscuro
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  applyTheme(newTheme);
  
  console.log(`Theme toggled from ${currentTheme} to ${newTheme}`);
}

/**
 * Inicializa el sistema de temas
 */
function initThemeSystem() {
  // Aplicar tema inicial
  const initialTheme = getSavedTheme();
  applyTheme(initialTheme);
  
  // Configurar event listeners para todos los botones de tema
  const themeButtons = document.querySelectorAll('.theme-toggle');
  themeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleTheme();
    });
  });
  
  // Escuchar cambios en la preferencia del sistema
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Solo cambiar si no hay preferencia guardada del usuario
      if (!localStorage.getItem(THEME_KEY)) {
        const systemTheme = e.matches ? 'dark' : 'light';
        applyTheme(systemTheme);
      }
    });
  }
  
  console.log(`Theme system initialized with ${initialTheme} theme, ${themeButtons.length} buttons found`);
}

/**
 * Función para reset manual del tema (debugging)
 */
function resetTheme() {
  localStorage.removeItem(THEME_KEY);
  const systemTheme = getSystemPreference();
  applyTheme(systemTheme);
  console.log(`Theme reset to system preference: ${systemTheme}`);
}

// Inicializar el sistema cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeSystem);
} else {
  // DOM ya está listo
  initThemeSystem();
}

// Exponer funciones globalmente para debugging
window.themeSystem = {
  toggle: toggleTheme,
  apply: applyTheme,
  reset: resetTheme,
  current: () => document.documentElement.getAttribute('data-theme') || 'light'
};

/**
 * ═══════════════════════════════════════════════════
 * 🎨 UTILIDADES JAVASCRIPT GLOBALES
 * ═══════════════════════════════════════════════════
 */

// Función para hacer fetch con autenticación
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  return fetch(url, mergedOptions);
}

// Verificar si el usuario está autenticado
function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// Obtener usuario actual
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Formatear fecha
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Formatear fecha relativa
function formatRelativeTime(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}