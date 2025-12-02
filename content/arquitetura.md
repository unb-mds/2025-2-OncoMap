---
title: "Arquitetura"
subtitulo: "Documentação da Arquitetura do projeto OncoMap"
draft: false
layout: "embed"  # <-- Isso usa o layout 'embed.html'

#
# CORREÇÃO: Todo o 'blocos_de_texto' agora está DENTRO do Front Matter
#
blocos_de_texto:
  - titulo: "Arquitetura Lógica da Solução"
    texto: |
      A solução **OncoMap** segue um modelo de **Arquitetura em Camadas** (Tiered Architecture), separando a interface do usuário (Frontend) da lógica de negócios (Backend) e do armazenamento de dados (Banco de Dados).
      
      Abaixo está o diagrama de alto nível que ilustra a interação entre os principais componentes do sistema. 
      * **Frontend (Apresentação):** Responsável pela interface e experiência do usuário.
      * **Backend (Lógica de Negócios):** Servidor API RESTful que orquestra as regras de negócio e a persistência de dados.
      * **Banco de Dados (Persistência):** Armazena todas as informações clínicas e de usuário.
      

  - titulo: "Stack Tecnológico"
    texto: |
      As seguintes tecnologias foram escolhidas para compor o projeto, visando **desempenho, escalabilidade e facilidade de manutenção**:
      
      ### 🖥️ Frontend (Interface)
      
      ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) 
      ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) 
      ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
      
      ### ⚙️ Backend (API e Lógica)
      
      ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) 
      ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) 
      ![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white)
      
      ### 🗄️ Dados & IA
      
      ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) 
      ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) 
      ![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)
      
      ### 🛠️ DevOps & QA
      
      ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) 
      ![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white) 
      ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
      

  - titulo: "Estrutura de Componentes"
    texto: |
      ```
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

  - titulo: "Diagrama"
    texto: |
      <img src="/images/arquitetura/diagrama1.png" alt="Diagrama 1" style="width: 70%; display: block; margin-left: auto; margin-right: auto;">

      <img src="/images/arquitetura/diagrama2.png" alt="Diagrama 2" style="width: 70%; display: block; margin-left: auto; margin-right: auto;">

      <img src="/images/arquitetura/diagrama3.png" alt="Diagrama 3" style="width: 70%; display: block; margin-left: auto; margin-right: auto;">
---
