import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  FileText,
  Calculator,
  MessageSquare,
  Calendar
} from 'lucide-react';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefone',
      info: '(11) 99999-9999',
      description: 'Seg-Sex: 8h às 18h'
    },
    {
      icon: Mail,
      title: 'E-mail',
      info: 'contato@1f2j.com',
      description: 'Resposta em até 2h'
    },
    {
      icon: MapPin,
      title: 'Endereço',
      info: 'São Paulo, SP',
      description: 'Atendimento presencial'
    },
    {
      icon: Clock,
      title: 'Horário',
      info: 'Seg-Sex: 8h às 18h',
      description: 'Sáb: 8h às 12h'
    }
  ];

  const services = [
    { icon: Calculator, title: 'Orçamento Grátis', description: 'Solicite seu orçamento sem compromisso' },
    { icon: FileText, title: 'Consultoria', description: 'Orientação especializada para seu projeto' },
    { icon: MessageCircle, title: 'Suporte', description: 'Atendimento personalizado e ágil' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode implementar a lógica de envio do formulário
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-[#EB2590] via-[#00AFEF] to-[#FFF212] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff7900]/20 via-[#ff7900]/10 to-[#ff7900]/20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#ff7900]/20 to-[#ff7900]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-[#ff7900]/20 to-[#ff7900]/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Vamos Criar Algo <span className="text-[#ff7900]">Incrível</span> Juntos
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Nossa equipe especializada está pronta para transformar suas ideias em realidade com soluções personalizadas e tecnologia de ponta
          </p>
        </motion.div>

        {/* Services Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="bg-[#ff7900] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
                  <p className="text-white/90">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border-none shadow-xl bg-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <Send className="w-6 h-6 text-[#FFF212]" />
                  Envie sua Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Nome *
                      </label>
                      <Input 
                        type="text" 
                        required 
                        className="w-full bg-white/20 border-white/20 text-white placeholder:text-white/60"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Telefone *
                      </label>
                      <Input 
                        type="tel" 
                        required 
                        className="w-full bg-white/20 border-white/20 text-white placeholder:text-white/60"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      E-mail *
                    </label>
                    <Input 
                      type="email" 
                      required 
                      className="w-full bg-white/20 border-white/20 text-white placeholder:text-white/60"
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Assunto
                    </label>
                    <Input 
                      type="text" 
                      className="w-full bg-white/20 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Assunto da sua mensagem"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Mensagem *
                    </label>
                    <Textarea 
                      required 
                      className="w-full min-h-[120px] bg-white/20 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Descreva seu projeto ou dúvida..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#ff7900] hover:bg-[#ff7900]/90 text-white py-3 text-lg font-semibold"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white">
                Informações de Contato
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="bg-[#ff7900] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{info.title}</h4>
                      <p className="text-[#FFF212] font-medium">{info.info}</p>
                      <p className="text-sm text-white/80">{info.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#ff7900] rounded-lg p-8 text-white text-center"
            >
              <MapPin className="w-16 h-16 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Nossa Localização</h4>
              <p className="mb-4">São Paulo, SP</p>
              <p className="text-sm opacity-90">
                Atendemos toda a região metropolitana de São Paulo com entrega expressa
              </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <Button 
                className="w-full bg-[#ff7900] hover:bg-[#ff7900]/90 text-white py-3 text-lg font-semibold"
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border-white text-white hover:bg-white hover:text-[#ff7900] py-3 text-lg font-semibold"
                onClick={() => window.location.href = 'tel:+5511999999999'}
              >
                <Phone className="w-5 h-5 mr-2" />
                Ligar Agora
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;