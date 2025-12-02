# Documentação de Arquitetura do Projeto (OncoMap)

Este documento detalha as decisões técnicas, a estrutura de código, o esquema de dados e o fluxo de inteligência artificial do sistema.

---

## 1. Visão Geral do Sistema (System Context)
O **OncoMap** é uma plataforma de inteligência de dados que monitora e visualiza investimentos públicos em oncologia e saúde. O sistema coleta menções em diários oficiais, categoriza os gastos via IA e permite a geração de relatórios de auditoria automatizados.

**Arquitetura de Alto Nível:**
* **Frontend:** SPA em React focada em visualização geoespacial interativa.
* **Backend:** API RESTful em Node.js que orquestra banco de dados, IA (Gemini) e geração de documentos (PDF).

---

## 2. Arquitetura Frontend

### 2.1. Stack Tecnológica
| Tecnologia | Versão | Função |
| :--- | :--- | :--- |
| **React** | ^19.0 | Biblioteca de UI principal. |
| **Vite** | ^7.0 | Build tool de alta performance. |
| **React Router** | ^7.0 | Gerenciamento de rotas e navegação. |
| **Deck.gl** | ^9.0 | Renderização de mapas e camadas de dados massivos. |

### 2.2. Estrutura de Diretórios

```text
frontend/src/
├── assets/          # Imagens e ícones estáticos
├── components/      # Componentes React
│   ├── Geral/       # UI Kit (Botões, Navbars, Loaders)
│   ├── HomePage/    # Componentes da Landing Page/Dashboard inicial
│   └── MapaPage/    # Mapas, Tooltips e Layers do Deck.gl
├── data/            # Arquivos estáticos (GeoJSONs)
├── pages/           # Vistas (Views)
│   ├── HomePage.tsx # Rota "/"
│   └── MapaPage.tsx # Rota "/mapa"
├── style/           # CSS Modules e estilos globais
├── App.tsx          # Definição de Rotas (Router)
└── main.tsx         # Entry Point
```

## 3. Arquitetura Backend

### 3.1. Stack Tecnológica

| Tecnologia | Versão | Função |
| :--- | :--- | :--- |
| **Node.js** | 18+ | Runtime. |
| **Express** | ^5.0 | Framework de API. |
| **PostgreSQL** | ^8.16 | Banco de dados relacional (Hospedado no Supabase). |
| **Google Gen AI** | ^0.24 | Modelo `gemini-2.0-flash-lite` para análise de contexto. |
| **Puppeteer** | - | Via `html-pdf-node` para renderização de PDFs. |

### 3.2. Estrutura de Diretórios

O backend segue uma estrutura que separa a API, configurações e utilitários.
Plaintext

```text
backend/src/
├── api/
│   ├── controllers/ # Lógica de controle e regras de negócio
│   └── routes/      # Definição de endpoints específicos da API
├── config/          # Configurações de ambiente e banco de dados
├── data/            # Arquivos temporários de dados
├── database/        # Migrations e seeders do Sequelize
├── mocks/           # Dados falsos para testes
├── routes/          # Rotas principais ou globais da aplicação
├── scripts/         # Scripts de automação
├── testscripts/     # Scripts auxiliares de teste
├── utils/           # Funções utilitárias (Helpers)
├── app.js           # Configuração dos middlewares do Express
└── server.js        # Inicialização do servidor HTTP
```

### 3.3. Modelo de Dados (Database Schema)

O sistema baseia-se em uma tabela central de fatos chamada `mentions`. As queries SQL nos controllers indicam a seguinte estrutura:

**Tabela: `mentions`**

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | SERIAL | Identificador único. |
| `municipality_ibge_code` | VARCHAR | Código IBGE do município (ex: '3550308'). |
| `municipality_name` | VARCHAR | Nome do município. |
| `state_uf` | CHAR(2) | Sigla do Estado (ex: 'SP'). |
| `publication_date` | DATE | Data da publicação no diário oficial. |
| `source_url` | TEXT | Link para a fonte original. |
| `final_extracted_value` | NUMERIC | Valor monetário final validado. |
| `extracted_value` | NUMERIC | Valor extraído (fallback). |
| `extracted_value_txt` | NUMERIC | Valor extraído via texto (fallback secundário). |
| `gemini_analysis` | JSONB | Objeto com categorização (medicamentos, obras, etc). |
| `gemini_analysis_txt` | JSONB | Objeto de análise secundária. |

### 3.4. API Endpoints (Definição de Rotas)

#### 🗺️ Mapas & Visualização (mapRoutes.js)

`GET /api/map/regiao/:regiaoSlug` - Agrega dados de investimento por macro-região.

`GET /api/map/estado/:codIbge` - Detalhes consolidados de um estado via código IBGE.

`GET /api/map/municipio/:ibge` - Lista de investimentos e menções de um município específico.

#### 📊 Estatísticas (statsRoutes.js)

`GET /api/stats/general` - Visão macro de totais por Estado e Município.

`GET /api/stats/state/:uf` - Estatísticas específicas por sigla de UF (ex: 'SP').

`GET /api/stats/municipality/:ibge` - Detalhamento estatístico por IBGE.

#### 📄 Relatórios & IA (reportRoutes.js)

`GET /api/report/region/:regionName/pdf` - Gera PDF de auditoria regional via IA.

`GET /api/report/state/:uf/pdf` - Gera PDF de auditoria estadual via IA.

`GET /api/report/municipality/:ibge/pdf` - Gera PDF de auditoria municipal via IA.

## 4. Pipeline de Inteligência Artificial (AI Flow)

1. O sistema utiliza um fluxo avançado de RAG (Retrieval-Augmented Generation) para criar relatórios:

2. Agregação de Dados: O Backend executa queries SQL complexas para somar valores por ano e categoria.

3. Engenharia de Prompt: Os dados estruturados são inseridos em um prompt de contexto onde o Gemini atua como um "Auditor Sênior de Contas Públicas".

4. Geração de Conteúdo: O modelo gera uma análise HTML com tabelas, conclusões e diagnósticos financeiros.

5. Renderização de PDF: O HTML gerado é processado pelo html-pdf-node (Puppeteer headless) gerando um arquivo binário para download.

## 5. Setup e Execução

### Pré-requisitos
* Node.js v18+
* PostgreSQL (Local ou Supabase)
* Chave de API do Google Gemini (`GEMINI_API_KEY`) no arquivo `.env`

### Rodando o Backend
1. Entre na pasta: `cd backend`

2. Instale as dependências: `npm install`

3. Instale dependências do sistema (Linux/Puppeteer):
```bash
npm run setup
```
4. Inicialize o Banco de Dados (Essencial na 1ª vez):
```bash
npm run db:setup
```
5. Inicie o servidor: `npm run dev`

### Rodando o Frontend

1. Entre na pasta: 
```bash
cd frontend
```

2. Instale as dependências: 
```bash
npm install
```

3. Inicie o servidor:
```bash
npm run dev
```

4. O sistema estará acessível em: `http://localhost:3001`


