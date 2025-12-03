import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import PdfButton from '../src/components/MapaPage/PDFButao'; 
import api from '../src/services/api';

// Mocks Globais
vi.mock('../src/services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
const mockAlert = vi.fn();

describe('Componente PdfButton', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
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

    // --- MOCK BLINDADO PARA EVITAR LOOP INFINITO ---
    const originalCreateElement = document.createElement.bind(document);
    const realLink = originalCreateElement('a'); // Elemento real

    const spyLinkSetAttribute = vi.spyOn(realLink, 'setAttribute');
    const spyLinkRemove = vi.spyOn(realLink, 'remove');

    // Intercepta a criação APENAS do link 'a'
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

    // Verificações
    expect(api.get).toHaveBeenCalledWith('/api/relatorio', { responseType: 'blob' });
    expect(spyCreateElement).toHaveBeenCalledWith('a');
    expect(spyAppendChild).toHaveBeenCalledWith(realLink);
    expect(spyLinkSetAttribute).toHaveBeenCalledWith('download', 'meu-arquivo.pdf');
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