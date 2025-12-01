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
# Isso diz: "Não baixe o Chrome automático, use o que eu acabei de instalar"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]