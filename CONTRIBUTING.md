# Guia de Contribuição - OncoMap

Obrigado por considerar contribuir para o OncoMap! 🎉
Este documento contém diretrizes para garantir que o processo de contribuição seja suave e eficaz para todos.

## Código de Conduta

Para garantir um ambiente aberto e acolhedor, adotamos um [Código de Conduta](https://github.com/unb-mds/2025-2-OncoMap/blob/main/CODE_OF_CONDUCT.md) que se aplica a todos os contribuidores. Por favor, leia-o antes de participar.

## 🚀 Como Rodar o Projeto Localmente

Este guia detalha os passos para configurar o ambiente de desenvolvimento (Backend Node.js e Frontend).

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

* **Git:** [Download](https://git-scm.com/downloads)
* **Node.js (v20+):** [Download](https://nodejs.org/en/download/)
* **Conta no Supabase:** (Para configurar o banco de dados localmente, se necessário)
* **Docker (Opcional):** Caso prefira rodar via container.
    * *Linux (Debian/Ubuntu):* Instale o Docker Compose rodando:
        ```bash
        sudo apt install docker-compose
        ```

---

### 1. Clonar o Repositório

Clone o projeto para sua máquina local:

```bash
git clone [https://github.com/unb-mds/2025-2-OncoMap.git](https://github.com/unb-mds/2025-2-OncoMap.git)
cd 2025-2-OncoMap
```

### 2. Instalação Geral

Instale as dependências:

```bash
# Na raiz do projeto (2025-2-OncoMap/)
npm run install:all
```

### 3. Configuração do Backend

O backend é responsável pela coleta de dados (Puppeteer/Axios) e enriquecimento (Gemini AI).

#### 3.1 Variáveis de Ambiente: Entre na pasta do backend e crie o arquivo `.env` baseado no exemplo:`

```bash
cd Oncomap/backend
cp .env.example .env
```
> 💡 Preencha o `.env` com suas credenciais do Supabase e Gemini API. Se não tiver acesso, solicite aos mantenedores.

### 4. Rodar o Frontend e Backend

```bash
# Na raiz do projeto (2025-2-OncoMap/)
npm run dev
```
Isso iniciará o Backend e o Frontend simultaneamente no mesmo terminal.

## 5. Se deseja rodar pelo Docker
Caso prefira rodar via container.

```bash
# Na raiz do projeto (2025-2-OncoMap/)
npm run docker
```

## 🐛 Como abrir Issues (Relatar Bugs ou Sugerir Melhorias)

Antes de criar uma issue, por favor:
1.  **Verifique se a issue já existe:** Use a busca do GitHub para ver se alguém já relatou o problema ou sugeriu a funcionalidade.
2.  **Seja claro e descritivo:**
    * Use um título objetivo.
    * Descreva o comportamento esperado vs. o comportamento atual.
    * Se possível, inclua capturas de tela ou logs de erro.
    * Para bugs, descreva os passos para reproduzir o erro.

## 🔁 Como enviar um Pull Request (PR)

1.  **Fork o repositório:** Crie uma cópia do projeto na sua conta.
2.  **Crie uma Branch:** Nunca trabalhe na branch `main` diretamente.
    * `git switch -c feature/minha-nova-funcionalidade`
    * `git switch -c fix/correcao-bug`
3.  **Faça suas alterações:** Escreva código limpo e testável.
4.  **Teste:** Se você alterou scripts de backend, rode-os localmente para garantir que não quebraram.
5.  **Commit:** Siga o padrão de commits (veja abaixo).
6.  **Push:** Envie para o seu fork (`git push origin feature/minha-nova-funcionalidade`).
7.  **Abra o PR:** No GitHub, abra o Pull Request para a branch `main` do repositório original.
    * Preencha o template do PR descrevendo o que foi feito.
    * Link a issue relacionada (ex: `Closes #12`).

## 📝 Padrões de Commit

Prezamos muito por um histórico de projeto limpo e legível. Commits claros facilitam a revisão de código e ajudam a entender a evolução do projeto ao longo do tempo.

**Idealmente, seguimos a convenção do [Conventional Commits](https://www.conventionalcommits.org/pt-br/).**

**Estrutura:** `tipo(escopo): descrição curta`

### Tipos permitidos:
* `feat`: Uma nova funcionalidade (ex: novo script de coleta, botão no frontend).
* `fix`: Correção de bug.
* `docs`: Alterações apenas na documentação (README, CONTRIBUTING).
* `style`: Alterações que não afetam o código (espaços, formatação, ponto e vírgula).
* `refactor`: Mudança de código que não corrige bug nem adiciona funcionalidade.
* `perf`: Mudança de código para melhorar performance.
* `test`: Adição ou correção de testes.
* `build`: Alterações no sistema de build ou dependências externas (npm, docker, github actions).
* `ci`: Alterações nos arquivos de configuração de CI (GitHub Workflows).
* `chore`: Outras alterações que não modificam arquivos src ou testes (ex: .gitignore, .env.example).

### Exemplos:
* `feat(coletor): adiciona suporte para coleta via puppeteer`
* `fix(api): corrige erro 403 no axios`
* `docs: atualiza instruções de setup no README`
* `ci(actions): adiciona pipeline mensal de coleta`

## 🎨 Estilo de Código

* **JavaScript (Node.js):**
    * Use `const` e `let` (evite `var`).
    * Use `async/await` em vez de `.then()` encadeados quando possível.
    * Mantenha a indentação consistente (2 ou 4 espaços).
    * Sempre trate erros em blocos `try/catch`.


---