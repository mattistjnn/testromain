const volumeConverter = {
    units: {
        liter: { name: "Litre", symbol: "L" },
        gallon: { name: "Gallon", symbol: "gal" }
    },

    conversionFactors: {
        liter: 1,
        gallon: 0.264172
    },

    convert(value, fromUnit, toUnit) {
        if (!this.conversionFactors[fromUnit] || !this.conversionFactors[toUnit]) {
            throw new Error("Unité de volume non valide");
        }

        const valueInLiters = value / this.conversionFactors[fromUnit];

        const result = valueInLiters * this.conversionFactors[toUnit];

        return Number(result.toFixed(6));
    },

    getUnitOptions() {
        return Object.entries(this.units).map(([key, value]) => ({
            id: key,
            name: `${value.name} (${value.symbol})`
        }));
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = volumeConverter;
}
