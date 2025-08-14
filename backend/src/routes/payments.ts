import { Router } from 'express';
import { verifyToken } from '../middlewares/auth';
import { createPreference, getPaymentStatus, webhook, processCardPayment } from '../controllers/paymentController';

const router = Router();

// Rota protegida para criar preferência de pagamento
router.post('/create', verifyToken, createPreference);

// Rota para consultar status do pagamento
router.get('/status/:id', getPaymentStatus);

// Rota para processar pagamento com cartão
router.post('/process-card', verifyToken, processCardPayment);

// Rota pública para webhook do Mercado Pago
router.post('/webhook', webhook);

export default router;