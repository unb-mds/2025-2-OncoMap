import { Link } from "react-scroll";    

const Navbar = () =>{
    return(
        <nav>
            <ul>
                <li>
                    <Link to="secao1" smooth={true} duration={500} spy={true} activeClass="active">
                        Inicio
                    </Link>
                </li>
                <li>
                    <Link to="secao1" smooth={true} duration={500} spy={true} activeClass="active">
                        Inicio
                    </Link>
                </li>
                <li>
                    <Link to="secao1" smooth={true} duration={500} spy={true} activeClass="active">
                        Inicio
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;