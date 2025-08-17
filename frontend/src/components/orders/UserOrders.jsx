import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Clock, Package, ArrowRight, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { userService } from '../../services/api';

const UserOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await userService.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: 'Aguardando Pagamento',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock
      },
      approved: {
        label: 'Pagamento Aprovado',
        color: 'bg-green-100 text-green-800',
        icon: Package
      },
      rejected: {
        label: 'Pagamento Recusado',
        color: 'bg-red-100 text-red-800',
        icon: RefreshCcw
      }
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB2590]"></div>
          <p className="mt-4 text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#EB2590] flex items-center gap-2">
              <Package className="w-6 h-6" />
              Meus Pedidos
            </CardTitle>
            <CardDescription>
              Acompanhe o status dos seus pedidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusConfig = getStatusConfig(order.payment_status);
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#EB2590] transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Pedido #{order.id}</h3>
                          <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm ${statusConfig.color}`}>
                          <div className="flex items-center gap-1">
                            <statusConfig.icon className="w-4 h-4" />
                            {statusConfig.label}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span>{item.product_name}</span>
                            <span className="text-gray-600">
                              {item.quantity}x R$ {parseFloat(item.price).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div className="text-[#EB2590] font-semibold">
                          Total: R$ {parseFloat(order.total).toFixed(2)}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#EB2590] border-[#EB2590] hover:bg-[#EB2590] hover:text-white"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          Ver Detalhes
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Você ainda não fez nenhum pedido.
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-[#EB2590] hover:bg-[#EB2590]/90"
                >
                  Começar a Comprar
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserOrders;