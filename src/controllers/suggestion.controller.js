// src/controllers/suggestion.controller.js

/**
 * ═══════════════════════════════════════════════════
 * 💡 SUGGESTION CONTROLLER
 * ═══════════════════════════════════════════════════
 * 
 * Maneja las peticiones HTTP de sugerencias
 */

const suggestionService = require('../services/suggestion.service');
const { success, error } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

/**
 * 📚 GET /api/suggestions/:connector
 * Obtener sugerencias por conector
 */
const getSuggestions = async (req, res, next) => {
  try {
    const { connector } = req.params;

    const suggestions = suggestionService.getSuggestionsByConnector(connector);

    return success(res, { connector, suggestions, total: suggestions.length }, 'Suggestions retrieved successfully');

  } catch (err) {
    next(err);
  }
};

/**
 * 🎲 GET /api/suggestions/:connector/random
 * Obtener sugerencias aleatorias
 */
const getRandomSuggestions = async (req, res, next) => {
  try {
    const { connector } = req.params;
    const count = parseInt(req.query.count) || 3;

    const suggestions = suggestionService.getRandomSuggestions(connector, count);

    return success(res, { connector, suggestions }, 'Random suggestions retrieved successfully');

  } catch (err) {
    next(err);
  }
};

/**
 * 🌟 GET /api/suggestions
 * Obtener todas las sugerencias
 */
const getAllSuggestions = async (req, res, next) => {
  try {
    const suggestions = suggestionService.getAllSuggestions();

    return success(res, suggestions, 'All suggestions retrieved successfully');

  } catch (err) {
    next(err);
  }
};

/**
 * 🔍 GET /api/suggestions/search
 * Buscar sugerencias
 */
const searchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return error(res, 'Search query is required', HTTP_STATUS.BAD_REQUEST);
    }

    const results = suggestionService.searchSuggestions(q);

    return success(res, { query: q, results }, 'Search completed successfully');

  } catch (err) {
    next(err);
  }
};

/**
 * ➕ POST /api/suggestions (Admin only - lo implementaremos después)
 * Agregar nueva sugerencia
 */
const addSuggestion = async (req, res, next) => {
  try {
    const { connector, text } = req.body;

    if (!connector || !text) {
      return error(res, 'Connector and text are required', HTTP_STATUS.BAD_REQUEST);
    }

    const suggestion = suggestionService.addSuggestion(connector, text);

    return success(res, { suggestion }, 'Suggestion added successfully', HTTP_STATUS.CREATED);

  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSuggestions,
  getRandomSuggestions,
  getAllSuggestions,
  searchSuggestions,
  addSuggestion
};