const lengthConverter = require('./../../js/converters/length');

describe('Module de conversion de longueur', () => {
    test('Doit avoir toutes les unités requises', () => {
        const units = Object.keys(lengthConverter.units);
        expect(units).toContain('meter');
        expect(units).toContain('kilometer');
        expect(units).toContain('foot');
        expect(units).toContain('inch');
        expect(units).toContain('yard');
        expect(units).toContain('mile');
    });

    test('Doit exposer les méthodes requises', () => {
        expect(typeof lengthConverter.convert).toBe('function');
        expect(typeof lengthConverter.getUnitOptions).toBe('function');
    });

    test('Convertit correctement les mètres en kilomètres', () => {
        expect(lengthConverter.convert(1000, 'meter', 'kilometer')).toBe(1);
        expect(lengthConverter.convert(1, 'meter', 'kilometer')).toBe(0.001);
    });

    test('Convertit correctement les mètres en pieds', () => {
        expect(lengthConverter.convert(1, 'meter', 'foot')).toBeCloseTo(3.28084, 5);
        expect(lengthConverter.convert(10, 'meter', 'foot')).toBeCloseTo(32.8084, 4);
    });

    test('Convertit correctement les mètres en pouces', () => {
        expect(lengthConverter.convert(1, 'meter', 'inch')).toBeCloseTo(39.3701, 4);
    });

    test('Convertit correctement les mètres en yards', () => {
        expect(lengthConverter.convert(1, 'meter', 'yard')).toBeCloseTo(1.09361, 5);
    });

    test('Convertit correctement les mètres en miles', () => {
        expect(lengthConverter.convert(1609.344, 'meter', 'mile')).toBeCloseTo(1, 3);
    });

    test('Convertit correctement les kilomètres en mètres', () => {
        expect(lengthConverter.convert(1, 'kilometer', 'meter')).toBe(1000);
    });

    test('Convertit correctement les pieds en mètres', () => {
        expect(lengthConverter.convert(3.28084, 'foot', 'meter')).toBeCloseTo(1, 5);
    });

    test('Convertit correctement les pieds en pouces', () => {
        expect(lengthConverter.convert(1, 'foot', 'inch')).toBeCloseTo(12, 5);
    });

    test('Convertit correctement les miles en kilomètres', () => {
        expect(lengthConverter.convert(1, 'mile', 'kilometer')).toBeCloseTo(1.60934, 5);
    });

    test('Lève une erreur pour des unités non valides', () => {
        expect(() => lengthConverter.convert(10, 'invalidUnit', 'meter')).toThrow();
        expect(() => lengthConverter.convert(10, 'meter', 'invalidUnit')).toThrow();
    });

    test('Retourne la même valeur quand les unités source et cible sont identiques', () => {
        expect(lengthConverter.convert(10, 'meter', 'meter')).toBe(10);
        expect(lengthConverter.convert(42, 'foot', 'foot')).toBe(42);
    });

    test('getUnitOptions renvoie un tableau d\'objets avec id et name', () => {
        const options = lengthConverter.getUnitOptions();
        expect(Array.isArray(options)).toBe(true);
        expect(options.length).toBe(6);

        options.forEach(option => {
            expect(option).toHaveProperty('id');
            expect(option).toHaveProperty('name');
            expect(typeof option.id).toBe('string');
            expect(typeof option.name).toBe('string');
        });
    });
});