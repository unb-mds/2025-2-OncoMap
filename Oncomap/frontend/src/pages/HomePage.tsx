import { Link } from "react-router-dom";

const HomePage= () => {
    return (
        <div>
            <h1>Home Page</h1>
            <Link to="/Mapa">Ir para o Mapa</Link>
        </div>
    )
}

export default HomePage