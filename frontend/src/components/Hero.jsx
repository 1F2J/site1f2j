import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Printer, Zap, Award, Star, Users, Clock, CheckCircle, Sparkles } from 'lucide-react';
import BannerCarousel from './BannerCarousel';
import '../App.css';

const Hero = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    { icon: Printer, text: "Impressão Digital Profissional", description: "Tecnologia de última geração com resolução até 2880 DPI" },
    { icon: Sparkles, text: "Acabamento Premium", description: "Materiais importados e processos certificados" },
    { icon: CheckCircle, text: "Garantia de Qualidade", description: "Controle rigoroso em todas as etapas" }
  ];

  const stats = [
    { icon: Users, number: "1000+", label: "Projetos Entregues" },
    { icon: Star, number: "5.0", label: "Satisfação Garantida" },
    { icon: Clock, number: "24h", label: "Atendimento Rápido" }
  ];

  return (
    <>
    <div className="relative overflow-hidden bg-gradient-to-br from-[#EB2590] via-[#00AFEF] to-[#FFF212]">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Impressão Digital de Alta Qualidade
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8">
            Pessoas especiais merecem Projetos especiais. Merecem 1F2J
          </p>
          <Button 
            className="bg-[#ff7900] hover:bg-[#ff7900]/90 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={scrollToProducts}
          >
            Conheça Nossos Produtos
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>

        {/* Banner Carousel */}
        <motion.div 
          className="relative max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl">
            <BannerCarousel />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-r from-[#EB2590]/10 via-[#00AFEF]/10 to-[#FFF212]/10 rounded-lg blur-lg"></div>
          <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-l from-[#EB2590]/10 via-[#00AFEF]/10 to-[#FFF212]/10 rounded-lg blur-lg"></div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="bg-[#ff7900] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.text}</h3>
              <p className="text-white/90">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6 text-[#FFF212] mr-2" />
                <span className="text-3xl font-bold text-white">
                  {stat.number}
                </span>
              </div>
              <p className="text-white/90 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
    </>
  );
};

export default Hero;

