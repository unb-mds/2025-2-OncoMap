import MapaInterativo3D from "../components/MapaPage/mapa"
import Footer from "../components/Geral/footer";
import '../style/MapaPage.css';


const MapaPege = () => {
    return(
        <div className="mapa-page-container">
            <div className="map-wrapper">
                <MapaInterativo3D />    
            </div>
            <Footer />
        </div>
    )
}

export default MapaPege