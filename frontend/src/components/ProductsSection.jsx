import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { Printer, Sticker, Flag, ArrowRight, Star, Clock, Shield } from 'lucide-react';
import '../App.css';

const ProductsSection = () => {
  const products = [
    {
      id: 1,
      title: 'Impressão Digital',
      description: 'Alta qualidade em grandes formatos para suas necessidades profissionais',
      icon: Printer,
      bgColor: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      textColor: 'text-white',
      features: ['Resolução 4K', 'Papel Premium', 'Cores Vibrantes'],
      price: 'A partir de R$ 15,00'
    },
    {
      id: 2,
      title: 'Adesivos',
      description: 'Personalizados para sua marca com materiais resistentes',
      icon: Sticker,
      bgColor: 'bg-gradient-to-br from-magenta-500 to-pink-600',
      textColor: 'text-white',
      features: ['Vinil Premium', 'Resistente à Água', 'Corte Personalizado'],
      price: 'A partir de R$ 8,00'
    },
    {
      id: 3,
      title: 'Banners',
      description: 'Comunicação visual impactante para eventos e promoções',
      icon: Flag,
      bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      textColor: 'text-black',
      features: ['Lona Resistente', 'Ilhoses Inclusos', 'Impressão HD'],
      price: 'A partir de R$ 25,00'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="products-section" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Nossos <span className="text-cyan-600">Produtos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos soluções completas em impressão digital com a mais alta qualidade 
            e tecnologia de ponta para atender todas as suas necessidades.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={cardVariants}>
              <Card className="border-none shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer overflow-hidden group h-full">
                <div className={`${product.bgColor} ${product.textColor} relative`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-20 h-20 border-2 border-current rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-current rounded-full"></div>
                  </div>
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <product.icon className="w-12 h-12" />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold mb-2">
                      {product.title}
                    </CardTitle>
                    <CardDescription className={`${product.textColor} opacity-90 text-base`}>
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                </div>

                <CardContent className="p-6 bg-white flex-1 flex flex-col">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-3">Características:</h4>
                    <ul className="space-y-2 mb-6">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-600">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-cyan-600">{product.price}</span>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>24h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          <span>Garantia</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white group">
                      Solicitar Orçamento
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Precisa de algo personalizado?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Nossa equipe está pronta para criar soluções sob medida para seu projeto
          </p>
          <Button 
            className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Falar com Especialista
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;

