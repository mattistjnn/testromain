
const cryptoConverter = {
    units: {
        BTC: { name: "Bitcoin", symbol: "₿" },
        ETH: { name: "Ethereum", symbol: "Ξ" },
        SOL: { name: "Solana", symbol: "◎" },
        ADA: { name: "Cardano", symbol: "₳" },
        USDT: { name: "Tether", symbol: "₮" },
        XRP: { name: "Ripple", symbol: "XRP" }
    },

    ratesCache: {
        timestamp: null,
        rates: null,
        expirationTime: 600000
    },

    async fetchExchangeRates() {
        const now = Date.now();
        if (this.ratesCache.rates && this.ratesCache.timestamp &&
            (now - this.ratesCache.timestamp < this.ratesCache.expirationTime)) {
            return this.ratesCache.rates;
        }

        try {
            const apiUrl = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json';
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }

            const data = await response.json();
            const cryptoRates = {};

            for (const crypto of Object.keys(this.units)) {
                const lowerCrypto = crypto.toLowerCase();
                if (data.usd && data.usd[lowerCrypto]) {
                    cryptoRates[lowerCrypto] = data.usd[lowerCrypto];
                } else {
                    console.warn(`Taux pour ${crypto} non trouvé, utilisation d'un taux fictif`);
                    const demoRates = {
                        btc: 0.000033,
                        eth: 0.00045,
                        sol: 0.012,
                        ada: 0.32,
                        usdt: 1,
                        xrp: 1.7
                    };
                    cryptoRates[lowerCrypto] = demoRates[lowerCrypto] || 1;
                }
            }

            this.ratesCache.rates = cryptoRates;
            this.ratesCache.timestamp = now;

            return cryptoRates;
        } catch (error) {
            console.error("Erreur lors de la récupération des taux de crypto-monnaies:", error);

            const demoRates = {
                btc: 0.000033,
                eth: 0.00045,
                sol: 0.012,
                ada: 0.32,
                usdt: 1,
                xrp: 1.7
            };

            this.ratesCache.rates = demoRates;
            this.ratesCache.timestamp = now;

            return demoRates;
        }
    },

    async convert(value, fromCrypto, toCrypto) {
        if (!this.units[fromCrypto] || !this.units[toCrypto]) {
            throw new Error("Crypto-monnaie non valide");
        }

        try {
            const rates = await this.fetchExchangeRates();
            const valueInUSD = value / rates[fromCrypto.toLowerCase()];
            const result = valueInUSD * rates[toCrypto.toLowerCase()];
            return Number(result.toFixed(8));
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
    module.exports = cryptoConverter;
}