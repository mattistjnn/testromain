/**
 * Module de conversion de crypto-monnaies
 * Utilise l'API https://github.com/fawazahmed0/exchange-api
 */
const cryptoConverter = {
    // Définition des unités disponibles - utilisons les codes plus généralement reconnus par les API
    units: {
        BTC: { name: "Bitcoin", symbol: "₿" },
        ETH: { name: "Ethereum", symbol: "Ξ" },
        SOL: { name: "Solana", symbol: "◎" },
        ADA: { name: "Cardano", symbol: "₳" },
        USDT: { name: "Tether", symbol: "₮" },
        XRP: { name: "Ripple", symbol: "XRP" }
    },

    // Cache des taux de change pour éviter les appels API répétés
    ratesCache: {
        timestamp: null,
        rates: null,
        expirationTime: 600000 // 10 minutes en millisecondes (les crypto varient plus rapidement)
    },

    /**
     * Obtient les taux de change actuels depuis l'API en utilisant USD comme base
     * @returns {Promise<Object>} - Promesse résolue avec les taux de change
     */
    async fetchExchangeRates() {
        const now = Date.now();
        // Vérifier si le cache est valide
        if (this.ratesCache.rates && this.ratesCache.timestamp &&
            (now - this.ratesCache.timestamp < this.ratesCache.expirationTime)) {
            return this.ratesCache.rates;
        }

        try {
            // Utilisons USD comme base au lieu de BTC pour plus de fiabilité
            const apiUrl = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json';
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }

            const data = await response.json();

            // L'API peut ne pas renvoyer directement les codes de crypto comme vous les avez définis
            // Nous allons vérifier si elle contient les codes que nous utilisons
            const cryptoRates = {};

            // Pour chaque crypto que nous voulons supporter
            for (const crypto of Object.keys(this.units)) {
                const lowerCrypto = crypto.toLowerCase();
                // Vérifions si le taux existe dans l'API
                if (data.usd && data.usd[lowerCrypto]) {
                    cryptoRates[lowerCrypto] = data.usd[lowerCrypto];
                } else {
                    // Taux fictif pour démo si l'API ne fournit pas le taux
                    console.warn(`Taux pour ${crypto} non trouvé, utilisation d'un taux fictif`);
                    // Des valeurs approximatives pour la démo
                    const demoRates = {
                        btc: 0.000033,    // ~30,000 USD pour 1 BTC
                        eth: 0.00045,     // ~2,222 USD pour 1 ETH
                        sol: 0.012,       // ~83 USD pour 1 SOL
                        ada: 0.32,        // ~3.13 USD pour 1 ADA
                        usdt: 1,          // ~1 USD pour 1 USDT
                        xrp: 1.7          // ~0.59 USD pour 1 XRP
                    };
                    cryptoRates[lowerCrypto] = demoRates[lowerCrypto] || 1;
                }
            }

            // Mettre à jour le cache
            this.ratesCache.rates = cryptoRates;
            this.ratesCache.timestamp = now;

            return cryptoRates;
        } catch (error) {
            console.error("Erreur lors de la récupération des taux de crypto-monnaies:", error);

            // En cas d'erreur, utiliser des taux de démo
            const demoRates = {
                btc: 0.000033,
                eth: 0.00045,
                sol: 0.012,
                ada: 0.32,
                usdt: 1,
                xrp: 1.7
            };

            // Mettre à jour le cache avec les taux de démo
            this.ratesCache.rates = demoRates;
            this.ratesCache.timestamp = now;

            return demoRates;
        }
    },

    /**
     * Convertit une valeur d'une crypto-monnaie à une autre
     * @param {number} value - Valeur à convertir
     * @param {string} fromCrypto - Crypto-monnaie source
     * @param {string} toCrypto - Crypto-monnaie cible
     * @returns {Promise<number>} - Promesse résolue avec la valeur convertie
     */
    async convert(value, fromCrypto, toCrypto) {
        // Vérification de la validité des unités
        if (!this.units[fromCrypto] || !this.units[toCrypto]) {
            throw new Error("Crypto-monnaie non valide");
        }

        try {
            const rates = await this.fetchExchangeRates();

            // Les taux sont exprimés en USD par unité de crypto
            // Donc pour convertir, nous passons par USD comme intermédiaire

            // Calculer la valeur en USD
            const valueInUSD = value / rates[fromCrypto.toLowerCase()];

            // Convertir la valeur USD vers la crypto cible
            const result = valueInUSD * rates[toCrypto.toLowerCase()];

            // Arrondir à 8 décimales (standard pour la plupart des crypto)
            return Number(result.toFixed(8));
        } catch (error) {
            console.error("Erreur de conversion:", error);
            throw error;
        }
    },

    /**
     * Retourne la liste des unités disponibles pour l'interface utilisateur
     * @returns {Array} - Liste des unités avec leur nom et symbole
     */
    getUnitOptions() {
        return Object.entries(this.units).map(([key, value]) => ({
            id: key,
            name: `${value.name} (${value.symbol})`
        }));
    }
};

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cryptoConverter;
}