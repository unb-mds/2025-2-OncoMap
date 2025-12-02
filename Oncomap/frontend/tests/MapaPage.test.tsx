import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MapaPege from '../src/pages/MapaPage';
import { mapService } from '../src/services/mapService';

// --- MOCKS DOS COMPONENTES FILHOS ---

// 1. Mock do Layout e Footer
vi.mock('../src/components/Geral/layout_sidebar', () => ({
  default: () => <div data-testid="layout-sidebar">Sidebar</div>
}));

vi.mock('../src/components/Geral/footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}));

// 2. Mock da TabelaInfo
vi.mock('../src/components/MapaPage/TabelaInfo', () => ({
  default: () => <div data-testid="tabela-info">Mock Tabela Info</div>
}));

// 3. Mock do MapaInterativo
vi.mock('../src/components/MapaPage/mapa', () => ({
  default: ({ setSelectedRegion }: any) => (
    <div data-testid="mapa-interativo">
      <button onClick={() => setSelectedRegion('sudeste')}>
        Simular Clique Sudeste
      </button>
    </div>
  )
}));

// 4. Mock do Serviço
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

    // Verifica se os componentes principais estão na tela
    expect(screen.getByTestId('layout-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mapa-interativo')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();

    // Verifica se a mensagem de instrução inicial aparece
    expect(screen.getByText(/Selecione uma região no mapa/i)).toBeInTheDocument();
    
    // Garante que a tabela NÃO está na tela ainda
    expect(screen.queryByTestId('tabela-info')).not.toBeInTheDocument();
  });

  it('deve buscar dados e mostrar a tabela ao selecionar uma região', async () => {
    // 1. Configura o mock com o formato CORRETO
    const mockData = { 
        regiao: 'SUDESTE', 
        municipios: [],
        investimentosGerais: [] 
    };
    
    vi.mocked(mapService.getDadosRegiao).mockResolvedValue(mockData);

    render(<MapaPege />);

    // 2. Simula o usuário clicando no mapa
    const btnSimulacao = screen.getByText('Simular Clique Sudeste');
    fireEvent.click(btnSimulacao);

    // 3. Verifica estado de carregamento
    expect(screen.getByText(/Carregando dados/i)).toBeInTheDocument();

    // 4. Verifica se chamou a API
    expect(mapService.getDadosRegiao).toHaveBeenCalledWith('sudeste');

    // 5. Aguarda a tabela aparecer
    await waitFor(() => {
      expect(screen.getByTestId('tabela-info')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Selecione uma região no mapa/i)).not.toBeInTheDocument();
  });

  it('deve exibir erro se a API falhar', async () => {
    // 1. Configura o mock para falhar
    vi.mocked(mapService.getDadosRegiao).mockRejectedValue(new Error('Erro API'));

    render(<MapaPege />);

    // 2. Tenta carregar
    fireEvent.click(screen.getByText('Simular Clique Sudeste'));

    // 3. Espera a mensagem de erro
    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar os dados/i)).toBeInTheDocument();
    });

    // 4. Testa o botão de Voltar
    const btnVoltar = screen.getByText('Voltar');
    fireEvent.click(btnVoltar);

    // 5. Deve voltar ao estado inicial (AGUARDANDO ATUALIZAÇÃO DO REACT)
    await waitFor(() => {
      expect(screen.getByText(/Selecione uma região no mapa/i)).toBeInTheDocument();
    });
  });

}); // <--- FALTAVA FECHAR O DESCRIBE AQUI