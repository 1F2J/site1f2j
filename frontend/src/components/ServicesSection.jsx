import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Palette, 
  Truck, 
  Users, 
  Clock, 
  Shield, 
  Lightbulb,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: 'Design Personalizado',
      description: 'Nossa equipe de designers cria layouts únicos e impactantes para seus projetos',
      icon: Palette,
      features: ['Criação de Arte', 'Revisão Ilimitada', 'Arquivos Editáveis'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 2,
      title: 'Entrega Expressa',
      description: 'Serviço de entrega rápida para atender suas necessidades urgentes',
      icon: Truck,
      features: ['Entrega em 24h', 'Rastreamento Online', 'Seguro Incluso'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      title: 'Consultoria Especializada',
      description: 'Orientação profissional para escolher os melhores materiais e acabamentos',
      icon: Users,
      features: ['Análise de Projeto', 'Sugestões Técnicas', 'Suporte Completo'],
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const benefits = [
    { icon: Clock, title: 'Agilidade', description: 'Prazos cumpridos rigorosamente' },
    { icon: Shield, title: 'Qualidade', description: 'Materiais premium e acabamento perfeito' },
    { icon: Lightbulb, title: 'Inovação', description: 'Tecnologia de ponta em impressão' },
    { icon: CheckCircle, title: 'Garantia', description: '100% de satisfação garantida' }
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Nossos <span className="text-cyan-600">Serviços</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos uma gama completa de serviços para atender todas as suas necessidades 
            de comunicação visual e impressão digital.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={itemVariants}>
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 overflow-hidden group">
                <div className={`bg-gradient-to-br ${service.color} p-6 text-white relative`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-16 h-16 border-2 border-current rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-current rounded-full"></div>
                  </div>
                  
                  <CardHeader className="relative z-10 p-0">
                    <service.icon className="w-12 h-12 mb-4" />
                    <CardTitle className="text-2xl font-bold mb-2">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-white/90 text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                </div>

                <CardContent className="p-6 bg-white flex-1">
                  <h4 className="font-semibold text-gray-800 mb-4">Inclui:</h4>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-600">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white group">
                    Saiba Mais
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-lg"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Por que escolher a <span className="text-cyan-600">1F2J</span>?
            </h3>
            <p className="text-lg text-gray-600">
              Nosso compromisso é entregar excelência em cada projeto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-800">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;