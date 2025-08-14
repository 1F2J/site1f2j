import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, ArrowUp, Youtube, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import useSiteLogo from '../hooks/useSiteLogo';
import '../App.css';

const Footer = () => {
  const logoUrl = useSiteLogo();
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
    <footer className="bg-gradient-to-br from-[#EB2590] via-[#00AFEF] to-[#FFF212] text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff7900]/20 via-[#ff7900]/10 to-[#ff7900]/20 opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#ff7900]/20 to-[#ff7900]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-[#ff7900]/20 to-[#ff7900]/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 opacity-10"></div>
      {/* Back to Top Button */}
      <Button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#ff7900] hover:bg-[#ff7900]/90 text-white rounded-full w-12 h-12 p-0 shadow-lg"
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
              <img src={logoUrl} alt="1F2J Logo" className="h-12 w-auto" />
              <div>
                <span className="text-2xl font-bold">1F2J</span>
                <div className="text-sm text-[#ff7900]">Gráfica Digital</div>
              </div>
            </div>
            <p className="text-white/90 mb-6 leading-relaxed">
              Especialistas em impressão digital com qualidade e tecnologia 
              para atender todas as suas necessidades gráficas.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="bg-[#ff7900] hover:bg-[#ff7900]/90 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
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
            <h3 className="text-lg font-semibold mb-6 text-[#ff7900]">Links Rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.action}
                    className="text-white/90 hover:text-[#ff7900] transition-colors duration-200 text-left"
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
            <h3 className="text-lg font-semibold mb-6 text-[#ff7900]">Nossos Serviços</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="text-white/90">
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
            <h3 className="text-lg font-semibold mb-6 text-[#ff7900]">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-[#ff7900] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <div className="text-white/90">(11) 99999-9999</div>
                  <div className="text-sm text-white/60">Seg-Sex: 8h às 18h</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-[#ff7900] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-white/90">contato@1f2j.com</div>
                  <div className="text-sm text-white/60">Resposta em 2h</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-[#ff7900] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-white/90">São Paulo, SP</div>
                  <div className="text-sm text-white/60">Atendimento presencial</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              className="w-full mt-6 bg-[#ff7900] hover:bg-[#ff7900]/90 text-white font-semibold"
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
          className="border-t border-white/20 pt-8 mb-8"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-[#ff7900]">
              Receba nossas novidades
            </h3>
            <p className="text-white/90 mb-6">
              Fique por dentro das últimas tendências em impressão digital
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#ff7900]"
              />
              <Button className="bg-[#ff7900] hover:bg-[#ff7900]/90 text-white px-6">
                Inscrever
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60">
              © 2025 1F2J Gráfica. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm text-white/60">
              <a href="#" className="hover:text-[#ff7900] transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-[#ff7900] transition-colors">
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

