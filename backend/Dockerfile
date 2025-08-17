# Use a imagem oficial do Node.js como base
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração do projeto
COPY package*.json yarn.lock ./

# Instala as dependências do projeto
RUN yarn config set network-timeout 600000 && \
    yarn install --frozen-lockfile

# Copia os arquivos do backend
COPY . .

# Faz o build do backend
RUN yarn build

# Imagem de produção
FROM node:20-alpine

WORKDIR /app

# Copia apenas os arquivos necessários da etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/public ./dist/public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.env ./

# Instala apenas as dependências de produção
RUN yarn install --frozen-lockfile --production

# Cria diretórios necessários
RUN mkdir -p dist/uploads dist/uploadprod && \
    chown -R node:node /app

# Configura o usuário não-root
USER node

# Expõe a porta do backend
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["yarn", "start"]