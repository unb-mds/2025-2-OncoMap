---
title: "Guia de Instalação"
subtitulo: "Como configurar e rodar o projeto OncoMap localmente"
draft: false
layout: "embed" 

blocos_de_texto:
  - titulo: "Pré-requisitos"
    texto: |
      Antes de começar, certifique-se de ter instalado em sua máquina:
      - [Docker](https://www.docker.com/) e Docker Compose.
      - [Git](https://git-scm.com/).
      - Uma chave de API do **Google AI Studio** (Gemini).

  - titulo: "1. Clonar o Repositório"
    texto: |
      Primeiro, baixe o código fonte para sua máquina:
      
      ```bash
      git clone [https://github.com/unb-mds/2025-2-OncoMap.git](https://github.com/unb-mds/2025-2-OncoMap.git)
      cd 2025-2-OncoMap
      ```

  - titulo: "2. Configurar Variáveis de Ambiente"
    texto: |
      Crie um arquivo chamado `.env` dentro da pasta `Oncomap/backend/` e cole o seguinte conteúdo (ajuste com seus dados):

      ```properties
      PORT=3001
      
      # Conexão com o Banco (Supabase - Pooler URL para compatibilidade IPv4)
      DATABASE_URL=postgres://usuario:senha@host-pooler:6543/postgres
      
      # Inteligência Artificial
      GEMINI_API_KEY=sua_chave_gemini_aqui
      
      # (Opcional) Chaves extras para evitar rate-limit
      GEMINI_API_KEYS=chave1,chave2,chave3
      ```

  - titulo: "3. Instalar Dependências e Rodar"
    texto: |
      Na raiz do projeto (onde está o `docker-compose.yml`), execute o comando para instalar as dependências locais (caso necessário pelos scripts) e subir os containers:

      ```bash
      npm run install:all
      docker-compose up --build
      ```

  - titulo: "4. Acessar a Aplicação"
    texto: |
      Após os containers subirem, acesse:
      - **Frontend (Aplicação):** [http://localhost:3000](http://localhost:3000)
      - **Backend (API Health Check):** [http://localhost:3001/api/health](http://localhost:3001/api/health)

---