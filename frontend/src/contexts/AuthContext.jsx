import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const validateToken = async () => {
    try {
      const response = await userService.getProfile();
      setUser(response.data);
      return true;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      logout();
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        await validateToken();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (userData, token) => {
    localStorage.setItem('userToken', token);
    const isValid = await validateToken();
    if (isValid) {
      navigate('/dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};