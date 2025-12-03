---
title: "[FEATURE] Teste da alimentacao do banco de dados"
date: 2025-11-29
milestone: "Sprint 8"
type: "issue"
draft: false
---

## 🎯 Descrição

Adicionar um script de teste automatizado para validar o processo de alimentação do banco de dados. O teste deve simular a execução do `collector.js` em um escopo limitado, confirmando que ele consegue buscar dados da API do Querido Diário e inseri-los corretamente na tabela `mentions` do nosso banco de dados PostgreSQL.

---

## ✅ Objetivo

O problema que esta feature resolve é a falta de garantia e confiança no nosso pipeline de dados principal. Atualmente, executamos o `collector.js` e assumimos que ele funcionou, mas não temos uma forma rápida e automática de verificar seu sucesso.

Esta funcionalidade é importante para o projeto por três razões:
1.  **Confiabilidade:** Garante que a funcionalidade mais crítica do nosso backend (a coleta de dados) está funcionando como esperado.
2.  **Manutenção:** Se a API do Querido Diário mudar seu formato ou se fizermos uma alteração no nosso código que quebre a inserção, o teste irá falhar imediatamente, nos alertando sobre o problema.
3.  **Facilidade de Colaboração:** Permite que qualquer membro da equipe execute o teste para validar se seu ambiente de desenvolvimento (conexão com o banco, variáveis de ambiente) está configurado corretamente.

---

## 📝 Detalhes da Implementação

A implementação consistirá em criar um script de teste de integração que executa e verifica a lógica de coleta.

1.  **Criar um Script de Teste:**
    * Criar um novo arquivo, por exemplo, `test/collector.test.js`. Este script usará as mesmas dependências (`pg`, `axios`) do nosso coletor principal.

2.  **Definir um Escopo de Teste Limitado:**
    * O teste não irá rodar para todos os 5.570 municípios. Ele será configurado para buscar dados de **apenas três municípios** (ex: Rio de Janeiro, `3304557`, ...) e para um **período de tempo curto** (ex: os últimos 30 dias). Isso garante que o teste seja rápido.


---

## 📊 Critérios de Aceitação

Para considerar esta funcionalidade concluída, os seguintes pontos devem ser atendidos:

- [ ] Um script de teste dedicado à alimentação do banco de dados existe no projeto.
- [ ] O script executa a lógica de coleta para um escopo pequeno e predefinido (3 município, período curto).
- [ ] O script se conecta ao banco de dados para verificar o resultado da inserção após a execução da coleta.
- [ ] O teste é considerado "passou" se o número de registros na tabela `mentions` aumentar após a execução do script.
- [ ] O teste é considerado "falhou" se nenhum novo registro for adicionado, exibindo uma mensagem de erro clara no console.

---