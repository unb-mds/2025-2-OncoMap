import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link"; 
import { useState } from "react";
      

const Navbar = () =>{
    const [MenuOpen, setMenuOpen] = useState(false);
    return(
        <header>
            <div>
               <h2>Oncomap</h2>
            </div>

            <button className="menu-button" onClick={() => setMenuOpen(!MenuOpen)}  aria-label="Toggle Menu">
                ☰
            </button>


            <nav className={MenuOpen ? 'nav-links open' : 'nav-links'}>
                <ul>
                    {/* Link 1: Leva para uma seção da HomePage */}
                    <li>
                        <HashLink to="/#inicio" smooth onClick={() => setMenuOpen(false)}>
                        Inicio
                        </HashLink>
                    </li>

                    {/* Link 2: Leva para outra seção da HomePage */}
                    <li>
                        <HashLink to="/#sobre" smooth onClick={() => setMenuOpen(false)}>
                        Sobre o projeto
                        </HashLink>
                    </li>
                    
                    {/* Link 3: Leva para uma PÁGINA DIFERENTE */}
                    <li>
                        <HashLink to="/#quem-somos" smooth onClick={() => setMenuOpen(false)}>
                        Quem somos
                        </HashLink>
                    </li>

                </ul>
            </nav>
            <Link to="/mapa" className="mapa-button-link" onClick={() => setMenuOpen(false)}>
                Explorar
            </Link>
        </header>
    )
}

export default Navbar;