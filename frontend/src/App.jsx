import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HomeProductSections from './components/HomeProductSections';
import ErrorBoundary from './components/ErrorBoundary';
import ServicesSection from './components/ServicesSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import ProductsManagement from './components/admin/ProductsManagement.jsx';
import CategoriesManagement from './components/admin/CategoriesManagement';
import OrdersManagement from './components/admin/OrdersManagement';
import ProductsPage from './components/ProductsPage';
import SiteSettings from './components/admin/SiteSettings';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import UserProfile from './components/UserProfile';
import UserDashboard from './components/UserDashboard';
import PaymentStatus from './components/payment/PaymentStatus';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <div className="pt-[140px]"> {/* Espaço para a navbar fixa */}
            <Routes>
              {/* Rota pública - Homepage */}
              <Route path="/" element={
                <main>
                  <Hero />
                  <div id="products-section">
                    <ErrorBoundary>
                      <HomeProductSections />
                    </ErrorBoundary>
                  </div>
                  <div id="services">
                    <ServicesSection />
                  </div>
                  <div id="about">
                    <AboutSection />
                  </div>
                  <div id="contact">
                    <ContactSection />
                  </div>
                </main>
              } />
              
              {/* Rotas públicas */}
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rotas de pagamento */}
              <Route path="/payment/success" element={<PaymentStatus />} />
              <Route path="/payment/failure" element={<PaymentStatus />} />
              <Route path="/payment/pending" element={<PaymentStatus />} />
              
              {/* Rotas protegidas de usuário */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              
              {/* Rota de login do admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Rotas protegidas do admin */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute requireAdmin={true}>
                  <ProductsManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/categories" element={
                <ProtectedRoute requireAdmin={true}>
                  <CategoriesManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute requireAdmin={true}>
                  <OrdersManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute requireAdmin={true}>
                  <SiteSettings />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

