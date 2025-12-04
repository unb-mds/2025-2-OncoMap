---
title: "[FEATURE] Script Mensal"
date: 2025-11-29
milestone: "Sprint_12"
type: "issue"
draft: false
---

## 🎯 Descrição
Criar um pipeline de dados automatizado que roda mensalmente para coletar novos diários oficiais.

---

## ✅ Objetivo
**Problema:** Atualmente, o banco de dados do OncoMap não é atualizado automaticamente. Os dados ficam desatualizados após a carga inicial, exigindo intervenção manual para rodar todos os scripts de coleta, enriquecimento e geração de relatórios.

**Importância:** Esta feature resolve o problema da **desatualização dos dados**. Ela é crucial para que o OncoMap se torne uma ferramenta de monitoramento **contínua e autônoma**, garantindo que o site sempre exiba as informações mais recentes sem que o mantenedor precise rodar os scripts manualmente todo mês.

---

## 📝 Detalhes da Implementação
- **Backend:**
    - Criar o script `monthly_collector.js` que busca diários dos últimos 30 dias na API do Querido Diário e já salva `source_url` e `txt_url`.
   
---

## 📊 Critérios de Aceitação
- [x] O script `monthly_collector.js` é criado e insere com sucesso novos dados do último mês.