import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Importar rotas
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import adminRoutes from './routes/admin';
import siteRoutes from './routes/site';
import testRoutes from './routes/test';
import cartRoutes from './routes/cart';
import userRoutes from './routes/user';
import paymentRoutes from './routes/payments';

// Configurar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middlewares
app.use(cors({
  origin: [FRONTEND_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Criar diretórios de upload se não existirem
const uploadsDir = path.join(__dirname, 'uploads');
const uploadProdDir = path.join(__dirname, 'uploadprod');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(uploadProdDir)) {
  fs.mkdirSync(uploadProdDir, { recursive: true });
}

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));
app.use('/uploadprod', express.static(uploadProdDir));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/produtos', productRoutes);
app.use('/api/categorias', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/test', testRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payments', paymentRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API 1F2J funcionando!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Middleware de tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Exportar o app para ser usado no servidor principal
export default app;

