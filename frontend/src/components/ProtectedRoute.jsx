import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminAuthService } from '../services/api';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated } = useAuth();
  const isAdminAuthenticated = adminAuthService.isAuthenticated();

  if (requireAdmin) {
    if (!isAdminAuthenticated) {
      return <Navigate to="/admin/login" replace />;
    }
    const adminUser = adminAuthService.getCurrentUser();
    if (!adminUser || adminUser.role !== 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

