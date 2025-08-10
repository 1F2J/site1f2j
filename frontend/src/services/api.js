import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
};

// Serviços de produtos
export const productService = {
  getAll: (params = {}) => api.get('/produtos', { params }),
  getById: (id) => api.get(`/produtos/${id}`),
  create: (formData) => api.post('/produtos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/produtos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/produtos/${id}`),
};

// Serviços de categorias
export const categoryService = {
  getAll: () => api.get('/categorias'),
  getBySlug: (slug) => api.get(`/categorias/${slug}`),
  getProducts: (slug, params = {}) => api.get(`/categorias/${slug}/produtos`, { params }),
  create: (formData) => api.post('/categorias', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/categorias/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/categorias/${id}`),
};

// Serviços do site (públicos)
export const siteService = {
  getBanners: () => api.get('/site/banners'),
  getSettings: () => api.get('/site/settings'),
  getCategories: () => api.get('/site/categories'),
  getProducts: (params = {}) => api.get('/site/products', { params }),
  getHomeSections: () => api.get('/site/home-sections'),
};

// Serviços do admin
export const adminService = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Produtos
  getAllProducts: (params = {}) => api.get('/admin/products', { params }),
  createProduct: (formData) => api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProduct: (id, formData) => api.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
  // Categorias
  getAllCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  
  // Pedidos
  getAllOrders: (params = {}) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  
  // Configurações do Site
  getSiteSettings: () => api.get('/admin/settings'),
  updateSiteLogo: (formData) => api.put('/admin/settings/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateHomeDisplay: (data) => api.put('/admin/settings/home-display', data),
  
  // Banners
  getBanners: () => api.get('/admin/banners'),
  uploadBanners: (formData) => api.post('/admin/banners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  toggleBanner: (id, isActive) => api.put(`/admin/banners/${id}/toggle`, { is_active: isActive }),
  deleteBanner: (id) => api.delete(`/admin/banners/${id}`),
  
  // Home Sections
  getHomeSections: () => api.get('/admin/home-sections'),
  createHomeSection: (data) => api.post('/admin/home-sections', data),
  updateHomeSection: (id, data) => api.put(`/admin/home-sections/${id}`, data),
  deleteHomeSection: (id) => api.delete(`/admin/home-sections/${id}`),
};

export default api;

