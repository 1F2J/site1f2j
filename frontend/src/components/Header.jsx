import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

import '../App.css';

const Header = () => {
  const [logoUrl, setLogoUrl] = useState('/uploads/default-logo.svg');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/site/settings');
        const data = await response.json();
        setLogoUrl(`http://localhost:3001${data.site_logo || '/uploads/default-logo.svg'}`);
      } catch (error) {
        console.error('Erro ao buscar logo:', error);
      }
    };
    fetchLogo();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Início', href: '#', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { name: 'Produtos', href: '#products-section', action: () => scrollToSection('products-section') },
    { name: 'Serviços', href: '#services', action: () => scrollToSection('services') },
    { name: 'Sobre', href: '#about', action: () => scrollToSection('about') },
    { name: 'Contato', href: '#contact', action: () => scrollToSection('contact') }
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-800 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contato@1f2j.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>Seg-Sex: 8h às 18h</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                onClick={() => scrollToSection('contact')}
              >
                Orçamento Grátis
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header 
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg text-gray-800' : 'bg-cyan-600 text-white shadow-lg'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {logoUrl && <img src={logoUrl} alt="1F2J Logo" className="h-12 w-auto" />}
              
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={item.action}
                  className={`font-medium transition-colors duration-200 hover:scale-105 ${isScrolled ? 'text-gray-700 hover:text-cyan-600' : 'text-white hover:text-yellow-400'}`}
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className={`${isScrolled ? 'text-gray-700 hover:text-cyan-600' : 'text-white hover:text-yellow-400'}`}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrinho
              </Button>
              <Button 
                className={`${isScrolled ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-yellow-400 hover:bg-yellow-500 text-black'} font-semibold px-6`}
                onClick={() => scrollToSection('contact')}
              >
                Fale Conosco
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className={`${isScrolled ? 'text-gray-700 hover:text-cyan-600' : 'text-white hover:text-yellow-400'}`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t shadow-lg"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.name}
                      onClick={item.action}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:text-cyan-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {item.name}
                    </motion.button>
                  ))}
                  
                  <div className="border-t pt-4 space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Carrinho
                    </Button>
                    <Button 
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                      onClick={() => scrollToSection('contact')}
                    >
                      Fale Conosco
                    </Button>
                  </div>

                  {/* Mobile Contact Info */}
                  <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>(11) 99999-9999</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>contato@1f2j.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;

