import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import App from '../src/App';

// Mocks das páginas para isolar o teste de roteamento
vi.mock('../src/pages/HomePage', () => ({
  default: () => <div data-testid="home-page">Mock Home Page</div>
}));

vi.mock('../src/pages/MapaPage', () => ({
  default: () => <div data-testid="mapa-page">Mock Mapa Page</div>
}));

describe('Componente App (Roteamento)', () => {
  it('deve renderizar a HomePage na rota raiz "/"', () => {
    window.history.pushState({}, 'Home', '/');
    
    render(<App />);

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.queryByTestId('mapa-page')).not.toBeInTheDocument();
  });

  it('deve renderizar a MapaPage na rota "/mapa"', () => {
    window.history.pushState({}, 'Mapa', '/mapa');
    
    render(<App />);

    expect(screen.getByTestId('mapa-page')).toBeInTheDocument();
    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
  });
});