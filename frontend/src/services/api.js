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
    const token = localStorage.getItem('userToken');
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
    // Permitir que o AuthContext lide com erros de autenticação
    return Promise.reject(error);
  }
);

// Serviços de autenticação para usuários comuns
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  },
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('userToken');
  },
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Serviços de autenticação para admin
export const adminAuthService = {
  login: (email, password) => api.post('/auth/admin/login', { email, password }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) return false;
    
    const userData = JSON.parse(user);
    return userData.role === 'admin';
  },
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
  getCategories: () => api.get('/categorias'),
  getProducts: (params = {}) => api.get('/produtos', { params }),
  getHomeSections: () => api.get('/site/home-sections'),
};

// Serviços de pagamento
export const paymentService = {
  createPayment: (data) => {
    console.log('Enviando dados para criação de pagamento:', data);
    return api.post('/payments/create', data);
  },
  getPaymentStatus: (paymentId) => api.get(`/payments/status/${paymentId}`),
  processCardPayment: (data) => {
    console.log('Processando pagamento com cartão:', data);
    return api.post('/payments/process-card', data);
  }
};

// Serviços do usuário (autenticado)
export const userService = {
  // Perfil
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  
  // Endereços
  getAddresses: () => api.get('/user/addresses'),
  addAddress: (data) => api.post('/user/addresses', data),
  updateAddress: (id, data) => api.put(`/user/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/user/addresses/${id}`),
  
  // Consentimentos LGPD
  updateConsents: (data) => api.put('/user/consents', data),
  
  // Exclusão de conta
  requestAccountDeletion: () => api.post('/user/request-deletion'),
  
  // Pedidos
  getOrders: (params = {}) => api.get('/user/orders', { params }),
  getOrderById: (id) => api.get(`/user/orders/${id}`),
  getPaymentStatus: (paymentId) => api.get(`/payments/status/${paymentId}`),
  createPayment: (data) => api.post('/payments/create', data),
  
  // Favoritos
  getFavorites: () => api.get('/user/favorites'),
  addToFavorites: (productId) => api.post('/user/favorites', { productId }),
  removeFromFavorites: (productId) => api.delete(`/user/favorites/${productId}`),
};

// Serviços do admin
export const adminService = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAnalytics: (timeRange) => api.get(`/admin/analytics?range=${timeRange}`),
  
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
  
  // Usuários
  getAllUsers: (params = {}) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
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

