---
title: "[FEATURE] FAzendo a responsividade da pagina inicial"
date: 2025-11-29
milestone: "Sprint_12"
type: "issue"
draft: false
---

## Descrição
Atualmente, a Homepage e seus componentes (`Hero`, `Equipe`, `Sobre`, `Footer`, etc.) possuem um layout fixo otimizado apenas para desktop. Precisamos adicionar Media Queries para garantir que o site se adapte corretamente a tablets e dispositivos móveis.

## Objetivos
- [x] Ajustar tamanhos de fonte no **Hero** para evitar quebras de texto em telas pequenas.
- [x] Transformar o Grid da seção **Equipe** (3 colunas) em 1 coluna no mobile.
- [x] Reorganizar o layout do **Footer** para empilhar colunas verticalmente em telas menores.
- [x] Ajustar espaçamentos (padding/margin) nos componentes **Sobre o Projeto** e **Como Funciona**.
- [x] Garantir que o **Grid de Features** se comporte de forma fluida (wrap) ou coluna única.

## Arquivos Afetados
- `Hero.css`
- `Equipe.css`
- `SobreProjeto.css`
- `Footer.css`
- `HomePage.css`
- `SobreNos.css`
- `ComoFunciona.css`