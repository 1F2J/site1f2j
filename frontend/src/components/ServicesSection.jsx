import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Printer,
  PenTool,
  Layers,
  Palette,
  Scissors,
  FileType,
  Truck,
  Clock,
  Shield,
  CheckCircle,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: 'Impressão Digital em Grande Formato',
      description: 'Impressão profissional em alta resolução para banners, faixas e painéis de até 5 metros',
      icon: Printer,
      features: [
        { icon: Palette, text: 'Cores Vibrantes e Precisas' },
        { icon: FileType, text: 'Resolução até 2880 DPI' },
        { icon: Shield, text: 'Garantia de 12 Meses' }
      ],
      color: 'from-[#EB2590] to-[#EB2590]/80'
    },
    {
      id: 2,
      title: 'Design e Criação Visual',
      description: 'Desenvolvimento de identidade visual, logotipos e materiais publicitários personalizados',
      icon: PenTool,
      features: [
        { icon: Layers, text: 'Projetos Exclusivos' },
        { icon: Clock, text: 'Entregas em 24-48h' },
        { icon: Scissors, text: 'Acabamento Premium' }
      ],
      color: 'from-[#00AFEF] to-[#00AFEF]/80'
    },
    {
      id: 3,
      title: 'Soluções Completas para Empresas',
      description: 'Atendimento especializado para empresas com soluções personalizadas e preços especiais',
      icon: Truck,
      features: [
        { icon: Shield, text: 'Qualidade Garantida' },
        { icon: Clock, text: 'Suporte Prioritário' },
        { icon: Palette, text: 'Consultoria Especializada' }
      ],
      color: 'from-[#FFF212] to-[#FFF212]/80'
    }
  ];

  const benefits = [
    { icon: Clock, title: 'Rapidez e Pontualidade', description: 'Entregas no prazo com agilidade garantida' },
    { icon: Shield, title: 'Qualidade Superior', description: 'Equipamentos modernos e materiais certificados' },
    { icon: Lightbulb, title: 'Tecnologia Avançada', description: 'Impressão digital de última geração' },
    { icon: CheckCircle, title: 'Garantia Total', description: 'Satisfação garantida em todos os serviços' }
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
    <section id="services" className="py-20 bg-gradient-to-br from-[#EB2590] via-[#00AFEF] to-[#FFF212]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Nossos <span className="text-[#ff7900]">Serviços</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Soluções completas em impressão digital de alta qualidade, comunicação visual e 
            materiais gráficos para sua empresa se destacar no mercado.
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
                <div className={`bg-[#ff7900] p-6 text-white relative`}>
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

                <CardContent className="p-6 bg-white/10 backdrop-blur-sm flex-1">
                  <h4 className="font-semibold text-white mb-4">Inclui:</h4>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-white/90">
                        <CheckCircle className="w-5 h-5 text-[#FFF212] flex-shrink-0" />
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full bg-[#ff7900] hover:bg-[#ff7900]/90 text-white group">
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
          className="bg-[#ff7900] rounded-2xl p-8 md:p-12 shadow-lg"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Por que escolher a <span className="text-[#FFF212]">1F2J</span>?
            </h3>
            <p className="text-lg text-white/90">
              Referência em qualidade e inovação no mercado gráfico
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
                <div className="bg-gradient-to-br from-[#EB2590] to-[#00AFEF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-white">{benefit.title}</h4>
                <p className="text-white/90">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;