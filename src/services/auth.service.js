// src/services/auth.service.js

/**
 * ═══════════════════════════════════════════════════
 * 🔐 AUTHENTICATION SERVICE
 * ═══════════════════════════════════════════════════
 * 
 * Maneja toda la lógica de autenticación:
 * - Registro de usuarios
 * - Login
 * - Validación de tokens
 * - Hash de passwords
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mockUsers } = require('../utils/mockData');
const { VALIDATION } = require('../config/constants');

/**
 * 📝 REGISTRAR NUEVO USUARIO
 * 
 * @param {Object} userData - {username, email, password}
 * @returns {Object} Usuario creado (sin password)
 */
const register = async (userData) => {
  const { username, email, password } = userData;

  // 1. Validar que no exista el usuario
  const existingUser = mockUsers.find(
    u => u.email === email || u.username === username
  );

  if (existingUser) {
    const field = existingUser.email === email ? 'Email' : 'Username';
    throw {
      statusCode: 409,
      message: `${field} already exists`
    };
  }

  // 2. Hash del password
  const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
  const passwordHash = await bcrypt.hash(password, bcryptRounds);

  // 3. Crear nuevo usuario (simulado)
  const newUser = {
    id: mockUsers.length + 1,
    username,
    email,
    passwordHash,
    createdAt: new Date(),
    totalPoints: 0,
    level: 'beginner',
    streak: 0
  };

  // 4. Guardar en "base de datos" (mock)
  mockUsers.push(newUser);

  // 5. Retornar usuario sin password
  const { passwordHash: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

/**
 * 🔑 LOGIN DE USUARIO
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} {user, token}
 */
const login = async (email, password) => {
  // 1. Buscar usuario por email
  const user = mockUsers.find(u => u.email === email);

  if (!user) {
    throw {
      statusCode: 401,
      message: 'Invalid credentials'
    };
  }

  // 2. Verificar password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw {
      statusCode: 401,
      message: 'Invalid credentials'
    };
  }

  // 3. Generar JWT token
  const token = generateToken(user.id);

  // 4. Retornar usuario sin password y token
  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token
  };
};

/**
 * 🎫 GENERAR JWT TOKEN
 * 
 * @param {number} userId 
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000) // Issued at
  };
  // Ensure JWT secret is configured
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Throw a descriptive error so the server startup or request shows a clear message
    throw {
      statusCode: 500,
      message: 'JWT_SECRET is not configured. Please set JWT_SECRET in your .env file or environment variables.'
    };
  }

  const token = jwt.sign(
    payload,
    secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );

  return token;
};

/**
 * ✅ VERIFICAR JWT TOKEN
 * 
 * @param {string} token 
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw {
        statusCode: 401,
        message: 'Token expired'
      };
    }
    throw {
      statusCode: 401,
      message: 'Invalid token'
    };
  }
};

/**
 * 👤 OBTENER USUARIO POR ID
 * 
 * @param {number} userId 
 * @returns {Object} Usuario sin password
 */
const getUserById = async (userId) => {
  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    throw {
      statusCode: 404,
      message: 'User not found'
    };
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * 🔄 REFRESCAR TOKEN
 * 
 * @param {string} oldToken 
 * @returns {string} Nuevo token
 */
const refreshToken = (oldToken) => {
  const decoded = verifyToken(oldToken);
  return generateToken(decoded.userId);
};

module.exports = {
  register,
  login,
  generateToken,
  verifyToken,
  getUserById,
  refreshToken
};