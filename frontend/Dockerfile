# Use a imagem oficial do Node.js como base
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Instala o pnpm globalmente
RUN npm install -g pnpm@10.4.1

# Copia os arquivos de configuração do projeto
COPY package.json pnpm-lock.yaml ./

# Instala as dependências do projeto
RUN pnpm install --frozen-lockfile

# Copia os arquivos do frontend
COPY . .

# Faz o build do frontend
RUN pnpm build

# Imagem de produção
FROM node:20-alpine

WORKDIR /app

# Instala o pnpm globalmente
RUN npm install -g pnpm@10.4.1 && pnpm install -g serve

# Copia os arquivos buildados
COPY --from=builder /app/dist ./dist

# Expõe a porta do servidor
EXPOSE 5173

# Inicia o servidor
CMD ["serve", "-s", "dist", "-l", "5173"]