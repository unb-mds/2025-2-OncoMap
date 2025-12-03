const mockGenerateContent = jest.fn();
const mockGetGenerativeModel = jest.fn().mockReturnValue({
  generateContent: mockGenerateContent
});

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: mockGetGenerativeModel
      };
    })
  };
});

jest.mock('../../config/database');
jest.mock('html-pdf-node');
jest.mock('../../utils/regionMap');

const reportController = require('../../api/controllers/reportController');
const db = require('../../config/database');
const pdf = require('html-pdf-node');
const { getStatesByRegion } = require('../../utils/regionMap');

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
      mockGenerateContent.mockResolvedValue({
        response: { text: () => '<h1>HTML IA</h1>' }
      });
      pdf.generatePdf.mockResolvedValue(Buffer.from('PDF'));

      await reportController.generateRegionReport(req, res);

      expect(mockGenerateContent).toHaveBeenCalled();
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(res.send).toHaveBeenCalled();
    });

    test('Deve retornar 400 para região inválida', async () => {
      req.params.regionName = 'invalid';
      getStatesByRegion.mockReturnValue([]);

      await reportController.generateRegionReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
    
    test('Deve tratar erro (500)', async () => {
        req.params.regionName = 'sul';
        getStatesByRegion.mockReturnValue(['RS']);
        db.query.mockRejectedValue(new Error('Erro DB'));
  
        await reportController.generateRegionReport(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('generateStateReport', () => {
    test('Deve gerar PDF para estado com sucesso', async () => {
      req.params.uf = 'SP';
      db.query.mockResolvedValue({ rows: [{ municipality_name: 'X', total_value: '100' }] });
      mockGenerateContent.mockResolvedValue({ response: { text: () => 'HTML' } });
      pdf.generatePdf.mockResolvedValue(Buffer.from('PDF'));

      await reportController.generateStateReport(req, res);

      expect(res.send).toHaveBeenCalled();
    });

    test('Deve retornar 404 se sem dados', async () => {
        req.params.uf = 'AC';
        db.query.mockResolvedValue({ rows: [] });
        await reportController.generateStateReport(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('generateMunicipalityReport', () => {
    test('Deve gerar PDF para município com sucesso', async () => {
      req.params.ibge = '123';
      db.query.mockResolvedValue({ rows: [{ municipality_name: 'X', final_extracted_value: '100' }] });
      mockGenerateContent.mockResolvedValue({ response: { text: () => 'HTML' } });
      pdf.generatePdf.mockResolvedValue(Buffer.from('PDF'));

      await reportController.generateMunicipalityReport(req, res);

      expect(res.send).toHaveBeenCalled();
    });

    test('Deve retornar 404 se sem dados', async () => {
        req.params.ibge = '999';
        db.query.mockResolvedValue({ rows: [] });
        await reportController.generateMunicipalityReport(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});