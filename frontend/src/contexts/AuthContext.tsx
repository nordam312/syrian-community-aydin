// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/config';
import CsrfService from '@/hooks/Csrf';


interface User {
  id: number;
  name: string;
  email: string;
  student_id: string;
  phone?: string;
  major?: string;
  role?: string;
  academic_year?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        withCredentials: true
      });

      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // في AuthContext.tsx
  const logout = async () => {
    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.post(`${API_URL}/logout`, {}, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // تنظيف البيانات المحلية بغض النظر عن النتيجة
      setUser(null);
      setIsAuthenticated(false);
      // إعادة توجيه إلى صفحة تسجيل الدخول
      // window.location.href = '/auth';
    }
  };
  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};