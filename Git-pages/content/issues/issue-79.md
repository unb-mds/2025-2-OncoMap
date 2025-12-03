---
title: "Implementação script para txt"
date: 2025-11-29
milestone: "Sprint_11"
type: "issue"
draft: false
---

## 🎯 Descrição
Implementar um pipeline de "Análise Dupla" para o enriquecimento de dados da IA.

O sistema deve analisar **duas fontes de texto** de forma independente para cada menção:
1.  **Fonte PDF:** (Script `enrichment_pdf.js`) Analisa o `source_url` (PDF) usando `pdf-parse`.
2.  **Fonte TXT:** (Novo script `enrichment_txt.js`) Analisa o `txt_url` ou o `excerpt`.

Os resultados de cada análise serão salvos em colunas separadas, permitindo 100% de cobertura de análise e validação cruzada dos dados.

---

## ✅ Objetivo
Qual problema essa feature resolve?
* O pipeline atual, focado apenas em PDF (`enrichment_pdf.js`), **ignora menções** onde o PDF não está disponível, está corrompido, ou o `pdf-parse` falha. Isso cria "buracos" no banco de dados.
* Não temos uma forma de "plano B" (fallback) para analisar os dados de texto (o `.txt` original ou o `excerpt`) que o `collector.js` salva.

Por que ela é importante para o projeto?
* **Cobertura de 100%:** Garante que **todas as menções** coletadas (seja PDF ou TXT) passem por uma análise de IA, maximizando a quantidade de dados extraídos.
* **Validação de Dados:** Ao ter duas análises (`gemini_analysis` e `gemini_analysis_txt`), podemos comparar os resultados, validar a precisão da IA e escolher a melhor fonte de dados para o frontend.
* **Robustez:** O pipeline se torna mais resiliente, pois uma falha na análise do PDF não impede mais a análise do TXT.

---

## 📝 Detalhes da Implementação
Se já tiver uma ideia de como implementar, descreva aqui.
* **Banco de Dados:** Adicionar duas novas colunas à tabela `mentions` no Supabase:
    * `gemini_analysis_txt` (do tipo `JSONB`)
    * `extracted_value_txt` (do tipo `NUMERIC(15, 2)`)
* **Refatoração:** O script `enrichment_pdf.js` permanece o mesmo, focado em `source_url` e salvando em `gemini_analysis`.
* * **Novo Script:** Criar o `enrichment_txt.js` , que será uma cópia do `enrichment_pdf.js` com as seguintes modificações:
    * **Dependências:** Remover `pdf-parse`. Manter `tiktoken` (para chunking).
    * **Fonte de Dados:** Modificar a lógica de *download* para baixar o `txt_url` (se existir) ou usar o `excerpt` (como fallback).
    * **Lógica de Chunking:** Manter a lógica de `splitTextIntoChunksByToken`, pois o `.txt` ou `excerpt` pode ser maior que o limite de 1 milhão de tokens.
    * **Query SQL:** Modificar a query principal para buscar menções onde `gemini_analysis_txt IS NULL` (para rodar em todos os municípios, independentemente do sucesso do PDF) e onde `(txt_url IS NOT NULL OR excerpt IS NOT NULL)`.
    * **Destino (Salvar):** O script deve salvar seus resultados nas novas colunas (`gemini_analysis_txt` e `extracted_value_txt`).
* **Fluxo de Trabalho:** O enriquecimento total será feito em duas fases (separadas ou paralelas):
    1.  `node src/scripts/enrichment_pdf.js [startId] [endId]`
    2.  `node src/scripts/enrichment_txt.js [startId] [endId]`

---

## 📊 Critérios de Aceitação
Quais pontos devem estar presentes para considerar a feature concluída?
* [x] As novas colunas `gemini_analysis_txt` e `extracted_value_txt` existem no banco de dados.
* [x] O novo script `enrichment_txt.js` existe e implementa a mesma arquitetura (Roteador de Chaves, `tiktoken`, `chunking`, processamento por ID).
* [x] O `enrichment_txt.js` busca corretamente as fontes de texto (`txt_url` ou `excerpt`).
* [x] O `enrichment_txt.js` salva com sucesso os resultados nas novas colunas `gemini_analysis_txt` e `extracted_value_txt`.
* [x] O script `enrichment_pdf.js` permanece funcional e salva os resultados nas colunas `gemini_analysis` originais.
---