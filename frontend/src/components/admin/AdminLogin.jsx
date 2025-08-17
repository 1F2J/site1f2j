import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { adminAuthService } from '../../services/api';
import useSiteLogo from '../../hooks/useSiteLogo';

import '../../App.css';

const AdminLogin = () => {
  const logoUrl = useSiteLogo();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminAuthService.login(formData.email, formData.password);
      const { token, user } = response.data;

      if (user.role !== 'admin') {
        setError('Acesso negado. Apenas administradores podem acessar.');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {logoUrl && <img src={logoUrl} alt="1F2J Logo" className="mx-auto h-16 w-auto" />}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Painel Administrativo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Faça login para acessar o painel
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@1f2j.com.br"
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-1f2j hover:bg-cyan-600"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Credenciais de teste: admin@1f2j.com.br / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

