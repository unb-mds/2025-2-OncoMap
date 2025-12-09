import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import '../../style/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleToggleClick = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        
        <h2 className="navbar-logo">OncoMap</h2>

        <nav className={menuOpen ? "navbar-nav active" : "navbar-nav"}>
          <ul>
            <li>
              <HashLink to="/#inicio" smooth onClick={handleLinkClick}>
                Início
              </HashLink>
            </li>
            <li>
              <HashLink to="/#sobre" smooth onClick={handleLinkClick}>
                Sobre
              </HashLink>
            </li>
            <li>
              <HashLink to="/#fontes" smooth onClick={handleLinkClick}>
                Fonte
              </HashLink>
            </li>
            <li>
              <HashLink to="/#quem-somos" smooth onClick={handleLinkClick}>
                Quem somos
              </HashLink>
            </li>
          </ul>
          
          <Link to="/mapa" className="navbar-explorar" onClick={handleLinkClick}>
            Explorar
          </Link>
        </nav>

        <button
          className={menuOpen ? "navbar-toggle active" : "navbar-toggle"}
          onClick={handleToggleClick}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;