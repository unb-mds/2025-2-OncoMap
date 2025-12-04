---
title: "Testspostman"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---


# Análise de Arquitetura de Dados para o Projeto OncoMap

### Issue: Definição da estratégia de tratamento de dados

---

## 📖 Descrição / Objetivo

Este documento detalha a pesquisa e os testes realizados para determinar a arquitetura de tratamento de dados mais eficiente para o projeto OncoMap. O objetivo principal é garantir que a plataforma interativa tenha um tempo de resposta rápido para o usuário final, mesmo ao consultar grandes volumes de dados, como os de uma região inteira do Brasil.

Foram analisadas duas abordagens principais:
1.  **Sem Banco de Dados Próprio:** O backend atua como um intermediário (proxy), consultando a API do Querido Diário em tempo real a cada requisição do usuário.
2.  **Com Banco de Dados Próprio:** O backend utiliza um processo de coleta assíncrono para popular um banco de dados local (PostgreSQL), e a API do projeto consulta essa base de dados otimizada para responder rapidamente às requisições do usuário.

---

## ✅ Testes Realizados e Descobertas

Para validar o comportamento da API do Querido Diário e entender suas capacidades, foi realizado um teste de consulta utilizando o Postman.

### Teste 1: Consulta a um Único Município (Rio de Janeiro)

Foi feita uma requisição `GET` para a API buscando por múltiplos termos (`quimioterapia,radioterapia,oncologia`) no município do Rio de Janeiro (`territory_id: 3304557`) durante o ano de 2024.

**Parâmetros da Requisição:**

![Parâmetros da Requisição no Postman](https://i.imgur.com/K5f4p6O.png)

**Resultado da Requisição:**

A API retornou com sucesso (`Status 200 OK`) um total de **83 diários oficiais** que continham pelo menos um dos termos pesquisados.

**Trecho da Resposta JSON:**

```json
{
    "total_gazettes": 83,
    "gazettes": [
        {
            "territory_id": "3304557",
            "date": "2024-01-11",
            "territory_name": "Rio de Janeiro",
            "excerpts": [
                "LTDA 181 R$ 110.413,86\n\n182 CI0519/05/2023 1614312\nCENTRAL DISTRIBUIDORA ADMINISTRACAO E \n\n...",
                "DO RIO DE JANEIRO SA / RTONCO RJ\n183 R$ 16.261,26\n\n184 CI0219/05/2023 5990297 CENTRO DE EXCELENCIA ONCOLOGICA S A 184 R$ 225.908,03..."
            ]
        },
        {
            "territory_id": "3304557",
            "date": "2024-10-15",
            "territory_name": "Rio de Janeiro",
            "excerpts": [
                "...370 CI0407/08/2024 428515 COI CLINICAS ONCOLOGICAS INTEGRADAS SA 39.086.160/0001-30 Habilitado R$ 1.928.211,47 R$ 220.940,71\n\n..."
            ]
        }
    ]
}
````

### Principais Descobertas do Teste

1.  **Qualidade dos Dados:** O texto no campo `excerpts` é bruto e não estruturado, exigindo um processamento significativo (parsing) para extrair informações úteis como nomes de empresas e, principalmente, valores financeiros.
2.  **Flexibilidade da `querystring`:** O parâmetro `querystring` aceita múltiplos termos separados por vírgula, o que aumenta a abrangência da busca e o número de resultados relevantes.
3.  **Limitação Crítica da API:** Em testes subsequentes, foi validado que a API do Querido Diário **não permite a consulta de múltiplos `territory_ids` em uma única requisição.** Cada município deve ser consultado individualmente.

-----

## 📌 O Problema e a Solução

### O Problema: A Inviabilidade da Abordagem em Tempo Real

O design do OncoMap exige a visualização de dados agregados por região (ex: "Região Sudeste"). A Região Sudeste possui **1.668 municípios**.

Considerando a **Limitação Crítica** descoberta (só é possível consultar um município por vez), a abordagem **sem banco de dados** exigiria que o nosso backend fizesse **1.668 chamadas sequenciais ou paralelas** à API do Querido Diário **toda vez que um usuário clicasse na Região Sudeste**.

**Análise de Tempo de Resposta (Estimativa):**

  * Tempo médio de uma requisição à API externa: \~1.5 segundos.
  * Tempo total para consultar a Região Sudeste: `1668 municípios * 1.5s/município = 2502 segundos`.
  * **Resultado: Aproximadamente 41 minutos de espera para o usuário.**

> Esta análise comprova que a abordagem em tempo real é tecnicamente inviável e resultaria em uma experiência de usuário inaceitável.

### A Solução: Arquitetura com Banco de Dados Próprio

A solução definitiva é a adoção de uma arquitetura que desacopla a coleta de dados da exibição.

**Diagrama da Arquitetura:**

```
[Frontend (Mapa)] <--> [Nossa API (Rápida)] <--> [Nosso Banco de Dados (PostgreSQL)]

[Coletor (Lento, em background)] --(faz as 1.668+ chamadas)--> [API Querido Diário] --(salva os dados)--> [Nosso Banco de Dados]
```

**Como Funciona:**

1.  **Fase de Coleta (Offline):** Um script "Coletor" (`collector.js`) é executado em segundo plano. Ele tem a paciência de fazer as milhares de chamadas necessárias à API do Querido Diário, processar os textos, extrair os valores, categorizar as informações e salvar tudo de forma limpa e estruturada no nosso banco de dados PostgreSQL.
2.  **Fase de Exibição (Tempo Real):** Quando o usuário clica na "Região Sudeste", nossa API executa uma **única e otimizada consulta SQL** ao **nosso próprio banco de dados**. Essa operação busca os dados já processados e agregados.

**Comparativo de Performance:**

| Abordagem | Tempo de Resposta (Consulta de Região) | Experiência do Usuário |
| :--- | :--- | :--- |
| **Sem Banco de Dados** | **\~41 minutos** | Inaceitável / Quebrado |
| **Com Banco de Dados**| **\~100 - 500 milissegundos** | Instantânea |

-----

## 💡 Ideia Conclusiva

A utilização de um banco de dados próprio (PostgreSQL) não é apenas uma melhoria, mas um **requisito fundamental** para a viabilidade do projeto OncoMap. Ele permite transformar um processo de coleta de dados lento e complexo em uma experiência de usuário rápida, fluida e rica em informações, além de ser o alicerce para funcionalidades avançadas como a geração de relatórios com LLM.

-----

## 📌 Critérios de Aceitação de Performance

Com a arquitetura de banco de dados definida, estabelecemos o seguinte critério de aceitação para a performance da nossa API interna:

  - **Toda e qualquer requisição do frontend para a nossa API de backend (`/api/...`) que busque dados para exibição no mapa (seja por município, estado ou região) deve ter um tempo de resposta inferior a `500ms`.**

-----

## 🔗 Links Úteis

  * [Documentação da API Querido Diário](https://queridodiario.ok.org.br/api/docs)
  * [GitHub do Querido Diário](https://github.com/okfn-brasil/querido-diario-api)

<!-- end list -->

```
```
