---
title: "Etapa4 Hooks Essenciais"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---


# Etapa 4 — Hooks essenciais (useEffect e Custom Hooks)

Nesta etapa você vai aprender dois tópicos fundamentais do React moderno:
1. **useEffect** — como lidar com efeitos colaterais (buscar dados, timers, eventos do DOM, etc).  
2. **Custom Hooks** — como criar hooks reutilizáveis para encapsular lógica.

---

## 1) O que são Hooks?
Hooks são funções que permitem “ligar” recursos do React (state, ciclo de vida, contexto) em componentes funcionais. Exemplos nativos: `useState`, `useEffect`, `useRef`, `useContext`, `useMemo`, `useCallback`.  
**Regras importantes ("Rules of Hooks")**:
- Chame hooks apenas no **topo** de componentes React ou custom hooks (não dentro de loops, condições ou funções aninhadas).  
- Nome dos custom hooks deve começar com `use` (ex.: `useFetch`).

---

## 2) `useEffect` — o básico
`useEffect` é o hook para **efeitos colaterais**: operações que acontecem fora da renderização pura (fetch, timers, subscrições, manipulação do DOM, sincronização com APIs externas).

Sintaxe básica:
```jsx
useEffect(() => {
  // efeito aqui (executa após a renderização)
  return () => {
    // cleanup (opcional) executado quando o componente desmonta ou antes do próximo efeito
  };
}, [dep1, dep2]); // array de dependências
```

### Exemplos simples
- **Executar uma vez quando o componente monta**:
```jsx
useEffect(() => {
  console.log("Componente montou");
}, []); // array vazio = monta apenas uma vez
```

- **Executar em toda renderização (cuidado!)**:
```jsx
useEffect(() => {
  console.log("Executa em todo render");
}); // sem array => roda após cada render
```

- **Executar quando uma dependência muda**:
```jsx
useEffect(() => {
  document.title = `Você clicou ${count} vezes`;
}, [count]); // roda quando 'count' muda
```

### O array de dependências (por que é importante)
- Liste **todas** as variáveis externas usadas dentro do efeito que podem mudar (estado, props, funções).  
- Se você omitir dependências, pode ter **stale closures** (efeito usando valores antigos) ou comportamento imprevisível.  
- O ESLint (plugin react-hooks) ajuda a detectar dependências faltantes automaticamente.

### Função de limpeza (cleanup)
- Retorne uma função dentro do efeito para **limpar** timers, listeners ou cancelar subscrições.
- Exemplo com `setInterval`:
```jsx
useEffect(() => {
  const id = setInterval(() => {
    setTime(t => t + 1);
  }, 1000);

  return () => clearInterval(id); // limpa quando desmonta
}, []);
```

### Exemplos práticos com cleanup
- **Event listener (resize)**:
```jsx
useEffect(() => {
  function handleResize() {
    setWidth(window.innerWidth);
  }
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

- **Abort controller para fetch** (evitar setState após desmontar):
```jsx
useEffect(() => {
  const controller = new AbortController();
  async function load() {
    try {
      const res = await fetch(url, { signal: controller.signal });
      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== "AbortError") setError(err);
    }
  }
  load();
  return () => controller.abort();
}, [url]);
```

### Erros comuns com useEffect
- **Loop infinito**: atualizar state dentro do efeito sem controlar dependências.  
  - Ex.: `useEffect(() => setX(y + 1), [y])` pode criar loop se não for planejado.
- **Esquecer o cleanup**: causar memory leaks (timers, listeners).  
- **Não incluir dependências**: efeito usa valores antigos (stale values).
- **Passar funções não memoizadas como dependência**: a função pode mudar em cada render e disparar o efeito desnecessariamente; use `useCallback` quando necessário.

---

## 3) `useLayoutEffect` (breve menção)
- Parecido com `useEffect` mas roda **síncrono** antes do paint do navegador — útil para ler/ajustar layout do DOM antes de pintar.  
- Na maioria dos casos, use `useEffect`; escolha `useLayoutEffect` apenas quando precisar ajustar o DOM imediatamente (ex.: medições de tamanho que afetam o layout).

---

## 4) Custom Hooks — por que e como criar
**O que são?** Funções que começam com `use` e podem chamar outros hooks. Encapsulam lógica reutilizável (fetch, sincronização com localStorage, manipulação de formularios, etc).

### Boas práticas
- Nome curto e claro: `useFetch`, `useLocalStorage`, `useToggle`.  
- Mantenha o hook focado em uma responsabilidade.  
- Hooks podem retornar estado, setters, funções utilitárias ou um objeto com esses valores.  
- Coloque-os em `src/hooks/` para organização.

### Exemplo 1 — `useLocalStorage`
```jsx
import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
```
Uso:
```jsx
const [nome, setNome] = useLocalStorage("nome", "");
```

### Exemplo 2 — `useFetch` (com loading e cancelamento)
```jsx
import { useState, useEffect } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    async function getData() {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Erro HTTP " + res.status);
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") setError(err);
      } finally {
        setLoading(false);
      }
    }

    getData();

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
```
Uso:
```jsx
const { data, loading, error } = useFetch("https://api.exemplo.com/itens");
```

### Exemplo 3 — `useToggle` (simples)
```jsx
import { useState } from "react";

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn(v => !v);
  return [on, toggle];
}
```
Uso:
```jsx
const [menuOpen, toggleMenu] = useToggle(false);
```

### Exemplo 4 — `useInterval` (uso avançado de refs para evitar stale callbacks)
```jsx
import { useEffect, useRef } from "react";

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // atualiza a referência para o callback mais recente
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    function tick() {
      savedCallback.current();
    }
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```
Uso:
```jsx
useInterval(() => {
  console.log("tick");
}, 1000);
```

---

## 5) Integração: quando transformar lógica em hook?
- Você tem a mesma lógica repetida em vários componentes.  
- Quer separar a lógica (busca, sincronização, validação) da UI.  
- Precisa de uma API limpa para controlar comportamento (ex.: `useModal` que retorna `[open, openModal, closeModal]`).

---

## 6) Dicas e armadilhas comuns com hooks
- **Memoize funções**: quando passar funções para dependências ou para componentes filhos, use `useCallback` para evitar renders/efeitos desnecessários.  
- **useRef para valores mutáveis** que não precisam causar re-render (ex.: id de timer, contador interno).  
- **Evite lógica complexa dentro de effects** — extraia em funções ou em hooks para testabilidade.  
- **Teste hooks** com utilitários (React Testing Library + hooks testing utilities).  
- **Evite efeitos sincronizados pesados** no `useLayoutEffect` — prefira otimizações de performance e throttle/debounce quando necessário.

---

## 7) Exercícios práticos sugeridos
1. Implemente `useLocalStorage` e use-o para salvar o tema do site (claro/escuro).  
2. Crie `useFetch` e mostre uma lista de dados carregados de uma API pública.  
3. Faça `useInterval` e use para atualizar um relógio na tela.  
4. Converta a lógica de toggle de um modal em `useModal` (retorne `open, openModal, closeModal`).  
5. Encontre e corrija um bug: um effect que faz `setState` sem dependências e causa loop infinito — explique a causa e solução.

---

### Conclusão
`useEffect` é a ferramenta padrão para efeitos colaterais e exige atenção às dependências e ao cleanup. Custom hooks permitem organizar e reutilizar lógica de forma elegante — escreva hooks pequenos e bem-focados. Com domínio desses conceitos você avança para arquiteturas melhores (Context, state managers) e componentes mais testáveis e reutilizáveis.
