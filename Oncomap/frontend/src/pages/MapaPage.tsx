import React, { useState, useEffect } from 'react';
import MapaInterativo from "../components/MapaPage/mapa";
import Footer from "../components/Geral/footer";
import Layout from '../components/Geral/layout_sidebar';
import TabelaInfo from '../components/MapaPage/TabelaInfo';
import '../style/MapaPage.css';
import type { FeatureCollection } from 'geojson';

import { mapService } from '../services/mapService';
import type { DadosRegiao } from '../types/apiTypes';

const MapaPege: React.FC = () => {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [estadoCodarea, setEstadoCodarea] = useState<string | null>(null);
    
    const [dadosDaRegiao, setDadosDaRegiao] = useState<DadosRegiao | null>(null);
    
    const [loadingDados, setLoadingDados] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    
    const [municipiosData, setMunicipiosData] = useState<FeatureCollection | null>(null);
    const [searchedMunicipioName, setSearchedMunicipioName] = useState<string | null>(null);

    useEffect(() => {
        const fetchRegionData = async () => {
            if (!selectedRegion) {
                setDadosDaRegiao(null);
                return;
            }

            setLoadingDados(true);
            setFetchError(null);

            try {
                const data = await mapService.getDadosRegiao(selectedRegion);
                setDadosDaRegiao(data);
            } catch (error) {
                console.error("Erro ao buscar região:", error);
                setFetchError("Não foi possível carregar os dados desta região.");
                setDadosDaRegiao(null);
            } finally {
                setLoadingDados(false);
            }
        };

        fetchRegionData();
    }, [selectedRegion]);

    const handleSetSelectedRegion = (region: string | null) => {
        setSelectedRegion(region);
        setEstadoCodarea(null);
        setSearchedMunicipioName(null);
    };
    
    const handleSetEstadoCodarea = (codarea: string | null) => {
        setEstadoCodarea(codarea);
        setSearchedMunicipioName(null);
    }

  return (
        <div className="mapa-page-container">
            <Layout/>
            <div className={selectedRegion ? "content-wrapper region-selected" : "content-wrapper"}>
                <div className="map-area">
                    <MapaInterativo
                        selectedRegion={selectedRegion}
                        setSelectedRegion={handleSetSelectedRegion}
                        selectedState={estadoCodarea}
                        setSelectedState={handleSetEstadoCodarea}
                        setMunicipiosData={setMunicipiosData}
                        searchedMunicipioName={searchedMunicipioName}
                    />
                </div>

                <div className="panel-area">
                  {loadingDados && (
                    <div className="panel-message">
                      <strong>Carregando dados da API...</strong>
                    </div>
                  )}

                  {fetchError && !loadingDados && (
                    <div className="panel-message error">
                      <strong>Erro ao carregar dados.</strong>
                      <p>{fetchError}</p>
                      <button onClick={() => {
                          setSelectedRegion(null);
                          setFetchError(null);
                      }}>Voltar</button>
                    </div>
                  )}

                  {!loadingDados && !fetchError && !selectedRegion && (
                    <div className="panel-message">
                         Selecione uma região no mapa para ver os investimentos.
                    </div>
                  )}
                  
                  {!loadingDados && !fetchError && dadosDaRegiao && selectedRegion && (
                    <div style={{ width: '100%' }}>
                      <TabelaInfo
                        dadosDaRegiao={dadosDaRegiao}
                        estadoCodarea={estadoCodarea}
                        onSelectState={handleSetEstadoCodarea}               
                        onClose={() => {
                          setEstadoCodarea(null);
                          setSelectedRegion(null);
                          setSearchedMunicipioName(null);
                        }}
                        municipiosDoEstadoGeoJSON={municipiosData}
                        setSearchedMunicipioName={setSearchedMunicipioName}
                      />
                    </div>
                  )}
                </div>
            </div>

            <Footer />
        </div>
  );
};

export default MapaPege;