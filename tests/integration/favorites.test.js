const favoritesManager = require('./../../js/storage/favorites');

describe('Module de gestion des favoris', () => {
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
        expect(typeof favoritesManager.getFavorites).toBe('function');
        expect(typeof favoritesManager.addFavorite).toBe('function');
        expect(typeof favoritesManager.removeFavorite).toBe('function');
        expect(typeof favoritesManager.clearFavorites).toBe('function');
    });

    test('getFavorites doit renvoyer un tableau vide si aucun favori n\'est enregistré', () => {
        const favorites = favoritesManager.getFavorites();
        expect(Array.isArray(favorites)).toBe(true);
        expect(favorites.length).toBe(0);
        expect(localStorage.getItem).toHaveBeenCalledWith(favoritesManager.STORAGE_KEY);
    });

    test('getFavorites doit renvoyer les favoris enregistrés', () => {
        const mockFavorites = [
            { type: 'length', fromUnit: 'meter', toUnit: 'foot' },
            { type: 'temperature', fromUnit: 'celsius', toUnit: 'fahrenheit' }
        ];
        localStorage.setItem(favoritesManager.STORAGE_KEY, JSON.stringify(mockFavorites));

        const favorites = favoritesManager.getFavorites();

        expect(Array.isArray(favorites)).toBe(true);
        expect(favorites.length).toBe(2);
        expect(favorites).toEqual(mockFavorites);
        expect(localStorage.getItem).toHaveBeenCalledWith(favoritesManager.STORAGE_KEY);
    });

    test('addFavorite doit ajouter un favori avec succès', () => {
        const newFavorite = { type: 'length', fromUnit: 'meter', toUnit: 'foot' };

        const result = favoritesManager.addFavorite(newFavorite);

        expect(result).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalled();

        const storedFavorites = JSON.parse(localStorage.getItem(favoritesManager.STORAGE_KEY));
        expect(Array.isArray(storedFavorites)).toBe(true);
        expect(storedFavorites.length).toBe(1);
        expect(storedFavorites[0]).toEqual(newFavorite);
    });

    test('addFavorite ne doit pas ajouter de doublons', () => {
        const favorite = { type: 'length', fromUnit: 'meter', toUnit: 'foot' };
        favoritesManager.addFavorite(favorite);
        jest.clearAllMocks();

        const result = favoritesManager.addFavorite(favorite);

        expect(result).toBe(false);

        const storedFavorites = JSON.parse(localStorage.getItem(favoritesManager.STORAGE_KEY));
        expect(storedFavorites.length).toBe(1);
    });

    test('removeFavorite doit supprimer un favori avec succès', () => {
        const favorites = [
            { type: 'length', fromUnit: 'meter', toUnit: 'foot' },
            { type: 'temperature', fromUnit: 'celsius', toUnit: 'fahrenheit' }
        ];
        localStorage.setItem(favoritesManager.STORAGE_KEY, JSON.stringify(favorites));
        jest.clearAllMocks();

        const result = favoritesManager.removeFavorite(0);

        expect(result).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalled();

        const storedFavorites = JSON.parse(localStorage.getItem(favoritesManager.STORAGE_KEY));
        expect(storedFavorites.length).toBe(1);
        expect(storedFavorites[0]).toEqual(favorites[1]);
    });

    test('removeFavorite doit retourner false si l\'index est invalide', () => {
        const favorite = { type: 'length', fromUnit: 'meter', toUnit: 'foot' };
        localStorage.setItem(favoritesManager.STORAGE_KEY, JSON.stringify([favorite]));
        jest.clearAllMocks();

        const result = favoritesManager.removeFavorite(1); // Index hors limites

        expect(result).toBe(false);

        const storedFavorites = JSON.parse(localStorage.getItem(favoritesManager.STORAGE_KEY));
        expect(storedFavorites.length).toBe(1);
    });

    test('clearFavorites doit supprimer tous les favoris', () => {
        const favorites = [
            { type: 'length', fromUnit: 'meter', toUnit: 'foot' },
            { type: 'temperature', fromUnit: 'celsius', toUnit: 'fahrenheit' }
        ];
        localStorage.setItem(favoritesManager.STORAGE_KEY, JSON.stringify(favorites));
        jest.clearAllMocks();

        favoritesManager.clearFavorites();

        expect(localStorage.setItem).toHaveBeenCalledWith(
            favoritesManager.STORAGE_KEY,
            JSON.stringify([])
        );

        const storedFavorites = JSON.parse(localStorage.getItem(favoritesManager.STORAGE_KEY));
        expect(storedFavorites.length).toBe(0);
    });
});