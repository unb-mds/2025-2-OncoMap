// Oncomap/backend/src/tests/controllers/statsController.test.js
const statsController = require('../../api/controllers/statsController');
const db = require('../../config/database');

// --- A MÁGICA: MOCK DO BANCO DE DADOS ---
// Isso diz ao Jest: "Sempre que alguém importar o db, use minha versão falsa".
jest.mock('../../config/database');

describe('Stats Controller', () => {
    let req, res;

    // Antes de cada teste, limpamos os mocks e resetamos req/res
    beforeEach(() => {
        req = { params: {} };
        res = {
            status: jest.fn().mockReturnThis(), // Permite encadear .status().json()
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('getGeneralStats', () => {
        test('Deve retornar status 200 e dados formatados corretamente', async () => {
            // 1. Prepara os dados falsos que o banco "retornaria"
            const mockStatesRows = [
                { state_uf: 'SP', total_value: '1000.00' },
                { state_uf: 'RJ', total_value: '500.00' }
            ];
            const mockMunicipalitiesRows = [
                { municipality_ibge_code: '1', municipality_name: 'Teste', state_uf: 'SP', total_value: '100.00' }
            ];

            // 2. Configura o Mock do db.query
            // Como o controller chama db.query duas vezes (estados e municipios),
            // usamos mockResolvedValueOnce para definir o retorno de cada chamada em ordem.
            db.query
                .mockResolvedValueOnce({ rows: mockStatesRows })       // 1ª chamada
                .mockResolvedValueOnce({ rows: mockMunicipalitiesRows }); // 2ª chamada

            // 3. Executa a função do controller
            await statsController.getGeneralStats(req, res);

            // 4. Verificações (Expectativas)
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                states: { SP: 1000.00, RJ: 500.00 },
                municipalities: [
                    { ibge: '1', name: 'Teste', uf: 'SP', total: 100.00 }
                ]
            });
        });

        test('Deve retornar erro 500 se o banco falhar', async () => {
            // Simula um erro no banco
            db.query.mockRejectedValue(new Error('Erro de conexão'));

            await statsController.getGeneralStats(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Erro interno ao processar estatísticas." });
        });
    });

    describe('getStateSpecificStats', () => {
        test('Deve retornar 404 se o estado não tiver dados', async () => {
            req.params.uf = 'AC';
            // Simula banco retornando lista vazia
            db.query.mockResolvedValue({ rows: [] });

            await statsController.getStateSpecificStats(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Nenhum dado encontrado para este estado." });
        });
    });

    // ... (testes anteriores) ...

    describe('getMunicipalitySpecificStats', () => {
        test('Deve retornar dados do município com soma de categorias', async () => {
            req.params.ibge = '3550308';

            // Dados simulados do banco (Mock)
            // Criamos duas linhas para testar se ele soma as categorias corretamente
            const mockRows = [
                {
                    municipality_name: 'São Paulo',
                    state_uf: 'SP',
                    final_extracted_value: '100.00',
                    publication_date: '2025-01-01',
                    source_url: 'http://pdf1.com',
                    gemini_analysis: { // JSON vindo da IA
                        medicamentos: 50,
                        equipamentos: 50,
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
                        medicamentos: 100, // Soma deve dar 150
                        obras_infraestrutura: 100
                    }
                }
            ];

            db.query.mockResolvedValue({ rows: mockRows });

            await statsController.getMunicipalitySpecificStats(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            
            // Verifica a estrutura da resposta
            const responseData = res.json.mock.calls[0][0]; // Pega o primeiro argumento da primeira chamada
            
            expect(responseData.name).toBe('São Paulo');
            expect(responseData.total_invested).toBe(300); // 100 + 200
            
            // Verifica a soma das categorias
            expect(responseData.categories.medicamentos).toBe(150); // 50 + 100
            expect(responseData.categories.equipamentos).toBe(50);
            expect(responseData.categories.obras_infraestrutura).toBe(100);
        });

        test('Deve retornar 404 se município não existir', async () => {
            req.params.ibge = '0000000';
            db.query.mockResolvedValue({ rows: [] });

            await statsController.getMunicipalitySpecificStats(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});