---
title: "Etapa3 Renderizacao"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---


# Etapa 3 – Renderização dinâmica

Nesta etapa você aprenderá como tornar a interface **dinâmica**: mostrar ou esconder elementos com base no estado, renderizar listas de dados corretamente usando `map()` e `key`, e criar **formulários controlados** onde os campos ficam sincronizados com o `state`.

---

## 1) Renderização condicional

**O que é?**  
Renderização condicional é a técnica de mostrar componentes diferentes (ou nada) dependendo de condições (normalmente valores do `state`).

### Formas comuns

1. **Operador ternário**  
```jsx
{condicao ? <ComponenteA /> : <ComponenteB />}
```

2. **Short-circuit com `&&`** (renderiza quando a condição é verdadeira)  
```jsx
{mostrar && <p>Esse texto aparece só quando `mostrar` for true</p>}
```

3. **Retornar `null`** dentro de um componente para não renderizá-lo:
```jsx
function Aviso({ ativo }) {
  if (!ativo) return null;
  return <div className="aviso">Atenção!</div>;
}
```

### Exemplo: mostrar/esconder painel
```jsx
import { useState } from "react";

function Painel() {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div>
      <button onClick={() => setMostrar(m => !m)}>
        {mostrar ? "Esconder painel" : "Mostrar painel"}
      </button>

      {mostrar && (
        <div className="painel">
          <h2>Painel</h2>
          <p>Conteúdo visível apenas quando `mostrar` é true.</p>
        </div>
      )}
    </div>
  );
}
```

---

## 2) Listas e `key`

**Por que usar `key`?**  
Quando você renderiza listas com `.map()`, o React precisa de uma **chave única** por item para identificar quais elementos mudaram, foram adicionados ou removidos. Isso ajuda o React a fazer atualizações eficientes.

### Uso correto
```jsx
const itens = [
  { id: 1, nome: "Teclado" },
  { id: 2, nome: "Mouse" },
];

<ul>
  {itens.map(item => (
    <li key={item.id}>{item.nome}</li>
  ))}
</ul>
```

### Evite usar índice como `key` quando a lista pode mudar
```jsx
// ruim quando a lista pode ser reordenada ou itens removidos
itens.map((item, index) => <li key={index}>{item.nome}</li>)
```
Usar o índice pode causar bugs visuais e problemas de estado em componentes filhos (por exemplo, inputs que perdem o foco ou valores trocados).

### Exemplo: adicionar e remover itens
```jsx
import { useState } from "react";

function ListaProdutos() {
  const [produtos, setProdutos] = useState([
    { id: 1, nome: "Teclado" },
    { id: 2, nome: "Mouse" },
  ]);

  function adicionar(nome) {
    const novo = { id: Date.now(), nome };
    setProdutos(prev => [...prev, novo]);
  }

  function remover(id) {
    setProdutos(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div>
      <button onClick={() => adicionar("Monitor")}>Adicionar Monitor</button>
      <ul>
        {produtos.map(p => (
          <li key={p.id}>
            {p.nome} <button onClick={() => remover(p.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 3) Formulários — Inputs controlados

**O que é um input controlado?**  
Um input controlado é aquele cujo valor é controlado pelo `state` do React: o `value` do input vem do state e as mudanças usam `onChange` para atualizar esse state. Isso torna os valores previsíveis e fáceis de manipular.

### Exemplo simples (campo de texto em tempo real)
```jsx
import { useState } from "react";

function FormSimples() {
  const [nome, setNome] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="Digite seu nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <p>Você escreveu: {nome}</p>
    </div>
  );
}
```

### Form em que o `onSubmit` evita o reload
```jsx
function FormComEnvio() {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // evita recarregar a página
    console.log("Enviar para servidor:", email);
    // limpar campo
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

### Checkbox, radio e select controlados
```jsx
function FormTipos() {
  const [aceito, setAceito] = useState(false);
  const [cor, setCor] = useState("azul");
  const [opcao, setOpcao] = useState("A");

  return (
    <form>
      <label>
        <input
          type="checkbox"
          checked={aceito}
          onChange={(e) => setAceito(e.target.checked)}
        />
        Aceito os termos
      </label>

      <label>
        Cor:
        <select value={cor} onChange={(e) => setCor(e.target.value)}>
          <option value="azul">Azul</option>
          <option value="verde">Verde</option>
        </select>
      </label>

      <fieldset>
        <legend>Escolha</legend>
        <label>
          <input
            type="radio"
            name="opcao"
            value="A"
            checked={opcao === "A"}
            onChange={(e) => setOpcao(e.target.value)}
          />
          Opção A
        </label>
        <label>
          <input
            type="radio"
            name="opcao"
            value="B"
            checked={opcao === "B"}
            onChange={(e) => setOpcao(e.target.value)}
          />
          Opção B
        </label>
      </fieldset>
    </form>
  );
}
```

### Múltiplos inputs com um único objeto de state
```jsx
import { useState } from "react";

function FormMulti() {
  const [form, setForm] = useState({ nome: "", email: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <form>
      <input name="nome" value={form.nome} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <p>{form.nome} — {form.email}</p>
    </form>
  );
}
```

---

## 4) Exemplo integrado: To‑Do List (renderização condicional + lista + formulário controlado)

```jsx
// TodoApp.jsx
import { useState } from "react";

export default function TodoApp() {
  const [tarefa, setTarefa] = useState("");
  const [todos, setTodos] = useState([]);

  function adicionar(e) {
    e.preventDefault();
    if (!tarefa.trim()) return;
    const novo = { id: Date.now(), texto: tarefa, feito: false };
    setTodos(prev => [...prev, novo]);
    setTarefa("");
  }

  function remover(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function alternarFeito(id) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, feito: !t.feito } : t));
  }

  return (
    <div>
      <h2>To-Do</h2>

      <form onSubmit={adicionar}>
        <input
          value={tarefa}
          onChange={(e) => setTarefa(e.target.value)}
          placeholder="Nova tarefa"
        />
        <button type="submit">Adicionar</button>
      </form>

      {todos.length === 0 ? (
        <p>Nenhuma tarefa — adicione uma acima :)</p>
      ) : (
        <ul>
          {todos.map(t => (
            <li key={t.id}>
              <label style={{ textDecoration: t.feito ? "line-through" : "none" }}>
                <input
                  type="checkbox"
                  checked={t.feito}
                  onChange={() => alternarFeito(t.id)}
                />
                {t.texto}
              </label>
              <button onClick={() => remover(t.id)}>Remover</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## 5) Erros comuns e dicas rápidas

- **Esquecer `key` em listas** → renderização ineficiente e bugs.  
- **Usar índice como key** quando a lista muda → evita usar index se itens podem ser reordenados/removidos.  
- **Mutar o state diretamente** (ex.: `arr.push(...)`) → use sempre cópias (`[...arr]`, `{ ...obj }`).  
- **Inputs sem `value` controlado** → evite comportamentos inconsistentes; escolha controlado OU uncontrolled conscientemente.  
- **Esquecer `e.preventDefault()` no submit** → formulário recarrega a página.  
- **Não validar entrada** → cheque `trim()` antes de adicionar strings em listas.

---

## 6) Exercícios práticos sugeridos

1. Faça um contador preenchendo com renderização condicional: quando o valor for 0, mostre "Inicie o contador", caso contrário mostre o valor.  
2. Implemente uma lista de compras com adicionar/remover e garanta que cada item possui um `id` único.  
3. Estenda o To‑Do acima para permitir editar o texto de uma tarefa (renderize um input só no item sendo editado).  
4. Crie um formulário com vários campos (nome, email, senha) usando um único objeto de state (`FormMulti`).

---

### Próximo passo
Quando estiver confortável com renderização condicional, listas e formulários controlados, avance para **useEffect** (efeitos colaterais) — que é quando a aplicação precisa buscar dados, escutar eventos do DOM ou sincronizar com APIs/armazenamento.

Boas práticas: teste seus componentes com dados reais, use `console.log` para inspecionar state e lembre-se de usar `key` corretamente nas listas.
