/**
 * Configuration Playwright pour les tests E2E
 * @see https://playwright.dev/docs/test-configuration
 */

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    testDir: './tests/e2e',

    // Temps maximum par test
    timeout: 30 * 1000,

    // Nombre de retries en cas d'échec
    retries: 2,

    // Navigateurs à utiliser pour les tests
    projects: [
        {
            name: 'chromium',
            use: {
                // Configuration de Chromium
                browserName: 'chromium',
                viewport: { width: 1280, height: 720 },
                ignoreHTTPSErrors: true,
                // Pour déboguer, décommenter la ligne suivante
                // headless: false,

                // Captures d'écran et vidéos
                screenshot: 'only-on-failure',
                trace: 'retain-on-failure',
            },
        },
        // Ajoutez d'autres navigateurs si nécessaire
        // {
        //   name: 'firefox',
        //   use: { browserName: 'firefox' },
        // },
        // {
        //   name: 'webkit',
        //   use: { browserName: 'webkit' },
        // },
    ],

    // Configuration du serveur de développement
    webServer: {
        command: 'npm run start',
        port: 3000,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
    },

    // Reporter pour les résultats des tests
    reporter: [
        ['html', { open: 'never' }],
        ['list']
    ],

    // Options globales
    use: {
        // Navigation sans timeout
        actionTimeout: 0,

        // Traces pour le débogage
        trace: 'on-first-retry',
    },
};

module.exports = config;