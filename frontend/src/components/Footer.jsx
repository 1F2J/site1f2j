import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';
import '../App.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { name: 'Início', action: scrollToTop },
    { name: 'Produtos', action: () => scrollToSection('products-section') },
    { name: 'Serviços', action: () => scrollToSection('services') },
    { name: 'Sobre', action: () => scrollToSection('about') },
    { name: 'Contato', action: () => scrollToSection('contact') }
  ];

  const services = [
    'Impressão Digital',
    'Adesivos Personalizados',
    'Banners e Faixas',
    'Design Gráfico',
    'Consultoria Visual'
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Back to Top Button */}
      <Button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full w-12 h-12 p-0 shadow-lg"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>

      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo e Descrição */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-6">
              <img src={logo} alt="1F2J Logo" className="h-12 w-auto" />
              <div>
                <span className="text-2xl font-bold">1F2J</span>
                <div className="text-sm text-cyan-400">Gráfica Digital</div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Especialistas em impressão digital com qualidade e tecnologia 
              para atender todas as suas necessidades gráficas.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="bg-gray-800 hover:bg-cyan-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-cyan-400">Links Rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.action}
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Serviços */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-cyan-400">Nossos Serviços</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="text-gray-300">
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contato */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-cyan-400">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-cyan-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <div className="text-gray-300">(11) 99999-9999</div>
                  <div className="text-sm text-gray-500">Seg-Sex: 8h às 18h</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-cyan-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-gray-300">contato@1f2j.com</div>
                  <div className="text-sm text-gray-500">Resposta em 2h</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-cyan-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-gray-300">São Paulo, SP</div>
                  <div className="text-sm text-gray-500">Atendimento presencial</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
              onClick={() => scrollToSection('contact')}
            >
              Solicitar Orçamento
            </Button>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 pt-8 mb-8"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">
              Receba nossas novidades
            </h3>
            <p className="text-gray-300 mb-6">
              Fique por dentro das últimas tendências em impressão digital
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              />
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6">
                Inscrever
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">
              © 2025 1F2J Gráfica. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

