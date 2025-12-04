---
title: "[TASK] - Add .txt ao db"
date: 2025-11-29
milestone: "Sprint 9"
type: "issue"
draft: false
---

## 🎯 Objetivo / Motivação

Atualizar a tabela `mentions` do banco de dados, preenchendo a coluna `txt_url` para os registros onde ela está atualmente `NULL`. O script (`fill_missing_txt_urls.js`) buscará na API do Querido Diário o `txt_url` correspondente a cada diário já coletado.

Esta tarefa é necessária para maximizar a qualidade dos dados usados pelo script de enriquecimento (`enrichment.js`). O conteúdo completo do arquivo `.txt` geralmente fornece mais contexto do que o `excerpt`, aumentando a precisão da extração de valores financeiros pela IA. Resolve o problema de termos apenas `excerpts` para muitos registros.

---

## 📋 Escopo da Tarefa e Entregáveis

- [x] **Modificar Tabela `mentions`:** Garantir que a coluna `txt_url` (TEXT, nullable) exista.
- [x] **Criar Script `fill_missing_txt_urls.js`:** Desenvolver o script na pasta `scripts/`.
- [x] **Lógica de Busca:** Implementar a query `SELECT id, municipality_ibge_code, publication_date, source_url FROM mentions WHERE txt_url IS NULL`.
- [x] **Consulta à API Querido Diário:** Para cada menção, fazer uma requisição `GET` à API buscando pelo `municipality_ibge_code` e a `publication_date` exata.
- [x] **Identificação do Diário:** No resultado da API, encontrar o `gazette` cujo `url` (link do PDF) corresponda ao `source_url` da menção no banco.
- [x] **Extração e Atualização:** Extrair o `txt_url` do `gazette` correspondente (se existir) e executar uma query `UPDATE mentions SET txt_url = $1 WHERE id = $2` para salvar o valor encontrado (ou `NULL` se não foi encontrado).
- [x] **Controle de Velocidade:** Implementar um `delay` entre as requisições à API do Querido Diário.
- [x] **Adicionar Comando `npm`:** Adicionar o script `db:fill-txt` ao `package.json`.

---

## ✅ Critérios de Aceitação

- [x] O script `fill_missing_txt_urls.js` existe na pasta `scripts/` e executa sem erros fatais.
- [x] O script identifica corretamente as menções na tabela `mentions` com `txt_url IS NULL`.
- [x] As consultas à API do Querido Diário são feitas corretamente para a data e município específicos.
- [x] O script consegue encontrar o `gazette` correspondente na resposta da API usando o `source_url`.
- [x] A coluna `txt_url` na tabela `mentions` é atualizada com a URL encontrada ou permanece `NULL` (mas a linha não é mais selecionada pelo script em execuções futuras se a atualização ocorrer, mesmo que para `NULL`).
- [x] O script processa todas as menções pendentes e termina.
- [x] O comando `npm run db:fill-txt` executa o script corretamente.

---

## 🔗 Dependências (Opcional)

* Depende da existência da tabela `mentions` com as colunas `municipality_ibge_code`, `publication_date`, e `source_url` populadas.
* Depende da existência da coluna `txt_url` na tabela `mentions`.
* A Issue de Enriquecimento (`enrichment.js`) pode se beneficiar desta, mas não depende estritamente (possui fallback).

---

## 💡 Sugestão de Implementação (Opcional)

* Utilizar `axios` para fazer as chamadas à API do Querido Diário.
* Otimizar a busca na API consultando apenas pela data específica (`published_since` e `published_until` iguais).
* Usar o método `find()` do JavaScript no array `gazettes` retornado pela API para encontrar o `gazette` correspondente à `source_url`.
* Garantir que o `UPDATE` no banco seja feito mesmo se `txt_url` não for encontrado, para evitar reprocessamento desnecessário (talvez atualizando para `NULL` explicitamente ou adicionando uma coluna `txt_url_checked_at`). *Correção: O script atualizado já faz isso ao definir `txt_url = $1` onde `$1` pode ser `null`.*
* **Executar o script usando `screen`** devido à potencial longa duração (horas, dependendo do número de menções com `txt_url` nulo).

---

<details>
<summary>Checklist do Autor</summary>

- [ ] Verifiquei se não há uma tarefa duplicada já aberta.
- [ ] O título da tarefa é claro e conciso.
- [ ] Descrevi o objetivo e a motivação por trás da tarefa.
- [ ] Os entregáveis e os critérios de aceitação estão bem definidos.
- [ ] Associei a tarefa a um projeto (Project) ou marco (Milestone), se aplicável.
</details>