---
title: "Objetosnode"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

# 📑 Resumo de Objetos do Node.js / JavaScript
## 🔹 Manipulação de Objetos
- **`for...in`**
  Percorre todas as propriedades enumeráveis de um objeto (incluindo herdadas da cadeia de protótipos). <br>
  Útil para iterar chaves de um objeto.

  ```js
  const user = { name: "Ana", age: 25 };
  for (let key in user) {
    console.log(key, user[key]); // name Ana / age 25
  }
  
- **`typeof`**
Retorna uma string com o tipo de um valor ou variável.
Em objetos, retorna "object".

  ```js
  typeof { a: 1 }; // "object"
  typeof null;     // "object" (curiosidade histórica do JS)
  
- **`Object.keys()`**
Retorna um array com as chaves próprias de um objeto.

  ```js
  Object.keys({ a: 1, b: 2 }); // ["a", "b"]
  
- **`Object.values()`**
Retorna um array com os valores das chaves de um objeto.

  ```js
  Object.values({ a: 1, b: 2 }); // [1, 2]
  
- **`Object.entries()`**
Retorna um array de arrays, com cada par [chave, valor].

  ```js
  Object.entries({ a: 1, b: 2 });
  // [["a", 1], ["b", 2]]
  
- **`Object.assign()`**
Copia propriedades de um ou mais objetos para outro.
Muito usado para clonar ou fundir objetos.
  ```js
  const obj1 = { a: 1 };
  const obj2 = { b: 2 };
  const result = Object.assign({}, obj1, obj2);
  // { a: 1, b: 2 }
- **`Object.defineProperty()`**
Define ou modifica uma propriedade com características específicas (enumerável, configurável, gravável).
  ```js
  const obj = {};
  Object.defineProperty(obj, "secret", {
    value: 123,
    writable: false,
    enumerable: false
  });
  console.log(obj.secret); // 123
- **`Semelhanças com JSON`**
Um objeto em JS é estrutura viva (com métodos e referências).
JSON é texto em formato estruturado, usado para transmissão de dados.
  ```js
  const obj = { name: "Ana" };
  const json = '{"name":"Ana"}';

  typeof obj;  // "object"
  typeof json; // "string"
### require() vs import
- **`require()`**
Sintaxe do CommonJS (usada nativamente no Node.js).
Carrega módulos de forma síncrona.

  ```js
  const fs = require("fs");
- **`import`**
Sintaxe do ESM (ECMAScript Modules).
Recurso mais novo, usado também no navegador.
  ```js
  import fs from "fs";
#### Diferença principal:
require() → executa na hora da chamada.
import → carregado antes da execução, com suporte a tree-shaking.
- **`.exports`**
Em Node.js, é como um objeto especial que define o que será exportado de um módulo.
Pode ser usado de duas formas:

  ```js
  // exportando várias coisas
  module.exports = { soma, multiplica };
  ```
  ```js
  // exportando algo único
  module.exports = soma;
- **`JSON.stringify()`**
Converte um objeto em string JSON.

  ```js
  JSON.stringify({ a: 1 }); // '{"a":1}'
- **`JSON.parse()`**
Converte uma string JSON em objeto.

  ```js
  JSON.parse('{"a":1}'); // { a: 1 }
- **`.find()`**
Método de arrays, mas útil em arrays de objetos.
Retorna o primeiro elemento que satisfaz a condição.

  ```js
  const users = [{ id: 1 }, { id: 2 }];
  users.find(u => u.id === 2); // { id: 2 }
- **`.hasOwnProperty()`**
Verifica se a propriedade pertence diretamente ao objeto (não herdada do protótipo).

  ```js
  const obj = { a: 1 };
  obj.hasOwnProperty("a"); // true
- **`.sort()`**
Ordena um array de strings ou números, mas também pode ser usado com objetos.

  ```js
  [3, 1, 2].sort(); // [1, 2, 3]
  ["b", "a"].sort(); // ["a", "b"]

  const users = [{ age: 20 }, { age: 15 }];
  users.sort((a, b) => a.age - b.age);
  // [{ age: 15 }, { age: 20 }]
