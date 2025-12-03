module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'src/api/controllers/**/*.js',
    'src/utils/**/*.js',
    '!src/config/**',
    '!src/scripts/**',
    '!src/api/controllers/mockController.js'
  ],
};