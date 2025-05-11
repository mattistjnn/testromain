const temperatureConverter = {
    units: {
        celsius: { name: "Celsius", symbol: "°C" },
        fahrenheit: { name: "Fahrenheit", symbol: "°F" },
        kelvin: { name: "Kelvin", symbol: "K" }
    },

    convert(value, fromUnit, toUnit) {
        if (!this.units[fromUnit] || !this.units[toUnit]) {
            throw new Error("Unité de température non valide");
        }

        let result;

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

    getUnitOptions() {
        return Object.entries(this.units).map(([key, value]) => ({
            id: key,
            name: `${value.name} (${value.symbol})`
        }));
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = temperatureConverter;
}
