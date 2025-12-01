// Oncomap/backend/jest.config.js
module.exports = {
  testEnvironment: 'node',
  // Pasta onde o Jest vai procurar os testes
  roots: ['<rootDir>/src'],
  // Padrão de nome dos arquivos de teste (ex: arquivo.test.js)
  testMatch: ['**/*.test.js'],
  // Para cobertura de código (Code Coverage)
  collectCoverageFrom: [
    'src/api/controllers/**/*.js',
    'src/utils/**/*.js',
    // Ignoramos config e scripts soltos por enquanto
    '!src/config/**',
    '!src/scripts/**',
    '!src/api/controllers/mockController.js'
  ],
};