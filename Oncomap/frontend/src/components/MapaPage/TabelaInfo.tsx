import { useState, useMemo, useEffect, useRef } from 'react';
import '../../style/Tabelainfo.css';
import type { FeatureCollection } from 'geojson';
import { mapService, type DetalhesEstado } from '../../services/mapService';
import type { DadosRegiao, DetalhesMunicipio } from '../../types/apiTypes';
import PdfButton from '../MapaPage/PDFButao'; 

interface TabelaInfoProps {
  dadosDaRegiao: DadosRegiao;
  onClose: () => void;
  estadoCodarea: string | null;
  onSelectState: (codarea: string) => void; 
  municipiosDoEstadoGeoJSON: FeatureCollection | null;
  setSearchedMunicipioName: (name: string | null) => void;
}

const CATEGORIAS_ORDEM = [
  { key: 'medicamentos', label: 'Medicamentos' },
  { key: 'equipamentos', label: 'Equipamentos' },
  { key: 'obras_infraestrutura', label: 'Obras e Infraestrutura' },
  { key: 'servicos_saude', label: 'Serviços de Saúde' },
  { key: 'estadia_paciente', label: 'Estadia de Paciente' },
  { key: 'outros_relacionados', label: 'Outros' }
];

const TabelaInfo = ({
  dadosDaRegiao,
  estadoCodarea,
  onSelectState,
  onClose,
  municipiosDoEstadoGeoJSON,
  setSearchedMunicipioName,
}: TabelaInfoProps) => {
  
  const [termoBuscaMunicipio, setTermoBuscaMunicipio] = useState<string>('');
  const [detalhesMunicipio, setDetalhesMunicipio] = useState<DetalhesMunicipio | null>(null);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);
  const [detalhesEstado, setDetalhesEstado] = useState<DetalhesEstado | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // URL base para os relatórios (ajuste conforme seu env se necessário)
 // Mudei para 3000 (onde o backend vive)
const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/report`;

  const dadosDoEstado = estadoCodarea
    ? dadosDaRegiao.municipios?.find((m) => String(m.codarea) === String(estadoCodarea))
    : null;

  // Scroll Reset Effect
  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 0;
    const painelLateral = document.querySelector('.panel-area');
    if (painelLateral) painelLateral.scrollTop = 0;
    if (containerRef.current) containerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [detalhesMunicipio, estadoCodarea]);

  // Carrega Detalhes do Estado
  useEffect(() => {
    const carregarDetalhesEstado = async () => {
      if (estadoCodarea) {
        try {
          const dados = await mapService.getDetalhesEstado(estadoCodarea);
          setDetalhesEstado(dados);
        } catch (error) {
          console.error("Erro ao carregar estado:", error);
        }
      } else {
        setDetalhesEstado(null);
        setDetalhesMunicipio(null);
      }
    };
    carregarDetalhesEstado();
  }, [estadoCodarea]);

  const handleVerDetalhes = async (codIbge: string) => {
    if (!codIbge) return;
    setLoadingDetalhes(true);
    try {
      const detalhes = await mapService.getDetalhesMunicipio(codIbge);
      setDetalhesMunicipio(detalhes);
    } catch (error) {
      console.error("Erro:", error);
      alert("Não foi possível carregar os detalhes.");
    } finally {
      setLoadingDetalhes(false);
    }
  };

  const investimentosFiltrados = useMemo(() => {
    if (!dadosDoEstado) return [];
    if (!termoBuscaMunicipio) return dadosDoEstado.investimentos;
    return dadosDoEstado.investimentos.filter(item => 
      item.nome.toLowerCase().includes(termoBuscaMunicipio.toLowerCase())
    );
  }, [dadosDoEstado, termoBuscaMunicipio]);

  const municipiosGeoFiltrados = useMemo(() => {
    if (!municipiosDoEstadoGeoJSON || termoBuscaMunicipio.length < 2) return [];
    return municipiosDoEstadoGeoJSON.features.filter((feature) =>
      feature.properties?.name?.toLowerCase().includes(termoBuscaMunicipio.toLowerCase())
    );
  }, [municipiosDoEstadoGeoJSON, termoBuscaMunicipio]);

  const handleSelecionarSugestao = (nomeMunicipio: string) => {
    setTermoBuscaMunicipio(nomeMunicipio);
    setSearchedMunicipioName(nomeMunicipio);
    if (dadosDoEstado) {
      const municipioEncontrado = dadosDoEstado.investimentos?.find(
       inv => inv.nome?.toLowerCase() === nomeMunicipio.toLowerCase()
      );
      if (municipioEncontrado && municipioEncontrado.codarea_municipio) {
        handleVerDetalhes(municipioEncontrado.codarea_municipio);
      }
    }
  };

  // --- RENDERIZAÇÃO ---

  // 1. TELA DE DETALHES DO MUNICÍPIO (Nível 3)
  if (detalhesMunicipio) {
    // URL específica para o PDF deste município
    const pdfUrl = `${API_BASE_URL}/municipality/${detalhesMunicipio.ibge}/pdf`;

    return (
      <div className="info-container" ref={containerRef}>
        <div className="visao-detalhes">
          <button className="close-button" onClick={() => setDetalhesMunicipio(null)}>
             &larr; Voltar para lista de {detalhesMunicipio.uf}
          </button>

          <h2 className="titulo-estado">{detalhesMunicipio.name}</h2>
          
          <div className="card-destaque">
            <h3>Investimento Total Identificado</h3>
            <p className="periodo-acumulado">(Acumulado desde 2022)</p>
            <p className="valor-gigante">
              {detalhesMunicipio.total_invested.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          <h4 className="secao-titulo">Detalhamento por Categoria</h4>
          <div className="tabela-scroll">
            <table className="tabela-investimentos">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th className="col-valor-direita">Valor Investido</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIAS_ORDEM.map((cat) => {
                  const valor = detalhesMunicipio.categories[cat.key] || 0;
                  return (
                    <tr key={cat.key}>
                      <td>{cat.label}</td>
                      <td className={`col-valor-direita ${valor > 0 ? 'valor-positivo' : 'valor-zerado'}`}>
                        {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <h4 className="secao-titulo">Fontes (Diários Oficiais)</h4>
          <ul className="lista-links-scroll">
            {detalhesMunicipio.recent_mentions.length > 0 ? (
                detalhesMunicipio.recent_mentions.map((mencao, idx) => (
                  <li key={idx} className="lista-links-item">
                    <div className="link-header">
                        <strong>{new Date(mencao.date).toLocaleDateString()}</strong>
                    </div>
                    <a href={mencao.url} target="_blank" rel="noreferrer">📄 Ver Documento Original</a>
                  </li>
                ))
            ) : (
                <li className="sem-dados">Nenhum documento recente listado.</li>
            )}
          </ul>

          {/* NOVO BOTÃO USADO AQUI */}
          <PdfButton 
            url={pdfUrl} 
            label="Baixar Relatório Completo (PDF)" 
          />
        </div>
      </div>
    );
  }

  // --- 2. VISÃO DO ESTADO SELECIONADO (Nível 2) ---
  if (dadosDoEstado) {
    // Define a URL do PDF (Prioriza detalhesEstado se carregado para pegar UF correta)
    // Se detalhesEstado ainda não carregou, o botão pode ficar desabilitado ou usar fallback
    const pdfUrl = detalhesEstado 
        ? `${API_BASE_URL}/state/${detalhesEstado.uf}/pdf`
        : '#'; // Evita erro se não carregou

    return (
      <div className="info-container" ref={containerRef}>
        <div className="visao-estado">
          <button className="close-button" onClick={() => {
             onSelectState('');
             setDetalhesEstado(null);
          }}>
             &larr; Voltar para a Região
          </button>
          
          <h2 className="titulo-estado">{dadosDoEstado.nome}</h2>

          {detalhesEstado && (
            <div className="detalhes-estado-header">
               <div className="estado-total-label">Total no Estado:</div>
               <div className="periodo-acumulado">(Acumulado desde 2022)</div>
               <div className="estado-total-valor">
                 {detalhesEstado.total_invested.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
               </div>
               
               <div className="categorias-container">
                  {CATEGORIAS_ORDEM.map((cat) => {
                    const valor = detalhesEstado.categories[cat.key] || 0;
                    return (
                      <div key={cat.key} className="categoria-badge" style={{opacity: valor > 0 ? 1 : 0.6}}>
                        <span className="categoria-label">{cat.label}</span>
                        <span className="categoria-valor" style={{color: valor > 0 ? '#E8FCCF' : '#aaa'}}>
                          {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    );
                  })}
               </div>
            </div>
          )}

          <div className="municipio-search-section">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Pesquisar município na lista..."
                className="search-bar"
                value={termoBuscaMunicipio}
                onChange={(e) => setTermoBuscaMunicipio(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSelecionarSugestao(termoBuscaMunicipio);
                }}
              />
            </div>
            
            {municipiosGeoFiltrados.length > 0 && termoBuscaMunicipio.length >= 2 && (
              <ul className="municipio-search-results">
                {municipiosGeoFiltrados.slice(0, 3).map((municipio, index) => (
                  <li key={index} onClick={() => handleSelecionarSugestao(municipio.properties?.name || '')}>
                    {municipio.properties?.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <hr className="separator" />

          {loadingDetalhes ? (
             <div className="loading-msg">Carregando detalhes do município...</div>
          ) : (
            <div className="tabela-scroll">
              <table className="tabela-investimentos clickable-rows">
                <thead>
                  <tr><th>Município (Clique para detalhes)</th><th className="col-valor-direita">Total</th></tr>
                </thead>
                <tbody>
                  {investimentosFiltrados.length > 0 ? (
                    investimentosFiltrados.map((item, index) => (
                      <tr 
                        key={index} 
                        onClick={() => {
                           if (item.codarea_municipio) {
                             handleVerDetalhes(item.codarea_municipio);
                           } else {
                             console.warn("Item sem IBGE:", item);
                           }
                        }}
                        title="Clique para ver detalhes completos"
                      > 
                        <td className="cell-municipio">{item.nome}</td>
                        <td className="col-valor-direita">{item.valor}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={2} className="linha-vazia">Nenhum dado encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* NOVO BOTÃO USADO AQUI */}
          {detalhesEstado && (
            <PdfButton 
              url={pdfUrl} 
              label="Baixar Relatório Estadual (PDF)" 
            />
          )}
        </div>
      </div>
    );
  }

  // --- 3. VISÃO DA REGIÃO (Nível 1) ---
  const regionPdfUrl = `${API_BASE_URL}/region/${dadosDaRegiao.regiao?.toLowerCase() || ""}/pdf`;

  return (
    <div className="info-container" ref={containerRef}>
      <div className="visao-regiao">
        <button className="close-button" onClick={onClose}>
            &larr; Voltar para o Mapa
        </button>

        <h2 className="titulo-estado">{dadosDaRegiao.regiao}</h2>

        <table className="tabela-investimentos">
          <thead>
            <tr><th>Resumo Regional</th><th className="col-valor-direita">Valor</th></tr>
          </thead>
            <tbody>
              {dadosDaRegiao.investimentosGerais?.map((item, idx) => (
                <tr key={idx}><td>{item.nome}</td><td className="col-valor-direita">{item.valor}</td></tr>
              ))}
            </tbody>
        </table>

        <div className="municipios-lista">
          <h3>Estados da Região</h3>
          <div className="grid-estados">
            {dadosDaRegiao.municipios?.map((estado) => (
              <div 
                key={estado.codarea} 
                className="card-estado"
                onClick={() => onSelectState(String(estado.codarea))} 
              >
                <span className="nome-estado">{estado.nome}</span>
                <span className="seta-visual">➜</span>
              </div>
            ))}
          </div>
        </div>

        {/* NOVO BOTÃO USADO AQUI */}
        <PdfButton 
          url={regionPdfUrl} 
          label="Baixar Relatório Regional (PDF)" 
        />
      </div>
    </div>
  );
};

export default TabelaInfo;