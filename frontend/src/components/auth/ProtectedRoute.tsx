import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireAuth?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log unauthorized access attempts
    if (!isLoading && requireAuth && !isAuthenticated) {
      console.warn(`Unauthorized access attempt to: ${location.pathname}`);
    }
    if (!isLoading && requireAdmin && (!user || user.role !== 'admin')) {
      console.warn(`Non-admin access attempt to: ${location.pathname}`);
    }
  }, [isLoading, requireAuth, requireAdmin, isAuthenticated, user, location]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && (!user || user.role !== 'admin')) {
    return <Navigate to="/" state={{ unauthorized: true }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;