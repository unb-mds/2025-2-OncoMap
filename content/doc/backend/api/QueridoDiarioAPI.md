---
title: "Queridodiarioapi"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

# Querido Diário API - Documentação para Issue

---

## 📖 Contexto

No projeto **Radar de investimento em saúde oncológica nos municípios**, utilizaremos a API pública do **Querido Diário**, que disponibiliza os diários oficiais municipais de forma acessível para consulta e análise.

---

## API do Querido Diário

A API do **Querido Diário** segue o modelo **REST**, baseada em requisições HTTP, retornando dados no formato **JSON**. Ela permite consultar e filtrar publicações dos diários oficiais de diferentes municípios brasileiros.

Principais características:

* **REST:** arquitetura utilizada, simples e amplamente compatível.
* **Formato de Resposta:** JSON.
* **Filtros disponíveis:** município (código IBGE), palavras-chave, intervalo de datas.

---

## Como funciona a API

1. O **cliente** (nosso sistema) envia uma requisição HTTP para um endpoint (por exemplo: `/gazettes`).
2. O **servidor** da API processa a requisição e busca as publicações correspondentes.
3. A **resposta** é enviada em JSON, contendo os resultados encontrados.

Exemplo de requisição:

```http
GET /api/gazettes?territory_ids=4314902&published_since=2023-01-01&published_until=2023-12-31&querystring=oncologia
Host: queridodiario.ok.org.br
Accept: application/json
```

Resposta:

```json
{
  "gazettes": [
    {
      "territory_id": "4314902",
      "date": "2023-03-10",
      "url": "https://queridodiario.ok.org.br/gazettes/4314902/2023-03-10.pdf",
      "excerpt": "... contratação de serviços de oncologia clínica ..."
    }
  ]
}
```

---

## Principais Endpoints

### `/gazettes`

Permite consultar os diários oficiais.

**Parâmetros principais:**

* `querystring` → termo de busca (ex.: *oncologia*, *câncer*, *quimioterapia*).
* `territory_ids` → código IBGE do município (ex.: Porto Alegre = `4314902`).
* `published_since` → data inicial (AAAA-MM-DD).
* `published_until` → data final (AAAA-MM-DD).

---

## Tecnologias de apoio

Para testar e documentar a API do Querido Diário, podemos usar ferramentas como:

* **Postman** → testar requisições e organizar coleções.
* **Swagger (OpenAPI)** → a própria API já oferece documentação interativa.

---

## Passos de Uso no Projeto

1. **Definir municípios de interesse** (lista com códigos IBGE).
2. **Listar palavras-chave** relacionadas à oncologia (ex.: quimioterapia, radioterapia, medicamentos oncológicos).
3. **Implementar coleta** usando scripts (ex.: Python + `requests`).
4. **Armazenar dados** em CSV ou banco de dados.
5. **Analisar resultados** para identificar padrões de investimento e publicações.

---

## Vantagens e Limitações

### ✅ Vantagens

* Dados públicos e acessíveis.
* Permite buscas flexíveis por texto.
* Respostas em JSON, fáceis de manipular.

### ⚠️ Limitações

* Nem todos os municípios possuem cobertura completa.
* É necessário processar os textos para extrair valores financeiros.
* Termos variam conforme a redação de cada diário.

---

## Possíveis Extensões Futuras

* Integração com bases de dados de licitação (Portal da Transparência, ComprasNet).
* Construção de dashboards interativos para análise por município/estado.
* Uso de NLP (Processamento de Linguagem Natural) para detectar automaticamente investimentos em saúde oncológica.

---

## 📌 Resumo

* **API utilizada:** Querido Diário (REST, pública).
* **Endpoint principal:** `/gazettes`.
* **Filtros principais:** `querystring`, `territory_ids`, `published_since`, `published_until`.
* **Objetivo:** buscar e analisar menções a investimentos em saúde oncológica nos municípios brasileiros.

---

## Links Úteis

* [Documento Api QueridoDiário](https://queridodiario.ok.org.br/api/docs)
* [GitHub QueridoDiário](https://github.com/okfn-brasil/querido-diario-api)

