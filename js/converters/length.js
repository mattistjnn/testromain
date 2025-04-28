/**
 * Module de conversion de longueur
 */

const lengthConverter = {
    // Définition des unités disponibles
    units: {
        meter: { name: "Mètre", symbol: "m" },
        kilometer: { name: "Kilomètre", symbol: "km" },
        foot: { name: "Pied", symbol: "ft" },
        inch: { name: "Pouce", symbol: "in" },
        yard: { name: "Yard", symbol: "yd" },
        mile: { name: "Mile", symbol: "mi" }
    },

    // Facteurs de conversion par rapport au mètre (unité de base)
    conversionFactors: {
        meter: 1,
        kilometer: 0.001,
        foot: 3.28084,
        inch: 39.3701,
        yard: 1.09361,
        mile: 0.000621371
    },

    /**
     * Convertit une valeur d'une unité de longueur à une autre
     * @param {number} value - Valeur à convertir
     * @param {string} fromUnit - Unité source
     * @param {string} toUnit - Unité cible
     * @returns {number} - Valeur convertie
     */
    convert(value, fromUnit, toUnit) {
        // Vérification de la validité des unités
        if (!this.conversionFactors[fromUnit] || !this.conversionFactors[toUnit]) {
            throw new Error("Unité de longueur non valide");
        }

        // Convertir vers l'unité de base (mètre)
        const valueInMeters = value / this.conversionFactors[fromUnit];

        // Convertir de l'unité de base vers l'unité cible
        const result = valueInMeters * this.conversionFactors[toUnit];

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
    module.exports = lengthConverter;
}
