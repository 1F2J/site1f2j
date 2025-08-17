import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { adminService } from '../../services/api';
import { 
  Package, Users, ShoppingCart, TrendingUp, DollarSign, Eye, 
  Calendar, BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight,
  Clock, Star, AlertCircle, CheckCircle, XCircle, Loader
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import '../../App.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({
    salesData: [],
    categoryData: [],
    recentOrders: [],
    topProducts: [],
    monthlyRevenue: [],
    userGrowth: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, analyticsResponse] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAnalytics(timeRange)
      ]);
      
      setStats(statsResponse.data?.stats || {});
      setAnalytics(analyticsResponse.data || {
        salesData: [],
        categoryData: [],
        recentOrders: [],
        topProducts: [],
        monthlyRevenue: [],
        userGrowth: []
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setAnalytics({
        salesData: [],
        categoryData: [],
        recentOrders: [],
        topProducts: [],
        monthlyRevenue: [],
        userGrowth: []
      });
    } finally {
      setLoading(false);
    }
  };



  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'novo': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'producao': return <Loader className="h-4 w-4 text-yellow-500" />;
      case 'enviado': return <ArrowUpRight className="h-4 w-4 text-purple-500" />;
      case 'concluido': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelado': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'novo': return 'bg-blue-100 text-blue-800';
      case 'producao': return 'bg-yellow-100 text-yellow-800';
      case 'enviado': return 'bg-purple-100 text-purple-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#EB2590]"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Painel Administrativo
              </h1>
              <p className="text-gray-600 mt-1">Bem-vindo ao dashboard da 1F2J Gráfica</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="1y">Último ano</option>
              </select>
              <Button onClick={handleLogout} variant="outline">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-l-4 border-l-[#EB2590]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos</CardTitle>
                <Package className="h-4 w-4 text-[#EB2590]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.products?.total || 0}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {parseFloat(stats.products?.growth) >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  {stats.products?.growth || 0}% este mês
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-l-4 border-l-[#00AFEF]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita</CardTitle>
                <DollarSign className="h-4 w-4 text-[#00AFEF]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {(stats.revenue?.total || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {parseFloat(stats.revenue?.growth) >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  {stats.revenue?.growth || 0}% este mês
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-l-4 border-l-[#FFF212]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                <ShoppingCart className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.orders?.total || 0}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {parseFloat(stats.orders?.growth) >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  {stats.orders?.growth || 0}% este mês
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários</CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.users?.total || 0}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {parseFloat(stats.users?.growth) >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  {stats.users?.growth || 0}% este mês
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Gráficos e Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Vendas */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-[#EB2590]" />
                  Vendas por Dia
                </CardTitle>
                <CardDescription>Desempenho de vendas nos últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="vendas" stroke="#EB2590" fill="#EB2590" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gráfico de Categorias */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-[#00AFEF]" />
                  Vendas por Categoria
                </CardTitle>
                <CardDescription>Distribuição de vendas por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    {/* Usar Pie do recharts importado (nome Pie) */}
                    <Pie
                      data={analytics.categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Receita Mensal */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                Receita Mensal
              </CardTitle>
              <CardDescription>Evolução da receita nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Receita']} />
                  <Legend />
                  <Line type="monotone" dataKey="receita" stroke="#EB2590" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pedidos Recentes */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-[#00AFEF]" />
                  Pedidos Recentes
                </CardTitle>
                <CardDescription>Últimos pedidos realizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-gray-500">Pedido #{order.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R$ {order.total.toFixed(2)}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Produtos */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-[#FFF212]" />
                  Produtos Mais Vendidos
                </CardTitle>
                <CardDescription>Top 5 produtos por vendas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#EB2590] text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sales} vendas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">R$ {product.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Links rápidos */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-[#EB2590]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#EB2590]">
                  <Package className="h-5 w-5 mr-2" />
                  Gerenciar Produtos
                </CardTitle>
                <CardDescription>
                  Adicionar, editar e remover produtos do catálogo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-gradient-to-r from-[#EB2590] to-[#EB2590]/80 hover:from-[#EB2590]/90 hover:to-[#EB2590]/70"
                  onClick={() => navigate('/admin/products')}
                >
                  Acessar Produtos
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-[#00AFEF]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#00AFEF]">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Gerenciar Categorias
                </CardTitle>
                <CardDescription>
                  Organizar produtos em categorias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-gradient-to-r from-[#00AFEF] to-[#00AFEF]/80 hover:from-[#00AFEF]/90 hover:to-[#00AFEF]/70"
                  onClick={() => navigate('/admin/categories')}
                >
                  Acessar Categorias
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-600">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Gerenciar Pedidos
                </CardTitle>
                <CardDescription>
                  Visualizar e atualizar status dos pedidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:from-yellow-600 hover:to-yellow-500"
                  onClick={() => navigate('/admin/orders')}
                >
                  Acessar Pedidos
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <Eye className="h-5 w-5 mr-2" />
                  Configurações do Site
                </CardTitle>
                <CardDescription>
                  Gerenciar logo e banners do site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600"
                  onClick={() => navigate('/admin/settings')}
                >
                  Acessar Configurações
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

