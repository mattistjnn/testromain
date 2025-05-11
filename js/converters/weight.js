const weightConverter = {

    units: {
        gram: {
            name: 'Grammes',
            toBase: (value) => value,
            fromBase: (value) => value
        },
        kilogram: {
            name: 'Kilogrammes',
            toBase: (value) => value * 1000,
            fromBase: (value) => value / 1000
        },
        pound: {
            name: 'Livres',
            toBase: (value) => value * 453.592,
            fromBase: (value) => value / 453.592
        }
    },
    convert(value, fromUnit, toUnit) {
        if (!this.units[fromUnit] || !this.units[toUnit]) {
            throw new Error(`Unité non valide: ${!this.units[fromUnit] ? fromUnit : toUnit}`);
        }

        if (fromUnit === toUnit) {
            return value;
        }

        if (fromUnit === 'pound' && toUnit === 'kilogram') {
            return value * 0.45359237;
        }

        if (fromUnit === 'kilogram' && toUnit === 'pound') {
            return value * 2.20462;
        }

        const valueInBase = this.units[fromUnit].toBase(value);
        return this.units[toUnit].fromBase(valueInBase);
    },

    getUnitOptions() {
        return Object.keys(this.units).map(id => ({
            id,
            name: this.units[id].name
        }));
    }
};

module.exports = weightConverter;