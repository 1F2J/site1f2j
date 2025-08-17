import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, ChevronDown, X } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import useSiteLogo from '../hooks/useSiteLogo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const logoUrl = useSiteLogo();

  const menuItems = [
    { name: 'Todos os Produtos', href: '/products' },
    { name: 'Cartão de Visita', href: '/products?category=cartao-visita' },
    { name: 'Folders e Panfletos', href: '/products?category=folders-panfletos' },
    { name: 'Adesivos', href: '/products?category=adesivos' },
    { name: 'Banners, Faixas e Placas', href: '/products?category=banners-faixas-placas' },
    { name: 'Papelaria', href: '/products?category=papelaria' },
    { name: 'Brindes e Presentes', href: '/products?category=brindes-presentes' },
    { name: 'Wind Banner', href: '/products?category=wind-banner' },
    { name: 'Tags', href: '/products?category=tags' },
    { name: 'Linha Têxtil', href: '/products?category=linha-textil' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logoUrl} alt="1F2J Logo" className="h-12 w-auto" />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="O que você está procurando?"
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB2590] focus:border-transparent transition-all duration-300 bg-gray-50 group-hover:bg-white"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#EB2590] transition-colors duration-300">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-6">
            <div className="text-right hidden md:block relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-[#EB2590] transition-colors duration-300"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{user?.name?.split(' ')[0] || 'Usuário'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100 transform opacity-100 scale-100 transition-all duration-200">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#EB2590] transition-colors duration-200"
                      >
                        Meu Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#EB2590] transition-colors duration-200"
                      >
                        Meu Perfil
                      </Link>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#EB2590] transition-colors duration-200"
                        onClick={logout}
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-[#EB2590] transition-colors duration-300"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Entrar</span>
                </Link>
              )}
            </div>
            
            <button
              onClick={handleCartClick}
              className="text-gray-600 hover:text-[#EB2590] transition-colors duration-300 relative"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-[#EB2590] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-[#EB2590] transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O que você está procurando?"
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB2590] focus:border-transparent transition-all duration-300 bg-gray-50 group-hover:bg-white"
            />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#EB2590] transition-colors duration-300">
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Navigation Menu */}
        <div className={`md:block ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col md:flex-row md:items-center md:justify-center md:space-x-6 py-2 text-sm">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className="block py-2 text-gray-700 hover:text-[#EB2590] transition-colors duration-200 font-medium"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;