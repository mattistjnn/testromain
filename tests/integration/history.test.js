const historyManager = require('./../../js/storage/history');

describe('Module de gestion de l\'historique', () => {
    const localStorageMock = (() => {
        let store = {};
        return {
            getItem: jest.fn(key => store[key] || null),
            setItem: jest.fn((key, value) => {
                store[key] = value.toString();
            }),
            removeItem: jest.fn(key => {
                delete store[key];
            }),
            clear: jest.fn(() => {
                store = {};
            })
        };
    })();

    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true
    });

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test('Doit exposer les méthodes requises', () => {
        expect(typeof historyManager.getHistory).toBe('function');
        expect(typeof historyManager.addToHistory).toBe('function');
        expect(typeof historyManager.clearHistory).toBe('function');
    });

    test('getHistory doit renvoyer un tableau vide si aucun historique n\'est enregistré', () => {
        const history = historyManager.getHistory();
        expect(Array.isArray(history)).toBe(true);
        expect(history.length).toBe(0);
        expect(localStorage.getItem).toHaveBeenCalledWith(historyManager.storageKey);
    });

    test('getHistory doit renvoyer l\'historique enregistré', () => {
        const mockHistory = [
            {
                type: 'length',
                fromUnit: 'meter',
                fromValue: 10,
                toUnit: 'foot',
                toValue: 32.8084,
                timestamp: '2023-01-01T12:00:00.000Z'
            },
            {
                type: 'temperature',
                fromUnit: 'celsius',
                fromValue: 25,
                toUnit: 'fahrenheit',
                toValue: 77,
                timestamp: '2023-01-01T12:05:00.000Z'
            }
        ];
        localStorage.setItem(historyManager.storageKey, JSON.stringify(mockHistory));

        const history = historyManager.getHistory();

        expect(Array.isArray(history)).toBe(true);
        expect(history.length).toBe(2);
        expect(history).toEqual(mockHistory);
        expect(localStorage.getItem).toHaveBeenCalledWith(historyManager.storageKey);
    });

    test('addToHistory doit ajouter une conversion à l\'historique avec succès', () => {
        const newConversion = {
            type: 'length',
            fromUnit: 'meter',
            fromValue: 5,
            toUnit: 'foot',
            toValue: 16.4042,
            timestamp: '2023-01-01T12:00:00.000Z'
        };

        const result = historyManager.addToHistory(newConversion);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0]).toEqual(newConversion);
        expect(localStorage.setItem).toHaveBeenCalled();

        const storedHistory = JSON.parse(localStorage.getItem(historyManager.storageKey));
        expect(storedHistory[0]).toEqual(newConversion);
    });

    test('addToHistory doit ajouter l\'horodatage si non fourni', () => {
        const newConversion = {
            type: 'length',
            fromUnit: 'meter',
            fromValue: 5,
            toUnit: 'foot',
            toValue: 16.4042
        };

        const fixedDate = new Date('2023-01-01T12:00:00.000Z');
        jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);

        historyManager.addToHistory(newConversion);

        const storedHistory = JSON.parse(localStorage.getItem(historyManager.storageKey));
        expect(storedHistory[0].timestamp).toBe('2023-01-01T12:00:00.000Z');

        global.Date.mockRestore();
    });

    test('addToHistory doit lever une erreur si les données sont incomplètes', () => {
        const incompleteConversion = {
            type: 'length',
            fromUnit: 'meter',
            toUnit: 'foot',
            toValue: 16.4042
        };

        expect(() => historyManager.addToHistory(incompleteConversion)).toThrow();
        expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('addToHistory doit limiter l\'historique à 20 entrées', () => {
        const existingEntries = Array(20).fill().map((_, i) => ({
            type: 'length',
            fromUnit: 'meter',
            fromValue: i,
            toUnit: 'foot',
            toValue: i * 3.28084,
            timestamp: `2023-01-01T${i}:00:00.000Z`
        }));
        localStorage.setItem(historyManager.storageKey, JSON.stringify(existingEntries));
        jest.clearAllMocks();

        const newEntry = {
            type: 'temperature',
            fromUnit: 'celsius',
            fromValue: 25,
            toUnit: 'fahrenheit',
            toValue: 77,
            timestamp: '2023-01-02T12:00:00.000Z'
        };

        const result = historyManager.addToHistory(newEntry);

        expect(result.length).toBe(20);
        expect(result[0]).toEqual(newEntry);
        expect(result.length).toBeLessThanOrEqual(20);
        expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('clearHistory doit supprimer tout l\'historique', () => {
        const mockHistory = [
            {
                type: 'length',
                fromUnit: 'meter',
                fromValue: 10,
                toUnit: 'foot',
                toValue: 32.8084,
                timestamp: '2023-01-01T12:00:00.000Z'
            }
        ];
        localStorage.setItem(historyManager.storageKey, JSON.stringify(mockHistory));
        jest.clearAllMocks();

        const result = historyManager.clearHistory();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
        expect(localStorage.removeItem).toHaveBeenCalledWith(historyManager.storageKey);
    });
});