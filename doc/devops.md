
# 🛠️ Documentação DevOps - OncoMap

Este documento detalha a infraestrutura, configuração de ambiente, pipelines de CI/CD e estratégia de deploy do projeto **OncoMap**.

---

## 1. 🌐 Configuração de Ambiente (.env)

Para rodar o projeto localmente ou configurar o ambiente de produção, é necessário criar um arquivo `.env` na raiz do diretório **backend**.

Abaixo está um exemplo documentado das variáveis necessárias:

📄 Arquivo Exemplo: `.env.example`

```env
# --- Configurações do Servidor ---
# Porta onde o servidor backend irá rodar (Padrão: 3001)
PORT=3001

# --- Banco de Dados (Supabase) ---
# Connection String para o PostgreSQL hospedado no Supabase.
# Formato: postgresql://[user]:[password]@[host]:[port]/[database]
# Nota: Em produção, certifique-se de usar a string de conexão "Transaction Pooler" (porta 6543)
# para melhor performance em ambientes serverless, ou "Session" (porta 5432) para conexões diretas.
DATABASE_URL="postgresql://postgres:sua_senha@db.seu-id-projeto.supabase.co:5432/postgres"

# --- Integrações Externas ---

# URL base da API pública do Querido Diário
QUERIDO_DIARIO_API_URL="https://queridodiario.ok.org.br/api"

# --- Inteligência Artificial (LLMs) ---

# Chave de API para o Groq (Usado para testes com Llama 3)
GROQ_API_KEY="gsk_sua_chave_aqui"

# Chaves de API para o Google Gemini (Usado no script de enriquecimento de dados)
# Suporta múltiplas chaves separadas por vírgula para rotação automática em caso de Rate Limit.
GEMINI_API_KEYS="chave_gemini_1,chave_gemini_2,chave_gemini_3"

# Chave única do Gemini (Usada em controllers simples ou legados)
GEMINI_API_KEY="chave_gemini_principal"
````

---

## 2. 🚀 Estratégia de Deploy

A arquitetura do OncoMap é dividida em três componentes principais, otimizando custos e performance.

### 🏗️ Arquitetura

| Componente | Tecnologia        | Hospedagem           | Tipo de Deploy           |
| ---------- | ----------------- | -------------------- | ------------------------ |
| Frontend   | React (Vite)      | Render (Static Site) | Estático (Build & Serve) |
| Backend    | Node.js (Express) | Render (Web Service) | Docker Container         |
| Database   | PostgreSQL        | Supabase             | Managed Database         |

---

### 🔄 Fluxo de Deploy

#### Backend (Dockerizado)

* Empacotado em um container Docker
* O **Dockerfile** define dependências e porta de exposição
* Render reconstrói automaticamente a cada push na `main`
* Variáveis sensíveis configuradas no painel da plataforma

#### Frontend (Página Estática)

* Construído como SPA
* Configurado como **Static Site** no Render
* Build: `npm run build` → gera `dist/`
* `VITE_API_URL` aponta para a API pública
  Ex: `https://oncomap-backend.onrender.com`

---

## 3. ⚙️ Integração Contínua (CI) 

Utilizamos **GitHub Actions** para automação:

📌 Pipeline: Coleta e Enriquecimento de Dados
Arquivo: `.github/workflows/pipeline.yml`

### 🔔 Gatilhos

* `push` (exceto commits em `.md`)
* `pull_request → main`
* `schedule (cron)` opcional para execuções automáticas

### 🧪 Jobs do Pipeline

#### 📍 Backend - Verificação

* Ambiente: `ubuntu-latest`
* Passos:

  * Checkout
  * Instalação Node (v20)
  * `npm ci`
  * `npm run lint`
  * `npm test`

#### 🌐 Frontend - Build e Qualidade

* Mesmos passos do backend + build de produção:

  * `npm run build`

---

### 🔐 Segurança no CI

* Todas as chaves sensíveis (`DATABASE_URL`, `GEMINI_API_KEYS`, `GROQ_API_KEY`)
  são armazenadas como **GitHub Secrets**
* Nunca expostas no repositório

---

## 4. 🐳 Docker

Garantimos que desenvolvimento e produção utilizem o mesmo ambiente.

---

### Backend Dockerfile

```dockerfile
FROM node:22-alpine

# 1. Instalar o Chromium e dependências necessárias para renderizar PDF
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# 2. Configurar variáveis de ambiente para o Puppeteer (motor do PDF)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

---

### Frontend Dockerfile

```dockerfile
FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Expõe a porta do Frontend
EXPOSE 3001

# Comando para iniciar o front
CMD ["npm", "run", "dev"]
```

---

### Docker Compose

```yaml
services:
  # --- Serviço do Backend ---
  api-backend:
    build: ./backend
    container_name: meu-backend
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - PORT=3000

  # --- Serviço do Frontend ---
  app-frontend:
    build: ./frontend
    container_name: meu-frontend
    ports:
      - "3001:3001"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
    depends_on:
      - api-backend
```

---



