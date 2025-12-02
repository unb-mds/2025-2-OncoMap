---
title: "Docker"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

# Configuração do Docker e Docker Compose

Este guia descreve como criar e executar containers para o projeto **React (frontend)** e **Node.js (backend)** utilizando **Docker** e **Docker Compose**.

---

## 1. Pré-requisitos

Antes de começar, instale em sua máquina:

- [Docker](https://docs.docker.com/get-docker/)  
- [Docker Compose](https://docs.docker.com/compose/install/) (já incluso no Docker Desktop em muitas distribuições)

Verifique a instalação:

```bash
docker --version
docker compose version
```

---

## 2. Estrutura básica de arquivos

No diretório raiz do projeto,  será necessario:

```
.
├── backend/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── .env (opcional para variáveis de ambiente)
```

---

## 3. Criando os Dockerfiles

### Backend (Node.js)

Arquivo: **backend/Dockerfile**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Frontend (React)

Arquivo: **frontend/Dockerfile**

```dockerfile
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Servindo os arquivos estáticos com nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

> Ajustar os comandos `npm start` ou scripts conforme nosso projeto.

---

## 4. Criando o docker-compose.yml

Arquivo: **docker-compose.yml**

```yaml
version: "3.9"
services:
  backend:
    build: ./backend
    container_name: backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
    env_file:
      - .env

  frontend:
    build: ./frontend
    container_name: frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

---

## 5. Variáveis de ambiente (.env)

Crie um arquivo **.env** (não comite em repositórios públicos) para guardar variáveis sensíveis:

```env
NODE_ENV=production
API_URL=http://localhost:5000
```

O docker-compose lê automaticamente esse arquivo se configurado com `env_file`.

---

## 6. Comandos principais

**Construir e subir os containers**:
```bash
docker compose up --build
```

**Rodar em segundo plano (detached)**:
```bash
docker compose up -d
```

**Parar os containers**:
```bash
docker compose down
```

**Rebuild apenas de um serviço**:
```bash
docker compose build backend
```

**Acessar o terminal de um container**:
```bash
docker exec -it backend sh
```

---

## 7. Limpeza de imagens/volumes

Remover containers parados, imagens e volumes não utilizados:
```bash
docker system prune -af
docker volume prune
```

---

## Dicas finais

- Adicione um `.dockerignore` em **backend/** e **frontend/** para evitar copiar arquivos desnecessários para a imagem.
- Em ambiente de produção, configure variáveis de ambiente seguras e revise regras de rede.
- Utilize volumes para persistir dados de bancos de dados (se houver).

---