import { FaDatabase, FaExternalLinkAlt } from 'react-icons/fa';
import '../../style/Fonte.css';

const Fonte = () => {
  return (
    <section id="fontes" className="container fonte-section">
      <div className="fonte-content-wrapper">
        
        
        <div className="fonte-text-side">
          <h2 className="fonte-section-title">Nossa Fonte de Dados</h2>
          
          <div className="fonte-description-block">
            <p>
              A transparência nos investimentos públicos é fundamental para o controle social, 
              mas acessar dados dispersos em milhares de diários oficiais municipais é uma tarefa complexa.
            </p>
            <p>
              O <strong>OncoMap</strong> simplifica esse processo. Nossa plataforma é alimentada 
              automaticamente por dados processados pelo <em>Querido Diário</em>, garantindo que 
              você tenha acesso a informações oficiais, auditáveis e atualizadas sobre o destino 
              dos recursos da oncologia no Brasil.
            </p>
          </div>

          <div className="fonte-decorative-line"></div>
        </div>

    
        <div className="fonte-card-side">
          <div className="highlight-card">
            <div className="fonte-icon-container">
              <FaDatabase className="fonte-icon" />
            </div>
            
            <div className="fonte-card-content">
              <h3 className="fonte-name">Querido Diário</h3>
              <p className="fonte-role">Open Knowledge Brasil</p>
              
              <div className="fonte-text-block">
                <p>
                  <strong>O que é:</strong> Projeto de código aberto que utiliza tecnologia 
                  para libertar os dados dos diários oficiais municipais.
                </p>
                <p>
                  <strong>Como usamos:</strong> Filtramos publicações relacionadas a investimentos 
                  e contratos de <strong>oncologia</strong> nos municípios do Brasil.
                </p>
              </div>

              <a 
                href="https://queridodiario.ok.org.br/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="fonte-button"
              >
                Acessar Site <FaExternalLinkAlt style={{ marginLeft: '8px', fontSize: '0.8em' }} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Fonte;