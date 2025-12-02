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

    // --- A MÁGICA ACONTECE AQUI ---
    
    // 1. Guardamos a função original de criar elementos
    const originalCreateElement = document.createElement.bind(document);

    // 2. Criamos um elemento <a> REAL (para o appendChild aceitar)
    const realLink = originalCreateElement('a');

    // 3. Colocamos espiões nos métodos desse elemento real para saber se foram chamados
    const spyLinkClick = vi.spyOn(realLink, 'click');
    const spyLinkSetAttribute = vi.spyOn(realLink, 'setAttribute');
    const spyLinkRemove = vi.spyOn(realLink, 'remove');

    // 4. Interceptamos a criação de elementos:
    // Se pedirem um 'a', entregamos o nosso 'realLink' espionado.
    // Se pedirem qualquer outra coisa (div, span), entregamos o original.
    const spyCreateElement = vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
        if (tagName === 'a') return realLink;
        return originalCreateElement(tagName, options); 
    });

    const spyAppendChild = vi.spyOn(document.body, 'appendChild');

    render(<PdfButton url="/api/relatorio" label="Baixar PDF" filename="meu-arquivo.pdf" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Gerando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Baixar PDF')).toBeInTheDocument();
    });

    // VERIFICAÇÕES
    expect(api.get).toHaveBeenCalledWith('/api/relatorio', { responseType: 'blob' });
    
    expect(spyCreateElement).toHaveBeenCalledWith('a');
    expect(spyAppendChild).toHaveBeenCalledWith(realLink); // Agora passa, pois é um Node real

    expect(spyLinkSetAttribute).toHaveBeenCalledWith('download', 'meu-arquivo.pdf');
    expect(spyLinkClick).toHaveBeenCalled();
    expect(spyLinkRemove).toHaveBeenCalled();
    
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