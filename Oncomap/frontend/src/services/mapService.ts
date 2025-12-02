import api from './api'; 
import type { HealthResponse, DadosRegiao, DetalhesMunicipio } from '../types/apiTypes';

export interface DetalhesEstado {
  uf: string;
  ibge: string;
  name: string;
  total_invested: number;
  categories: any; 
}

export const mapService = {
  
  checkHealth: async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>('/api/health');
    return response.data;
  },

  getDadosRegiao: async (codRegiao: string): Promise<DadosRegiao> => {
    const regiaoSlug = codRegiao.toLowerCase().trim();
    const response = await api.get<DadosRegiao>(`/api/v1/map/regiao/${regiaoSlug}`);
    return response.data;
  },

  getDetalhesMunicipio: async (ibge: string): Promise<DetalhesMunicipio> => {
    const response = await api.get<DetalhesMunicipio>(`/api/v1/map/municipio/${ibge}`);
    return response.data;
  },


  getDetalhesEstado: async (codIbge: string): Promise<DetalhesEstado> => {
    const response = await api.get<DetalhesEstado>(`/api/v1/map/estado/${codIbge}`);
    return response.data;
  }
};