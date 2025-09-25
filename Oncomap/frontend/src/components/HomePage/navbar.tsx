import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link"; 
import '../../style/Navbar.css';
      

const Navbar = () =>{
    return(
        <header className="navbar">
            <div className="logo">
               <h2>Oncomap</h2>
            </div>

            <nav className="nav-links">
                <ul>
                    {/* Link 1: Leva para uma seção da HomePage */}
                    <li>
                        <HashLink to="/#inicio" smooth>
                        Inicio
                        </HashLink>
                    </li>

                    {/* Link 2: Leva para outra seção da HomePage */}
                    <li>
                        <HashLink to="/#sobre" smooth>
                        Sobre o projeto
                        </HashLink>
                    </li>
                    
                    {/* Link 3: Leva para uma PÁGINA DIFERENTE */}
                    <li>
                        <HashLink to="/#quem-somos" smooth>
                        Quem somos
                        </HashLink>
                    </li>

                </ul>
            </nav>
            <Link to="/mapa" className="mapa-button-link">
                Explorar
            </Link>
        </header>
    )
}

export default Navbar;