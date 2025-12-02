import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import App from '../src/App';

// --- MOCKS DAS PÁGINAS ---
// Substituímos as páginas reais por DIVs simples com texto.
// Isso isola o teste: se a HomePage quebrar, esse teste do App continua passando (corretamente).
vi.mock('../src/pages/HomePage', () => ({
  default: () => <div data-testid="home-page">Mock Home Page</div>
}));

vi.mock('../src/pages/MapaPage', () => ({
  default: () => <div data-testid="mapa-page">Mock Mapa Page</div>
}));

describe('Componente App (Roteamento)', () => {
  it('deve renderizar a HomePage na rota raiz "/"', () => {
    // Como o App já tem o <Router> dentro dele, não precisamos envolver em MemoryRouter aqui.
    // Mas atenção: O Browser Router usa a URL atual do navegador.
    // Precisamos forçar a URL para '/' antes de renderizar.
    window.history.pushState({}, 'Home', '/');
    
    render(<App />);

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.queryByTestId('mapa-page')).not.toBeInTheDocument();
  });

  it('deve renderizar a MapaPage na rota "/mapa"', () => {
    // Força a URL para '/mapa'
    window.history.pushState({}, 'Mapa', '/mapa');
    
    render(<App />);

    expect(screen.getByTestId('mapa-page')).toBeInTheDocument();
    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
  });
});