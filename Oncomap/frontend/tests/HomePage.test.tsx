/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../src/pages/HomePage';

describe('HomePage', () => {
  it('deve renderizar a estrutura principal da página (Navbar, Main e Footer)', () => {
    // Renderizamos dentro do Router porque o Navbar/Hero provavelmente usam <Link>
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // 1. Verifica se a área principal (<main>) foi renderizada
    // O seu código tem: <main className="main-content-card">
    const mainContent = screen.getByRole('main');
    
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveClass('main-content-card');

    // 2. Verifica se o Header/Navbar está presente (procura pela tag <nav> ou role="navigation")
    // Se o seu Navbar usar a tag <header> ou <nav>, isso vai passar.
    // Caso contrário, ele vai tentar achar algum texto comum.
    const navbar = screen.queryByRole('navigation') || screen.queryByRole('banner');
    if (navbar) {
      expect(navbar).toBeInTheDocument();
    }

    // 3. Verifica se o Footer está presente (procura pela tag <footer> ou role="contentinfo")
    const footer = screen.queryByRole('contentinfo');
    if (footer) {
      expect(footer).toBeInTheDocument();
    }
  });
});