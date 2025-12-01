FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Aqui expomos a porta do Front
EXPOSE 3001

# Comando para iniciar o front (ex: Vite, React Scripts)
CMD ["npm", "run", "dev"]