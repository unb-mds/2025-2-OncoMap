// Oncomap/backend/src/tests/controllers/reportController.test.js
const reportController = require('../../api/controllers/reportController');
const db = require('../../config/database');
const pdf = require('html-pdf-node');
const { getStatesByRegion } = require('../../utils/regionMap');

// --- MOCKS ---
jest.mock('../../config/database');
jest.mock('html-pdf-node');
jest.mock('../../utils/regionMap');

// MOCK DO GOOGLE GEMINI (Versão Simplificada)
// O segredo é: NÃO usar variáveis externas. Definir tudo aqui dentro.
jest.mock('@google/generative-ai', () => {
  const mockGenerateContent = jest.fn(); // Criamos a função aqui dentro
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: mockGenerateContent
        })
      };
    }),
    // Exportamos o mock para podermos acessá-lo nos testes!
    __mockGenerateContent: mockGenerateContent
  };
});

// Importamos o mock que acabamos de criar (é estranho, mas funciona)
const { __mockGenerateContent } = require('@google/generative-ai');

describe('Report Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('generateRegionReport', () => {
    test('Deve gerar PDF com sucesso para uma região', async () => {
      req.params.regionName = 'sudeste';

      getStatesByRegion.mockReturnValue(['SP', 'RJ']);
      
      db.query.mockResolvedValue({
        rows: [{ state_uf: 'SP', total_value: '1000.00' }]
      });

      // Usamos a variável exportada pelo mock
      __mockGenerateContent.mockResolvedValue({
        response: { text: () => '<h1>HTML IA</h1>' }
      });

      pdf.generatePdf.mockResolvedValue(Buffer.from('PDF'));

      await reportController.generateRegionReport(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(res.send).toHaveBeenCalled();
    });

    test('Deve retornar 400 para região inválida', async () => {
      req.params.regionName = 'invalid';
      getStatesByRegion.mockReturnValue([]);

      await reportController.generateRegionReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('generateStateReport', () => {
    test('Deve gerar PDF para estado com sucesso', async () => {
      req.params.uf = 'SP';
      db.query.mockResolvedValue({ rows: [{ municipality_name: 'X', total_value: '100' }] });
      __mockGenerateContent.mockResolvedValue({ response: { text: () => 'HTML' } });
      pdf.generatePdf.mockResolvedValue(Buffer.from('PDF'));

      await reportController.generateStateReport(req, res);

      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('generateMunicipalityReport', () => {
    test('Deve gerar PDF para município com sucesso', async () => {
      req.params.ibge = '123';
      db.query.mockResolvedValue({ rows: [{ municipality_name: 'X', final_extracted_value: '100' }] });
      __mockGenerateContent.mockResolvedValue({ response: { text: () => 'HTML' } });
      pdf.generatePdf.mockResolvedValue(Buffer.from('PDF'));

      await reportController.generateMunicipalityReport(req, res);

      expect(res.send).toHaveBeenCalled();
    });
  });
});