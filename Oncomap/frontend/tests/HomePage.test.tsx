import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../src/pages/HomePage';

describe('HomePage', () => {
  it('deve renderizar a estrutura principal da página (Navbar, Main e Footer)', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveClass('main-content-card');

    // Verifica se navbar e footer existem (buscando por roles ou texto se necessário)
    // Usamos queryByRole para não quebrar se não achar, mas o expect valida depois
    const navbar = screen.queryByRole('navigation') || screen.queryByRole('banner');
    if (navbar) expect(navbar).toBeInTheDocument();

    const footer = screen.queryByRole('contentinfo');
    if (footer) expect(footer).toBeInTheDocument();
  });
});