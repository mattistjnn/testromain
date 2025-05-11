const temperatureConverter = require('./../../js/converters/temperature');

describe('Module de conversion de température', () => {
    test('Doit avoir toutes les unités requises', () => {
        const units = Object.keys(temperatureConverter.units);
        expect(units).toContain('celsius');
        expect(units).toContain('fahrenheit');
        expect(units).toContain('kelvin');
    });

    test('Doit exposer les méthodes requises', () => {
        expect(typeof temperatureConverter.convert).toBe('function');
        expect(typeof temperatureConverter.getUnitOptions).toBe('function');
    });

    test('Convertit correctement les Celsius en Fahrenheit', () => {
        expect(temperatureConverter.convert(0, 'celsius', 'fahrenheit')).toBe(32);
        expect(temperatureConverter.convert(100, 'celsius', 'fahrenheit')).toBe(212);
        expect(temperatureConverter.convert(-40, 'celsius', 'fahrenheit')).toBe(-40);
    });

    test('Convertit correctement les Celsius en Kelvin', () => {
        expect(temperatureConverter.convert(0, 'celsius', 'kelvin')).toBe(273.15);
        expect(temperatureConverter.convert(100, 'celsius', 'kelvin')).toBe(373.15);
        expect(temperatureConverter.convert(-273.15, 'celsius', 'kelvin')).toBe(0);
    });

    test('Convertit correctement les Fahrenheit en Celsius', () => {
        expect(temperatureConverter.convert(32, 'fahrenheit', 'celsius')).toBe(0);
        expect(temperatureConverter.convert(212, 'fahrenheit', 'celsius')).toBe(100);
        expect(temperatureConverter.convert(-40, 'fahrenheit', 'celsius')).toBe(-40);
    });

    test('Convertit correctement les Fahrenheit en Kelvin', () => {
        expect(temperatureConverter.convert(32, 'fahrenheit', 'kelvin')).toBe(273.15);
        expect(temperatureConverter.convert(212, 'fahrenheit', 'kelvin')).toBe(373.15);
    });

    test('Convertit correctement les Kelvin en Celsius', () => {
        expect(temperatureConverter.convert(273.15, 'kelvin', 'celsius')).toBe(0);
        expect(temperatureConverter.convert(373.15, 'kelvin', 'celsius')).toBe(100);
        expect(temperatureConverter.convert(0, 'kelvin', 'celsius')).toBe(-273.15);
    });

    test('Convertit correctement les Kelvin en Fahrenheit', () => {
        expect(temperatureConverter.convert(273.15, 'kelvin', 'fahrenheit')).toBe(32);
        expect(temperatureConverter.convert(373.15, 'kelvin', 'fahrenheit')).toBe(212);
    });

    test('Retourne la même valeur quand les unités source et cible sont identiques', () => {
        expect(temperatureConverter.convert(25, 'celsius', 'celsius')).toBe(25);
        expect(temperatureConverter.convert(98.6, 'fahrenheit', 'fahrenheit')).toBe(98.6);
        expect(temperatureConverter.convert(310, 'kelvin', 'kelvin')).toBe(310);
    });

    test('Lève une erreur pour des unités non valides', () => {
        expect(() => temperatureConverter.convert(10, 'invalidUnit', 'celsius')).toThrow();
        expect(() => temperatureConverter.convert(10, 'celsius', 'invalidUnit')).toThrow();
    });

    test('getUnitOptions renvoie un tableau d\'objets avec id et name', () => {
        const options = temperatureConverter.getUnitOptions();
        expect(Array.isArray(options)).toBe(true);
        expect(options.length).toBe(3);

        options.forEach(option => {
            expect(option).toHaveProperty('id');
            expect(option).toHaveProperty('name');
            expect(typeof option.id).toBe('string');
            expect(typeof option.name).toBe('string');
        });
    });
});