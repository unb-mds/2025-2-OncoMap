
export interface HealthResponse {
  message: string;
}

export interface Investimento {
  nome: string;
  valor: string;
  codarea_municipio?: string; 
}

export interface MunicipioComInvestimentos {
  codarea: string;
  nome: string;
  uf?: string;
  investimentos: Investimento[];
}

export interface DadosRegiao {
  regiao: string;
  investimentosGerais: Investimento[];
  municipios: MunicipioComInvestimentos[];
}

export interface MencaoDetalhada {
  date: string;
  value: number;
  url: string;
  details: string[];
}

export interface CategoriasInvestimento {
  medicamentos: number;
  equipamentos: number;
  obras_infraestrutura: number;
  servicos_saude: number;
  outros_relacionados: number;
  estadia_paciente: number;
  [key: string]: number;
}

export interface DetalhesMunicipio {
  name: string;
  uf: string;
  ibge: string;
  total_invested: number;
  categories: CategoriasInvestimento;
  recent_mentions: MencaoDetalhada[];
}

export interface DetalhesEstado {
  uf: string;
  ibge: string;
  name: string;
  total_invested: number;
  categories: CategoriasInvestimento; 
}