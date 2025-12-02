import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import L, { type Layer } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../style/MapaPage.css';
import { regioesGeoJson } from '../../data/regioes';


const CODIGO_PARA_ESTADO: Record<string, string> = {
  '11': 'Rondônia', '12': 'Acre', '13': 'Amazonas', '14': 'Roraima',
  '15': 'Pará', '16': 'Amapá', '17': 'Tocantins',
  '21': 'Maranhão', '22': 'Piauí', '23': 'Ceará', '24': 'Rio Grande do Norte',
  '25': 'Paraíba', '26': 'Pernambuco', '27': 'Alagoas', '28': 'Sergipe', '29': 'Bahia',
  '31': 'Minas Gerais', '32': 'Espírito Santo', '33': 'Rio de Janeiro', '35': 'São Paulo',
  '41': 'Paraná', '42': 'Santa Catarina', '43': 'Rio Grande do Sul',
  '50': 'Mato Grosso do Sul', '51': 'Mato Grosso', '52': 'Goiás', '53': 'Distrito Federal'
};

interface GeoProperties {
  codarea?: string;
  regiao?: string;
  centroide?: [number, number];
  sigla?: string;
  id?: string;
  name?: string;
  nome?: string; 
  [key: string]: any;
}
type GeoFeature = Feature<Geometry, GeoProperties>;

const INITIAL_VIEW = {
  center: [-15, -54] as L.LatLngTuple,
  zoom: 4.2,
};

interface MapProps {
  selectedRegion: string | null;
  setSelectedRegion: (region: string | null) => void;
  selectedState: string | null;
  setSelectedState: (state: string | null) => void;
  setMunicipiosData: (data: FeatureCollection | null) => void; 
  searchedMunicipioName: string | null;
}

const MapaInterativo: React.FC<MapProps> = ({
  selectedRegion,
  setSelectedRegion,
  selectedState,
  setSelectedState,
  setMunicipiosData, 
  searchedMunicipioName,
}) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [hoveredObject, setHoveredObject] = useState<GeoFeature | null>(null);
  
  const [municipiosGeoJSON, setMunicipiosGeoJSON] = useState<FeatureCollection | null>(null);
  const [hoveredMunicipio, setHoveredMunicipio] = useState<GeoFeature | null>(null);

  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const municipiosLayerRef = useRef<L.GeoJSON | null>(null);

  const allStatesFeatures = useMemo<GeoFeature[]>(
    () => Object.values(regioesGeoJson).flatMap((r) => r.features as GeoFeature[]),
    []
  );


  useEffect(() => {
    if (map) setTimeout(() => map.invalidateSize(), 500);
  }, [map, selectedRegion, selectedState]);

 
  useEffect(() => {
    if (!map) return;

    if (selectedState) {
      const targetStateFeature = allStatesFeatures.find(
        (f) => f.properties.codarea === selectedState
      );
      if (targetStateFeature) {
        const bounds = L.geoJSON(targetStateFeature).getBounds();
        if (bounds.isValid()) {
          map.flyToBounds(bounds, { padding: [50, 50], duration: 1.0 });
        }
      }
    } 
    else if (selectedRegion && geoJsonLayerRef.current) {
      const bounds = geoJsonLayerRef.current.getBounds();
      if (bounds.isValid()) {
        map.flyToBounds(bounds, { padding: [50, 50], duration: 1.0 });
      }
    } 
    else {
      map.flyTo(INITIAL_VIEW.center, INITIAL_VIEW.zoom, { duration: 1.0 });
    }
  }, [selectedRegion, selectedState, map, allStatesFeatures]);

  useEffect(() => {
    if (selectedState) {
      const codigoUF = selectedState;
      if (codigoUF === '53') {
        setMunicipiosGeoJSON(null); 
        setMunicipiosData(null);     
        return;
      }
      const nomeDoArquivo = `geojs-${codigoUF}-mun`;
      import(`../../data/municipios/${nomeDoArquivo}.json`)
        .then((module) => {
          const data = module.default || module;
          setMunicipiosGeoJSON(data); 
          setMunicipiosData(data);      
        })
        .catch((_err) => {
          setMunicipiosGeoJSON(null); 
          setMunicipiosData(null);     
        });
    } else {
      setMunicipiosGeoJSON(null); 
      setMunicipiosData(null);     
    }
  }, [selectedState, setMunicipiosData]); 

  const statesStyle = (feature?: GeoFeature) => {
    if (!feature) return {};
    let fillColor = '#134611'; 
    const highlightColor = '#3DA35D'; 

    if (selectedState && feature.properties.codarea === selectedState) {
       return { fillColor: highlightColor, weight: 1, color: 'white', fillOpacity: 1 };
    }

    if (hoveredObject) {
      if (selectedRegion) {
        if (hoveredObject.properties.codarea === feature.properties.codarea)
          fillColor = highlightColor;
      } else {
        if (hoveredObject.properties.regiao === feature.properties.regiao)
          fillColor = highlightColor;
      }
    }
    return { fillColor, weight: 1, color: 'white', fillOpacity: 1 };
  };

  
  const onEachStateFeature = (feature: GeoFeature, layer: Layer) => {
    const regiaoDoEstado = feature.properties.regiao || 'Região';
    
    
    const codigo = feature.properties.codarea;
    const nomeDoEstado = (codigo && CODIGO_PARA_ESTADO[codigo]) 
      || feature.properties.nome 
      || feature.properties.name 
      || 'Estado';

    const tooltipContent = selectedRegion
      ? nomeDoEstado 
      : regiaoDoEstado.charAt(0).toUpperCase() + regiaoDoEstado.slice(1);

    layer.bindTooltip(tooltipContent, { sticky: true });

    layer.on({
      mouseover: () => setHoveredObject(feature),
      mouseout: () => setHoveredObject(null),
      click: () => { 
        if (!selectedRegion) {
          const regiao = feature.properties.regiao?.toLowerCase() || null;
          setSelectedRegion(regiao);
        } else if (!selectedState) {
          setSelectedState(feature.properties.codarea || null);
        }
      },
    });
  };

  const municipiosStyle = (feature?: GeoFeature) => {
    if (!feature) return {};
    const nome = feature.properties?.name?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const nomeBusca = searchedMunicipioName
      ? searchedMunicipioName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      : null;
    const isHovered = hoveredMunicipio?.properties.id === feature.properties.id;

    if (nomeBusca && nome === nomeBusca) {
      return { weight: 2.5, color: '#E8FCCF', fillColor: '#3DA35D', fillOpacity: 1 };
    }
    if (isHovered) {
      return { weight: 2, color: '#E8FCCF', fillColor: '#3DA35D', fillOpacity: 1 };
    }
    return { weight: 1, color: 'white', fillColor: '#134611', fillOpacity: 1 };
  };

  const onEachMunicipioFeature = (feature: GeoFeature, layer: Layer) => {
    const municipioName = feature.properties.name || feature.properties.nome || 'Nome não disponível';
    layer.bindTooltip(municipioName, { sticky: true });

    layer.on({
      mouseover: (event: any) => {
        setHoveredMunicipio(feature);
        event.target.setStyle({ weight: 2, color: '#E8FCCF', fillColor: '#3DA35D', fillOpacity: 1 });
      },
      mouseout: (event: any) => {
        setHoveredMunicipio(null);
        event.target.setStyle(municipiosStyle(feature));
      },
    });
  };

  const dataForStatesLayer = useMemo(() => {
    if (selectedState) {
      const stateFeature = allStatesFeatures.find((f) => f.properties.codarea === selectedState);
      return stateFeature
        ? { type: 'FeatureCollection', features: [stateFeature] }
        : { type: 'FeatureCollection', features: [] };
    }
    if (selectedRegion) {
      return (
        regioesGeoJson[selectedRegion as keyof typeof regioesGeoJson] || {
          type: 'FeatureCollection',
          features: [],
        }
      );
    }
    return { type: 'FeatureCollection', features: allStatesFeatures };
  }, [selectedRegion, selectedState, allStatesFeatures]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer
        center={INITIAL_VIEW.center}
        zoom={INITIAL_VIEW.zoom}
        style={{ height: '100%', width: '100%', backgroundColor: '#fff' }}
        ref={setMap}
        zoomControl={false}
        attributionControl={false}
      >
        <GeoJSON
          ref={geoJsonLayerRef}
          key={`${selectedRegion || 'brasil'}-${selectedState || 'none'}`}
          data={dataForStatesLayer as any}
          style={statesStyle}
          onEachFeature={onEachStateFeature} 
        />

        {municipiosGeoJSON && (
          <GeoJSON
            ref={municipiosLayerRef}
            key={selectedState}
            data={municipiosGeoJSON as any}
            style={municipiosStyle}
            onEachFeature={onEachMunicipioFeature}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapaInterativo;