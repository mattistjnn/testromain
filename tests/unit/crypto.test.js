const cryptoConverter = require('./../../js/converters/crypto');

global.fetch = jest.fn();

describe('Module de conversion de crypto-monnaies', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        cryptoConverter.ratesCache = {
            timestamp: null,
            rates: null,
            expirationTime: 600000 // 10 minutes
        };
    });

    test('Doit avoir toutes les unités requises', () => {
        const units = Object.keys(cryptoConverter.units);
        expect(units).toContain('BTC');
        expect(units).toContain('ETH');
        expect(units).toContain('SOL');
        expect(units).toContain('ADA');
        expect(units).toContain('USDT');
        expect(units).toContain('XRP');
    });

    test('Doit exposer les méthodes requises', () => {
        expect(typeof cryptoConverter.convert).toBe('function');
        expect(typeof cryptoConverter.getUnitOptions).toBe('function');
        expect(typeof cryptoConverter.fetchExchangeRates).toBe('function');
    });

    test('fetchExchangeRates doit récupérer les taux de change depuis l\'API', async () => {
        const mockResponse = {
            usd: {
                btc: 0.000033,
                eth: 0.00045,
                sol: 0.012,
                ada: 0.32,
                usdt: 1,
                xrp: 1.7
            }
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        });

        const rates = await cryptoConverter.fetchExchangeRates();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('currency-api'));

        expect(rates).toHaveProperty('btc');
        expect(rates).toHaveProperty('eth');
        expect(rates.btc).toBe(0.000033);
        expect(rates.eth).toBe(0.00045);

        expect(cryptoConverter.ratesCache.rates).toEqual(rates);
        expect(cryptoConverter.ratesCache.timestamp).toBeTruthy();
    });

    test('fetchExchangeRates doit utiliser le cache si disponible et non expiré', async () => {
        const mockRates = {
            btc: 0.000033,
            eth: 0.00045
        };
        cryptoConverter.ratesCache.rates = mockRates;
        cryptoConverter.ratesCache.timestamp = Date.now();

        const rates = await cryptoConverter.fetchExchangeRates();

        expect(fetch).not.toHaveBeenCalled();
        expect(rates).toEqual(mockRates);
    });

    test('fetchExchangeRates doit gérer les erreurs API et fournir des taux de démo', async () => {
        global.fetch.mockRejectedValueOnce(new Error('API error'));

        const rates = await cryptoConverter.fetchExchangeRates();

        expect(rates).toHaveProperty('btc');
        expect(rates).toHaveProperty('eth');
        expect(rates.btc).toBeTruthy();
        expect(rates.eth).toBeTruthy();

        expect(cryptoConverter.ratesCache.rates).toEqual(rates);
        expect(cryptoConverter.ratesCache.timestamp).toBeTruthy();
    });

    test('convert doit convertir correctement entre différentes crypto-monnaies', async () => {
        const mockRates = {
            btc: 0.000033,
            eth: 0.00045,
            sol: 0.012,
            usdt: 1,
            ada: 0.32,
            xrp: 1.7
        };

        jest.spyOn(cryptoConverter, 'fetchExchangeRates').mockResolvedValue(mockRates);

        let result = await cryptoConverter.convert(1, 'BTC', 'ETH');
        expect(result).toBeCloseTo(13.6364, 4);

        result = await cryptoConverter.convert(13.6364, 'ETH', 'BTC');
        expect(result).toBeCloseTo(1, 5);

        result = await cryptoConverter.convert(10, 'SOL', 'USDT');
        expect(result).toBeCloseTo(833.3333, 3);

        result = await cryptoConverter.convert(100, 'USDT', 'ADA');
        expect(result).toBeCloseTo(32, 0);
    });

    test('convert doit lever une erreur pour des crypto-monnaies non valides', async () => {
        await expect(cryptoConverter.convert(1, 'INVALID', 'BTC')).rejects.toThrow();
        await expect(cryptoConverter.convert(1, 'BTC', 'INVALID')).rejects.toThrow();
    });

    test('getUnitOptions doit renvoyer la liste des crypto-monnaies au format attendu', () => {
        const options = cryptoConverter.getUnitOptions();
        expect(Array.isArray(options)).toBe(true);

        options.forEach(option => {
            expect(option).toHaveProperty('id');
            expect(option).toHaveProperty('name');
            expect(typeof option.id).toBe('string');
            expect(typeof option.name).toBe('string');
        });

        const cryptoIds = options.map(option => option.id);
        expect(cryptoIds).toContain('BTC');
        expect(cryptoIds).toContain('ETH');
        expect(cryptoIds).toContain('SOL');
    });
});