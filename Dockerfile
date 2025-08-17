# Estágio de build do frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Estágio de build do backend
FROM node:18-alpine as backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Imagem final
FROM node:18-alpine
WORKDIR /app

# Copiar arquivos do frontend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copiar arquivos do backend
COPY --from=backend-builder /app/backend/dist ./backend/dist

# Copiar package.json raiz e instalar dependências
COPY package*.json ./
RUN npm install --production

# Copiar arquivo do servidor
COPY server.js ./

# Copiar arquivos de ambiente
COPY backend/.env ./backend/.env
COPY frontend/.env ./frontend/.env

EXPOSE 3000
CMD ["node", "server.js"]