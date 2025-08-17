import { Router } from 'express';
import { 
  getCategories, 
  getCategoryBySlug, 
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { verifyToken, isAdmin } from '../middlewares/auth';
import { upload } from '../utils/upload';

const router = Router();

// Rotas públicas
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.get('/:slug/produtos', getProductsByCategory);

// Rotas protegidas (admin)
router.post('/', verifyToken, isAdmin, upload.single('image') as any, createCategory);
router.put('/:id', verifyToken, isAdmin, upload.single('image') as any, updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

export default router;

