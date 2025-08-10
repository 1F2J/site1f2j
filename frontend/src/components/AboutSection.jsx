import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { 
  Award, 
  Users, 
  Calendar, 
  Target,
  Heart,
  Zap,
  Quote
} from 'lucide-react';

const AboutSection = () => {
  const stats = [
    { number: '500+', label: 'Projetos Concluídos', icon: Target },
    { number: '5+', label: 'Anos de Experiência', icon: Calendar },
    { number: '200+', label: 'Clientes Satisfeitos', icon: Users },
    { number: '99%', label: 'Taxa de Satisfação', icon: Award }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Paixão',
      description: 'Amamos o que fazemos e isso se reflete em cada projeto entregue'
    },
    {
      icon: Zap,
      title: 'Inovação',
      description: 'Sempre buscamos as melhores tecnologias e técnicas do mercado'
    },
    {
      icon: Award,
      title: 'Excelência',
      description: 'Nosso padrão de qualidade é sempre o mais alto possível'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      company: 'Empresa ABC',
      text: 'Excelente qualidade e atendimento. Sempre entregam no prazo e com perfeição.',
      rating: 5
    },
    {
      name: 'João Santos',
      company: 'Loja XYZ',
      text: 'Parceria de anos! A 1F2J sempre supera nossas expectativas em cada projeto.',
      rating: 5
    },
    {
      name: 'Ana Costa',
      company: 'Eventos Premium',
      text: 'Profissionais competentes e criativos. Recomendo para todos os meus contatos.',
      rating: 5
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
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
            Sobre a <span className="text-cyan-600">1F2J</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos uma gráfica digital especializada em soluções de impressão de alta qualidade, 
            comprometida em transformar suas ideias em realidade.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-6 text-gray-800">Nossa História</h3>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                Fundada com o objetivo de revolucionar o mercado de impressão digital, 
                a 1F2J nasceu da paixão por criar soluções visuais impactantes e de alta qualidade.
              </p>
              <p>
                Ao longo dos anos, construímos uma reputação sólida baseada na excelência 
                técnica, inovação constante e relacionamento próximo com nossos clientes.
              </p>
              <p>
                Hoje, somos referência no mercado, oferecendo desde impressões simples 
                até projetos complexos de comunicação visual, sempre com o mesmo 
                compromisso: superar expectativas.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Nossa Missão</h3>
              <p className="text-lg mb-6 opacity-90">
                "Transformar ideias em realidade através de soluções de impressão 
                digital inovadoras, oferecendo qualidade excepcional e atendimento 
                personalizado para cada cliente."
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">24h</div>
                  <div className="text-sm opacity-80">Entrega Expressa</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">100%</div>
                  <div className="text-sm opacity-80">Garantia</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-cyan-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Nossos <span className="text-cyan-600">Valores</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-gray-800">{value.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            O que nossos <span className="text-cyan-600">clientes</span> dizem
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg bg-white">
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-cyan-500 mb-4" />
                    <p className="text-gray-600 mb-6 italic leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.company}</div>
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Pronto para começar seu projeto?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Entre em contato conosco e descubra como podemos ajudar você
          </p>
          <Button 
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 text-lg font-semibold"
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Falar Conosco
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;