---
title: "Requisitos"
subtitulo: "Mapa de Épicos, Funcionalidades e Histórias de Usuário"
draft: false
layout: "embed"  # <-- ESSA É A MÁGICA!

blocos_de_texto:
  - titulo: "Visão Geral"
    texto: |
      ### Documentação completa dos requisitos, organizados por tipo e prioridade:
      - **Story Maps:** Mapeamento visual das histórias de usuário
      - **Requisitos Funcionais:** Funcionalidades específicas do sistema
      - **Requisitos Não Funcionais:** Qualidades e restrições do sistema
      - **Personas:** Perfis dos usuários do sistema

  - titulo: "StoryMap"
    texto: |
      <img src="/images/requisitos.png" alt="StoryMap" style="width: 100%;">

      ### Objetivos Principais:
      - Mapeamento completo das funcionalidades
      - Organização por personas e jornadas
      - Priorização por valor de negócio
      - Visualização da experiência do usuário

  - titulo: "Personas"
    texto: |
      ### Usuários Primários:
      - **Pesquisadores** Educacionais: Analistas que buscam dados sobre investimentos
      - **Gestores Públicos:** Tomadores de decisão em políticas educacionais
      - **Jornalistas:** Profissionais que cobrem saude pública
      ### Usuários Secundários:
      - **Comunidade** Assunto comunitário
      - **ONGs:** Organizações focadas em saúde
      - **Consultores:** Especialistas em políticas públicas

  - titulo: "Requisitos Funcionais"
    texto: |
      - **RF 01:** Busca por Palavras-Chave: O sistema deve permitir a busca por palavras-chave relacionadas à saúde oncológica (ex: "oncologia", "câncer", "quimioterapia", "radioterapia").
      - **RF 02:** Filtragem de Resultados: O sistema deve permitir que os resultados da busca sejam filtrados por:
        - Município e/ou Estado.
        - Período de tempo (data de início e fim).
      - **RF 03:** Extração de Valores Monetários: O sistema deve ser capaz de identificar e extrair valores monetários (em Reais, R$) de licitações e contratos encontrados nos diários.
      - **RF 04:** Classificação de Investimentos: O sistema deve processar os dados extraídos para classificá-los automaticamente por tipo de investimento, conforme as categorias definidas: Medicamentos, Equipamentos, Obras, Serviços de Saúde, etc.
      - **RF 05:** Exibição em Painel (Dashboard): O sistema deve exibir os resultados da busca em um painel de controle central.
      - **RF 06:** Tabela Detalhada: O painel deve conter uma tabela detalhada com informações de cada licitação/contrato, incluindo, no mínimo: município, valor, data e descrição.
      - **RF 07:** Gráficos Interativos: O sistema deve conter gráficos interativos que mostrem a distribuição dos investimentos (ex: total de gastos por município ou por categoria).
      - **RF 08:** Exportação de Dados: O sistema deve permitir a exportação dos dados da tabela e dos relatórios em formatos comuns, como CSV e PDF.

  - titulo: "Requisitos não Funcionais"
    texto: |
      - **RNF 01: Usabilidade**
        - A interface do usuário deve ser intuitiva e de fácil navegação, mesmo para usuários sem conhecimento técnico.
        - A visualização dos resultados (tabelas, gráficos) deve ser clara e facilitar a interpretação.
        - O processo de busca e exportação deve ser simples e direto.
      - **RNF 02: Desempenho**
        - As buscas no sistema devem retornar resultados em um tempo aceitável (meta: inferior a 5 segundos).
        - O processamento e a exibição dos dados no painel devem ser eficientes, mesmo com múltiplos filtros aplicados.
      - **RNF 03: Confiabilidade**
        - A extração de dados de licitações e contratos deve ser precisa, evitando erros de leitura de valores e datas.
        - A integridade dos dados deve ser mantida, garantindo consistência com as fontes dos diários oficiais.
      - **RNF 04: Escalabilidade**
        - A arquitetura do sistema deve permitir a inclusão de novos diários oficiais sem a necessidade de grandes mudanças estruturais.
        - O sistema deve ser capaz de suportar um aumento no volume de buscas e de usuários simultâneos no futuro.
  
---
