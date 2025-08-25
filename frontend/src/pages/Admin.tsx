
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/admin/LoginForm';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuthenticated');
    setIsAuthenticated(adminAuth === 'true');
  }, []);
  
  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
    if (success) {
      sessionStorage.setItem('adminAuthenticated', 'true');
    }
  };
  
  // Still loading auth state
  if (isAuthenticated === null) {
    return (
      <Layout>
        <div className="page-container py-12 flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse text-syria-green-600">Loading...</div>
        </div>
      </Layout>
    );
  }
  
  // Not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="page-container py-12">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl md:text-3xl font-bold text-syria-green-700 mb-8">Admin Access</h1>
            <LoginForm onLogin={handleLogin} />
          </div>
        </div>
      </Layout>
    );
  }
  
  // Authenticated
  return (
    <Layout>
      <div className="page-container py-12">
        <AdminDashboard />
      </div>
    </Layout>
  );
};

export default Admin;
