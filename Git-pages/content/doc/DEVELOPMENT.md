---
title: "Development"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

#  Documentação de Desenvolvimento - OncoMap

Este documento serve como guia técnico para desenvolvedores que desejam manter, evoluir ou entender a arquitetura do OncoMap.

##  Dependências e Versões

Para garantir a compatibilidade e execução correta dos scripts (especialmente o Puppeteer e a IA), utilize as versões abaixo:

* **Node.js:** `v20.x` (LTS) ou superior.
* **NPM:** `v10.x` ou superior.
* **Docker:** Recomendado para rodar o banco de dados localmente ou isolar o ambiente de execução.
* **Puppeteer:** `v21+` (Já incluso no `package.json`, requer bibliotecas Linux se rodado fora do Docker).
* **Banco de Dados:** PostgreSQL (via Supabase).

---

##  Guia de Instalação

A raiz contém scripts que gerenciam tanto o `backend` quanto o `frontend`.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/unb-mds/2025-2-OncoMap.git](https://github.com/unb-mds/2025-2-OncoMap.git)
    cd 2025-2-OncoMap
    ```

2.  **Instale todas as dependências (Raiz, Back e Front):**
    ```bash
    npm run install:all
    ```
    *Este comando executará automaticamente a instalação nas subpastas `Oncomap/backend` e `Oncomap/frontend`.*

---

##  Configuração do Ambiente (.env)

O sistema não funcionará sem as chaves de API. Você deve configurar as variáveis de ambiente na pasta do backend.

1.  Navegue até o backend: `cd Oncomap/backend`
2.  Duplique o arquivo de exemplo: `cp .env.example .env`
3.  Preencha as variáveis:

| Variável | Descrição | Onde obter |
| :--- | :--- | :--- |
| `DATABASE_URL` | Conexão direta Postgres | Supabase > Settings > Database |
| `QUERIDO_DIARIO_API_URL` | Link da API do Querido Diário | Querido Diário |
| `GROQ_API_KEY` | Chave para usar modelos Llama/Mixtral | Groq Console |
| `GEMINI_API_KEYS` | Chaves da IA do Google | Google AI Studio |
| `GEMINI_API_KEY` | Chave da IA do Google | Google AI Studio |

---

##  Scripts Disponíveis

Na raiz do projeto (`2025-2-OncoMap/`), você pode executar:

### Desenvolvimento
* `npm run dev`: Inicia o **Backend** e o **Frontend** simultaneamente (usando `concurrently`).
    * Backend roda na porta `3001`.
    * Frontend roda na porta `3000`.
* `npm run docker:up`: Sobe o ambiente completo usando Docker Compose.

### Scripts de Coleta e Análise (Backend)
Para rodar scripts específicos de ETL (Extração, Transformação e Carga), navegue até `Oncomap/backend` e use:

####  Automação Mensal (Pipeline Principal)
* **`npm run db:collect:monthly`**
    * **Arquivo:** `src/scripts/monthly_collector.js`
    * **Função:** Busca novos diários dos últimos 30-45 dias na API do Querido Diário e salva no banco.
* **`npm run db:enrich:pdf`**
    * **Arquivo:** `src/scripts/enrichment_pdf.js`
    * **Função:** Processa menções pendentes baixando e lendo o PDF original via Gemini.
* **`npm run db:enrich:txt`**
    * **Arquivo:** `src/scripts/enrichment_txt.js`
    * **Função:** Fallback. Processa menções que o PDF falhou, usando o texto puro ou chunks.

####  Configuração e Carga Histórica (Manutenção)
* **`npm run db:setup`**
    * **Arquivo:** `src/scripts/setup_municipalities.js`
    * **Função:** Popula a tabela de municípios com dados do IBGE (executar apenas na primeira vez).
* **`npm run db:collect`**
    * **Arquivo:** `src/scripts/collector.js`
    * **Função:** Coletor Histórico. Busca dados antigos desde 2022 (ideal para popular o banco do zero).
* **`npm run db:enrich`** (ou `db:enrichment`)
    * **Arquivo:** `src/scripts/enrichment.js`
    * **Função:** Script de enriquecimento legado/geral (pode ser usado para testes manuais).

####  Utilitários de Correção
* **`npm run db:update-txt`**
    * **Arquivo:** `src/scripts/update_txt_urls.js`
    * **Função:** Varre o banco buscando menções sem URL de texto e tenta encontrar na API.
* **`npm run db:fill-txt`**
    * **Arquivo:** `src/scripts/fill_txt_data.js` (ou `fill_missing_txt_urls.js`)
    * **Função:** Preenche dados faltantes de texto em registros específicos.

### Testes e Qualidade de Código
O projeto utiliza o framework **Jest** para garantir a estabilidade do backend. Para executar os testes, navegue até `Oncomap/backend` e utilize:

* **`npm test`**
    * **Função:** Executa todos os testes unitários e de integração uma única vez. Ideal para CI/CD ou verificação rápida antes de um commit.
* **`npm run test:watch`**
    * **Função:** Modo interativo (Watch Mode). O Jest fica rodando e re-executa os testes automaticamente sempre que você salva uma alteração em um arquivo. Recomendado durante o desenvolvimento ativo.
* **`npm run test:coverage`**
    * **Função:** Executa os testes e gera um relatório de cobertura de código (Code Coverage). Cria uma pasta `coverage/` na raiz com detalhes de quais linhas de código foram testadas e quais não foram.

---

---

##  Pipeline CI/CD (Automação)

A atualização dos dados do OncoMap é **100% automatizada** via GitHub Actions.

**Arquivo:** `.github/workflows/pipeline_mensal.yml`

### Funcionamento:
1.  **Gatilho (Trigger):**
    * Agendado (`cron`): Roda automaticamente às 05:00 UTC do dia 1º de cada mês.
    * Manual (`workflow_dispatch`): Pode ser acionado na aba "Actions" do GitHub.

2.  **Fluxo de Execução:**
    * **Etapa 1 (Setup):** Instala Node.js e dependências.
    * **Etapa 2 (Coleta):** Executa `monthly_collector.js` para buscar novos dados na API externa. Utiliza Puppeteer para contornar bloqueios de segurança (403 Forbidden).
    * **Etapa 3 (Enriquecimento Primário):** Executa `enrichment_pdf.js` para classificar gastos oncológicos.
    * **Etapa 4 (Enriquecimento Secundário):** Executa `enrichment_txt.js` para recuperar falhas da etapa anterior.

3.  **Segredos:**
    * O pipeline utiliza `Repository Secrets` do GitHub (`DATABASE_URL`, `GEMINI_API_KEYS`, etc.) para rodar com segurança na nuvem.

---

##  Integrações Externas

O OncoMap atua como um agregador e processador de dados de múltiplas fontes:

### 1. Querido Diário (Open Knowledge Brasil)
* **Tipo:** Fonte de Dados Pública.
* **Uso:** Utilizamos a API de Gazetas (`/api/gazettes`) para buscar diários oficiais municipais.
* **Detalhe Técnico:** Devido a bloqueios de WAF (Web Application Firewall) em data centers, a coleta é feita simulando um navegador real via **Puppeteer**.

### 2. Google Gemini (Google AI)
* **Tipo:** Processamento de Linguagem Natural (LLM).
* **Modelo:** `gemini-2.0-flash-lite` (ou superior).
* **Uso:**
    * Lê o texto cru dos diários.
    * Identifica valores monetários (R$).
    * Categoriza o gasto (Medicamentos, Obras, Serviços, etc.).
    * Retorna um JSON estruturado para o banco.

### 3. Supabase
* **Tipo:** Backend-as-a-Service (PostgreSQL + Storage).
* **Uso:**
    * **Database:** Armazena metadados dos diários e o resultado JSON da análise.
    * **Storage:** Armazena os relatórios PDF gerados (Bucket: `relatorios-oncologicos`).

### 4. Groq 
* **Tipo:** Plataforma de Inferência de IA (LPU - Language Processing Unit).
* **Modelos Suportados:** Llama 3, Mixtral 8x7b, Gemma.
* **Uso no Projeto:**
    * Serve como uma alternativa de **baixa latência** ao Gemini para processamento de texto.
    * Útil para testes rápidos de prompts ou quando a cota do Gemini é atingida.
    * Requer a instalação do SDK `groq-sdk` e a configuração da `GROQ_API_KEY`.
* **Diferencial:** Processa tokens centenas de vezes mais rápido que modelos tradicionais, ideal para tarefas que exigem resposta em tempo real.
