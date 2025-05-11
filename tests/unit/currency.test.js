const currencyConverter = require('./../../js/converters/currency');

global.fetch = jest.fn();

describe('Module de conversion de monnaies', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        currencyConverter.ratesCache = {
            timestamp: null,
            rates: null,
            expirationTime: 3600000
        };
    });

    test('Doit avoir toutes les unités requises', () => {
        const units = Object.keys(currencyConverter.units);
        expect(units).toContain('EUR');
        expect(units).toContain('USD');
        expect(units).toContain('GBP');
        expect(units).toContain('JPY');
    });

    test('Doit exposer les méthodes requises', () => {
        expect(typeof currencyConverter.convert).toBe('function');
        expect(typeof currencyConverter.getUnitOptions).toBe('function');
        expect(typeof currencyConverter.fetchExchangeRates).toBe('function');
    });

    test('fetchExchangeRates doit récupérer les taux de change depuis l\'API', async () => {
        const mockRates = {
            eur: {
                usd: 1.1,
                gbp: 0.85,
                jpy: 130
            }
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockRates
        });

        const rates = await currencyConverter.fetchExchangeRates();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('currency-api'));
        expect(rates).toEqual(mockRates.eur);
        expect(currencyConverter.ratesCache.rates).toEqual(mockRates.eur);
        expect(currencyConverter.ratesCache.timestamp).toBeTruthy();
    });

    test('fetchExchangeRates doit utiliser le cache si disponible et non expiré', async () => {
        const mockRates = { usd: 1.1, gbp: 0.85 };
        currencyConverter.ratesCache.rates = mockRates;
        currencyConverter.ratesCache.timestamp = Date.now();

        const rates = await currencyConverter.fetchExchangeRates();

        expect(fetch).not.toHaveBeenCalled();
        expect(rates).toEqual(mockRates);
    });

    test('fetchExchangeRates doit gérer les erreurs API', async () => {
        global.fetch.mockRejectedValueOnce(new Error('API error'));

        await expect(currencyConverter.fetchExchangeRates()).rejects.toThrow();
    });

    test('convert doit convertir correctement entre différentes monnaies', async () => {
        const mockRates = {
            usd: 1.1,
            gbp: 0.85,
            jpy: 130
        };

        jest.spyOn(currencyConverter, 'fetchExchangeRates').mockResolvedValue(mockRates);

        let result = await currencyConverter.convert(100, 'EUR', 'USD');
        expect(result).toBeCloseTo(110, 1);

        result = await currencyConverter.convert(110, 'USD', 'EUR');
        expect(result).toBeCloseTo(100, 1);

        result = await currencyConverter.convert(100, 'EUR', 'GBP');
        expect(result).toBeCloseTo(85, 1);

        result = await currencyConverter.convert(10, 'GBP', 'JPY');
        expect(result).toBeCloseTo(1529.41, 2);
    });

    test('convert doit retourner la même valeur pour la même monnaie', async () => {
        const result = await currencyConverter.convert(100, 'EUR', 'EUR');
        expect(result).toBe(100);
        expect(currencyConverter.fetchExchangeRates).not.toHaveBeenCalled();
    });

    test('convert doit lever une erreur pour des monnaies non valides', async () => {
        await expect(currencyConverter.convert(100, 'INVALID', 'EUR')).rejects.toThrow();
        await expect(currencyConverter.convert(100, 'EUR', 'INVALID')).rejects.toThrow();
    });

    test('getUnitOptions doit renvoyer la liste des monnaies au format attendu', () => {
        const options = currencyConverter.getUnitOptions();
        expect(Array.isArray(options)).toBe(true);

        options.forEach(option => {
            expect(option).toHaveProperty('id');
            expect(option).toHaveProperty('name');
            expect(typeof option.id).toBe('string');
            expect(typeof option.name).toBe('string');
        });

        const currencyIds = options.map(option => option.id);
        expect(currencyIds).toContain('EUR');
        expect(currencyIds).toContain('USD');
        expect(currencyIds).toContain('GBP');
    });
});