---
title: "Requisitosprojeto"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

# Documento de Requisitos de Software: Radar de Investimento de Saúde Oncológica
## Versão: 0.1.0 (Escopo do MVP)
## Data: 09 de Setembro de 2025

1. **Visão Geral do Projeto**

* O projeto **Radar de Investimento de Saúde Oncológica** visa analisar e dar transparência aos investimentos públicos em saúde oncológica nos municípios brasileiros. A solução irá extrair, padronizar e organizar dados da plataforma **Querido Diário**, que agrega uma vasta quantidade de diários oficiais municipais em formatos não padronizados.

* O problema central a ser resolvido é a dificuldade em rastrear e analisar os gastos com licitações e contratações ligadas à oncologia (medicamentos, equipamentos, serviços e obras), devido à heterogeneidade e falta de padronização das fontes de dados.

2. **Requisitos Funcionais (RF)**
* Os requisitos funcionais descrevem o que o sistema deve fazer. Eles estão organizados em Épicos e Histórias de Usuário para fornecer contexto, seguidos pelos requisitos formais detalhados.

**ÉPICO 1: Busca e Análise de Dados**
* Conjunto de funcionalidades que permitem ao usuário encontrar, extrair e classificar as informações relevantes dentro do grande volume de dados dos diários oficiais.

**História de Usuário 1.1: Busca e Filtragem de Informações**

Como um usuário (pesquisador, cidadão):

* Eu quero poder buscar por palavras-chave e aplicar filtros (município, período), para que eu possa encontrar licitações e contratos específicos sobre saúde oncológica de forma rápida e precisa.

**RF01: Busca por Palavras-Chave:** O sistema deve permitir a busca por palavras-chave relacionadas à saúde oncológica (ex: "oncologia", "câncer", "quimioterapia", "radioterapia").

**RF02: Filtragem de Resultados:** O sistema deve permitir que os resultados da busca sejam filtrados por:

* Município e/ou Estado.

* Período de tempo (data de início e fim).

**Critérios de Aceitação:**

* A busca deve funcionar combinando palavras-chave e filtros.

* A interface de filtros deve ser clara e de fácil utilização.

**História de Usuário 1.2: Extração e Classificação de Dados Financeiros**

Como um analista:

* Eu quero que o sistema extraia e classifique automaticamente os valores monetários e o tipo de investimento, para que eu possa entender como os recursos estão sendo distribuídos sem análise manual.

**RF03: Extração de Valores Monetários:** O sistema deve ser capaz de identificar e extrair valores monetários (em Reais, R$) de licitações e contratos encontrados nos diários.

**RF04: Classificação de Investimentos:** O sistema deve processar os dados extraídos para classificá-los automaticamente por tipo de investimento, conforme as categorias definidas: Medicamentos, Equipamentos, Obras, Serviços de Saúde, etc.

**Critérios de Aceitação:**

* A precisão na extração de valores deve ser alta.

* Toda despesa identificada deve ser associada a uma categoria de investimento.

**ÉPICO 2: Visualização e Geração de Relatórios**
* Conjunto de funcionalidades para apresentar os dados de forma clara, compreensível e útil para o usuário final.

**História de Usuário 2.1: Visualização de Dados em Painel**

Como um usuário:

* Eu quero visualizar os resultados da busca em um painel de controle (dashboard) com tabelas e gráficos, para que eu possa analisar e interpretar facilmente as informações coletadas.

**RF05: Exibição em Painel (Dashboard):** O sistema deve exibir os resultados da busca em um painel de controle central.

**RF06: Tabela Detalhada:** O painel deve conter uma tabela detalhada com informações de cada licitação/contrato, incluindo, no mínimo: município, valor, data e descrição.

**RF07: Gráficos Interativos:** O sistema deve conter gráficos interativos que mostrem a distribuição dos investimentos (ex: total de gastos por município ou por categoria).

**Critérios de Aceitação:**

* O painel deve ser atualizado dinamicamente conforme os filtros aplicados.

* Os gráficos devem ser de fácil interpretação.

**História de Usuário 2.2: Exportação de Dados**

Como um analista:

Eu quero poder exportar os dados e os relatórios gerados, para que eu possa realizar análises mais aprofundadas em outras ferramentas ou compartilhar os resultados.

**RF08: Exportação de Dados:** O sistema deve permitir a exportação dos dados da tabela e dos relatórios em formatos comuns, como CSV e PDF.

**Critérios de Aceitação:**

* A exportação deve refletir os filtros atualmente aplicados.

* O arquivo gerado deve ser íntegro e legível.

**3. Requisitos Não Funcionais (RNF)**
* Os requisitos não funcionais definem as características de qualidade do sistema, garantindo uma boa experiência de uso.

**RNF01: Usabilidade**

* A interface do usuário deve ser intuitiva e de fácil navegação, mesmo para usuários sem conhecimento técnico.

* A visualização dos resultados (tabelas, gráficos) deve ser clara e facilitar a interpretação.

* O processo de busca e exportação deve ser simples e direto.

**RNF02: Desempenho**

* As buscas no sistema devem retornar resultados em um tempo aceitável (meta: inferior a 5 segundos).

* O processamento e a exibição dos dados no painel devem ser eficientes, mesmo com múltiplos filtros aplicados.

**RNF03: Confiabilidade**

* A extração de dados de licitações e contratos deve ser precisa, evitando erros de leitura de valores e datas.

* A integridade dos dados deve ser mantida, garantindo consistência com as fontes dos diários oficiais.

**RNF04: Escalabilidade**

* A arquitetura do sistema deve permitir a inclusão de novos diários oficiais sem a necessidade de grandes mudanças estruturais.

* O sistema deve ser capaz de suportar um aumento no volume de buscas e de usuários simultâneos no futuro.

**4. Escopo para o MVP (Produto Mínimo Viável)**
- Com base na priorização, a primeira versão do produto focará nas funcionalidades essenciais para entregar valor e validar a solução.

**Funcionalidades INCLUÍDAS no MVP:**

* Busca por Palavras-Chave e Filtros (RF01, RF02).

* Extração e Classificação de Dados (RF03, RF04).

* Visualização em Tabela Detalhada (RF06).

**Funcionalidades para Versões Futuras (PÓS-MVP):**

* Dashboard com Gráficos Interativos (RF05, RF07).

* Exportação de Dados em CSV e PDF (RF08).

* Filtros avançados e novas categorias de análise.

**5. Restrições e Premissas do Projeto**

* **Padrões de Software Livre:** O projeto seguirá as melhores práticas e padrões de desenvolvimento de software livre, incluindo licenciamento e guias de contribuição.

* **Fonte de Dados Primária:** A única fonte de dados para o sistema será a plataforma "Querido Diário".

* **Guia para Protótipos:** Os protótipos de interface (baixa e alta fidelidade) devem priorizar a clareza e simplicidade, focando em uma jornada de usuário fluida desde a busca até a visualização dos resultados.

**6. Artefatos Relacionados**

* **User Story Map:** O planejamento visual dos requisitos e do escopo do MVP pode ser acessado no [board do Figma](https://www.figma.com/board/8Jsltq8BOL65CsMoRWFjik/Template-MDS--Copy-?node-id=0-1&p=f&t=Mh9B7fFd33lW6I0P-0).
* **Controle da Tarefa:** A criação e o desenvolvimento do Story Map foram rastreados através da seguinte [issue no GitHub](https://github.com/unb-mds/2025-2-OncoMap/issues/33). 
