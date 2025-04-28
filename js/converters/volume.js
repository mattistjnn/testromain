/**
 * Module de conversion de volume
 */

const volumeConverter = {
    // Définition des unités disponibles
    units: {
        liter: { name: "Litre", symbol: "L" },
        gallon: { name: "Gallon", symbol: "gal" }
    },

    // Facteurs de conversion par rapport au litre (unité de base)
    conversionFactors: {
        liter: 1,
        gallon: 0.264172
    },

    /**
     * Convertit une valeur d'une unité de volume à une autre
     * @param {number} value - Valeur à convertir
     * @param {string} fromUnit - Unité source
     * @param {string} toUnit - Unité cible
     * @returns {number} - Valeur convertie
     */
    convert(value, fromUnit, toUnit) {
        // Vérification de la validité des unités
        if (!this.conversionFactors[fromUnit] || !this.conversionFactors[toUnit]) {
            throw new Error("Unité de volume non valide");
        }

        // Convertir vers l'unité de base (litre)
        const valueInLiters = value / this.conversionFactors[fromUnit];

        // Convertir de l'unité de base vers l'unité cible
        const result = valueInLiters * this.conversionFactors[toUnit];

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
    module.exports = volumeConverter;
}
