---
title: "Etapa6 Organizacao Boas Praticas"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---


# Etapa 6 — Organização e Boas Práticas (para iniciantes em React)

Nesta etapa você aprende **como organizar seu projeto** e seguir boas práticas que deixam o código mais fácil de ler, escalar e manter. Tudo explicado de forma simples, com exemplos práticos.

---

## 1) Estrutura de pastas recomendada

Para projetos pequenos a médios, uma estrutura simples e clara ajuda muito:

```
src/
├── components/      # Componentes reutilizáveis e pequenos
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── Button.module.css
│   └── Header.jsx
├── pages/           # Páginas (rotas)
│   ├── Home.jsx
│   └── Profile.jsx
├── hooks/           # Custom hooks (useFetch, useLocalStorage...)
├── context/         # Providers / Context API
├── services/        # chamadas API, helpers de rede
├── styles/          # estilos globais (variables.css, reset.css)
├── utils/           # funções utilitárias
├── assets/          # imagens, fontes, ícones
├── routes/          # definição de rotas (opcional)
└── App.jsx
```

Dica: prefira **pastas pequenas e com responsabilidade única** (cada pasta com um propósito claro).

---

## 2) Componentes: organização e padrão

- **Componentes pequenos e focados**: cada componente faz uma coisa (ex.: `Button`, `Avatar`, `ProductCard`).  
- **Nomes com PascalCase**: `MyButton`, `UserProfile`.  
- **Arquivos por componente**: quando o componente tem CSS próprio ou testes, crie uma pasta com `index` ou `Component.jsx`.

Exemplo de componente simples com CSS module:

```jsx
// components/Button/Button.jsx
import styles from "./Button.module.css";

export default function Button({ children, onClick }) {
  return (
    <button className={styles.btn} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
/* components/Button/Button.module.css */
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
```

---

## 3) Separação entre apresentação e lógica

- **Presentational components**: apenas UI (p. ex. `UserCard`).  
- **Container components / hooks**: contém lógica (busca de API, transformação de dados).

Exemplo: mover fetch para um hook
```jsx
// hooks/useUsers.js
import { useState, useEffect } from "react";

export function useUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("/api/users").then(r => r.json()).then(setUsers);
  }, []);
  return users;
}
```

```jsx
// components/UserList.jsx
import { useUsers } from "../hooks/useUsers";

export default function UserList() {
  const users = useUsers();
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

---

## 4) Estilos: opções e recomendações

- **CSS Modules**: isolam estilos por componente (`.module.css`). Bom para projetos pequenos/medios.  
- **Tailwind CSS**: utilitário para desenvolvimento rápido (precisa configuração).  
- **Styled Components / Emotion**: CSS-in-JS (boa para componentes com estilos dinâmicos).  
- **Global styles**: variáveis, reset e tipografia em `src/styles/`.

Evite misturar muitos paradigmas de estilo sem necessidade. Escolha um e mantenha-se consistente.

---

## 5) Tipagem: PropTypes vs TypeScript

- **PropTypes** (runtime): boa para checagem simples em projetos JS.  
- **TypeScript** (compile-time): mais verboso no início, mas previne muitos bugs e é recomendado para projetos maiores.  

Exemplo com PropTypes:
```jsx
import PropTypes from "prop-types";

function Greeting({ name }) {
  return <p>Olá, {name}</p>;
}

Greeting.propTypes = {
  name: PropTypes.string.isRequired,
};
```

---

## 6) Performance básica

- Use `React.memo` para componentes puros que recebem props estáveis.  
- Use `useCallback` para funções passadas a filhos, evitando recriações desnecessárias.  
- Use `useMemo` para cálculos pesados.  
- Carregamento preguiçoso com `React.lazy` + `Suspense` para dividir bundle (code splitting).

Exemplo de `React.lazy`:
```jsx
import { Suspense, lazy } from "react";

const BigComponent = lazy(() => import("./BigComponent"));

function App() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BigComponent />
    </Suspense>
  );
}
```

---

## 7) Tratamento de erros (Error Boundaries)

Componentes de classe podem ser Error Boundaries — capturam erros em renderização do filho.

```jsx
// ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) return <h2>Algo deu errado.</h2>;
    return this.props.children;
  }
}
```

Use em volta de partes propensas a falhas.

---

## 8) Testes básicos

- **Unit tests** com Jest + React Testing Library.  
- Escreva testes para componentes importantes (renderização, interações, callbacks).

Exemplo de teste simples:

```jsx
// __tests__/Greeting.test.jsx
import { render, screen } from "@testing-library/react";
import Greeting from "../components/Greeting";

test("exibe saudação", () => {
  render(<Greeting name="Giovani" />);
  expect(screen.getByText(/Olá, Giovani/i)).toBeInTheDocument();
});
```

---

## 9) Linting e formatação

- Use **ESLint** (com regras para React) e **Prettier** para formatação automática.  
- Adicione scripts no `package.json` para rodar lint e formatar:  
```json
"scripts": {
  "lint": "eslint 'src/**' --fix",
  "format": "prettier --write 'src/**'"
}
```

---

## 10) Variáveis de ambiente e builds

- No **Create React App** use `REACT_APP_...` (ex.: `REACT_APP_API_URL`).  
- No **Vite** use `VITE_...`.  
- Nunca commit informações sensíveis (chaves privadas) no repositório; use variáveis em ambiente do deploy.  
- Para gerar a build: `npm run build` → pasta `build/` ou `dist/` pronta para deploy.

---

## 11) Deploy (opções fáceis)

- **Vercel**, **Netlify**, **Surge**: deploy simples conectando ao GitHub.  
- **Heroku / Render** também são opções.  
- Apenas envie a pasta `build/` (ou configure o serviço para rodar `npm run build`).

---

## 12) Boas práticas de código

- Nomeie claramente (BotaoPrimary ao invés de `Btn1`).  
- Componentes pequenos e com responsabilidade única.  
- Evite duplicação: crie componentes reutilizáveis.  
- Extraia lógica complexa para hooks ou funções utilitárias.  
- Documente componentes com comentários e README do projeto.

---

## 13) Checklist antes de abrir PR / enviar projeto

- [ ] Código lintado e formatado.  
- [ ] Componentes testados (mínimo).  
- [ ] Variáveis de ambiente configuradas.  
- [ ] Componentes com acessibilidade básica (labels, aria).  
- [ ] Build funcionando (`npm run build`).

---

## 14) Recursos rápidos para continuar aprendendo

- Documentação oficial do React (com conceitos e guias).  
- React Testing Library (testes).  
- ESLint + Prettier (qualidade de código).  
- TypeScript (tipagem estática).

---

> Seguindo essas práticas você deixa seu projeto mais profissional, mais fácil de manter e menos sujeito a bugs. Se quiser, eu posso gerar um **template mínimo de projeto** com essa estrutura (arquivos `.jsx`, CSS e scripts `package.json`) pronto para você clonar. Quer que eu gere esse template agora?
