const currencyConverter = {
    units: {
        EUR: { name: "Euro", symbol: "€" },
        USD: { name: "Dollar américain", symbol: "$" },
        GBP: { name: "Livre Sterling", symbol: "£" },
        JPY: { name: "Yen japonais", symbol: "¥" },
        CHF: { name: "Franc suisse", symbol: "CHF" },
        CAD: { name: "Dollar canadien", symbol: "C$" },
        AUD: { name: "Dollar australien", symbol: "A$" }
    },

    ratesCache: {
        timestamp: null,
        rates: null,
        expirationTime: 3600000
    },

    async fetchExchangeRates() {
        const now = Date.now();

        if (this.ratesCache.rates && this.ratesCache.timestamp &&
            (now - this.ratesCache.timestamp < this.ratesCache.expirationTime)) {
            return this.ratesCache.rates;
        }

        try {
            const apiUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json';
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }

            const data = await response.json();

            this.ratesCache.rates = data.eur;
            this.ratesCache.timestamp = now;

            return data.eur;
        } catch (error) {
            console.error("Erreur lors de la récupération des taux de change:", error);
            throw error;
        }
    },

    async convert(value, fromCurrency, toCurrency) {
        if (!this.units[fromCurrency] || !this.units[toCurrency]) {
            throw new Error("Monnaie non valide");
        }

        if (fromCurrency === toCurrency) {
            return value;
        }

        try {
            const rates = await this.fetchExchangeRates();

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

    getUnitOptions() {
        return Object.entries(this.units).map(([key, value]) => ({
            id: key,
            name: `${value.name} (${value.symbol})`
        }));
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = currencyConverter;
}