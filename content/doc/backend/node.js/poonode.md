---
title: "Poonode"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

# Funcionalidades do Node.js/JavaScript

## 1. `.bind`
Cria uma nova função com o `this` fixado ao valor especificado.

```js
function saudacao() {
  console.log(`Olá, ${this.nome}`);
}

const pessoa = { nome: "Artur" };
const saudacaoPessoa = saudacao.bind(pessoa);
saudacaoPessoa(); // "Olá, Artur"
```

---

## 2. `.call`
Executa uma função, especificando o valor de `this` e argumentos individualmente.

```js
function apresentar(cidade) {
  console.log(`${this.nome} mora em ${cidade}`);
}

const pessoa = { nome: "Maria" };
apresentar.call(pessoa, "Recife"); // "Maria mora em Recife"
```

---

## 3. `.apply`
Parecido com `.call`, mas os argumentos são passados em **array**.

```js
function somar(a, b) {
  return a + b;
}

console.log(somar.apply(null, [5, 7])); // 12
```

---

## 4. `Object.setPrototypeOf`
Define o protótipo (herança) de um objeto.

```js
const animal = {
  falar() {
    console.log("Som genérico");
  }
};

const cachorro = { nome: "Rex" };
Object.setPrototypeOf(cachorro, animal);
cachorro.falar(); // "Som genérico"
```

---

## 5. `class` e `new`
Sintaxe de classe para criar objetos e instanciar com `new`.

```js
class Pessoa {
  constructor(nome) {
    this.nome = nome;
  }
}

const p1 = new Pessoa("Lucas");
console.log(p1.nome); // "Lucas"
```

---

## 6. `Object.create()`
Cria um novo objeto com o protótipo especificado.

```js
const animal = {
  tipo: "Mamífero"
};

const gato = Object.create(animal);
gato.nome = "Mingau";

console.log(gato.tipo); // "Mamífero"
```

---

## 7. Getters e Setters
Permitem acessar e modificar propriedades de forma controlada.

```js
class Retangulo {
  constructor(l, a) {
    this.l = l;
    this.a = a;
  }
  get area() {
    return this.l * this.a;
  }
  set largura(valor) {
    this.l = valor;
  }
}

const r = new Retangulo(10, 5);
console.log(r.area); // 50
r.largura = 20;
console.log(r.area); // 100
```

---

## 8. Métodos Estáticos
Pertencem à classe, não à instância.

```js
class Matematica {
  static soma(a, b) {
    return a + b;
  }
}

console.log(Matematica.soma(5, 7)); // 12
```

---

## 9. Polimorfismo
Capacidade de métodos terem comportamentos diferentes em classes diferentes.

```js
class Animal {
  falar() {
    console.log("Som genérico");
  }
}

class Cachorro extends Animal {
  falar() {
    console.log("Au au");
  }
}

class Gato extends Animal {
  falar() {
    console.log("Miau");
  }
}

const animais = [new Cachorro(), new Gato()];
animais.forEach(a => a.falar());
// "Au au"
// "Miau"
```

---

## 10. Modificadores de Acesso (`#` e outros)
Em JavaScript moderno, o `#` é usado para criar **campos privados** em classes. Esses campos só podem ser acessados dentro da própria classe.

- **Público (default):** acessível de qualquer lugar.
- **Privado (`#`):** acessível apenas dentro da classe.
- **Protegido (convenção `_`):** não existe nativamente, mas é usado como convenção para indicar que não deve ser acessado diretamente.

```js
class ContaBancaria {
  #saldo = 0; // campo privado

  depositar(valor) {
    this.#saldo += valor;
  }

  getSaldo() {
    return this.#saldo;
  }
}

const conta = new ContaBancaria();
conta.depositar(100);
console.log(conta.getSaldo()); // 100
console.log(conta.#saldo); // Erro: campo privado
```
