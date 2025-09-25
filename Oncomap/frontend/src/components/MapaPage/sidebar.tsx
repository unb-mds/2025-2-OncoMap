// src/components/Sidebar.tsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../style/Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Função para fechar o menu
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* A sobreposição que aparece quando o menu está aberto */}
      <div
        className={isOpen ? 'sidebar-overlay open' : 'sidebar-overlay'}
        onClick={closeSidebar}
      />
      
      <aside className={isOpen ? 'sidebar open' : 'sidebar'}>
        <nav>
          <ul>
            <li>
              <NavLink to="/" onClick={closeSidebar}>
                Home
              </NavLink>
            </li>
            {/* Exemplo de futuro link */}
            {/* <li>
              <NavLink to="/outra-pagina" onClick={closeSidebar}>
                Outra Página
              </NavLink>
            </li> */}
          </ul>
        </nav>
      </aside>

      {/* O botão agora é renderizado depois para facilitar o CSS `+` */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'} {/* Muda o ícone quando está aberto */}
      </button>
    </>
  );
};

export default Sidebar;