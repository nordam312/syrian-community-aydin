import { useState, useEffect } from 'react';

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

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // تحقق من وجود بيانات المستخدم في localStorage
    const savedUser = localStorage.getItem('userData');
    const savedToken = localStorage.getItem('userToken');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // إذا كان هناك خطأ في البيانات، احذفها
        localStorage.removeItem('userData');
        localStorage.removeItem('userToken');
      }
    }
  }, []);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userToken', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
  };

  const isAuthenticated = !!user && !!token;

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
};
