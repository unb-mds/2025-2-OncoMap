import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MapaPege from '../src/pages/MapaPage';
import { mapService } from '../src/services/mapService';

// --- MOCKS ---
vi.mock('../src/components/Geral/layout_sidebar', () => ({
  default: () => <div data-testid="layout-sidebar">Sidebar</div>
}));

vi.mock('../src/components/Geral/footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('../src/components/MapaPage/TabelaInfo', () => ({
  default: () => <div data-testid="tabela-info">Mock Tabela Info</div>
}));

// Mock do Mapa que simula um clique via botão
vi.mock('../src/components/MapaPage/mapa', () => ({
  default: ({ setSelectedRegion }: { setSelectedRegion: (r: string) => void }) => (
    <div data-testid="mapa-interativo">
      <button onClick={() => setSelectedRegion('sudeste')}>
        Simular Clique Sudeste
      </button>
    </div>
  )
}));

vi.mock('../src/services/mapService', () => ({
  mapService: {
    getDadosRegiao: vi.fn()
  }
}));

describe('Página MapaPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o layout inicial corretamente', () => {
    render(<MapaPege />);

    expect(screen.getByTestId('layout-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mapa-interativo')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText(/Selecione uma região no mapa/i)).toBeInTheDocument();
    expect(screen.queryByTestId('tabela-info')).not.toBeInTheDocument();
  });

  it('deve buscar dados e mostrar a tabela ao selecionar uma região', async () => {
    const mockData = { 
        regiao: 'SUDESTE', 
        municipios: [],
        investimentosGerais: [] 
    };
    
    vi.mocked(mapService.getDadosRegiao).mockResolvedValue(mockData);

    render(<MapaPege />);

    const btnSimulacao = screen.getByText('Simular Clique Sudeste');
    fireEvent.click(btnSimulacao);

    expect(screen.getByText(/Carregando dados/i)).toBeInTheDocument();
    expect(mapService.getDadosRegiao).toHaveBeenCalledWith('sudeste');

    await waitFor(() => {
      expect(screen.getByTestId('tabela-info')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Selecione uma região no mapa/i)).not.toBeInTheDocument();
  });

  it('deve exibir erro se a API falhar', async () => {
    vi.mocked(mapService.getDadosRegiao).mockRejectedValue(new Error('Erro API'));

    render(<MapaPege />);

    fireEvent.click(screen.getByText('Simular Clique Sudeste'));

    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar os dados/i)).toBeInTheDocument();
    });

    const btnVoltar = screen.getByText('Voltar');
    fireEvent.click(btnVoltar);

    // Aguarda a UI atualizar após limpar o erro
    await waitFor(() => {
      expect(screen.getByText(/Selecione uma região no mapa/i)).toBeInTheDocument();
    });
  });
});