---
title: "Etapa5 Estrutura App"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---


# Etapa 5 — Estrutura do app (React Router & Context API)

Nesta etapa você vai aprender a estruturar a aplicação em **páginas/rotas** com o **React Router** e a compartilhar estado entre vários componentes com a **Context API**. Vou explicar tudo como para um iniciante, com exemplos práticos e boas práticas.

---

## 1) Organização de pastas sugerida

Exemplo de estrutura para um projeto React pequeno/médio:
```
src/
├── App.jsx
├── index.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   └── Profile.jsx
├── components/
│   ├── Header.jsx
│   └── Footer.jsx
├── routes/            # opcional: rotas organizadas aqui
│   └── AppRoutes.jsx
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── hooks/
│   └── useLocalStorage.js
└── services/
    └── api.js
```

_Colocar providers em `context/` e hooks reutilizáveis em `hooks/` ajuda a manter o projeto organizado._

---

## 2) React Router (v6) — conceitos básicos

### Instalação
```
npm install react-router-dom
```

### Roteamento simples (App.jsx)
```jsx
// App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### Definindo rotas (AppRoutes.jsx)
```jsx
// routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import RequireAuth from "./RequireAuth"; // componente que protege rotas

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* rota protegida */}
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />

      {/* 404 - rota coringa */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

### Links e navegação
- Usar `<Link to="/caminho">` para links que não recarregam a página.  
- Usar `useNavigate()` para navegação programática.

```jsx
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <button onClick={() => navigate("/login")}>Entrar</button>
    </header>
  );
}
```

### Parâmetros de rota (`useParams`)
```jsx
// Rota: /product/:id
import { useParams } from "react-router-dom";

function ProductPage() {
  const { id } = useParams(); // id da URL
  // buscar produto por id...
  return <div>Produto {id}</div>;
}
```

### Localização atual (`useLocation`)
```jsx
import { useLocation } from "react-router-dom";

function ShowLocation() {
  const location = useLocation();
  console.log(location.pathname); // caminho atual
  return null;
}
```

### Redirecionamento (`Navigate`)
```jsx
// redireciona para /login
return <Navigate to="/login" replace />;
```

---

## 3) Protegendo rotas — RequireAuth (ex.: redireciona ao login)

Exemplo de componente que verifica se o usuário está autenticado e, se não estiver, redireciona para `/login`. Vale usar com Context (AuthContext) para checar `user` ou `token`.
```jsx
// routes/RequireAuth.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // redireciona ao login e guarda a rota atual em state para depois voltar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
```

No Login, você pode usar `useLocation()` para ler `location.state.from` e navegar de volta após autenticar.

---

## 4) Context API — estado global simples

### Quando usar Context?
- Para dados que vários componentes precisam: usuário autenticado, tema (claro/escuro), carrinho de compras, idioma (i18n).  
- Evite colocar *todo* estado no context — não é um substituto para gerenciamento complexo (como Redux), mas é ótimo para casos leves a médios.

### Criando um AuthContext simples
```jsx
// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // exemplo: persistir usuário no localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  function login(userData) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Consumindo o contexto
```jsx
// qualquer componente
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return <p>Carregando...</p>;

  return (
    <div>
      <h2>Olá, {user.name}</h2>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

---

## 5) Context com `useReducer` — exemplo para carrinho

Quando o estado tem lógica mais complexa (múltiplas ações), `useReducer` é uma boa alternativa dentro do provider.

```jsx
// context/CartContext.jsx
import { createContext, useReducer, useContext } from "react";

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD":
      // se o item existir, incrementa quantidade
      const exists = state.items.find(i => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    case "REMOVE":
      return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const add = (item) => dispatch({ type: "ADD", payload: item });
  const remove = (id) => dispatch({ type: "REMOVE", payload: { id } });
  const clear = () => dispatch({ type: "CLEAR" });

  return (
    <CartContext.Provider value={{ cart: state, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

// hook utilitário
export function useCart() {
  return useContext(CartContext);
}
```

Uso: envolver `CartProvider` no topo (App) e usar `useCart()` nos componentes que precisam.

---

## 6) Boas práticas e dicas

- **Coloque providers o mais alto possível** (ex.: em `index.jsx` ou `App.jsx`) para que toda a árvore possa consumir o contexto.  
- **Separe contextos por responsabilidade** (AuthContext, CartContext) — evite um único contexto gigante.  
- **Não coloque valores que mudam muito** (como contadores atualizados a cada segundo) no context — isso causa re-renders amplos.  
- **Memoize valores quando necessário**: se você passar objetos no `value` do provider, use `useMemo` para evitar re-renders desnecessários:  
  ```jsx
  const value = useMemo(() => ({ user, login, logout }), [user]);
  ```
- **Proteja rotas privadas** com um componente como `RequireAuth` e mantenha a lógica de autenticação no `AuthContext`.  
- **Persistência**: use `localStorage` ou IndexedDB com cuidado; sincronize com `useEffect` e trate erros.  
- **Teste**: componentes que usam context ficam mais fáceis de testar se você puder injetar providers com valores de teste.

---

## 7) Erros comuns e como evitar

- **Esquecer `BrowserRouter`** — sem ele, `Routes` e `Link` não funcionam.  
- **Paths com espaços** — cuidado ao construir `to="/states"` (sem espaços). Espaços geram `%20`.  
- **Colocar muita lógica no provider** — prefira dividir responsabilidades e extrair lógica para hooks.  
- **Passar funções recreadas no `value` do provider** — use `useCallback`/`useMemo` quando necessário para estabilidade de referência.  
- **Usar Context para tudo** — o prop drilling às vezes é aceitável; não transforme context em anti-padrão (ex.: para dados locais e altamente mutáveis).

---

## 8) Exercícios práticos sugeridos

1. Crie rotas para `/`, `/login`, `/profile` e uma página 404. Proteja `/profile` com `RequireAuth`.  
2. Implemente `AuthContext` com `login`/`logout` e persista no `localStorage`. No login, redirecione de volta para a página que o usuário tentou acessar.  
3. Crie `CartContext` usando `useReducer` com ações `ADD`, `REMOVE`, `CLEAR` e um componente que mostra o total de itens.  
4. Experimente `useNavigate` para redirecionar após ação (ex.: após checkout ir para `/obrigado`).  
5. Meça re-renders: coloque `console.log` no componente Header e veja se ele é re-renderizado ao adicionar itens no carrinho; otimize com `useMemo`/`useCallback` se necessário.

---

Se quiser, eu posso gerar exemplos prontos em arquivos `.jsx` (por exemplo `AuthContext.jsx`, `RequireAuth.jsx`, `AppRoutes.jsx`) para você testar no seu projeto. Quer que eu gere os arquivos de exemplo agora?
