---
title: "Typescript React"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

## React + Typescript

O React e o TypeScript juntos oferecem uma combinação poderosa: a flexibilidade do React com a segurança da tipagem estática do TypeScript. Isso ajuda a evitar erros comuns e melhora a produtividade.

---

## 1. Vantagens de usar Typescript com React 

- **Autocompletar inteligente (IntelliSense):** sugere propriedades e métodos corretos.
- **Detecção precoce de erros:** evita passar props ou estados com tipos errados.
- **Melhor manutenção de código:** facilita trabalhar em equipes grandes.
- **Documentação implícita:** os tipos funcionam como uma forma de documentação.
- **Maior escalabilidade:** útil em projetos médios e grandes.


---


## 2. Configuração do Projeto


Criar um projeto React com TypeScript:
```bash
npx create-react-app meu-app --template typescript
```


Ou com Vite (mais rápido):
```bash
npm create vite@latest meu-app -- --template react-ts
```


Isso já cria a estrutura com suporte a TypeScript (`.tsx`).


---


## 3. Componentes com TypeScript


### Componente de Função
```tsx
import React from "react";


type Props = {
nome: string;
idade?: number; // opcional
};


const Saudacao: React.FC<Props> = ({ nome, idade }) => {
return (
<div>
<h1>Olá, {nome}!</h1>
{idade && <p>Idade: {idade}</p>}
</div>
);
};


export default Saudacao;
```


---


## 4. Estado e Hooks


### useState com TypeScript
```tsx
import React, { useState } from "react";


const Contador: React.FC = () => {
const [contador, setContador] = useState<number>(0);


return (
<div>
<p>Valor: {contador}</p>
<button onClick={() => setContador(contador + 1)}>+</button>
</div>
);
};


export default Contador;
```


### useEffect com tipos
```tsx
import React, { useState, useEffect } from "react";


const Relogio: React.FC = () => {
const [hora, setHora] = useState<Date>(new Date());


useEffect(() => {
const timer = setInterval(() => setHora(new Date()), 1000);
return () => clearInterval(timer);
}, []);


return <h2>{hora.toLocaleTimeString()}</h2>;
};


export default Relogio;
```


---

## 5. Tipando Eventos
const Formulario: React.FC = () => {
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();
console.log("Form enviado!");
};


return (
<form onSubmit={handleSubmit}>
<button type="submit">Enviar</button>
</form>
);
};
```


---


## 6. Tipando Requisições (com Fetch ou Axios)


```tsx
import React, { useState, useEffect } from "react";


interface Post {
id: number;
title: string;
}


const Posts: React.FC = () => {
const [posts, setPosts] = useState<Post[]>([]);


useEffect(() => {
fetch("https://jsonplaceholder.typicode.com/posts")
.then((res) => res.json())
.then((data: Post[]) => setPosts(data));
}, []);


return (
<ul>
{posts.map((post) => (
<li key={post.id}>{post.title}</li>
))}
</ul>
);
};


export default Posts;
```


---


## 7. Conclusão


Usar **React + TypeScript** ajuda a:
- Escrever componentes mais seguros.
- Evitar erros de tipagem em props e estados.
- Aumentar a produtividade com melhor suporte de editor.


> Dica: sempre comece tipando props e estados, e vá expandindo para context, hooks personalizados e reducers conforme o projeto cresce.
