# 🩺 OncoMap - Transparência em Saúde Oncológica

![Versão](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/Status-Concluído-green)
![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)
![GitHub license](https://img.shields.io/github/license/unb-mds/2025-2-OncoMap)

> **Transformando diários oficiais em dados acessíveis sobre o investimento no combate ao câncer.**

O **OncoMap** é uma plataforma de inteligência de dados que monitora, extrai e visualiza os investimentos públicos municipais destinados à oncologia no Brasil.

A partir da integração com o projeto **Querido Diário**, nossa aplicação utiliza **Inteligência Artificial Generativa (Google Gemini)** para ler documentos burocráticos (PDFs e textos de licitações), extrair valores monetários e categorizar gastos, transformando dados não estruturados em *insights* claros para a sociedade.

---

## 📝 Sumário
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [Como Rodar o Projeto (Docker)](#-como-rodar-o-projeto-docker)
- [Pipeline de Dados e IA](#-pipeline-de-dados-e-ia)
- [Testes e Qualidade](#-testes-e-qualidade)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Equipe](#-equipe)

---

## 🚀 Funcionalidades

* **🗺️ Mapa Interativo:** Visualização em mapa interativo dos investimentos por estado e município.
* **📊 Tabela com dados:** Detalhamento dos gastos por categorias (Medicamentos, Equipamentos, Obras, Serviços...).
* **📄 Relatórios Inteligentes:** Geração automática de PDFs com análises textuais e financeiras criadas por IA sobre o cenário de cada região.
* **🔍 Transparência Ativa:** Link direto para o documento original (PDF do Diário Oficial) de cada despesa.

---

## ✔️ Tecnologias Utilizadas

| Camada | Tecnologias |
| :--- | :---------------------------------------------------------------------------------------------------------- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) |
| **Backend** | ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-404D59?style=flat) ![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=flat&logo=puppeteer&logoColor=white) |
| **Dados & IA** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) ![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat&logo=googlebard&logoColor=white) |
| **DevOps & QA** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) ![Jest](https://img.shields.io/badge/Jest-323330?style=flat&logo=Jest&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white) |

---

## 🛠 Como Rodar o Projeto (Docker)

A maneira mais fácil de rodar a aplicação completa é utilizando **Docker Compose**.

### Pré-requisitos
* [Docker](https://www.docker.com/) instalado.
* Uma chave de API do [Google AI Studio](https://aistudio.google.com/).

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/unb-mds/2025-2-OncoMap.git](https://github.com/unb-mds/2025-2-OncoMap.git)
    cd 2025-2-OncoMap
    ```

2. **Instale as dependências:**
    ```bash
    npm run install:all
    ```

3.  **Configure o Backend:**
    Crie um arquivo `.env` dentro da pasta `Oncomap/backend/` com o seguinte conteúdo:
    ```ini
    PORT=3001
    
    # Conexão com o Banco (Supabase - Pooler URL para compatibilidade IPv4)
    # Formato: postgres://usuario:[senha]@host-pooler:6543/postgres
    DATABASE_URL=sua_string_de_conexao_aqui
    
    # Inteligência Artificial
    GEMINI_API_KEY=sua_chave_gemini_aqui
    # (Opcional) Chaves extras para evitar rate-limit
    GEMINI_API_KEYS=chave1,chave2,chave3
    ```

4.  **Suba os containers:**
    Na raiz do projeto (onde está o `docker-compose.yml`), execute:
    ```bash
    docker-compose up --build
    ```

5.  **Acesse a aplicação:**
    * **Frontend:** [http://localhost:3000](http://localhost:3000)
    * **API (Backend):** [http://localhost:3001/api/health](http://localhost:3001/api/health)

---

## ⚙️ Pipeline de Dados e IA

O coração do OncoMap são os scripts de ETL (Extração, Transformação e Carga) que rodam em segundo plano para popular o banco de dados.

1.  **Coleta (`collector.js`):** Busca diários na API externa filtrando por palavras-chave (oncologia, quimioterapia, etc.) e salva os metadados.
2.  **Enriquecimento PDF (`enrichment_pdf.js`):** Baixa o PDF oficial, extrai o texto completo e usa o **Gemini 2.0 Flash-lite** para identificar valores e empresas contratadas.
3.  **Enriquecimento TXT (`enrichment_txt.js`):** Atua como *fallback*. Se o PDF falhar, analisa o texto bruto disponível para garantir 100% de cobertura.

*Para rodar os scripts manualmente (fora do Docker):*
```bash
cd Oncomap/backend
node src/scripts/enrichment_pdf.js 1 1000  # Processa do ID 1 ao 1000
```

---
## ✅ Testes e Qualidade
O projeto possui uma suíte de testes automatizados para garantir a estabilidade do backend.

* Cobertura atual: >90% (Controllers, Reports e Utils).

* Rodar testes:

```bash
cd Oncomap/backend
npm test
```
---

## 📁 Estrutura do Projeto
```Plaintext
.
└── 2025-2-OncoMap/
    ├── .github/workflows/           # CI/CD (Pipeline Mensal)
    ├── Oncomap/
    │   ├── backend/
    │   │   ├── src/
    │   │   │   ├── api/             # Controllers e Rotas (Express)
    │   │   │   ├── config/          # Configuração de Banco e Env
    │   │   │   ├── scripts/         # Pipeline de Dados (Coleta + IA)
    │   │   │   ├── tests/           # Testes Unitários (Jest)
    │   │   │   └── utils/           # Funções auxiliares
    │   │   ├── Dockerfile
    │   │   └── server.js
    │   └── frontend/                # Aplicação React + Vite
    │   │   ├── src/
    │   │   └── Dockerfile
    ├── docker-compose.yml           # Orquestração dos containers
    └── README.md
```
---

## 👥 Equipe
| [![Felype Carrijo](https://avatars.githubusercontent.com/u/168106790?v=4)](https://github.com/Flyxs) | [![Giovani Coelho](https://avatars.githubusercontent.com/u/176083022?v=4)](https://github.com/Gotc2607) | [![Artur Galdino](https://avatars.githubusercontent.com/u/187340217?v=4)](https://github.com/ArturFGaldino) | [![Luiz](https://avatars.githubusercontent.com/u/212640680?v=4)](https://github.com/Luizz97) | [![João Pedro](https://avatars.githubusercontent.com/u/178330046?v=4)](https://github.com/joaoPedro-201) | [![Gabriel Alexandroni](https://avatars.githubusercontent.com/u/170197026?v=4)](https://github.com/Alexandroni07) |
|:-------------------------------------------------------------:|:-----------------------------------------------------------:|:-----------------------------------------------------------:|:-----------------------------------------------------------:|:-------------------------------------------------------------:|:-------------------------------------------------------------:|
| [Felype Carrijo](https://github.com/Flyxs) | [Giovani Coelho](https://github.com/Gotc2607) | [Artur Galdino](https://github.com/ArturFGaldino) | [Luiz](https://github.com/Luizz97) | [João Pedro](https://github.com/joaoPedro-201) | [Gabriel Alexandroni](https://github.com/Alexandroni07) |

---

## 🎨 Documentação Extra
A documentação de suporte ao projeto, incluindo protótipos e o mapeamento de histórias de usuário, pode ser encontrada nos links abaixo.

- **Story Map:** [Acessar o Story Map no Figma](https://www.figma.com/board/8Jsltq8BOL65CsMoRWFjik/Template-MDS--Copy-?node-id=0-1&p=f&t=qNEzS63nFVyC3kB9-0)
- **Protótipo de Alta Fidelidade:** [Acessar no Figma](https://www.figma.com/design/XyUsffocEKRw7przVsbk0n/Pagina-do-projeto?node-id=0-1&p=f&t=NCglUxCaxCXUAbg9-0)
