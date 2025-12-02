---
title: "Typescript"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

# Estudo de TypeScript


O **TypeScript** é um superset do JavaScript que adiciona **tipagem estática** e recursos avançados para facilitar o desenvolvimento de aplicações mais seguras e organizadas.


---


## 1. Configuração Inicial


Instalar TypeScript globalmente:
```bash
npm install -g typescript
```


Verificar versão:
```bash
tsc -v
```


Criar arquivo de configuração:
```bash
tsc --init
```


---

## 2. Tipos Básicos
```ts
let dados: unknown;
dados = "texto";
dados = 42;
```


---


## 3. Funções


### Tipagem de parâmetros e retorno
```ts
function soma(a: number, b: number): number {
return a + b;
}
```


### Parâmetros opcionais e padrão
```ts
function saudacao(nome: string, saudacao: string = "Olá"): string {
return `${saudacao}, ${nome}`;
}
```


---


## 4. Objetos e Interfaces


### Tipando objetos
```ts
let pessoa: { nome: string; idade: number } = {
nome: "João",
idade: 25
};
```


### Interfaces
```ts
interface Usuario {
id: number;
nome: string;
ativo?: boolean; // opcional
}


let usuario1: Usuario = {
id: 1,
nome: "Carlos"
};
```


---

## 5. Classes 

```ts 
class Animal{
    nome: string;

    contructor(nome: string){
        this.nome = nome;
    }
    fazersom(): void {
        console.log("Som genérico...");
    }
}
class cachorro extend Animal {
    fazersom(): void{
        console.log("Au Au");
    }
}
let dog = new cachorro("Rex");
dog.fazersom();
```

---

## 6. Generics

Generics permitem reutilizar código de foma tipada.

``` ts 
function identidade<T>(valor: T): T {
    return valor;
}

let num = identidade<number>(10);
let texto = identidade<string>("Olá");
```

---

## 7. Tipos Avançados

## Union Types
```ts
let id : number | string;
id = 10;
id = "abc123";
```
## Types Alias
```ts
interface Pessoa{
    nome: string;
}
interface Funcionario{
    salario: number;
}

let trabalhador: Pessoa & Funcionario = {
    nome: "Ana",
    salario: 10.000
};
```

---

## 8. Módulos


```ts
// arquivo: math.ts
export function soma(a: number, b: number): number {
return a + b;
}


// arquivo: app.ts
import { soma } from "./math";


console.log(soma(2, 3));
```


---


## 9. Compilação


Compilar arquivo TS para JS:
```bash
tsc arquivo.ts
```


Compilar projeto (usando `tsconfig.json`):
```bash
tsc
```


Rodar em tempo real com `ts-node`:
```bash
npx ts-node arquivo.ts
```


---


## 10. Boas Práticas


✔ **Prefira `unknown` ao invés de `any`** → força verificação de tipo.
```ts
function processa(dado: unknown) {
if (typeof dado === "string") {
console.log(dado.toUpperCase());
}
}
```


✔ **Use interfaces ou types para tipar objetos** → melhora a legibilidade.


✔ **Sempre tipar parâmetros e retornos de funções** → evita comportamento inesperado.


✔ **Organize seu código em módulos** → melhora a manutenção.


✔ **Ative opções de segurança no `tsconfig.json`** como `strict` e `noImplicitAny`.


---


## 11. Erros Comuns


❌ **Usar `any` em todo lugar**
Isso anula os benefícios do TypeScript.


❌ **Não inicializar variáveis obrigatórias em classes**
```ts
class Pessoa {
nome: string; // erro se não for inicializado
constructor(nome: string) {
this.nome = nome;
}
}
```


❌ **Misturar tipagem dinâmica e estática de forma confusa**
```ts
let valor: number | string = 10;
valor.toFixed(); // erro, pois também pode ser string
```
✅ Solução: usar *type guards*.


❌ **Esquecer de compilar antes de rodar**
Lembre-se de que o navegador não entende TypeScript diretamente.


---


## 12. Conclusão


O TypeScript ajuda a:
- Evitar erros comuns de tipagem.
- Melhorar a manutenção de projetos grandes.
- Aumentar a produtividade com autocompletar e IntelliSense.


> Dica: comece tipando aos poucos, em projetos pequenos, e vá avançando para conceitos como **decorators, namespaces e utility types** quando dominar os fundamentos.
