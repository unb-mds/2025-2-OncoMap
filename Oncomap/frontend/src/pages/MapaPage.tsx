import MapaInterativo3D from "../components/mapa"
import { Link } from "react-router-dom";
import './MapaPage.css';


const MapaPege = () => {
    return(
        <div className="mapa-page">
            <div className="header">
                <h1>Oncomap</h1>
                <nav>
                    <Link to="/">Home</Link>
                </nav>
            </div>
            <div className="mapa-container">
                <MapaInterativo3D />    
            </div>

        </div>
    )
}

export default MapaPege