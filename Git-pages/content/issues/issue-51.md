---
title: "[TASK] Definição e Estruturação do Pipeline de Coleta e Tratamento de Dados"
date: 2025-11-29
milestone: "Sprint 8"
type: "issue"
draft: false
---

## 🎯 Descrição

Definir e estruturar a arquitetura completa do pipeline de ETL (Extract, Transform, Load). O objetivo desta semana foi criar o alicerce do nosso novo backend, planejando cada etapa do fluxo de dados, desde a busca da informação bruta até o seu armazenamento estruturado.

---

## ✅ Objetivo

O problema que esta funcionalidade resolve é a **falta de um plano de implementação claro para a aquisição de dados**. Antes de escrever o código final, precisamos de uma arquitetura bem definida para garantir que o sistema seja robusto, modular e escalável.

Esta funcionalidade é crucial porque ela **transforma a ideia do pipeline de dados em um plano de engenharia executável**. Ao final desta semana, teremos um "blueprint" (planta baixa) completo do backend, permitindo que a equipe desenvolva os componentes de forma organizada e eficiente nas próximas etapas.

---

## 📝 Detalhes do Plano de Ação

O trabalho foi focado em planejar e estruturar as 4 fases do pipeline.

### **Fase 1: Coleta de Fontes de Dados**
-   **Tarefa:** Definir o processo para consumir a API externa do "Querido Diário".
-   **Entregável:** Detalhar os parâmetros de busca necessários (município, datas, palavras-chave) e a estrutura de dados esperada como resposta. Modelar como a lógica de paginação será tratada para garantir a coleta de todos os dados relevantes.

### **Fase 2: Processamento dos Arquivos**
-   **Tarefa:** Planejar o método para download e extração de conteúdo dos arquivos (PDFs) retornados pela API.
-   **Entregável:** Documentar o fluxo que recebe um link, baixa o arquivo e extrai seu conteúdo textual. Mapear possíveis pontos de falha (ex: arquivo corrompido, link quebrado).

### **Fase 3: Extração de Informações Estruturadas**
-   **Tarefa:** Desenvolver a estratégia para transformar o texto bruto extraído em dados estruturados (ex: empresa, CNPJ, valor).
-   **Entregável:** Criar um "prompt" modelo bem definido, que servirá de base para a extração de informações via IA. Definir o formato exato do JSON de saída que esperamos após o tratamento.

### **Fase 4: Armazenamento no Banco de Dados**
-   **Tarefa:** Modelar como os dados estruturados serão armazenados.
-   **Entregável:** Definir o esquema da tabela final no banco de dados (nomes das colunas, tipos de dados, restrições). Documentar o processo de conexão e inserção dos dados.

---

## 📊 Critérios de Aceitação

Para considerar esta etapa de planejamento concluída, os seguintes pontos foram alcançados:

- [x] O esquema da tabela do banco de dados para armazenar os dados finais foi definido e documentado.
- [x] Um plano de implementação para as próximas semanas foi criado, quebrando o desenvolvimento do pipeline em tarefas menores e mais gerenciáveis (ex: criar script de coleta, criar processador de PDF, etc.).
- [x] A documentação do projeto (como o `README.md` e o documento de arquitetura) foi revisada e as seções que precisam ser alteradas foram identificadas e marcadas para atualização futura.
- [x] A decisão de migrar a tecnologia do backend e a nova arquitetura proposta foram apresentadas e validadas pela equipe.