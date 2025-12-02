
# 🛡️ Documentação de Garantia de Qualidade (QA) - OncoMap

Este documento detalha as estratégias de qualidade de código, testes automatizados e critérios de aceitação utilizados no projeto **OncoMap** para garantir robustez e manutenibilidade.

---

## 1. 🧹 Linter e Qualidade Estática

Utilizamos ferramentas de análise estática para garantir consistência no estilo de código e prevenir erros comuns antes mesmo da execução.

### ⚙️ Configuração

| Item | Descrição |
|------|-----------|
| Ferramenta | ESLint |
| Arquivo | `eslint.config.js` |
| Extensões analisadas | `.js`, `.ts`, `.tsx` |
| Ambientes | Node.js (Backend) e Browser (Frontend/React) |

### 📌 Regras de Estilo Aplicadas

As principais regras aplicadas incluem:

- **Ponto e vírgula:** obrigatório — `semi: ["error", "always"]`
- **Aspas simples** como padrão — `quotes: ["error", "single"]`
- Erro para **variáveis não utilizadas** — `no-unused-vars: "error"`
- Validação de hooks React — `react-hooks/exhaustive-deps`
- `console.log` proibido em produção — `no-console: ["warn"]`

📍 Comando para verificação:

```sh
npm run lint
````

---

## 2. 🧪 Estratégia de Testes

O projeto utiliza **Jest** para testes unitários e de integração no backend.

---

### 📊 Cobertura de Testes (Coverage)

Buscamos manter alta cobertura principalmente nos módulos críticos.

| Arquivo               | % Statements | % Branch | % Functions | % Lines |
| --------------------- | ------------ | -------- | ----------- | ------- |
| **Todos os Arquivos** | 88.11%       | 69.14%   | 100%        | 90.5%   |
| api/controllers       | 87.56%       | 66.27%   | 100%        | 90.05%  |
| reportController.js   | 83.09%       | 58.06%   | 100%        | 86.17%  |
| statsController.js    | 100%         | 87.5%    | 100%        | 100%    |
| utils/regionMap.js    | 100%         | 100%     | 100%        | 100%    |

> 🏆 regionMap.js e statsController.js possuem cobertura **total (100%)**.

---

## 3. 📄 Relatório de Testes Implementados

Com base nos arquivos de teste localizados em `src/tests/`.

---

### 3.1. 🧱 Testes Unitários — `reportController`

O foco é validar:

📌 **Geração de PDF**
📌 **Chamadas à IA (Gemini)**
📌 **Erros de conexão e dados inválidos**

#### Casos Cobertos

| Cenário                          | Resultado Esperado             |
| -------------------------------- | ------------------------------ |
| Geração de relatório por região  | 🟩 PDF gerado corretamente     |
| Região inválida                  | 🟥 `400 Bad Request`           |
| Falha no BD                      | 🟥 `500 Internal Server Error` |
| Geração estadual válida (ex: SP) | 🟩 PDF gerado                  |
| Estado sem dados                 | 🟥 `404 Not Found`             |
| Geração municipal válida         | 🟩 Sucesso                     |
| Munícipio inexistente            | 🟥 `404 Not Found`             |

---

### 3.2. 🔁 Testes de Integração — `statsController`

Validam:

🧮 Agregações por **Estado/Município**
📊 Totais de investimento
📥 Estrutura final entregue ao front

#### Casos Cobertos

| Endpoint                       | Cenários Testados                            |
| ------------------------------ | -------------------------------------------- |
| `getGeneralStats`              | Sucesso 200 + erro 500                       |
| `getStateSpecificStats`        | Soma correta + estado sem dados              |
| `getMunicipalitySpecificStats` | Cálculo de categorias + código IBGE inválido |

📌 Caso crítico validado:

> Duas menções → 50 + 100 → total de **150** na categoria `medicamentos` ✔

---

## 4. 🛠️ Critérios de Qualidade Estática


| Critério         | Requisito                             |
| ---------------- | ------------------------------------- |
| Lint             | `npm run lint` sem erros              |
| Testes           | `npm test` deve passar completamente  |
| Cobertura        | Novas features **com testes**         |
| Código           | Sem variáveis/ imports não utilizados |
| Manutenibilidade | Seguir padrões definidos no ESLint    |

Caso não siga, sera mostrado um erro no commit.
