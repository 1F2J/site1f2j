import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import HomeProductSections from './components/HomeProductSections';
import ErrorBoundary from './components/ErrorBoundary';
import ServicesSection from './components/ServicesSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import ProductsManagement from './components/admin/ProductsManagement';
import CategoriesManagement from './components/admin/CategoriesManagement';
import OrdersManagement from './components/admin/OrdersManagement';
import ProductsPage from './components/ProductsPage';
import SiteSettings from './components/admin/SiteSettings';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Adicionar import
import ProductDetail from './components/ProductDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rota pública - Homepage */}
          <Route path="/" element={
            <>
              <Header />
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
              <Footer />
            </>
          } />
          {/* Rota pública - Página de Produtos */}
          <Route path="/products" element={<ProductsPage />} />
          
          {/* Rota de login do admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Rota protegida do dashboard admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute>
                <ProductsManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/categories" 
            element={
              <ProtectedRoute>
                <CategoriesManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <ProtectedRoute>
                <OrdersManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute>
                <SiteSettings />
              </ProtectedRoute>
            } 
          />
          // Adicionar rota
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

