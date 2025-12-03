---
title: "[BUG] - Ajustes de CSS na Navbar/Footer e Lógica de Zoom Sincronizado no Mapa"
date: 2025-11-29
milestone: "Nenhuma"
type: "issue"
draft: false
---

## 🐛 Descrição do Bug

Foram identificados problemas de consistência visual e usabilidade no Frontend. Especificamente: o layout da MapaPage apresenta espaçamento excessivo à direita em telas grandes; a lista de estados na tabela lateral não interage com o mapa (não dá zoom); a Navbar fixa sobrepõe os títulos das seções ao navegar por âncoras; e o menu mobile/footer apresentam comportamentos de responsividade indesejados (menu ocupando tela toda ou footer sumindo).

---

## 🔄 Passos para Reproduzir

- Problema 1 - Mapa e Tabela:

    - Acesse a página /mapa.

   -  Em um monitor largo, observe que o container do mapa tenta ocupar 100% da largura, criando um espaço vazio excessivo à direita da tabela.

    - Selecione uma região (ex: Norte).

    - Na lista lateral da tabela, clique no nome de um estado (ex: Amazonas).

    - Observe que a tabela muda, mas o mapa não realiza o zoom automático no estado.

- Problema 2 - Navbar e Responsividade:

    - Na Home, clique no link "Sobre" ou "Quem somos".

    - Observe que o título da seção fica escondido atrás da Navbar fixa.

    - Reduza a tela para tamanho mobile (< 768px).

    - Abra o menu hambúrguer: ele ocupa a tela inteira, impedindo a visualização do contexto.

    - Verifique o rodapé: em algumas resoluções mobile, ele desaparece (display: none).
---

## ✅ Comportamento Esperado

1. MapaPage: O conteúdo (Mapa + Tabela) deve ser centralizado com max-width (1440px), mantendo padding assimétrico para acomodar o botão de menu lateral.

2. nteração: Ao clicar no nome de um estado na TabelaInfo, o mapa deve receber o comando e realizar o zoom (flyToBounds) automaticamente, unificando a navegação.

3. Navbar: Deve possuir efeito Glassmorphism, scroll suave com compensação de altura (scroll-padding-top) para não cobrir títulos, e o menu mobile deve ser um dropdown que não ocupe 100% da altura da tela.

4. Footer: Deve permanecer visível e responsivo em todas as resoluções.
---

## 💥 Comportamento Atual

1. Layout: O content-wrapper estica indefinidamente (width 100%), quebrando o design em telas ultrawide.

2. Lógica: A lista de estados é apenas informativa (texto), sem função de clique para controlar o mapa.

3. UI: A Navbar fixa corta o topo das seções. O botão "Explorar" (CTA) tem padding insuficiente, fazendo o texto tocar nas bordas.

4. Mobile: O CSS antigo esconde o footer em telas < 768px e o menu mobile usa um estilo de "gaveta" intrusivo.

---

## 💻 Ambiente de Execução

- Sistema Operacional: Linux / Windows

- Navegador: Google Chrome / Firefox

- Versão da Aplicação: Desenvolvimento (Localhost)

- Dispositivo: Desktop & Mobile (Responsividade)

---

##  adicional Contexto Adicional (Opcional)

As alterações envolvem refatoração nos seguintes arquivos:

    - src/pages/MapaPage.tsx (CSS e Lógica de State)

    - src/components/MapaPage/mapa.tsx (Centralização do useEffect de zoom)

    - src/components/MapaPage/TabelaInfo.tsx (Conversão de lista para botões clicáveis)

    - src/style/Navbar.css (Glassmorphism e Menu Dropdown)

    - src/style/Footer.css (Correção de display none)