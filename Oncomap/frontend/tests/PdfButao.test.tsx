import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import PdfButton from '../src/components/MapaPage/PDFButao'; 
import api from '../src/services/api';

// --- MOCKS GLOBAIS ---

// 1. Mock do serviço de API (Axios)
vi.mock('../src/services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

// 2. Mocks do Navegador
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
const mockAlert = vi.fn();

describe('Componente PdfButton', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Configura mocks do window
    window.URL.createObjectURL = mockCreateObjectURL;
    window.URL.revokeObjectURL = mockRevokeObjectURL;
    window.alert = mockAlert;
    
    // Retorna uma URL falsa para o Blob
    mockCreateObjectURL.mockReturnValue('blob:http://localhost/fake-url');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve renderizar o botão com o texto correto', () => {
    render(<PdfButton url="/api/relatorio" label="Baixar PDF" />);
    
    const button = screen.getByRole('button', { name: /Baixar PDF/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('deve realizar o fluxo de download com sucesso ao clicar', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: new Blob(['fake content']) });

    // --- SETUP PARA INTERCEPTAR O DOWNLOAD ---
    
    // 1. Guardamos a função original
    const originalCreateElement = document.createElement.bind(document);

    // 2. Criamos um elemento <a> REAL para usar de espião
    const realLink = originalCreateElement('a');

    // 3. Espionamos os métodos desse elemento
    const spyLinkSetAttribute = vi.spyOn(realLink, 'setAttribute');
    const spyLinkRemove = vi.spyOn(realLink, 'remove');

    // 4. Interceptamos o createElement: se pedirem 'a', entregamos o nosso; senão, o original.
    const spyCreateElement = vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
        if (tagName === 'a') return realLink;
        return originalCreateElement(tagName, options); 
    });

    // 5. Espionamos o appendChild para saber se o link foi colocado na tela
    const spyAppendChild = vi.spyOn(document.body, 'appendChild');

    render(<PdfButton url="/api/relatorio" label="Baixar PDF" filename="meu-arquivo.pdf" />);

    // --- AÇÃO ---
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Verifica estado de loading
    expect(screen.getByText('Gerando...')).toBeInTheDocument();

    // Aguarda voltar ao normal
    await waitFor(() => {
      expect(screen.getByText('Baixar PDF')).toBeInTheDocument();
    });

    // --- VERIFICAÇÕES ---
    expect(api.get).toHaveBeenCalledWith('/api/relatorio', { responseType: 'blob' });
    
    // Verifica se criou o elemento 'a'
    expect(spyCreateElement).toHaveBeenCalledWith('a');
    
    // A prova final: Verifica se o link foi adicionado ao corpo da página
    // (Isso confirma que o código chegou na parte de "clicar" no link)
    expect(spyAppendChild).toHaveBeenCalledWith(realLink);

    // Verifica se configurou o nome do arquivo
    expect(spyLinkSetAttribute).toHaveBeenCalledWith('download', 'meu-arquivo.pdf');
    
    // Verifica se removeu o link depois
    expect(spyLinkRemove).toHaveBeenCalled();
    
    // Verifica se limpou a memória do Blob
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it('deve exibir um alerta se o download falhar', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Erro de Rede'));

    render(<PdfButton url="/api/relatorio" label="Baixar PDF" />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Erro ao baixar PDF. Verifique se o backend está rodando.");
    });

    expect(screen.getByRole('button')).not.toBeDisabled();
  });
});