# Use a imagem oficial do Node.js como base
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Instala o pnpm globalmente
RUN npm install -g pnpm

# Copia os arquivos de configuração do projeto
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Copia os arquivos do frontend e backend
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Instala as dependências do projeto raiz
RUN pnpm install

# Instala as dependências e faz o build do frontend
WORKDIR /app/frontend
RUN pnpm install
RUN pnpm build

# Instala as dependências e faz o build do backend
WORKDIR /app/backend
RUN pnpm install
RUN pnpm build

# Volta para o diretório raiz
WORKDIR /app

# Expõe as portas necessárias
EXPOSE 3001
EXPOSE 5173

# Comando para iniciar a aplicação
CMD ["pnpm", "start"]