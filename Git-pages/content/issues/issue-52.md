---
title: "[FEATURE]Configurar e Conectar Banco de Dados com Supabase"
date: 2025-11-29
milestone: "Sprint 8"
type: "issue"
draft: false
---



## 🎯 Descrição
Criar o projeto no Supabase (incluindo conta, se necessário) e configurar o repositório com as credenciais de acesso para conectar a aplicação ao banco de dados.

---

## 📝 Detalhes da Implementação
- Criar uma conta na plataforma Supabase (caso ainda não exista).
- Criar um novo projeto no dashboard do Supabase para obter o banco de dados e as APIs.
- Obter as chaves de acesso (Project URL e `anon key`) nas configurações do projeto Supabase.
- No repositório do projeto, criar um arquivo `.env.local` para armazenar as credenciais de forma segura.
- Adicionar o arquivo `.env.local` ao `.gitignore` para que as chaves secretas não sejam enviadas ao repositório.
- Instalar o SDK do Supabase no projeto (ex: `npm install @supabase/supabase-js`).
- Criar um módulo ou classe para inicializar o cliente do Supabase, lendo as credenciais a partir das variáveis de ambiente.

---

## 📊 Critérios de Aceitação
- [x] Conta e projeto foram criados no Supabase.
- [x] As credenciais de acesso (URL e `anon key`) estão configuradas no projeto como variáveis de ambiente.
- [x] O arquivo com as variáveis de ambiente locais (ex: `.env.local`) está listado no `.gitignore`.
- [x] A aplicação consegue estabelecer uma conexão bem-sucedida com o banco de dados do Supabase.
