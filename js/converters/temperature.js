/**
 * Module de conversion de température
 */

const temperatureConverter = {
    // Définition des unités disponibles
    units: {
        celsius: { name: "Celsius", symbol: "°C" },
        fahrenheit: { name: "Fahrenheit", symbol: "°F" },
        kelvin: { name: "Kelvin", symbol: "K" }
    },

    /**
     * Convertit une valeur d'une unité de température à une autre
     * @param {number} value - Valeur à convertir
     * @param {string} fromUnit - Unité source
     * @param {string} toUnit - Unité cible
     * @returns {number} - Valeur convertie
     */
    convert(value, fromUnit, toUnit) {
        // Vérification de la validité des unités
        if (!this.units[fromUnit] || !this.units[toUnit]) {
            throw new Error("Unité de température non valide");
        }

        let result;

        // Convertir à Celsius d'abord (utilisé comme unité intermédiaire)
        let tempInCelsius;

        switch (fromUnit) {
            case 'celsius':
                tempInCelsius = value;
                break;
            case 'fahrenheit':
                tempInCelsius = (value - 32) * (5 / 9);
                break;
            case 'kelvin':
                tempInCelsius = value - 273.15;
                break;
        }

        // Convertir de Celsius à l'unité cible
        switch (toUnit) {
            case 'celsius':
                result = tempInCelsius;
                break;
            case 'fahrenheit':
                result = (tempInCelsius * (9 / 5)) + 32;
                break;
            case 'kelvin':
                result = tempInCelsius + 273.15;
                break;
        }

        return Number(result.toFixed(6));
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
    module.exports = temperatureConverter;
}
