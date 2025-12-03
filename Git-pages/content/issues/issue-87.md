---
title: "[Fix] Remover borda de foco (outline) ao clicar nas regiões"
date: 2025-11-29
milestone: "Sprint_12"
type: "issue"
draft: false
---

### 📝 Descrição / Objetivo
Foi identificado um problema visual na interação com o mapa. Atualmente, ao clicar ou focar em um estado ou município, o navegador aplica automaticamente uma borda de foco (outline) padrão, criando um retângulo preto ao redor do desenho (SVG) da região.

**Comportamento Atual:** Um quadrado preto aparece sobrepondo o mapa ao selecionar uma região.
**Comportamento Esperado:** A seleção deve ocorrer de forma limpa, respeitando apenas as cores de destaque (fillColor) e bordas definidas no design, sem a interferência do outline padrão do navegador.

---

### ✅ Tarefas
- [ ] Identificar a classe CSS do Leaflet responsável pelo foco (`.leaflet-interactive`).
- [ ] Aplicar a regra `outline: none` no arquivo de estilos global ou do mapa.
- [ ] Testar a navegação clicando em diferentes estados e municípios para garantir que a borda sumiu.
- Documentar a atividade com print (Antes/Depois) nos comentários desta issue.

---

### 📌 Critérios de Aceitação
- [x] Bug corrigido (Quadrado preto não aparece mais).

