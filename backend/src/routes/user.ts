import { Router } from 'express';
import { verifyToken } from '../middlewares/auth';
import {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  updateConsents,
  requestAccountDeletion
} from '../controllers/userController';

const router = Router();

// Todas as rotas do usuário requerem autenticação
router.use(verifyToken);

// Rotas de perfil
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Rotas de endereços
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

// Rotas de consentimentos LGPD
router.put('/consents', updateConsents);

// Rota para solicitar exclusão da conta
router.post('/request-deletion', requestAccountDeletion);

export default router;