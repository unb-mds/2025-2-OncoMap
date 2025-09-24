import MapaInterativo3D from "../components/mapa"
import { Link } from "react-router-dom";


const MapaPege = () => {
    return(
        <div className="mapa-page">
            <h1>MapaPage</h1>
            <Link to="/">Ir para Home</Link>
            <MapaInterativo3D/>
        </div>
    )
}

export default MapaPege