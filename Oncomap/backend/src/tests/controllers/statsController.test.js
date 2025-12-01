// Oncomap/backend/src/tests/controllers/statsController.test.js
const statsController = require('../../api/controllers/statsController');
const db = require('../../config/database');

// Mock do Banco de Dados
jest.mock('../../config/database');

describe('Stats Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    /**
     * TESTE 1: getGeneralStats
     */
    describe('getGeneralStats', () => {
        test('Deve retornar estatísticas gerais corretamente (200)', async () => {
            // Mock dos retornos das duas queries (Estados e Municípios)
            const mockStates = { rows: [{ state_uf: 'SP', total_value: '100.50' }] };
            const mockCities = { rows: [{ municipality_ibge_code: '1', municipality_name: 'Teste', state_uf: 'SP', total_value: '50.00' }] };
            
            db.query
                .mockResolvedValueOnce(mockStates)
                .mockResolvedValueOnce(mockCities);

            await statsController.getGeneralStats(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                states: { 'SP': 100.50 },
                municipalities: expect.arrayContaining([
                    expect.objectContaining({ ibge: '1', total: 50.00 })
                ])
            });
        });

        test('Deve tratar erro de banco de dados (500)', async () => {
            db.query.mockRejectedValue(new Error('Erro de conexão'));
            await statsController.getGeneralStats(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    /**
     * TESTE 2: getStateSpecificStats
     */
    describe('getStateSpecificStats', () => {
        test('Deve retornar dados do estado com sucesso (200)', async () => {
            req.params.uf = 'SP';
            // Simula retorno com dados para testar o reduce (soma)
            db.query.mockResolvedValue({ 
                rows: [
                    { municipality_name: 'A', municipality_ibge_code: '1', total_value: '100.00' },
                    { municipality_name: 'B', municipality_ibge_code: '2', total_value: '200.00' }
                ] 
            });

            await statsController.getStateSpecificStats(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            // Verifica se somou 100 + 200
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                total_invested: 300.00
            }));
        });

        test('Deve retornar 404 se estado não tiver dados', async () => {
            req.params.uf = 'AC';
            db.query.mockResolvedValue({ rows: [] }); // Array vazio

            await statsController.getStateSpecificStats(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        test('Deve tratar erro de banco (500)', async () => {
            req.params.uf = 'RJ';
            db.query.mockRejectedValue(new Error('DB Error'));
            await statsController.getStateSpecificStats(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    /**
     * TESTE 3: getMunicipalitySpecificStats
     * CRÍTICO: Este teste cobre a lógica de soma de categorias JSON
     */
    describe('getMunicipalitySpecificStats', () => {
        test('Deve somar categorias corretamente (200)', async () => {
            req.params.ibge = '3550308';

            // DADOS RICOS: Incluímos JSONs completos para forçar o código a entrar nos IFs de soma
            const mockRows = [
                {
                    municipality_name: 'São Paulo',
                    state_uf: 'SP',
                    final_extracted_value: '100.00',
                    publication_date: '2025-01-01',
                    source_url: 'http://pdf1.com',
                    gemini_analysis: {
                        medicamentos: 50,
                        equipamentos: 50,
                        obras_infraestrutura: 0,
                        detalhes_extraidos: []
                    }
                },
                {
                    municipality_name: 'São Paulo',
                    state_uf: 'SP',
                    final_extracted_value: '200.00',
                    publication_date: '2025-01-02',
                    source_url: 'http://pdf2.com',
                    gemini_analysis: {
                        medicamentos: 100, // Soma deve dar 150 (50+100)
                        servicos_saude: 100
                    }
                },
                {
                    // Caso onde analysis é null (para testar resiliência)
                    final_extracted_value: '50.00',
                    gemini_analysis: null 
                }
            ];

            db.query.mockResolvedValue({ rows: mockRows });

            await statsController.getMunicipalitySpecificStats(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            
            const responseData = res.json.mock.calls[0][0];
            
            // Verificações de Soma
            expect(responseData.total_invested).toBe(350); // 100 + 200 + 50
            expect(responseData.categories.medicamentos).toBe(150); // 50 + 100
            expect(responseData.categories.equipamentos).toBe(50);
            expect(responseData.categories.servicos_saude).toBe(100);
            expect(responseData.categories.estadia_paciente).toBe(0); // Garante que inicializou com 0
        });

        test('Deve retornar 404 se município não existir', async () => {
            req.params.ibge = '0000000';
            db.query.mockResolvedValue({ rows: [] });
            await statsController.getMunicipalitySpecificStats(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        test('Deve tratar erro de banco (500)', async () => {
            req.params.ibge = '123';
            db.query.mockRejectedValue(new Error('DB Error'));
            await statsController.getMunicipalitySpecificStats(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});