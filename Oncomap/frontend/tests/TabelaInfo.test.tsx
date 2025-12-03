import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TabelaInfo from '../src/components/MapaPage/TabelaInfo';
import { mapService } from '../src/services/mapService';
import type { DadosRegiao, DetalhesMunicipio, DetalhesEstado } from '../src/types/apiTypes';

// Mock essencial para JSDOM
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// --- MOCKS DE DADOS ---
const mockDadosRegiao: DadosRegiao = {
  regiao: 'SUDESTE',
  investimentosGerais: [{ nome: 'Total Regional', valor: 'R$ 1.000,00' }],
  municipios: [
    {
      codarea: '35',
      nome: 'São Paulo',
      uf: 'SP',
      investimentos: [
        { nome: 'Campinas', valor: 'R$ 500,00', codarea_municipio: '3509502' }
      ]
    },
    { codarea: '33', nome: 'Rio de Janeiro', uf: 'RJ', investimentos: [] }
  ]
};

const mockDetalhesEstado: DetalhesEstado = {
  uf: 'SP',
  ibge: '35',
  name: 'São Paulo',
  total_invested: 50000,
  categories: {
    medicamentos: 10000,
    equipamentos: 20000,
    obras_infraestrutura: 0,
    servicos_saude: 5000,
    estadia_paciente: 0,
    outros_relacionados: 15000
  }
};

const mockDetalhesMunicipio: DetalhesMunicipio = {
  name: 'Campinas',
  uf: 'SP',
  ibge: '3509502',
  total_invested: 500,
  categories: {
    medicamentos: 200,
    equipamentos: 300,
    obras_infraestrutura: 0,
    servicos_saude: 0,
    estadia_paciente: 0,
    outros_relacionados: 0
  },
  recent_mentions: []
  // REMOVIDO: details: [] (Isso causava o erro)
};

// Mock do Serviço
vi.mock('../src/services/mapService', () => ({
  mapService: {
    getDetalhesEstado: vi.fn(),
    getDetalhesMunicipio: vi.fn(),
  }
}));

describe('Componente TabelaInfo', () => {
  const mockOnClose = vi.fn();
  const mockOnSelectState = vi.fn();
  const mockSetSearched = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a visão da REGIÃO inicialmente', () => {
    render(
      <TabelaInfo
        dadosDaRegiao={mockDadosRegiao}
        onClose={mockOnClose}
        estadoCodarea={null}
        onSelectState={mockOnSelectState}
        municipiosDoEstadoGeoJSON={null}
        setSearchedMunicipioName={mockSetSearched}
      />
    );

    expect(screen.getByText('SUDESTE')).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
  });

  it('deve chamar onSelectState ao clicar em um estado', () => {
    render(
      <TabelaInfo
        dadosDaRegiao={mockDadosRegiao}
        onClose={mockOnClose}
        estadoCodarea={null}
        onSelectState={mockOnSelectState}
        municipiosDoEstadoGeoJSON={null}
        setSearchedMunicipioName={mockSetSearched}
      />
    );

    fireEvent.click(screen.getByText('São Paulo'));
    expect(mockOnSelectState).toHaveBeenCalledWith('35');
  });

  it('deve renderizar a visão do ESTADO quando estadoCodarea é fornecido', async () => {
    vi.mocked(mapService.getDetalhesEstado).mockResolvedValue(mockDetalhesEstado);

    render(
      <TabelaInfo
        dadosDaRegiao={mockDadosRegiao}
        onClose={mockOnClose}
        estadoCodarea="35"
        onSelectState={mockOnSelectState}
        municipiosDoEstadoGeoJSON={null}
        setSearchedMunicipioName={mockSetSearched}
      />
    );

    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    expect(screen.getByText('Campinas')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Medicamentos')).toBeInTheDocument();
    });
  });

  it('deve carregar DETALHES DO MUNICÍPIO ao clicar na linha', async () => {
    vi.mocked(mapService.getDetalhesEstado).mockResolvedValue(mockDetalhesEstado);
    vi.mocked(mapService.getDetalhesMunicipio).mockResolvedValue(mockDetalhesMunicipio);

    render(
      <TabelaInfo
        dadosDaRegiao={mockDadosRegiao}
        onClose={mockOnClose}
        estadoCodarea="35"
        onSelectState={mockOnSelectState}
        municipiosDoEstadoGeoJSON={null}
        setSearchedMunicipioName={mockSetSearched}
      />
    );

    const rowCampinas = screen.getByText('Campinas');
    fireEvent.click(rowCampinas);

    expect(mapService.getDetalhesMunicipio).toHaveBeenCalledWith('3509502');

    await waitFor(() => {
      expect(screen.getByText(/300,00/)).toBeInTheDocument();
    });
  });
});