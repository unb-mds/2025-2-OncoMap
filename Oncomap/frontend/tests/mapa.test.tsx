import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MapaInterativo from '../src/components/MapaPage/mapa';

// Mock do CSS
vi.mock('leaflet/dist/leaflet.css', () => ({}));

// Mock do React-Leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
  GeoJSON: ({ data }: { data: { features: unknown[] } }) => (
    <div data-testid="geojson-layer">
      {data?.features ? `Layer com ${data.features.length} features` : 'Layer Vazia'}
    </div>
  ),
  useMap: () => ({ fitBounds: vi.fn(), flyTo: vi.fn() }),
}));

// Mock do Leaflet Core
vi.mock('leaflet', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    geoJSON: () => ({
      getBounds: () => ({
        isValid: () => true,
        getCenter: () => [0, 0]
      })
    })
  };
});

describe('Componente MapaInterativo', () => {
  const defaultProps = {
    selectedRegion: null,
    setSelectedRegion: vi.fn(),
    selectedState: null,
    setSelectedState: vi.fn(),
    setMunicipiosData: vi.fn(),
    searchedMunicipioName: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o container do mapa e a camada inicial de estados', () => {
    render(<MapaInterativo {...defaultProps} />);

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    
    const layers = screen.getAllByTestId('geojson-layer');
    expect(layers.length).toBeGreaterThan(0);
    expect(screen.getByText(/Layer com/i)).toBeInTheDocument();
  });

  it('deve filtrar para uma região específica quando selectedRegion muda', () => {
    render(<MapaInterativo {...defaultProps} selectedRegion="sudeste" />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByText(/Layer com/i)).toBeInTheDocument();
  });

  it('deve tentar carregar municípios quando um estado é selecionado', async () => {
    render(<MapaInterativo {...defaultProps} selectedState="35" />);
    
    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });
});