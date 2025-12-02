---
title: "Etapa2 React Comunicacao"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---


# Etapa 2 — Comunicação entre componentes (Props, State e Eventos)

Bem-vindo(a) à etapa onde o React começa a **ficar interativo**. Aqui você vai aprender **como os componentes conversam entre si** e **como a interface reage às ações do usuário**.

---

## 1) Props — passando dados do pai para o filho

**O que são?**  
*Props* (propriedades) são **dados que o componente pai envia para o componente filho**.  
Dentro do filho, as props são **somente leitura** (imutáveis).

### 1.1 Exemplo básico
```jsx
// Botao.jsx
export default function Botao(props) {
  return <button>{props.texto}</button>;
}

// App.jsx
import Botao from "./Botao";

export default function App() {
  return (
    <div>
      <h1>Exemplo de Props</h1>
      <Botao texto="Clique aqui" />
      <Botao texto="Enviar formulário" />
    </div>
  );
}
```

### 1.2 Desestruturação (mais comum no dia a dia)
```jsx
export default function Botao({ texto }) {
  return <button>{texto}</button>;
}
```

### 1.3 Tipos comuns de props
- **string/number/boolean**: `<Preco valor={19.9} />`
- **array/objeto**: `<Lista itens={['a','b']} />`
- **funções (callbacks)**: `<Form onSubmit={handleSubmit} />`
- **elementos/JSX** pelo `children`: `<Card><p>Conteúdo</p></Card>`

### 1.4 Children prop (componente “embrulhador”)
```jsx
// Card.jsx
export default function Card({ children }) {
  return <div className="card">{children}</div>;
}

// App.jsx
<Card>
  <h2>Título</h2>
  <p>Qualquer conteúdo aqui dentro vai para o children.</p>
</Card>
```

### 1.5 Passando **funções** via props (filho → aciona algo no pai)
```jsx
// Produto.jsx (filho)
export default function Produto({ nome, onAdicionar }) {
  return (
    <div>
      <span>{nome}</span>
      <button onClick={onAdicionar}>Adicionar</button>
    </div>
  );
}

// App.jsx (pai)
import { useState } from "react";
import Produto from "./Produto";

export default function App() {
  const [quantidade, setQuantidade] = useState(0);

  function adicionarAoCarrinho() {
    setQuantidade(q => q + 1);
  }

  return (
    <div>
      <h1>Carrinho: {quantidade}</h1>
      <Produto nome="Teclado" onAdicionar={adicionarAoCarrinho} />
      <Produto nome="Mouse" onAdicionar={adicionarAoCarrinho} />
    </div>
  );
}
```

> **Por que isso é importante?** Props levam **dados e funções** para baixo na árvore. Quando o filho precisa “avisar” algo ao pai, ele **chama a função** recebida por props.

---

## 2) State — valores que mudam com o tempo

**O que é?**  
O *state* é a **memória interna** de um componente. Quando o state muda, o React **re-renderiza** e a interface é atualizada.

### 2.1 Sintaxe básica com `useState`
```jsx
import { useState } from "react";

export default function Contador() {
  const [numero, setNumero] = useState(0); // 0 = valor inicial

  return (
    <div>
      <p>Você clicou {numero} vezes</p>
      <button onClick={() => setNumero(numero + 1)}>Clique</button>
    </div>
  );
}
```

### 2.2 Atualização baseada no valor anterior (**forma segura**)
```jsx
setNumero((anterior) => anterior + 1);
```
> Use essa forma quando a atualização depender do valor anterior. Evita bugs com atualizações em lote.

### 2.3 **Não mutar** o state diretamente
- **Errado (objeto):**
  ```jsx
  estado.usuario.nome = "Ana"; // não faça isso
  setEstado(estado);           // não dispara re-render corretamente
  ```
- **Certo (cópia imutável):**
  ```jsx
  setEstado(prev => ({
    ...prev,
    usuario: { ...prev.usuario, nome: "Ana" }
  }));
  ```

- **Listas (adicionar/remover/editar)**
  ```jsx
  // adicionar
  setItens(prev => [...prev, novoItem]);

  // remover
  setItens(prev => prev.filter(item => item.id !== id));

  // editar
  setItens(prev => prev.map(it => it.id === id ? { ...it, nome: "Novo" } : it));
  ```

### 2.4 Inputs controlados (state + input)
```jsx
import { useState } from "react";

export default function Formulario() {
  const [nome, setNome] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // evita reload da página
    alert(`Olá, ${nome}!`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Digite seu nome"
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

### 2.5 **Lifting state up** (subir o estado para o pai)
Quando **dois ou mais componentes** precisam do **mesmo dado**, mova o state para o **ancestral comum** e passe props para os filhos.

```jsx
// Filtro.jsx (filho - apenas emite eventos)
export default function Filtro({ termo, onChange }) {
  return (
    <input
      value={termo}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Filtrar produtos"
    />
  );
}

// Lista.jsx (filho - recebe dados filtrados)
export default function Lista({ itens }) {
  return (
    <ul>
      {itens.map((p) => <li key={p.id}>{p.nome}</li>)}
    </ul>
  );
}

// App.jsx (pai - guarda o state compartilhado)
import { useState } from "react";
import Filtro from "./Filtro";
import Lista from "./Lista";

const TODOS = [
  { id: 1, nome: "Teclado" },
  { id: 2, nome: "Mouse" },
  { id: 3, nome: "Monitor" },
];

export default function App() {
  const [termo, setTermo] = useState("");

  const filtrados = TODOS.filter(p =>
    p.nome.toLowerCase().includes(termo.toLowerCase())
  );

  return (
    <div>
      <Filtro termo={termo} onChange={setTermo} />
      <Lista itens={filtrados} />
    </div>
  );
}
```

---

## 3) Eventos — reagindo a ações do usuário

### 3.1 Eventos mais usados
- `onClick` — clique em botão/elemento
- `onChange` — mudança em inputs
- `onSubmit` — envio de formulário
- `onKeyDown`, `onKeyUp`, `onMouseEnter`, etc.

### 3.2 Exemplos práticos
```jsx
<button onClick={() => alert("Clicou!")}>Clique</button>
```

Passando **parâmetros** para o handler:
```jsx
function remover(id) {
  console.log("remover", id);
}

<button onClick={() => remover(42)}>Remover item 42</button>
```

Formulário com `preventDefault`:
```jsx
function handleSubmit(e) {
  e.preventDefault();
  // ...enviar dados
}
<form onSubmit={handleSubmit}>...</form>
```

### 3.3 Dica: nomeie callbacks que vêm por props com `onAlgo`
```jsx
// Filho
export default function Item({ id, nome, onRemover }) {
  return <button onClick={() => onRemover(id)}>Remover {nome}</button>;
}

// Pai
<Item id={7} nome="Mouse" onRemover={handleRemover} />
```

---

## 4) Exemplo integrado (props + state + eventos)

```jsx
// ContadorComPasso.jsx
import { useState } from "react";

export default function ContadorComPasso({ passoInicial = 1 }) {
  const [valor, setValor] = useState(0);
  const [passo, setPasso] = useState(passoInicial);

  return (
    <div>
      <h3>Valor: {valor}</h3>

      <label>
        Passo: 
        <input
          type="number"
          value={passo}
          onChange={(e) => setPasso(Number(e.target.value) || 0)}
        />
      </label>

      <div>
        <button onClick={() => setValor(v => v + passo)}>+ {passo}</button>
        <button onClick={() => setValor(v => v - passo)}>- {passo}</button>
        <button onClick={() => setValor(0)}>Zerar</button>
      </div>
    </div>
  );
}

// App.jsx
import ContadorComPasso from "./ContadorComPasso";

export default function App() {
  return (
    <div>
      <h1>Demo: Props + State + Eventos</h1>
      <ContadorComPasso passoInicial={2} />
      <ContadorComPasso passoInicial={5} />
    </div>
  );
}
```

---

## 5) Erros comuns (e como evitar)

1. **Espaço nas rotas/links** gerando `%20`  
   Use `to="/states"` (sem espaço antes).

2. **Mutação direta do state** (não re-renderiza corretamente)  
   Sempre crie **cópias** (`{ ...obj }`, `[...array]`).

3. **Atualização baseada no valor anterior sem função**  
   Prefira `setX(prev => prev + 1)` quando depender do valor anterior.

4. **Esquecer `key` ao renderizar listas**  
   ```jsx
   itens.map(item => <li key={item.id}>{item.nome}</li>)
   ```

5. **Inputs “descontrolados”**  
   Lembre de passar `value` + `onChange` quando quiser controlar o campo via state.

---

## 6) Exercícios rápidos

1) Crie um componente **Botao** que receba as props `texto` e `onClick`, e use-o várias vezes no App.  
2) Faça um **contador** com botões de `+1` e `-1` usando `useState`.  
3) Crie um **formulário controlado** com campos `nome` e `email` que exibe os valores abaixo do form em tempo real.  
4) Faça um componente **Produto** (filho) com botão “Adicionar”, que chama uma função no **App** (pai) para **aumentar o total do carrinho**.  
5) Implemente um **filtro de lista**: um input no pai e uma lista de itens filtrados no filho (use *lifting state up*).

---

### Para onde ir depois?
- **Renderização condicional** (`cond ? <A/> : <B/>` e `cond && <A/>`)  
- **useEffect** para buscar dados de API  
- **Context API** para evitar *prop drilling* quando muitos níveis precisam do mesmo dado  

---

> Dominando **props**, **state** e **eventos**, você já consegue criar interfaces reativas, controlar formulários e fazer componentes realmente reutilizáveis.
