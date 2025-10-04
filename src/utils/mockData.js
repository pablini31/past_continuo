// src/utils/mockData.js

/**
 * 🎭 Datos de prueba (Mock Data)
 * Usaremos estos datos ANTES de conectar las bases de datos
 */

// 👥 Usuarios simulados
const mockUsers = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz', // bcrypt hash simulado
    createdAt: new Date('2025-09-01'),
    totalPoints: 450,
    level: 'intermediate',
    streak: 7
  },
  {
    id: 2,
    username: 'jane_smith',
    email: 'jane@example.com',
    passwordHash: '$2b$10$zyxwvutsrqponmlkjihgfedcba',
    createdAt: new Date('2025-09-15'),
    totalPoints: 180,
    level: 'beginner',
    streak: 3
  }
];

// 💡 Sugerencias predefinidas
const mockSuggestions = {
  while: [
    'my brother was playing videogames',
    'it was raining outside',
    'the teacher was explaining the lesson',
    'my mom was cooking dinner',
    'the sun was setting',
    'everyone was sleeping',
    'the music was playing loudly',
    'I was thinking about you'
  ],
  when: [
    'the phone rang',
    'she arrived home',
    'the accident happened',
    'I saw him',
    'the lights went out',
    'the bell rang',
    'he called me',
    'the movie started'
  ],
  as: [
    'the sun was rising',
    'we were leaving',
    'time was passing',
    'she was singing',
    'they were arriving',
    'the day was ending',
    'winter was approaching',
    'the story was unfolding'
  ]
};

// 📝 Oraciones de ejemplo completadas
const mockSentences = [
  {
    id: 1,
    userId: 1,
    part1: 'I was studying',
    connector: 'while',
    part2: 'my brother was playing videogames',
    isCorrect: true,
    points: 10,
    createdAt: new Date('2025-10-01T10:30:00Z')
  },
  {
    id: 2,
    userId: 1,
    part1: 'She was cooking',
    connector: 'when',
    part2: 'the phone rang',
    isCorrect: true,
    points: 10,
    createdAt: new Date('2025-10-02T14:20:00Z')
  },
  {
    id: 3,
    userId: 2,
    part1: 'They were walking',
    connector: 'as',
    part2: 'the sun was setting',
    isCorrect: true,
    points: 10,
    createdAt: new Date('2025-10-03T09:15:00Z')
  }
];

// 🎯 Progreso del usuario
const mockProgress = {
  1: {
    userId: 1,
    totalSentences: 45,
    correctSentences: 42,
    accuracy: 93.3,
    totalPoints: 450,
    level: 'intermediate',
    streak: 7,
    lastPracticeDate: new Date('2025-10-03'),
    badges: ['first_sentence', 'week_streak', 'perfect_10']
  },
  2: {
    userId: 2,
    totalSentences: 18,
    correctSentences: 16,
    accuracy: 88.9,
    totalPoints: 180,
    level: 'beginner',
    streak: 3,
    lastPracticeDate: new Date('2025-10-03'),
    badges: ['first_sentence']
  }
};

module.exports = {
  mockUsers,
  mockSuggestions,
  mockSentences,
  mockProgress
};