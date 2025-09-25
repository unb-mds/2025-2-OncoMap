import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link"; 
import '../style/Navbar.css';
      

const Navbar = () =>{
    const [menuOpen, setmenuOpen] = useState(false);
    return(
        <header className="navbar">
            <div className="logo">
               <h2>Oncomap</h2>
            </div>

            <button className="menu-button" onClick={() => setmenuOpen(!menuOpen)}  aria-label="Toggle Menu">
                ☰
            </button>


            <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
                <ul>
                    {/* Link 1: Leva para uma seção da HomePage */}
                    <li>
                        <HashLink to="/#inicio" smooth onClick={() => setmenuOpen(false)}>
                        Inicio
                        </HashLink>
                    </li>

                    {/* Link 2: Leva para outra seção da HomePage */}
                    <li>
                        <HashLink to="/#sobre" smooth onClick={() => setmenuOpen(false)}>
                        Sobre o projeto
                        </HashLink>
                    </li>
                    
                    {/* Link 3: Leva para uma PÁGINA DIFERENTE */}
                    <li>
                        <HashLink to="/#quem-somos" smooth onClick={() => setmenuOpen(false)}>
                        Quem somos
                        </HashLink>
                    </li>

                </ul>
            </nav>
            <Link to="/mapa" className="mapa-button-link" onClick={() => setmenuOpen(false)}>
                Explorar
            </Link>
        </header>
    )
}

export default Navbar;