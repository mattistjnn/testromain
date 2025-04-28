/**
 * Module de conversion de poids
 */

const weightConverter = {
    // Définition des unités disponibles
    units: {
        gram: { name: "Gramme", symbol: "g" },
        kilogram: { name: "Kilogramme", symbol: "kg" },
        pound: { name: "Livre", symbol: "lb" }
    },

    // Facteurs de conversion par rapport au gramme (unité de base)
    conversionFactors: {
        gram: 1,
        kilogram: 0.001,
        pound: 0.00220462
    },

    /**
     * Convertit une valeur d'une unité de poids à une autre
     * @param {number} value - Valeur à convertir
     * @param {string} fromUnit - Unité source
     * @param {string} toUnit - Unité cible
     * @returns {number} - Valeur convertie
     */
    convert(value, fromUnit, toUnit) {
        // Vérification de la validité des unités
        if (!this.conversionFactors[fromUnit] || !this.conversionFactors[toUnit]) {
            throw new Error("Unité de poids non valide");
        }

        // Convertir vers l'unité de base (gramme)
        const valueInGrams = value / this.conversionFactors[fromUnit];

        // Convertir de l'unité de base vers l'unité cible
        const result = valueInGrams * this.conversionFactors[toUnit];

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
    module.exports = weightConverter;
}
