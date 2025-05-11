const volumeConverter = require('./../../js/converters/volume');

describe('Module de conversion de volume', () => {
    test('Doit avoir toutes les unités requises', () => {
        const units = Object.keys(volumeConverter.units);
        expect(units).toContain('liter');
        expect(units).toContain('gallon');
    });

    test('Doit exposer les méthodes requises', () => {
        expect(typeof volumeConverter.convert).toBe('function');
        expect(typeof volumeConverter.getUnitOptions).toBe('function');
    });

    test('Convertit correctement les litres en gallons', () => {
        expect(volumeConverter.convert(1, 'liter', 'gallon')).toBeCloseTo(0.264172, 6);
        expect(volumeConverter.convert(3.78541, 'liter', 'gallon')).toBeCloseTo(1, 5);
        expect(volumeConverter.convert(10, 'liter', 'gallon')).toBeCloseTo(2.64172, 5);
    });

    test('Convertit correctement les gallons en litres', () => {
        expect(volumeConverter.convert(1, 'gallon', 'liter')).toBeCloseTo(3.78541, 5);
        expect(volumeConverter.convert(2, 'gallon', 'liter')).toBeCloseTo(7.57082, 5);
        expect(volumeConverter.convert(0.264172, 'gallon', 'liter')).toBeCloseTo(1, 5);
    });

    test('Retourne la même valeur quand les unités source et cible sont identiques', () => {
        expect(volumeConverter.convert(10, 'liter', 'liter')).toBe(10);
        expect(volumeConverter.convert(5, 'gallon', 'gallon')).toBe(5);
    });

    test('Lève une erreur pour des unités non valides', () => {
        expect(() => volumeConverter.convert(10, 'invalidUnit', 'liter')).toThrow();
        expect(() => volumeConverter.convert(10, 'liter', 'invalidUnit')).toThrow();
    });

    test('getUnitOptions renvoie un tableau d\'objets avec id et name', () => {
        const options = volumeConverter.getUnitOptions();
        expect(Array.isArray(options)).toBe(true);
        expect(options.length).toBe(2);

        options.forEach(option => {
            expect(option).toHaveProperty('id');
            expect(option).toHaveProperty('name');
            expect(typeof option.id).toBe('string');
            expect(typeof option.name).toBe('string');
        });
    });
});