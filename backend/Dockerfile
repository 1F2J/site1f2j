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

# Copia os arquivos do backend
COPY . .

# Faz o build do backend
RUN pnpm build

# Expõe a porta do backend
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["pnpm", "start"]