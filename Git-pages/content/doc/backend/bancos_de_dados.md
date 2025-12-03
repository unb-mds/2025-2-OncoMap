---
title: "Bancos De Dados"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

# Bancos de Dados
---

## 📖 Contexto

Antes de iniciar a implementação, precisamos decidir o banco de dados.  
Como a linguagem do projeto ainda não foi definida, avaliaremos opções considerando:

- **Maturidade**
- **Flexibilidade**
- **Custo**
- **Desempenho**
- **Ecossistema de drivers/ORMs**
- **Facilidade de operação (self-hosted vs. gerenciado)**

---

## O que é um Banco de Dados (resumo)

- **Relacionais (SQL):** modelo tabular, transações ACID, SQL (ex.: PostgreSQL, MySQL, SQLite).  
- **Não relacionais (NoSQL):** modelos flexíveis (documentos, chave-valor, grafo etc.) para casos de uso específicos (ex.: MongoDB, Redis).  

---

## Compatibilidade por Linguagem (drivers/ORMs populares)

> **Observação:** lista não exaustiva; todos são multiplataforma.

| Banco | Python | Node.js | .NET | Go | Ruby | PHP | Rust |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **PostgreSQL** | `psycopg`, `asyncpg`, SQLAlchemy, Django ORM | `pg`, Prisma, Sequelize, Knex | Npgsql, EF Core | `pgx`, GORM (postgres) | ActiveRecord, Sequel | PDO_PGSQL | `sqlx`, Diesel |
| **MySQL/MariaDB** | `mysqlclient`, `PyMySQL`, SQLAlchemy, Django ORM | `mysql2`, Prisma, Sequelize, Knex | MySqlConnector, Pomelo EF Core | `go-sql-driver/mysql`, GORM | ActiveRecord, Sequel | PDO_MYSQL, `mysqli` | `sqlx`, Diesel |
| **SQLite** | `sqlite3` (stdlib), SQLAlchemy, Django ORM | `better-sqlite3`, `sqlite3`, Prisma, Knex | Microsoft.Data.Sqlite, EF Core | `mattn/go-sqlite3`, GORM | ActiveRecord | PDO_SQLITE | `rusqlite`, `sqlx` |
| **MongoDB** | `pymongo`, `motor` (async) | `mongodb`, Mongoose | MongoDB .NET Driver | `mongo-go-driver` | `mongo`, Mongoid | Extensão `mongodb` | `mongodb` crate |
| **Redis** | `redis` (redis-py) | `redis`, `ioredis` | StackExchange.Redis | `go-redis` | `redis` | `phpredis` | `redis` crate |

---

## Quando usar cada um (resumo)

- **PostgreSQL (SQL):** robustez, consultas complexas, dados relacionais, integrações avançadas (JSONB, extensões).  
- **MySQL/MariaDB (SQL):** simples, muito difundido, ótimo para leituras intensivas.  
- **SQLite (SQL, arquivo único):** protótipos, apps locais/embarcados, testes.  
- **MongoDB (Documentos):** esquema flexível, iteração rápida em modelos de dados variáveis.  
- **Redis (Chave-valor em memória):** cache, sessões, filas/pub-sub (uso complementar).  

---

## Vantagens & Desvantagens

### PostgreSQL
- ✅ Rico em recursos (CTEs, JSONB, extensões), ACID forte, confiável.  
- ❌ Pode demandar mais tuning; um pouco mais “pesado” para apps mínimas.  

### MySQL/MariaDB
- ✅ Amplo suporte, ótimo desempenho em leituras, fácil operação.  
- ❌ Menos recursos SQL avançados que Postgres; particionamento/consultas complexas podem exigir workarounds.  

### SQLite
- ✅ Zero configuração, leve, perfeito para prototipagem e testes.  
- ❌ Não indicado para alta concorrência/escala horizontal.  

### MongoDB
- ✅ Flexível (documentos), bom para dados sem esquema rígido, fácil de evoluir.  
- ❌ Modelagem relacional complexa fica mais difícil; transações multi-documento exigem cuidado.  

### Redis
- ✅ Latência baixíssima; excelente para cache/sessões/filas.  
- ❌ Memória é cara; não é banco primário para dados críticos a longo prazo.  
