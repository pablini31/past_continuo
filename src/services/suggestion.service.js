// src/services/suggestion.service.js

/**
 * ═══════════════════════════════════════════════════
 * 💡 SUGGESTION SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Maneja la lógica de sugerencias para completar oraciones
 */

const { mockSuggestions } = require('../utils/mockData');
const { CONNECTORS } = require('../config/constants');

class SuggestionService {
  
  /**
   * Obtiene sugerencias por conector
   * @param {string} connector - 'while', 'when', 'as'
   * @returns {Array} Array de sugerencias
   */
  getSuggestionsByConnector(connector) {
    // Validar que el conector sea válido
    if (!CONNECTORS.includes(connector.toLowerCase())) {
      throw new Error(`Invalid connector. Must be one of: ${CONNECTORS.join(', ')}`);
    }

    const suggestions = mockSuggestions[connector.toLowerCase()] || [];
    
    return suggestions;
  }

  /**
   * Obtiene sugerencias aleatorias para cualquier conector
   * @param {number} limit - Número de sugerencias a retornar
   * @returns {Object} Objeto con sugerencias por conector
   */
  getRandomSuggestions(limit = 3) {
    const result = {};

    CONNECTORS.forEach(connector => {
      const suggestions = mockSuggestions[connector] || [];
      
      // Mezclar array y tomar 'limit' elementos
      const shuffled = this.shuffleArray([...suggestions]);
      result[connector] = shuffled.slice(0, limit);
    });

    return result;
  }

  /**
   * Obtiene UNA sugerencia aleatoria de un conector específico
   * @param {string} connector - 'while', 'when', 'as'
   * @returns {string} Una sugerencia aleatoria
   */
  getOneSuggestion(connector) {
    const suggestions = this.getSuggestionsByConnector(connector);
    
    if (suggestions.length === 0) {
      throw new Error(`No suggestions found for connector: ${connector}`);
    }

    const randomIndex = Math.floor(Math.random() * suggestions.length);
    return suggestions[randomIndex];
  }

  /**
   * Obtiene todas las sugerencias de todos los conectores
   * @returns {Object} Objeto con todas las sugerencias
   */
  getAllSuggestions() {
    return mockSuggestions;
  }

  /**
   * Busca sugerencias que contengan una palabra específica
   * @param {string} keyword - Palabra a buscar
   * @returns {Array} Sugerencias que contienen la palabra
   */
  searchSuggestions(keyword) {
    const results = [];
    const lowerKeyword = keyword.toLowerCase();

    CONNECTORS.forEach(connector => {
      const suggestions = mockSuggestions[connector] || [];
      
      suggestions.forEach(suggestion => {
        if (suggestion.toLowerCase().includes(lowerKeyword)) {
          results.push({
            connector,
            suggestion
          });
        }
      });
    });

    return results;
  }

  /**
   * Mezcla un array (Fisher-Yates shuffle)
   * @param {Array} array - Array a mezclar
   * @returns {Array} Array mezclado
   */
  shuffleArray(array) {
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }
}

// Exportar una instancia (Singleton pattern)
module.exports = new SuggestionService();