import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { userService } from '../../services/api';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const paymentId = searchParams.get('payment_id');
        if (paymentId) {
          const response = await userService.getPaymentStatus(paymentId);
          setStatus(response.data.status);
        }
      } catch (error) {
        console.error('Erro ao verificar status do pagamento:', error);
        setStatus('failure');
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const statusConfig = {
    approved: {
      icon: CheckCircle,
      title: 'Pagamento Aprovado!',
      description: 'Seu pedido foi confirmado e está sendo processado.',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    rejected: {
      icon: XCircle,
      title: 'Pagamento Recusado',
      description: 'Houve um problema com seu pagamento. Por favor, tente novamente.',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    pending: {
      icon: Clock,
      title: 'Pagamento Pendente',
      description: 'Aguardando confirmação do pagamento.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    in_process: {
      icon: Clock,
      title: 'Pagamento em Processamento',
      description: 'Seu pagamento está sendo processado.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }
  };

  const config = statusConfig[status];

  if (!config) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className={`mx-auto w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mb-4`}>
              <config.icon className={`w-8 h-8 ${config.color}`} />
            </div>
            <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {status === 'pending' && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Assim que confirmarmos seu pagamento, você receberá um e-mail com os detalhes do pedido.
                  </p>
                </div>
              )}

              {status === 'failure' && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-800">
                    Verifique os dados do seu cartão e tente novamente. Se o problema persistir,
                    entre em contato com seu banco ou escolha outro método de pagamento.
                  </p>
                </div>
              )}

              <Button 
                className="w-full" 
                onClick={() => navigate('/orders')}
              >
                Ver Meus Pedidos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/')}
              >
                Voltar para a Loja
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentStatus;