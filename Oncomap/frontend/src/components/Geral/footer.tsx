import '../../style/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        
        <div className="footer-column">
          <h4>Informações</h4>
          <ul>
            <li><a href="/#inicio">Início</a></li>
            <li><a href="/#sobre">Sobre o projeto</a></li>
            <li><a href="/#quem-somos">Quem somos</a></li>
          </ul>
        </div>


        <div className="footer-column">
          <h4>Siga-nos</h4>
          <ul>
            <li><a href="https://github.com/unb-mds/2025-2-OncoMap" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>OncoMap</h4>
          <p>Transparência nos investimentos em saúde oncológica</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 OncoMap - Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;