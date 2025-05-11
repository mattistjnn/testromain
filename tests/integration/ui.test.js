const UIManager = require('./../../js/ui');

jest.mock('../../js/converters/length', () => ({
    getUnitOptions: jest.fn().mockReturnValue([
        { id: 'meter', name: 'Mètre (m)' },
        { id: 'foot', name: 'Pied (ft)' }
    ]),
    convert: jest.fn().mockReturnValue(3.28084)
}));

jest.mock('../../js/converters/temperature', () => ({
    getUnitOptions: jest.fn().mockReturnValue([
        { id: 'celsius', name: 'Celsius (°C)' },
        { id: 'fahrenheit', name: 'Fahrenheit (°F)' }
    ]),
    convert: jest.fn().mockReturnValue(32)
}));

jest.mock('../../js/converters/weight', () => ({
    getUnitOptions: jest.fn().mockReturnValue([
        { id: 'kg', name: 'Kilogramme (kg)' },
        { id: 'lb', name: 'Livre (lb)' }
    ]),
    convert: jest.fn().mockReturnValue(2.20462)
}));

jest.mock('../../js/converters/volume', () => ({
    getUnitOptions: jest.fn().mockReturnValue([
        { id: 'liter', name: 'Litre (L)' },
        { id: 'gallon', name: 'Gallon (gal)' }
    ]),
    convert: jest.fn().mockReturnValue(0.264172)
}));

jest.mock('../../js/converters/currency', () => ({
    getUnitOptions: jest.fn().mockReturnValue([
        { id: 'eur', name: 'Euro (€)' },
        { id: 'usd', name: 'Dollar US ($)' }
    ]),
    convert: jest.fn().mockResolvedValue(1.1)
}));

jest.mock('../../js/converters/crypto', () => ({
    getUnitOptions: jest.fn().mockReturnValue([
        { id: 'btc', name: 'Bitcoin (BTC)' },
        { id: 'eth', name: 'Ethereum (ETH)' }
    ]),
    convert: jest.fn().mockResolvedValue(16.5)
}));

jest.mock('../../js/storage/favorites', () => ({
    getFavorites: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    clearFavorites: jest.fn()
}));

jest.mock('../../js/storage/history', () => ({
    getHistory: jest.fn(),
    addToHistory: jest.fn(),
    clearHistory: jest.fn()
}));

describe('Module UIManager', () => {
    let ui;
    const lengthConverter = require('./../../js/converters/length');
    const temperatureConverter = require('./../../js/converters/temperature');
    const weightConverter = require('./../../js/converters/weight');
    const volumeConverter = require('./../../js/converters/volume');
    const currencyConverter = require('./../../js/converters/currency');
    const cryptoConverter = require('./../../js/converters/crypto');
    const favoritesManager = require('./../../js/storage/favorites');
    const historyManager = require('./../../js/storage/history');

    beforeEach(() => {
        // Setup du DOM
        document.body.innerHTML = `
        <select id="conversion-type">
          <option value="length">Longueur</option>
          <option value="temperature">Température</option>
          <option value="weight">Poids</option>
          <option value="volume">Volume</option>
          <option value="currency">Monnaie</option>
          <option value="crypto">Crypto</option>
        </select>
        <select id="from-unit"></select>
        <select id="to-unit"></select>
        <input type="number" id="from-value" value="1">
        <input type="text" id="to-value" readonly>
        <button id="convert-btn">Convertir</button>
        <button id="add-favorite-btn">Ajouter aux favoris</button>
        <div id="favorites-list"></div>
        <button id="clear-favorites-btn">Effacer favoris</button>
        <div id="history-list"></div>
        <button id="clear-history-btn">Effacer historique</button>
        `;

        jest.clearAllMocks();

        favoritesManager.getFavorites.mockReturnValue([]);
        historyManager.getHistory.mockReturnValue([]);

        ui = new UIManager();
        ui.init();
    });

    test('Doit initialiser correctement l\'interface', () => {
        expect(ui.elements.conversionType).not.toBeNull();
        expect(ui.elements.fromUnit).not.toBeNull();
        expect(ui.elements.toUnit).not.toBeNull();
        expect(lengthConverter.getUnitOptions).toHaveBeenCalled();
        expect(favoritesManager.getFavorites).toHaveBeenCalled();
        expect(historyManager.getHistory).toHaveBeenCalled();
    });

    test('Doit charger les unités correspondantes lors du changement de type de conversion', () => {
        ui.elements.conversionType.value = 'temperature';
        ui.elements.conversionType.dispatchEvent(new Event('change'));

        expect(temperatureConverter.getUnitOptions).toHaveBeenCalled();

        expect(ui.elements.fromUnit.options.length).toBeGreaterThan(0);
        expect(ui.elements.toUnit.options.length).toBeGreaterThan(0);
    });

    test('Doit effectuer une conversion et l\'ajouter à l\'historique', async () => {
        ui.elements.conversionType.value = 'length';
        ui.elements.fromUnit.value = 'meter';
        ui.elements.toUnit.value = 'foot';
        ui.elements.fromValue.value = '1';

        await ui.performConversion();

        expect(lengthConverter.convert).toHaveBeenCalledWith(1, 'meter', 'foot');
        expect(ui.elements.toValue.value).toBe('3.28084');

        expect(historyManager.addToHistory).toHaveBeenCalled();
        const conversionData = historyManager.addToHistory.mock.calls[0][0];
        expect(conversionData.type).toBe('length');
        expect(conversionData.fromUnit).toBe('meter');
        expect(conversionData.fromValue).toBe(1);
        expect(conversionData.toUnit).toBe('foot');
        expect(conversionData.toValue).toBe(3.28084);
    });

    test('Doit ajouter une conversion aux favoris', () => {
        ui.elements.conversionType.value = 'length';
        ui.elements.fromUnit.value = 'meter';
        ui.elements.toUnit.value = 'foot';

        ui.addToFavorites();

        expect(favoritesManager.addFavorite).toHaveBeenCalledWith({
            type: 'length',
            fromUnit: 'meter',
            toUnit: 'foot'
        });
    });

    test('Doit afficher les favoris enregistrés', () => {
        const mockFavorites = [
            { type: 'length', fromUnit: 'meter', toUnit: 'foot' },
            { type: 'temperature', fromUnit: 'celsius', toUnit: 'fahrenheit' }
        ];
        favoritesManager.getFavorites.mockReturnValue(mockFavorites);

        lengthConverter.getUnitOptions.mockReturnValue([
            { id: 'meter', name: 'Mètre (m)' },
            { id: 'foot', name: 'Pied (ft)' }
        ]);

        ui.displayFavorites();

        const favoritesContainer = ui.elements.favoritesList;
        expect(favoritesContainer.innerHTML).not.toBe('');

        expect(favoritesContainer.innerHTML).toContain('Longueur');
        expect(favoritesContainer.innerHTML).toContain('Température');

        expect(favoritesContainer.querySelectorAll('.use-favorite').length).toBe(2);
        expect(favoritesContainer.querySelectorAll('.remove-favorite').length).toBe(2);
    });

    test('Doit effacer tous les favoris', () => {
        ui.elements.clearFavoritesBtn.click();

        expect(favoritesManager.clearFavorites).toHaveBeenCalled();
    });

    test('Doit afficher l\'historique des conversions', () => {
        const mockHistory = [
            {
                type: 'length',
                fromUnit: 'meter',
                fromValue: 1,
                toUnit: 'foot',
                toValue: 3.28084,
                timestamp: new Date().toISOString()
            }
        ];
        historyManager.getHistory.mockReturnValue(mockHistory);

        ui.displayHistory();

        const historyContainer = ui.elements.historyList;
        expect(historyContainer.innerHTML).not.toBe('');

        expect(historyContainer.innerHTML).toContain('Longueur');

        expect(historyContainer.innerHTML).toContain('1');
        expect(historyContainer.innerHTML).toContain('3.28084');
    });

    test('Doit effacer tout l\'historique', () => {
        ui.elements.clearHistoryBtn.click();

        expect(historyManager.clearHistory).toHaveBeenCalled();
    });

    test('Doit utiliser un favori sélectionné', () => {
        const mockFavorites = [
            { type: 'length', fromUnit: 'meter', toUnit: 'foot' }
        ];
        favoritesManager.getFavorites.mockReturnValue(mockFavorites);

        ui.displayFavorites();

        const useButton = document.querySelector('.use-favorite');
        useButton.click();

        expect(ui.elements.conversionType.value).toBe('length');

        expect(ui.elements.fromUnit.value).toBe('meter');
        expect(ui.elements.toUnit.value).toBe('foot');
    });

    test('Doit supprimer un favori', () => {
        const mockFavorites = [
            { type: 'length', fromUnit: 'meter', toUnit: 'foot' }
        ];
        favoritesManager.getFavorites.mockReturnValue(mockFavorites);

        ui.displayFavorites();

        const removeButton = document.querySelector('.remove-favorite');
        removeButton.click();

        expect(favoritesManager.removeFavorite).toHaveBeenCalledWith(0);
    });

    test('Doit afficher une alerte pour une valeur non numérique', async () => {
        const originalAlert = window.alert;
        window.alert = jest.fn();

        ui.elements.fromValue.value = 'abc';

        await ui.performConversion();

        expect(window.alert).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('Veuillez entrer une valeur numérique valide');

        window.alert = originalAlert;
    });

    test('Doit gérer une erreur de conversion', async () => {
        lengthConverter.convert.mockImplementationOnce(() => {
            throw new Error('Erreur de conversion');
        });

        const originalAlert = window.alert;
        const originalConsoleError = console.error;
        window.alert = jest.fn();
        console.error = jest.fn();

        ui.elements.conversionType.value = 'length';
        ui.elements.fromUnit.value = 'meter';
        ui.elements.toUnit.value = 'foot';
        ui.elements.fromValue.value = '1';

        await ui.performConversion();

        expect(console.error).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('Erreur de conversion: Erreur de conversion');

        window.alert = originalAlert;
        console.error = originalConsoleError;
    });
});