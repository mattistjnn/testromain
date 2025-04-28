class UIManager {
    constructor() {
        // Éléments DOM
        this.elements = {
            conversionType: document.getElementById('conversion-type'),
            fromUnit: document.getElementById('from-unit'),
            toUnit: document.getElementById('to-unit'),
            fromValue: document.getElementById('from-value'),
            toValue: document.getElementById('to-value'),
            convertBtn: document.getElementById('convert-btn'),
            addFavoriteBtn: document.getElementById('add-favorite-btn'),
            favoritesList: document.getElementById('favorites-list'),
            clearFavoritesBtn: document.getElementById('clear-favorites-btn'),
            historyList: document.getElementById('history-list'),
            clearHistoryBtn: document.getElementById('clear-history-btn')
        };

        // Convertisseurs disponibles
        this.converters = {
            length: lengthConverter,
            temperature: temperatureConverter,
            weight: weightConverter,
            volume: volumeConverter,
            currency: currencyConverter,
            crypto: cryptoConverter
        };

        // Labels par type de conversion
        this.typeLabels = {
            length: 'Longueur',
            temperature: 'Température',
            weight: 'Poids',
            volume: 'Volume',
            currency: 'Monnaie',
            crypto: 'Crypto'
        };
    }

    init() {
        this.setupEventListeners();
        this.loadConversionType();
        this.displayFavorites();
        this.displayHistory();
    }

    setupEventListeners() {
        this.elements.conversionType.addEventListener('change', () => this.loadConversionType());
        this.elements.convertBtn.addEventListener('click', () => this.performConversion());
        this.elements.addFavoriteBtn.addEventListener('click', () => this.addToFavorites());
        this.elements.clearFavoritesBtn.addEventListener('click', () => {
            favoritesManager.clearFavorites();
            this.displayFavorites();
        });
        this.elements.clearHistoryBtn.addEventListener('click', () => {
            historyManager.clearHistory();
            this.displayHistory();
        });
    }

    loadConversionType() {
        const type = this.elements.conversionType.value;
        const converter = this.converters[type];

        if (!converter) {
            console.error(`Convertisseur pour le type ${type} non trouvé`);
            return;
        }

        this.elements.fromUnit.innerHTML = '';
        this.elements.toUnit.innerHTML = '';

        const options = converter.getUnitOptions();
        options.forEach(unit => {
            this.elements.fromUnit.appendChild(new Option(unit.name, unit.id));
            this.elements.toUnit.appendChild(new Option(unit.name, unit.id));
        });

        if (options.length > 1) {
            this.elements.toUnit.selectedIndex = 1;
        }
    }

    async performConversion() {
        try {
            const { conversionType, fromUnit, toUnit, fromValue, toValue } = this.elements;
            const type = conversionType.value;
            const from = fromUnit.value;
            const to = toUnit.value;
            const value = parseFloat(fromValue.value);

            if (isNaN(value)) {
                alert('Veuillez entrer une valeur numérique valide');
                return;
            }

            const converter = this.converters[type];
            const result = (type === 'currency' || type === 'crypto')
                ? await converter.convert(value, from, to)
                : converter.convert(value, from, to);

            toValue.value = result;

            const conversionData = {
                type,
                fromUnit: from,
                fromValue: value,
                toUnit: to,
                toValue: result,
                timestamp: new Date().toISOString()
            };

            historyManager.addToHistory(conversionData);
            this.displayHistory();

        } catch (error) {
            console.error('Erreur lors de la conversion:', error);
            alert(`Erreur de conversion: ${error.message}`);
        }
    }

    addToFavorites() {
        try {
            const { conversionType, fromUnit, toUnit } = this.elements;
            const type = conversionType.value;
            const from = fromUnit.value;
            const to = toUnit.value;

            if (!from || !to) {
                alert('Veuillez sélectionner les unités de conversion');
                return;
            }

            favoritesManager.addFavorite({ type, fromUnit: from, toUnit: to });
            this.displayFavorites();

        } catch (error) {
            console.error('Erreur lors de l\'ajout aux favoris:', error);
            alert(`Erreur: ${error.message}`);
        }
    }

    displayFavorites() {
        const favorites = favoritesManager.getFavorites();
        const container = this.elements.favoritesList;
        container.innerHTML = '';

        if (favorites.length === 0) {
            container.innerHTML = '<div class="text-gray-400 italic">Aucun favori enregistré</div>';
            return;
        }

        favorites.forEach((favorite, index) => {
            const converter = this.converters[favorite.type];
            const fromUnitInfo = converter.getUnitOptions().find(u => u.id === favorite.fromUnit);
            const toUnitInfo = converter.getUnitOptions().find(u => u.id === favorite.toUnit);

            const favoriteEl = document.createElement('div');
            favoriteEl.className = 'p-2 border border-gray-700 rounded-md flex justify-between items-center bg-gray-800 text-gray-100';
            favoriteEl.innerHTML = `
                <div>
                    <span class="font-semibold text-blue-400">${this.typeLabels[favorite.type]}</span>: 
                    ${fromUnitInfo ? fromUnitInfo.name : favorite.fromUnit} → 
                    ${toUnitInfo ? toUnitInfo.name : favorite.toUnit}
                </div>
                <div>
                    <button class="use-favorite text-green-400 hover:text-green-300 mr-2" data-index="${index}">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    <button class="remove-favorite text-red-400 hover:text-red-300" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            container.appendChild(favoriteEl);
        });

        document.querySelectorAll('.use-favorite').forEach(button => {
            button.addEventListener('click', e => this.useFavorite(parseInt(e.currentTarget.dataset.index)));
        });

        document.querySelectorAll('.remove-favorite').forEach(button => {
            button.addEventListener('click', e => {
                favoritesManager.removeFavorite(parseInt(e.currentTarget.dataset.index));
                this.displayFavorites();
            });
        });
    }

    useFavorite(index) {
        const favorite = favoritesManager.getFavorites()[index];
        if (!favorite) return;

        this.elements.conversionType.value = favorite.type;
        this.loadConversionType();

        setTimeout(() => {
            this.elements.fromUnit.value = favorite.fromUnit;
            this.elements.toUnit.value = favorite.toUnit;
        }, 100);
    }

    displayHistory() {
        const history = historyManager.getHistory();
        const container = this.elements.historyList;
        container.innerHTML = '';

        if (history.length === 0) {
            container.innerHTML = '<div class="text-gray-400 italic">Aucune conversion récente</div>';
            return;
        }

        history.forEach(entry => {
            const converter = this.converters[entry.type];
            const fromUnitInfo = converter.getUnitOptions().find(u => u.id === entry.fromUnit);
            const toUnitInfo = converter.getUnitOptions().find(u => u.id === entry.toUnit);

            const historyEl = document.createElement('div');
            historyEl.className = 'p-3 border border-gray-700 rounded-md bg-gray-800 text-gray-100';

            const date = new Date(entry.timestamp);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

            historyEl.innerHTML = `
                <div class="flex justify-between">
                    <span class="font-semibold text-purple-400">${this.typeLabels[entry.type]}</span>
                    <span class="text-sm text-gray-400">${formattedDate}</span>
                </div>
                <div class="mt-1">
                    ${entry.fromValue} ${fromUnitInfo ? fromUnitInfo.name : entry.fromUnit} = 
                    ${entry.toValue} ${toUnitInfo ? toUnitInfo.name : entry.toUnit}
                </div>
            `;

            container.appendChild(historyEl);
        });
    }
}

// Instanciation globale
const UI = new UIManager();
UI.init();

// Export pour tests éventuels
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
