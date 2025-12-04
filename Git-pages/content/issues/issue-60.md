---
title: "[FEATURE] Alimentacao do municipalities_status"
date: 2025-11-29
milestone: "Sprint 8"
type: "issue"
draft: false
---

## 🎯 Descrição

Criar e alimentar uma tabela de controle (`municipalities_status`) no banco de dados. Esta tabela servirá como uma "fila de processamento", contendo a lista de todos os 5.570 municípios do Brasil e o status de sua coleta de dados (se já foi processado ou não).

---

## ✅ Objetivo

O problema que esta feature resolve é a falta de resiliência e estado do nosso script de coleta de dados em larga escala (`collector.js`). Atualmente, se o processo de coleta (que leva dias) for interrompido por qualquer motivo (queda de internet, desligamento do computador), ele precisa recomeçar do zero, desperdiçando tempo e recursos.

Esta funcionalidade é crucial porque transforma nosso coletor em um processo **robusto, resiliente e reiniciável**. Com a tabela de status, o script saberá exatamente onde parou e poderá continuar do próximo município pendente, garantindo a integridade da nossa carga de dados inicial sem retrabalho.

---

## 📝 Detalhes da Implementação

A implementação será focada em um novo script de setup e na criação da tabela de suporte no banco de dados.

- **Criação da Tabela no Banco de Dados:**
    - No Supabase (ou no cliente de banco de dados), criar uma nova tabela chamada `municipalities_status` com as seguintes colunas:
        - `ibge_code` (VARCHAR(7), PRIMARY KEY)
        - `name` (VARCHAR(255), NOT NULL)
        - `state_uf` (VARCHAR(2), NOT NULL)
        - `last_processed_at` (TIMESTAMP WITH TIME ZONE, NULL)

- **Criação do Script de Setup:**
    - Criar um novo script `backend/scripts/setup_municipalities.js`.
    - Este script irá:
        1. Ler o arquivo `src/data/municipios.json` que contém a lista de todos os municípios.
        2. Fazer um loop por cada município no arquivo JSON.
        3. Para cada município, inserir uma nova linha na tabela `municipalities_status`, com o `last_processed_at` definido como `NULL`.

---

## 📊 Critérios de Aceitação

Para considerar esta funcionalidade concluída, os seguintes pontos devem ser atendidos:

- [x] A tabela `municipalities_status` existe no banco de dados com a estrutura correta.
- [x] O script `setup_municipalities.js` é criado e está funcional.
- [x] Ao executar o script de setup, a tabela `municipalities_status` é populada com sucesso com todos os 5.570 municípios.
- [x] Todas as novas linhas na tabela `municipalities_status` são inseridas com a coluna `last_processed_at` como `NULL`.
- [x] O script pode ser executado novamente sem gerar erros de duplicidade (graças à cláusula `ON CONFLICT`).
- [x] O comando `npm run db:setup` está configurado no `package.json` e executa o script corretamente.

---