---
title: "[TASK] - Enrichment.js"
date: 2025-11-29
milestone: "Sprint 9"
type: "issue"
draft: false
---

## 🎯 Objetivo / Motivação

Implementar o script principal (`enrichment.js`) que processa os dados brutos coletados (excerpts ou textos completos) utilizando a API do Google Gemini. O objetivo é extrair informações estruturadas (valores monetários totais e categorizados) sobre investimentos oncológicos e salvar esses dados enriquecidos de volta no banco de dados.

Esta tarefa é crucial pois transforma os trechos de texto não estruturados em dados quantificáveis e categorizados, que são essenciais para a visualização e análise no frontend do OncoMap. Resolve o problema de termos apenas "evidências brutas" e permite a geração de insights.

---

## 📋 Escopo da Tarefa e Entregáveis

- [x] **Modificar Tabela `mentions`:** Garantir que as colunas `gemini_analysis` (JSONB) e `extracted_value` (NUMERIC) existam.
- [x] **Criar Script `enrichment.js`:** Desenvolver o script principal na pasta `scripts/`.
- [x] **Lógica de Seleção de Fonte:** Implementar a lógica que prioriza o download do conteúdo do `txt_url` (se disponível) e usa o `excerpt` como fallback.
- [x] **Desenvolver Prompt Refinado:** Implementar a função `getGeminiPrompt` com instruções detalhadas para extrair o JSON estruturado (`total_gasto_oncologico`, `medicamentos`, `equipamentos`, `estadia_paciente`, `obras_infraestrutura`, `servicos_saude`, `outros_relacionados`).
- [x] **Integração com Gemini API:** Implementar a chamada à API do Gemini (`gemini-flash-latest`) usando o SDK `@google/generative-ai`.
- [x] **Lógica de Limpeza e Cálculo:** Implementar a função `extractJsonFromString` para extrair o JSON da resposta e recalcular o `total_gasto_oncologico` localmente para garantir precisão.
- [x] **Tratamento de Erros e Rate Limit:** Implementar a lógica de `try...catch` com retentativas (exponential backoff) para erros `429 Too Many Requests` e tratamento para outros erros da API ou de parsing.
- [x] **Controle de Velocidade:** Implementar um `delay` configurável entre as chamadas ao Gemini para respeitar os limites e a boa vizinhança da API.
- [x] **Atualização do Banco de Dados:** Implementar a query `UPDATE mentions` para salvar o `gemini_analysis` (JSON) e o `extracted_value` (NUMERIC calculado) na linha correspondente.
- [x] **Adicionar Comando `npm`:** Adicionar o script `db:enrich` ao `package.json`.

---

## ✅ Critérios de Aceitação

- [x] O script `enrichment.js` existe na pasta `scripts/` e executa sem erros fatais.
- [x] O script identifica corretamente as menções na tabela `mentions` que ainda não foram processadas (`gemini_analysis IS NULL`).
- [x] O script tenta baixar o conteúdo do `txt_url` quando disponível e usa o `excerpt` como fallback.
- [x] As chamadas para a API do Gemini são feitas usando o prompt refinado.
- [x] Erros `429` da API do Gemini acionam a lógica de espera e retentativa configurada.
- [x] A resposta do Gemini é limpa, e o JSON é extraído ou um erro é registrado se a extração falhar.
- [x] O valor total (`extracted_value`) é calculado corretamente a partir das categorias no script.
- [x] Os dados (`gemini_analysis` e `extracted_value`) são salvos corretamente na tabela `mentions` após o processamento bem-sucedido.
- [x] O script processa todas as menções pendentes e termina.
- [x] O comando `npm run db:enrich` executa o script corretamente.

---

## 🔗 Dependências (Opcional)

* Depende da existência da tabela `mentions` com as colunas `excerpt` e `source_url` populadas (resultado da Issue da coleta inicial).
* Depende da existência das colunas `txt_url`, `gemini_analysis`, e `extracted_value` na tabela `mentions`.
* Para melhores resultados, depende da conclusão da Issue de preenchimento dos `txt_url`s faltantes, mas possui fallback para `excerpt`.

---

## 💡 Sugestão de Implementação (Opcional)

* Utilizar o SDK `@google/generative-ai` para interagir com o Gemini.
* Utilizar `axios` para baixar o conteúdo dos `txt_url`s.
* Implementar a lógica de seleção de fonte (`txt` vs `excerpt`) e o tratamento de erro de download.
* Implementar a função `extractJsonFromString` usando `indexOf('{')` e `lastIndexOf('}')` ou Regex mais robusto.
* Implementar o loop de retentativa (`while (attempt < maxRetries)`) dentro de uma função `processMention` separada para modularidade.
* Usar `JSON.stringify` para salvar o objeto `analysisData` na coluna `JSONB`.
* **Executar o script usando `screen`** devido à longa duração estimada (horas).

---

<details>
<summary>Checklist do Autor</summary>

- [ ] Verifiquei se não há uma tarefa duplicada já aberta.
- [ ] O título da tarefa é claro e conciso.
- [ ] Descrevi o objetivo e a motivação por trás da tarefa.
- [ ] Os entregáveis e os critérios de aceitação estão bem definidos.
- [ ] Associei a tarefa a um projeto (Project) ou marco (Milestone), se aplicável.
</details>