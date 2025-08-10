import { Router } from 'express';
import { verifyToken } from '../middlewares/auth';
import { getCart, addToCart, updateCartItem, removeFromCart, checkout } from '../controllers/cartController';

const router = Router();

router.use(verifyToken);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:id', updateCartItem);
router.delete('/item/:id', removeFromCart);
router.post('/checkout', checkout);

export default router;