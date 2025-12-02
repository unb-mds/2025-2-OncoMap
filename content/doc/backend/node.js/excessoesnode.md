---
title: "Excessoesnode"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

# Funcionalidades do Node.js

Aqui estão algumas funcionalidades e recursos do Node.js explicados
brevemente, com exemplos.

------------------------------------------------------------------------

## `process.argv`

Permite acessar os argumentos passados na linha de comando ao executar
um script Node.js.

``` js
// exemplo.js
console.log(process.argv);
```

Executando:

``` bash
node exemplo.js ola mundo
```

Saída:

    ['node', '/caminho/exemplo.js', 'ola', 'mundo']

------------------------------------------------------------------------

## `fs` (biblioteca)

Módulo do Node.js para manipulação de arquivos.

``` js
const fs = require('fs');
fs.readFile('arquivo.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

------------------------------------------------------------------------

## `readFile`

Função da biblioteca `fs` para ler arquivos.

``` js
const fs = require('fs');
fs.readFile('texto.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

------------------------------------------------------------------------

## `.split`

Divide uma string em partes, retornando um array.

``` js
const frase = "Node.js é incrível";
console.log(frase.split(" ")); // ['Node.js', 'é', 'incrível']
```

------------------------------------------------------------------------

## Escape Characters

-   `\'` insere aspas simples
-   `\"` insere aspas duplas
-   `\\` insere barra invertida
-   `\n` nova linha
-   `\r` retorno de carro
-   `\t` tabulação
-   `\b` backspace

``` js
console.log('Linha 1\nLinha 2');
```

------------------------------------------------------------------------

## Expressão Regular

Padrões para busca e manipulação de strings.

``` js
const regex = /\d+/g;
console.log("Ano 2025".match(regex)); // ['2025']
```

------------------------------------------------------------------------

## `.replace`

Substitui partes de uma string.

``` js
console.log("Ola Mundo".replace("Mundo", "Node.js"));
```

------------------------------------------------------------------------

## `.flatMap`

Mapeia e "achata" arrays em um só.

``` js
const arr = [1, 2, 3];
console.log(arr.flatMap(x => [x, x * 2]));
// [1, 2, 2, 4, 3, 6]
```

------------------------------------------------------------------------

## `try`, `catch`, `throw`

Tratamento de erros.

``` js
try {
  throw new Error("Algo deu errado");
} catch (err) {
  console.error(err.message);
}
```

------------------------------------------------------------------------

## `new Error`

Cria um objeto de erro.

``` js
const erro = new Error("Falha no sistema");
console.log(erro.message);
```

------------------------------------------------------------------------

## `"type": "module"`

Configuração no `package.json` para usar ES Modules (`import/export`).

``` json
{
  "type": "module"
}
```

------------------------------------------------------------------------

## `export` e `export default`

Exportam funções/variáveis de módulos.

``` js
// soma.js
export function soma(a, b) { return a + b; }
export default soma;
```

``` js
// index.js
import soma, { soma as somar } from './soma.js';
console.log(soma(2, 3));
```

------------------------------------------------------------------------

## `writeFile`

Escreve conteúdo em um arquivo.

``` js
const fs = require('fs');
fs.writeFile('saida.txt', 'Olá Node.js', err => {
  if (err) throw err;
  console.log('Arquivo salvo!');
});
```

------------------------------------------------------------------------

## `.promises`

API de promessas da biblioteca `fs`.

``` js
const fs = require('fs').promises;
async function exemplo() {
  await fs.writeFile('teste.txt', 'Conteúdo');
}
exemplo();
```

------------------------------------------------------------------------

## `async` e `await`

Sintaxe para trabalhar com Promises de forma mais simples.

``` js
async function ola() {
  return "Olá";
}

ola().then(console.log);
```

------------------------------------------------------------------------

## `.then`

Executa algo quando a Promise é resolvida.

``` js
Promise.resolve(42).then(valor => console.log(valor));
```

------------------------------------------------------------------------

## `finally`

Executa após a conclusão de uma Promise, com sucesso ou erro.

``` js
Promise.resolve("ok")
  .then(console.log)
  .finally(() => console.log("Finalizado"));
```

------------------------------------------------------------------------

## `Promise.all`

Executa várias Promises em paralelo e aguarda todas terminarem.

``` js
Promise.all([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(console.log); // [1, 2, 3]
```
