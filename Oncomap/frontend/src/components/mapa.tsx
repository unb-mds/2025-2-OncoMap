import React, { useState, useCallback, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import type { Feature, Geometry } from 'geojson';
import type { MapViewState, PickingInfo } from '@deck.gl/core';
import { GeoJsonLayer } from '@deck.gl/layers';
import StaticMap from 'react-map-gl';
import { regioesGeoJson } from '../data/regioes';

// --- DEFINIÇÃO DE TIPOS ---

interface EstadoProperties {
  codarea: string;
  regiao?: string;
  centroide?: [number, number];
  [key: string]: any;
}

// E aqui criamos o tipo Feature com essas propriedades:
type EstadoFeature = Feature<Geometry, EstadoProperties>;


const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -54,
  latitude: -15,
  zoom: 3.5,
  pitch: 30,
  bearing: 0,
};

const REGION_CENTERS: Record<string, Partial<MapViewState>> = {
  norte: { longitude: -60, latitude: -5, zoom: 4.5 },
  nordeste: { longitude: -42, latitude: -8, zoom: 4.8 },
  centroOeste: { longitude: -54, latitude: -15, zoom: 4.8 },
  sudeste: { longitude: -45, latitude: -21, zoom: 5.2 },
  sul: { longitude: -52, latitude: -28, zoom: 5.2 },
};

const MapaInterativo3D: React.FC = () => {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<EstadoFeature | null>(null);

  const allStatesFeatures = useMemo<EstadoFeature[]>(
    () => Object.values(regioesGeoJson).flatMap(region => region.features as EstadoFeature[]),
    []
  );

  const resetView = useCallback(() => {
    setSelectedRegion(null);
    setViewState(vs => ({ ...vs, ...INITIAL_VIEW_STATE, transitionDuration: 1000 }));
  }, []);

  const handleRegionClick = useCallback((regionKey: string) => {
    setSelectedRegion(regionKey);
    setViewState(currentViewState => ({
      ...currentViewState,
      ...REGION_CENTERS[regionKey],
      pitch: 45,
      transitionDuration: 1000,
    }));
  }, []);

  const handleStateClick = useCallback((feature: EstadoFeature) => {
    const [lon, lat] = feature.properties.centroide || [-54, -15];
    setViewState(currentViewState => ({
      ...currentViewState,
      longitude: lon,
      latitude: lat,
      zoom: 7,
      transitionDuration: 1000,
    }));
  }, []);

  const layers = [
    new GeoJsonLayer<EstadoProperties>({
      id: 'geojson-layer',
      data: selectedRegion
        ? (regioesGeoJson[selectedRegion].features as EstadoFeature[])
        : allStatesFeatures,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: true,
      lineWidthMinPixels: 1,

      
      getFillColor: (f: Feature<Geometry, EstadoProperties>) =>
        hoveredState?.properties.codarea === f.properties.codarea
          ? [255, 140, 0, 150]
          : [80, 120, 150, 100],

      getLineColor: [255, 255, 255],
      getElevation: 10000,
      updateTriggers: {
        getFillColor: [hoveredState],
      },
      onHover: (info: PickingInfo<EstadoFeature>) => setHoveredState(info.object || null),
      onClick: (info: PickingInfo<EstadoFeature>) => {
        if (!info.object) return;

        if (!selectedRegion) {
          const clickedRegionKey = info.object.properties.regiao;
          if (clickedRegionKey) {
            handleRegionClick(clickedRegionKey);
          }
        } else {
          handleStateClick(info.object);
        }
      },
    }),
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {selectedRegion && (
        <button
          onClick={resetView}
          style={{
            position: 'absolute', top: '20px', left: '20px', zIndex: 1,
            padding: '10px', cursor: 'pointer',
          }}
        >
          Ver Brasil
        </button>
      )}
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState as MapViewState)}
      >
        <StaticMap
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/light-v10"
        />
      </DeckGL>
    </div>
  );
};

export default MapaInterativo3D;
