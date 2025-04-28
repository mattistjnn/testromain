/**
 * Module de conversion de monnaies
 * Utilise l'API https://github.com/fawazahmed0/exchange-api
 */
const currencyConverter = {
    // Définition des unités disponibles
    units: {
        EUR: { name: "Euro", symbol: "€" },
        USD: { name: "Dollar américain", symbol: "$" },
        GBP: { name: "Livre Sterling", symbol: "£" },
        JPY: { name: "Yen japonais", symbol: "¥" },
        CHF: { name: "Franc suisse", symbol: "CHF" },
        CAD: { name: "Dollar canadien", symbol: "C$" },
        AUD: { name: "Dollar australien", symbol: "A$" }
    },

    // Cache des taux de change pour éviter les appels API répétés
    ratesCache: {
        timestamp: null,
        rates: null,
        expirationTime: 3600000 // 1 heure en millisecondes
    },

    /**
     * Obtient les taux de change actuels depuis l'API
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
            // URL correcte de l'API - utilise la dernière version disponible
            const apiUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json';
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }

            const data = await response.json();

            // Mettre à jour le cache
            this.ratesCache.rates = data.eur;
            this.ratesCache.timestamp = now;

            return data.eur;
        } catch (error) {
            console.error("Erreur lors de la récupération des taux de change:", error);
            throw error;
        }
    },

    /**
     * Convertit une valeur d'une monnaie à une autre
     * @param {number} value - Valeur à convertir
     * @param {string} fromCurrency - Monnaie source
     * @param {string} toCurrency - Monnaie cible
     * @returns {Promise<number>} - Promesse résolue avec la valeur convertie
     */
    async convert(value, fromCurrency, toCurrency) {
        // Vérification de la validité des unités
        if (!this.units[fromCurrency] || !this.units[toCurrency]) {
            throw new Error("Monnaie non valide");
        }

        // Si les monnaies sont identiques, retourner la valeur telle quelle
        if (fromCurrency === toCurrency) {
            return value;
        }

        try {
            const rates = await this.fetchExchangeRates();

            // Les taux sont basés sur l'EUR, donc nous devons calculer en conséquence
            let valueInEUR;

            if (fromCurrency === 'EUR') {
                valueInEUR = value;
            } else {
                valueInEUR = value / rates[fromCurrency.toLowerCase()];
            }

            let result;
            if (toCurrency === 'EUR') {
                result = valueInEUR;
            } else {
                result = valueInEUR * rates[toCurrency.toLowerCase()];
            }

            return Number(result.toFixed(4));
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
    module.exports = currencyConverter;
}