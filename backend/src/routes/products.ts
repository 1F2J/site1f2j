import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController';
import { verifyToken, isAdmin } from '../middlewares/auth';
import { upload, productUpload } from '../utils/upload';

const router = Router();

// Rotas públicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rotas protegidas (admin)
router.post('/', verifyToken, isAdmin, productUpload.single('image') as any, createProduct);
router.put('/:id', verifyToken, isAdmin, productUpload.single('image') as any, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;

