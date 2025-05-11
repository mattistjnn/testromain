/**
 * Configuration Jest pour le projet
 */

module.exports = {
    // Environnement de test
    testEnvironment: 'jsdom',

    // Patterns pour trouver les fichiers de test
    testMatch: [
        '**/tests/**/*.test.js',
        '**/__tests__/**/*.js'
    ],

    // Fichiers à ignorer
    testPathIgnorePatterns: [
        '/node_modules/'
    ],

    // Coverage des tests
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'js/**/*.js'
    ],

    // Répertoires où rechercher les modules pour les imports
    moduleDirectories: [
        'node_modules',
        'js'
    ],

    // Transformer les fichiers pour Jest
    transform: {
        '^.+\\.js$': 'babel-jest'
    },

    // Configuration pour les mocks
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

    // Verbosité des tests
    verbose: true
};