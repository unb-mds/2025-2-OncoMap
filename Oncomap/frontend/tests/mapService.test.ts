import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mapService } from '../src/services/mapService';
import api from '../src/services/api'; 


vi.mock('../src/services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('mapService', () => {
  beforeEach(() => {
    vi.clearAllMocks(); 
  });

  it('getDadosRegiao deve chamar a API com a URL correta e retornar os dados', async () => {
    
    const mockResponse = {
      data: {
        regiao: 'sudeste',
        municipios: [{ nome: 'São Paulo', codarea: '35' }]
      }
    };

    
    vi.mocked(api.get).mockResolvedValue(mockResponse);

    
    const resultado = await mapService.getDadosRegiao('Sudeste');

    
    expect(api.get).toHaveBeenCalledWith('/api/v1/map/regiao/sudeste');

    expect(resultado).toEqual(mockResponse.data);
  });

  it('getDetalhesMunicipio deve buscar pelo IBGE correto', async () => {
    const mockResponse = { data: { name: 'Campinas', total_invested: 1000 } };
    vi.mocked(api.get).mockResolvedValue(mockResponse);

    await mapService.getDetalhesMunicipio('3509502');

    expect(api.get).toHaveBeenCalledWith('/api/v1/map/municipio/3509502');
  });

  it('deve lançar erro se a API falhar', async () => {

    const erroAPI = new Error('Falha no Servidor');
    vi.mocked(api.get).mockRejectedValue(erroAPI);

   
    await expect(mapService.getDetalhesEstado('35')).rejects.toThrow('Falha no Servidor');
  });
});