# Use a imagem oficial do Node.js como base
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Instala o pnpm globalmente
RUN npm install -g pnpm

# Copia os arquivos de configuração do projeto
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instala as dependências do projeto
RUN pnpm install

# Copia os arquivos do frontend
COPY . .

# Faz o build do frontend
RUN pnpm build

# Expõe a porta do frontend
EXPOSE 5173

# Comando para iniciar a aplicação em modo de desenvolvimento
CMD ["pnpm", "dev"]