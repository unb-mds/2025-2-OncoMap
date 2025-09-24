import { Link } from "react-router-dom";
import '../style/HomePage.css';

const HomePage= () => {
    return (
        <div>
            <div className="navbar">

                <h2>Oncomap</h2>
                <nav>
                    <Link to="/Mapa">inicio</Link>
                    <Link to="/">Sobre</Link>
                    <Link to="/">Quem somos</Link>
                </nav>
                <button>
                    <Link to="/Mapa">Explorar</Link>
                </button>

            </div>
            <div className="Sobre">

            </div>
            <div className="Quem-somos">

            </div>
            <div className="footer">

            </div>
        </div>
    )
}

export default HomePage