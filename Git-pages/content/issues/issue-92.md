---
title: "[Feat] Geração relatórios PDF"
date: 2025-11-29
milestone: "Nenhuma"
type: "issue"
draft: false
---

## 🎯 Descrição
Implementar um sistema de **Exportação de Relatórios em PDF** enriquecidos com Inteligência Artificial.

Atualmente, o usuário visualiza os dados no mapa, mas não tem uma forma fácil de extrair um documento formal ou analítico sobre o que está vendo. O objetivo é permitir que o usuário baixe relatórios prontos para uso (Regionais, Estaduais ou Municipais).

---

## ✅ Objetivo
Fornecer aos gestores públicos, jornalistas e pesquisadores uma ferramenta de **análise automatizada**. 

Em vez de apenas entregar uma planilha de números, o sistema deve usar o **Gemini** para "ler" os dados agregados do banco e escrever um relatório textual (com introdução, análise e conclusão), formatado elegantemente em PDF. Isso agrega valor ao transformar dados brutos em *insights* consumíveis.

---

## 📝 Detalhes da Implementação

### Backend
* **Controlador (`reportController.js`):**
    * Criar funções que busquem dados agregados no banco (`mentions` e `final_extracted_value`).
    * Implementar lógica de Prompt Engineering para enviar esses dados ao Gemini e solicitar um retorno em HTML formatado.
    * Usar uma biblioteca como `html-pdf-node` ou `puppeteer` para converter o HTML gerado em binário PDF.
* **Rotas (`reportRoutes.js`):**
    * `GET /api/report/region/:regionName/pdf`
    * `GET /api/report/state/:uf/pdf`
    * `GET /api/report/municipality/:ibge/pdf`

### Design do Relatório
* O PDF deve ter um cabeçalho padrão do OncoMap.
* Deve incluir tabelas de dados (geradas pela IA ou montadas no código).
* Deve incluir textos analíticos (ex: "O estado X lidera os investimentos com 40% do total...").

---

## 📊 Critérios de Aceitação

- [x] O sistema deve gerar PDFs válidos para download direto no navegador.
- [x] O relatório deve suportar três níveis de granularidade: Região, Estado e Município.
- [x] O conteúdo textual deve ser dinâmico (gerado pela IA com base nos dados reais do momento).
- [x] O relatório deve exibir corretamente os valores monetários formatados (R$).
- [x] Caso a região/estado/município não tenha dados, a API deve retornar um erro 400 ou 404 claro, sem tentar gerar um PDF vazio.

---