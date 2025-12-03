# Documentação de Arquitetura do Projeto (OncoMap)

Este documento centraliza as decisões técnicas, a estrutura de código, o
esquema de dados, o fluxo de inteligência artificial e as estratégias de
garantia de qualidade (QA) do sistema.

------------------------------------------------------------------------

## 1. Visão Geral do Sistema (System Context)

O **OncoMap** é uma plataforma de inteligência de dados que monitora e
visualiza investimentos públicos em oncologia. O sistema coleta menções
em diários oficiais (via API do **Querido Diário**), categoriza os
gastos via IA (Gemini/Groq) e permite a geração de relatórios de
auditoria automatizados.

**Arquitetura de Alto Nível:** \* **Frontend:** SPA em React focada em
visualização geoespacial interativa com Leaflet. \* **Backend:** API
RESTful que gerencia coleta de dados (ETL), processamento de arquivos e
integração com LLMs.

------------------------------------------------------------------------

## 2. Arquitetura Frontend

### 2.1. Stack Tecnológica

Baseado no `package.json`:

| Tecnologia      | Versão | Função / Decisão |
|-----------------|--------|------------------|
| **React**        | ^19.1 | Biblioteca de UI principal. |
| **Vite**         | ^7.1  | Build tool e servidor de desenvolvimento. |
| **TypeScript**   | ~5.8  | Tipagem estática para robustez. |
| **React Leaflet**| ^5.0  | **Mapas:** Renderização de mapas interativos (Substituindo Deck.gl). |
| **React Router** | ^7.9  | Roteamento declarativo no cliente. |
| **jsPDF**        | ^3.0  | Geração de relatórios PDF no navegador. |
| **Vitest**       | ^4.0  | Framework de testes automatizados. |

### 2.2. Estrutura de Diretórios (Logical View)

Organização modular baseada na estrutura atual:

    frontend/
    ├── src/
    │   ├── assets/          # Recursos estáticos globais
    │   ├── components/      # Biblioteca de Componentes de UI
    │   │   ├── Geral/       # Componentes reutilizáveis (Botões, Navbars)
    │   │   ├── HomePage/    # Componentes da Landing Page
    │   │   └── MapaPage/    # Componentes de visualização (Mapa Leaflet, Tabelas)
    │   ├── data/            # Mocks e arquivos estáticos (GeoJSONs)
    │   ├── pages/           # Vistas Principais (Route Handlers)
    │   ├── services/        # Camada de comunicação com API (Axios)
    │   ├── types/           # Definições de Tipos TypeScript globais
    │   ├── App.tsx          # Configuração de Rotas
    │   └── main.tsx         # Ponto de entrada (Entry Point)
    ├── tests/               # Testes Unitários e de Integração
    └── package.json

## 3. Arquitetura Backend

### 3.1. Stack Tecnológica

Baseado no DEVELOPMENT.md e package-lock.json:

| Tecnologia      | Versão | Função / Decisão |
|-----------------|--------|------------------|
| Node.js         | 20+    | Runtime JavaScript (LTS). |
| Express         | ^5.1   | Framework Web (API REST). |
| PostgreSQL      | ^8.16  | Banco de dados relacional (Supabase). |
| Sequelize       | ^6.37  | ORM para modelagem e migrations. |
| Google Gen AI   | ^0.24  | IA Principal: Modelo gemini-2.0-flash-lite. |
| Groq SDK        | -      | IA Secundária: Inferência rápida com Llama 3. |
| Puppeteer       | v21+   | Crawler para coleta de dados e geração de PDFs. |
| Jest            | -      | Framework de testes de backend. |


### 3.2. Estrutura de Diretórios

    backend/src/
    ├── api/
    │   ├── controllers/ # Regras de negócio (Report, Stats, Map)
    │   └── routes/      # Endpoints da API
    ├── config/          # Configurações (DB, Env)
    ├── database/        # Migrations e Seeders
    ├── mocks/           # Dados falsos para testes locais
    ├── scripts/         # Scripts de ETL (Coleta Mensal, Enriquecimento)
    ├── utils/           # Helpers e Parsers
    └── app.js           # Configuração do Express

### 3.3. Modelo de Dados (Database Schema)

Tabela central de fatos identificada no sistema:

**Tabela: mentions**

| Coluna                   | Tipo     | Descrição                                           |
|--------------------------|----------|-----------------------------------------------------|
| id                       | SERIAL   | Identificador único.                                |
| municipality_ibge_code   | VARCHAR  | Código IBGE do município.                           |
| municipality_name        | VARCHAR  | Nome do município.                                  |
| state_uf                 | CHAR(2)  | Sigla do Estado.                                    |
| publication_date         | DATE     | Data da publicação no diário oficial.               |
| source_url               | TEXT     | Link original do Diário Oficial.                    |
| final_extracted_value    | NUMERIC  | Valor monetário validado.                           |
| gemini_analysis          | JSONB    | Objeto com categorização (medicamentos, obras, etc) |


### 3.4. API Endpoints

**🗺️ Mapas & Visualização (`mapRoutes.js`)**

-   `GET /api/v1/map/regiao/:regiaoSlug` --- Agrega dados por
    macro-região.
-   `GET /api/v1/map/estado/:codIbge` --- Detalhes consolidados de um
    estado.
-   `GET /api/v1/map/municipio/:ibge` --- Lista de investimentos de um
    município.

**📄 Relatórios & IA (`reportRoutes.js`)**

-   `GET /api/report/region/:regionName/pdf` --- Gera PDF de auditoria
    regional via IA.
-   `GET /api/report/municipality/:ibge/pdf` --- Gera PDF de auditoria
    municipal via IA.

------------------------------------------------------------------------

## 4. Pipeline de Inteligência Artificial (AI Flow)

1.  **Coleta (ETL):** Scripts (`monthly_collector.js`) buscam diários na
    API do Querido Diário.\
2.  **Processamento:** O Backend baixa os PDFs e extrai o texto bruto.\
3.  **Enriquecimento:**
    -   O texto é enviado ao Gemini (ou Groq) com um prompt de "Auditor
        Público".\
    -   A IA extrai valores, categorias e gera resumos.\
4.  **Visualização:**\
    O dado estruturado é salvo no PostgreSQL e servido via API para o
    Mapa.

------------------------------------------------------------------------

## 5. Qualidade e Testes (Quality Assurance)

### Frontend (Vitest)

-   Foco: Serviços (`mapService`), Roteamento (`App`) e Integração
    (`MapaPage`).\
-   Cobertura: Monitorada via v8 (**Meta: \>60%** em componentes
    lógicos).

### Backend (Jest)

-   Foco: Controllers e Utilitários (`regionMap`, `statsController`).\
-   Cobertura: Monitorada via Jest Coverage (**Meta: \>85%** em
    controllers críticos).

### Ferramentas de Linting

-   **ESLint:** Configuração rigorosa para Node.js e React
    (`eslint.config.js`).\
-   **Regras:** Sem `any` implícito, sem variáveis não utilizadas, uso
    obrigatório de `async/await`.

------------------------------------------------------------------------

## 6. Setup e Execução

### Pré-requisitos

-   **Node.js:** v20.x (LTS) ou superior.\
-   **Banco de Dados:** PostgreSQL (Supabase).\
-   **Variáveis:** Arquivo `.env` configurado com `DATABASE_URL`,
    `GEMINI_API_KEY` e `QUERIDO_DIARIO_API_URL`.

### Instalação Rápida (Monorepo)

Na raiz do projeto, execute:

``` bash
npm run install:all
```

### Rodando o Backend

1.  Entre na pasta:

``` bash
cd backend
```

2.  Instalar as dependências:

``` bash
npm install
```

3.  Instale dependências do sistema (Linux/Puppeteer):

``` bash
npm run setup
```

3.  Inicie o servidor:

``` bash
npm run dev
```

### Rodando o Frontend

1.  Entre na pasta:

``` bash
cd frontend
```

2.  Instalar as dependências:

``` bash
npm install
```

3.  Inicie o servidor:

``` bash
npm run dev
```

Acesse em: **http://localhost:3001**
