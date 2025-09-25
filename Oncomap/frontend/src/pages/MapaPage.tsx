import MapaInterativo3D from "../components/mapa"
import { Link } from "react-router-dom";
import '../style/MapaPage.css';


const MapaPege = () => {
    return(
        <div className="mapa-page">
            <div className="mapa-container">
                <MapaInterativo3D />    
            </div>

        </div>
    )
}

export default MapaPege