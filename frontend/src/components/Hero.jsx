import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Printer, Zap, Award } from 'lucide-react';
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
    { icon: Printer, text: "Impressão de Alta Qualidade" },
    { icon: Zap, text: "Entrega Rápida" },
    { icon: Award, text: "Garantia de Satisfação" }
  ];

  return <BannerCarousel />;};

export default Hero;

