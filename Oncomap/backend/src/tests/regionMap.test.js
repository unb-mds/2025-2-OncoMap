// Oncomap/backend/src/tests/utils/regionMap.test.js
const { getStatesByRegion } = require('../utils/regionMap');

describe('Region Map Utility', () => {
    
    test('Deve retornar os estados corretos para a região Norte', () => {
        const result = getStatesByRegion('norte');
        const expected = ['AC', 'AM', 'AP', 'PA', 'RO', 'RR', 'TO'];
        expect(result).toEqual(expected);
    });

    test('Deve lidar com variações de escrita (Centro-Oeste)', () => {
        // Testa com hífen
        expect(getStatesByRegion('centro-oeste')).toEqual(['DF', 'GO', 'MT', 'MS']);
        // Testa sem hífen (se sua lógica suportar)
        expect(getStatesByRegion('centrooeste')).toEqual(['DF', 'GO', 'MT', 'MS']);
        // Testa com letras maiúsculas
        expect(getStatesByRegion('CENTRO-OESTE')).toEqual(['DF', 'GO', 'MT', 'MS']);
    });

    test('Deve retornar array vazio para região inválida', () => {
        const result = getStatesByRegion('regiao-inexistente');
        expect(result).toEqual([]);
    });

    test('Deve retornar array vazio se input for nulo ou vazio', () => {
        expect(getStatesByRegion(null)).toEqual([]);
        expect(getStatesByRegion('')).toEqual([]);
    });
});