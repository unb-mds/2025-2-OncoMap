---
title: "Etapa1 Fundamentos React"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

# Etapa 1 -- Estrutura básica de um projeto React

Nesta etapa você aprende como funciona a base de um projeto React.

------------------------------------------------------------------------

## 1. Estrutura típica de um projeto

    meu-projeto/
    ├── src/
    │   ├── components/   # Componentes reutilizáveis
    │   │   └── Header.jsx
    │   ├── pages/        # Páginas do app
    │   │   └── HomePage.jsx
    │   ├── App.jsx       # Componente principal
    │   └── index.js      # Ponto de entrada
    ├── public/
    │   └── index.html
    └── package.json      # Configurações e dependências

------------------------------------------------------------------------

## 2. Criando um componente simples

Exemplo de um **componente funcional** em React:

``` jsx
// Header.jsx
function Header() {
  return (
    <header>
      <h1>Bem-vindo ao meu site</h1>
    </header>
  );
}

export default Header; // Permite usar em outros arquivos
```

------------------------------------------------------------------------

## 3. Usando um componente dentro de outro

``` jsx
// App.jsx
import Header from "./components/Header";

function App() {
  return (
    <div>
      <Header />
      <p>Esse é o conteúdo principal</p>
    </div>
  );
}

export default App;
```

------------------------------------------------------------------------

## 4. Diferença entre export default e export nomeado

-   **Export default** → usado quando você quer exportar **um único item
    principal** por arquivo.

``` jsx
// Header.jsx
export default Header;
```

Importando:

``` jsx
import Header from "./Header";
```

-   **Export nomeado** → usado quando há **várias exportações** no mesmo
    arquivo.

``` jsx
export function Button() {
  return <button>Clique</button>;
}

export function Input() {
  return <input />;
}
```

Importando:

``` jsx
import { Button, Input } from "./FormElements";
```

------------------------------------------------------------------------

✅ Agora você já entende a **estrutura básica** e como criar e exportar
componentes em React.
