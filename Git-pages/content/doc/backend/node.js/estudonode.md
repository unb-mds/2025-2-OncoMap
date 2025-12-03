---
title: "Estudonode"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

# Estudo Node.js

## Tipos de dados
| Tipo        | Descrição                                             | Exemplo                                     |
| ----------- | ----------------------------------------------------- | ------------------------------------------- |
| `Number`    | Números inteiros ou decimais                          | `let idade = 25;` `let preco = 19.99;`      |
| `String`    | Texto, caracteres entre aspas                         | `let nome = "Artur";`                       |
| `Boolean`   | Verdadeiro ou falso                                   | `let ativo = true;`                         |
| `Undefined` | Variável declarada mas sem valor                      | `let valor;`                                |
| `Null`      | Valor intencionalmente vazio                          | `let resultado = null;`                     |
| `BigInt`    | Números muito grandes                                 | `let numeroGrande = 12345678901234567890n;` |
| `Symbol`    | Valor único e imutável, geralmente para identificação | `let id = Symbol("id");`                    |

## Tipos de referência
| Tipo       | Descrição                                               | Exemplo                                       |
| ---------- | ------------------------------------------------------- | --------------------------------------------- |
| `Object`   | Estrutura que armazena múltiplos valores e propriedades | `let pessoa = { nome: "Ana", idade: 30 };`    |
| `Array`    | Lista de valores                                        | `let frutas = ["maçã", "banana", "laranja"];` |

• Objetos e arrays são amplamente usados para armazenar dados de usuários, configurações e respostas de APIs.
## Variáveis 
### Existem 3 tipos de variáveis:
| Palavra-chave | Escopo | Mutável? | Exemplo         |
| ------------- | ------ | -------- | --------------- |
| `var`         | Função | Sim      | `var x = 10;`   |
| `let`         | Bloco  | Sim      | `let y = 20;`   |
| `const`       | Bloco  | Não      | `const z = 30;` |

• Em Node.js o `var` vem caindo em desuso ao longo do tempo e hoje em dia quase não é utilizado
## Funções
### Funções são blocos de código reutilizáveis. Existem três principais formas:
#### Tradicional
```
function soma(a, b) {
  return a + b;
}
console.log(soma(2,3)); // 5
```
#### Anônima atribuída a variável
```
const multiplicar = function(a, b) {
  return a * b;
};
console.log(multiplicar(2,3)); // 6
```
#### Arrow function
```
const dividir = (a, b) => a / b;
console.log(dividir(6,2)); // 3
```
• Arrow functions são ideais para callbacks e funções assíncronas, como eventos e leitura de arquivos.
