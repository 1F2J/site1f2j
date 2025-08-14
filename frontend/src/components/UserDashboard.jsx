import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, Star, Package, Receipt, Calendar, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';

import { useAuth } from '../contexts/AuthContext';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userOrders = [
    {
      id: '1',
      date: '15/03/2024',
      status: 'Entregue',
      items: ['Banner 3x1m', 'Adesivos Personalizados'],
      total: 'R$ 450,00'
    },
    {
      id: '2',
      date: '10/03/2024',
      status: 'Em produção',
      items: ['Faixa 2x0.7m'],
      total: 'R$ 180,00'
    }
  ];

  const userStats = [
    { icon: ShoppingBag, label: 'Pedidos Totais', value: '8' },
    { icon: Star, label: 'Avaliações Feitas', value: '5' },
    { icon: Package, label: 'Produtos Favoritos', value: '12' }
  ];

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Boas-vindas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#EB2590] mb-4">
            Bem-vindo(a), {user?.name || 'Cliente'}
          </h1>
          <p className="text-gray-600 text-lg">
            Acompanhe seus pedidos e descubra nossas novidades
          </p>
        </motion.div>

        {/* Estatísticas do Usuário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {userStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 flex items-center justify-between border-2 border-[#EB2590]/20 shadow-lg"
            >
              <div className="flex items-center">
                <div className="bg-[#EB2590] p-3 rounded-lg mr-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#EB2590]">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Histórico de Pedidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border-2 border-[#EB2590]/20 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-[#EB2590] mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-[#EB2590]" />
            Histórico de Pedidos
          </h2>
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-gray-800 font-medium">Pedido #{order.id}</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {order.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#EB2590] font-medium">{order.status}</p>
                    <p className="text-gray-800 font-bold">{order.total}</p>
                  </div>
                </div>
                <div className="text-gray-600 text-sm">
                  {order.items.join(', ')}
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    className="border-gray-200 text-gray-600 hover:bg-gray-100"
                    size="sm"
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  <Button
                    className="bg-[#EB2590] hover:bg-[#EB2590]/90 text-white"
                    size="sm"
                  >
                    Comprar Novamente
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Carrinho de Compras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 border-2 border-[#EB2590]/20 shadow-lg mt-8"
        >
          <h2 className="text-2xl font-bold text-[#EB2590] mb-6 flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2 text-[#EB2590]" />
            Seu Carrinho
          </h2>
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Seu carrinho está vazio</p>
            <Button
              className="mt-4 bg-[#EB2590] hover:bg-[#EB2590]/90 text-white"
              onClick={() => navigate('/products')}
            >
              Explorar Produtos
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;