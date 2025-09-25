import { Link } from "react-router-dom";
import "../../style/Footer.css";

const Footer = () => {
    return(
        <footer className="footer">

            <div className="footer-content">

                <div className="footer-section">
                    <h4>Informações</h4>
                    <ul>
                        <Link to="/#inicio">Início</Link>
                        <Link to="/#sobre">Sobre o projeto</Link>
                        <Link to="/#quem-somos">Quem somos</Link>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contato</h4>
                    <p>
                        Phone: +55 (XX) XXXX-XXXX<br />
                        Email: contato@oncomap.com<br />
                        Address: Rua Fictícia, 123
                    </p>
                </div>
                <div className="footer-section">
                    <h4>Siga-nos</h4>
                    <ul className="social-links">
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">LinkedIn</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Onco Mapa</h4>
                    <p>Mapa Interativo de Incidência e Mortalidade por Câncer.</p>
                </div>
                <div className="footer-bottom">
                    <p>© ONCOMAP 2019. All rights reserved.</p>
                    <p>Contact us: +55 (XX) XXXX-XXXX</p>
                </div>

            </div>

        </footer>
    )

}
export default Footer;