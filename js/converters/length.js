const lengthConverter = {

    units: {
        meter: {
            name: 'Mètres',
            toBase: (value) => value,
            fromBase: (value) => value
        },
        kilometer: {
            name: 'Kilomètres',
            toBase: (value) => value * 1000,
            fromBase: (value) => value / 1000
        },
        foot: {
            name: 'Pieds',
            toBase: (value) => value * 0.3048,
            fromBase: (value) => value / 0.3048
        },
        inch: {
            name: 'Pouces',
            toBase: (value) => value * 0.0254,
            fromBase: (value) => value / 0.0254
        },
        yard: {
            name: 'Yards',
            toBase: (value) => value * 0.9144,
            fromBase: (value) => value / 0.9144
        },
        mile: {
            name: 'Miles',
            toBase: (value) => value * 1609.344,
            fromBase: (value) => value / 1609.344
        }
    },

    convert(value, fromUnit, toUnit) {
        if (!this.units[fromUnit] || !this.units[toUnit]) {
            throw new Error(`Unité non valide: ${!this.units[fromUnit] ? fromUnit : toUnit}`);
        }

        if (fromUnit === toUnit) {
            return value;
        }

        if (fromUnit === 'foot' && toUnit === 'inch') {
            return value * 12; // Exactement 12 pouces par pied
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

module.exports = lengthConverter;