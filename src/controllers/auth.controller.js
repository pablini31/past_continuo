// src/controllers/auth.controller.js

/**
 * ═══════════════════════════════════════════════════
 * 🔐 AUTH CONTROLLER
 * ═══════════════════════════════════════════════════
 * 
 * Maneja las peticiones HTTP de autenticación
 */

const authService = require('../services/auth.service');
const { success, error } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

/**
 * 📝 POST /api/auth/register
 * Registrar nuevo usuario
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validar campos requeridos
    if (!username || !email || !password) {
      return error(res, 'Username, email and password are required', HTTP_STATUS.BAD_REQUEST);
    }

    // Llamar al service
    const user = await authService.register({ username, email, password });

    // Generar token
    const token = authService.generateToken(user.id);

    // Guardar token en cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    return success(res, { user, token }, 'User registered successfully', HTTP_STATUS.CREATED);

  } catch (err) {
    next(err);
  }
};

/**
 * 🔑 POST /api/auth/login
 * Iniciar sesión
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return error(res, 'Email and password are required', HTTP_STATUS.BAD_REQUEST);
    }

    // Llamar al service
    const result = await authService.login(email, password);

    // Guardar token en cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return success(res, result, 'Login successful');

  } catch (err) {
    next(err);
  }
};

/**
 * 🚪 POST /api/auth/logout
 * Cerrar sesión
 */
const logout = async (req, res, next) => {
  try {
    // Limpiar cookie
    res.clearCookie('token');

    return success(res, null, 'Logout successful');

  } catch (err) {
    next(err);
  }
};

/**
 * 👤 GET /api/auth/me
 * Obtener usuario actual (requiere autenticación)
 */
const getMe = async (req, res, next) => {
  try {
    // El userId viene del middleware de autenticación
    const userId = req.userId;

    const user = await authService.getUserById(userId);

    return success(res, { user }, 'User retrieved successfully');

  } catch (err) {
    next(err);
  }
};

/**
 * 🔄 POST /api/auth/refresh
 * Refrescar token
 */
const refreshToken = async (req, res, next) => {
  try {
    const oldToken = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!oldToken) {
      return error(res, 'No token provided', HTTP_STATUS.UNAUTHORIZED);
    }

    const newToken = authService.refreshToken(oldToken);

    // Guardar nuevo token en cookie
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return success(res, { token: newToken }, 'Token refreshed successfully');

  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  refreshToken
};