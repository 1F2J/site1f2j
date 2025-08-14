import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import useSiteLogo from '../../hooks/useSiteLogo';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const logoUrl = useSiteLogo();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      await login(response.data.user, response.data.token);
    } catch (error) {
      console.error('Erro no login:', error);
      setError(
        error.response?.data?.message ||
        error.message ||
        'Erro ao fazer login. Por favor, verifique suas credenciais e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border-2 border-[#EB2590]/20 bg-white">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-[#EB2590]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center">
                <img src={logoUrl} alt="1F2J Logo" className="h-8 w-auto" />
              </div>
            </div>
            
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Bem-vindo de volta!
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Faça login para acessar sua conta
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-[#EB2590] rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-[#EB2590] rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-[#EB2590] border-gray-300 rounded focus:ring-[#EB2590]"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Lembrar de mim
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#EB2590] hover:text-[#EB2590]/80 font-medium"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#EB2590] to-[#00AFEF] hover:from-[#EB2590]/90 hover:to-[#00AFEF]/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="text-[#EB2590] hover:text-[#EB2590]/80 font-semibold"
                >
                  Cadastre-se aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;

