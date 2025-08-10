import { Router } from 'express';
import { 
  getDashboardStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllOrders,
  updateOrderStatus,
  getSiteSettings,
  updateSiteLogo,
  getBanners,
  uploadBanners,
  toggleBanner,
  deleteBanner,
  updateHomeDisplay,
  getHomeSections,
  createHomeSection,
  updateHomeSection,
  deleteHomeSection
} from '../controllers/adminController';
import { verifyToken, isAdmin } from '../middlewares/auth';
import { upload, productUpload } from '../utils/upload';

const router = Router();

// Todas as rotas do admin requerem autenticação e permissão de admin
router.use(verifyToken, isAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Produtos (admin view - inclui inativos)
router.get('/products', getAllProducts);
router.post('/products', productUpload.fields([{ name: 'main_image', maxCount: 1 }, { name: 'secondary_images', maxCount: 10 }]), createProduct);
router.put('/products/:id', productUpload.fields([{ name: 'main_image', maxCount: 1 }, { name: 'secondary_images', maxCount: 10 }]), updateProduct);
router.delete('/products/:id', deleteProduct);

// Categorias (admin view)
router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Pedidos
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Configurações do site
router.get('/settings', getSiteSettings);
router.put('/settings/logo', upload.single('logo'), updateSiteLogo);
router.put('/settings/home-display', updateHomeDisplay);

// Banners
router.get('/banners', getBanners);
router.post('/banners', upload.array('banners', 10), uploadBanners); // Máximo 10 banners por vez
router.put('/banners/:id/toggle', toggleBanner);
router.delete('/banners/:id', deleteBanner);

// Home Sections
router.get('/home-sections', getHomeSections);
router.post('/home-sections', createHomeSection);
router.put('/home-sections/:id', updateHomeSection);
router.delete('/home-sections/:id', deleteHomeSection);

export default router;

