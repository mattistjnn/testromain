const weightConverter = require('./../../js/converters/weight');

describe('Module de conversion de poids', () => {
    test('Doit avoir toutes les unités requises', () => {
        const units = Object.keys(weightConverter.units);
        expect(units).toContain('gram');
        expect(units).toContain('kilogram');
        expect(units).toContain('pound');
    });

    test('Doit exposer les méthodes requises', () => {
        expect(typeof weightConverter.convert).toBe('function');
        expect(typeof weightConverter.getUnitOptions).toBe('function');
    });

    test('Convertit correctement les grammes en kilogrammes', () => {
        expect(weightConverter.convert(1000, 'gram', 'kilogram')).toBe(1);
        expect(weightConverter.convert(500, 'gram', 'kilogram')).toBe(0.5);
    });

    test('Convertit correctement les grammes en livres', () => {
        expect(weightConverter.convert(453.592, 'gram', 'pound')).toBeCloseTo(1, 5);
        expect(weightConverter.convert(1000, 'gram', 'pound')).toBeCloseTo(2.20462, 5);
    });

    test('Convertit correctement les kilogrammes en grammes', () => {
        expect(weightConverter.convert(1, 'kilogram', 'gram')).toBe(1000);
        expect(weightConverter.convert(0.5, 'kilogram', 'gram')).toBe(500);
    });

    test('Convertit correctement les kilogrammes en livres', () => {
        expect(weightConverter.convert(1, 'kilogram', 'pound')).toBeCloseTo(2.20462, 5);
        expect(weightConverter.convert(0.45359237, 'kilogram', 'pound')).toBeCloseTo(1, 5);
    });

    test('Convertit correctement les livres en grammes', () => {
        expect(weightConverter.convert(1, 'pound', 'gram')).toBeCloseTo(453.592, 3);
        expect(weightConverter.convert(2, 'pound', 'gram')).toBeCloseTo(907.184, 3);
    });

    test('Convertit correctement les livres en kilogrammes', () => {
        expect(weightConverter.convert(1, 'pound', 'kilogram')).toBeCloseTo(0.45359237, 8);
        expect(weightConverter.convert(2.20462, 'pound', 'kilogram')).toBeCloseTo(1, 5);
    });

    test('Retourne la même valeur quand les unités source et cible sont identiques', () => {
        expect(weightConverter.convert(10, 'gram', 'gram')).toBe(10);
        expect(weightConverter.convert(5, 'kilogram', 'kilogram')).toBe(5);
        expect(weightConverter.convert(3, 'pound', 'pound')).toBe(3);
    });

    test('Lève une erreur pour des unités non valides', () => {
        expect(() => weightConverter.convert(10, 'invalidUnit', 'gram')).toThrow();
        expect(() => weightConverter.convert(10, 'gram', 'invalidUnit')).toThrow();
    });

    test('getUnitOptions renvoie un tableau d\'objets avec id et name', () => {
        const options = weightConverter.getUnitOptions();
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