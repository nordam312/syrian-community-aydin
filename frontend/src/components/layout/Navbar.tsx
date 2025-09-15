import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '@/config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CsrfService from '@/hooks/Csrf';
import { useToast } from '@/components/ui/use-toast';


const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [developerText, setDeveloperText] = useState('مطور الصفحة');
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  // Toggle developer text between Arabic and English every 5 seconds with animation
  useEffect(() => {
    const texts = [
      'مطور الصفحة',
      'Developer',
      ];
    let currentIndex = 0;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % texts.length;
        setDeveloperText(texts[currentIndex]);
        setIsAnimating(false);
      }, 400);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      const userName = user?.name || 'صديقي';
      await logout(); // استخدم الدالة من Context فقط
      closeMenu();
      navigate('/');

      // إظهار رسالة توديع مع الاسم 
      toast({
        description: (
          <div className="text-center">
            <span className="text-syria-green-600 font-bold animate-pulse"
                  style={{
                    textShadow: '0 0 10px rgba(72, 187, 120, 0.5), 0 0 20px rgba(72, 187, 120, 0.3)',
                    display: 'inline-block'
                  }}>
              إلى اللقاء {userName} 👋
            </span>
            <br />
            <span className="text-gray-600 text-sm">نتمنى لك يوماً سعيداً</span>
          </div>
        ),
        duration: 3000,
        className: 'bg-white',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // روابط مختلفة حسب حالة تسجيل الدخول
  const getNavLinks = () => {
    const baseLinks = [
      { name: 'الرئيسية', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'اسألنا', path: '/faq' },
      { name: 'حاسبة المعدل', path: '/gpa-calculator' },
      { name: 'الانتخابات', path: '/elections' },
      { name: 'الفعاليات', path: '/events' },
      { name: developerText, path: '/developer' },
    ];

    if (isAuthenticated && user?.role === 'admin') {
      return [
        ...baseLinks,
        { name: 'Admin', path: '/admin' },
      ];
    } else if (isAuthenticated) {
      return baseLinks;
    } else {
      return [...baseLinks, { name: 'تسجيل/دخول', path: '/auth' }];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-white shadow-sm py-4 border-b-2 border-syria-green-500" style={{ boxShadow: '0 1px 0 0 rgba(34, 197, 94, 0.3), 0 2px 8px -2px rgba(34, 197, 94, 0.2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/" onClick={closeMenu}>
              <span className="font-bold text-2xl text-syria-green-600">
                Syrian Community
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-8 flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-500 ${isActive(link.path)
                    ? 'bg-syria-green-100 text-syria-green-600'
                    : 'text-gray-700 hover:bg-syria-green-50 hover:text-syria-green-600'
                    } ${link.path === '/developer' ? 'min-w-[100px] text-center' : ''}`}
                >
                  {link.path === '/developer' ? (
                    <div className="relative inline-block">
                      <span
                        className={`inline-block transition-all ease-in-out ${
                          isAnimating
                            ? 'duration-500 opacity-0 transform translate-x-2 -translate-y-3 scale-50 rotate-180 blur-sm'
                            : 'duration-700 opacity-100 transform translate-x-0 translate-y-0 scale-100 rotate-0 blur-0'
                        }`}
                        style={{
                          textShadow: isAnimating
                            ? '0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.4)'
                            : '0 1px 2px rgba(34, 197, 94, 0.3)',
                          background: isAnimating
                            ? 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.1), transparent)'
                            : 'none',
                          animation: !isAnimating
                            ? 'shimmer 3s ease-in-out infinite, float 4s ease-in-out infinite'
                            : 'none'
                        }}
                      >
                        {link.name}
                      </span>
                      {isAnimating && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="animate-spin text-syria-green-500">⚡</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <span>{link.name}</span>
                  )}
                </Link>
              ))}

              {/* عرض معلومات المستخدم وزر تسجيل الخروج */}
              {isAuthenticated && (
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l-2 border-syria-green-400">
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-syria-green-600" />
                    <span className="text-sm text-gray-700">{user?.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-1" />
                    تسجيل الخروج
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-syria-green-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden animate-page-enter">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-500 ${isActive(link.path)
                    ? 'bg-syria-green-100 text-syria-green-600'
                    : 'text-gray-700 hover:bg-syria-green-50 hover:text-syria-green-600'
                    }`}
                >
                  {link.path === '/developer' ? (
                    <div className="relative inline-block">
                      <span
                        className={`inline-block transition-all ease-in-out ${
                          isAnimating
                            ? 'duration-500 opacity-0 transform translate-x-2 -translate-y-3 scale-50 rotate-180 blur-sm'
                            : 'duration-700 opacity-100 transform translate-x-0 translate-y-0 scale-100 rotate-0 blur-0'
                        }`}
                        style={{
                          textShadow: isAnimating
                            ? '0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.4)'
                            : '0 1px 2px rgba(34, 197, 94, 0.3)',
                          background: isAnimating
                            ? 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.1), transparent)'
                            : 'none',
                          animation: !isAnimating
                            ? 'shimmer 3s ease-in-out infinite, float 4s ease-in-out infinite'
                            : 'none'
                        }}
                      >
                        {link.name}
                      </span>
                      {isAnimating && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="animate-spin text-syria-green-500">⚡</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <span>{link.name}</span>
                  )}
                </Link>
              ))}

              {/* عرض معلومات المستخدم وزر تسجيل الخروج في النسخة المحمولة */}
              {isAuthenticated && (
                <div className="border-t-2 border-syria-green-400 mt-3 pt-3">
                  <div className="flex items-center space-x-2 px-3 py-2 ">
                    <User size={16} className="text-syria-green-600" />
                    <span className="text-sm text-gray-700">{user?.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-2" />
                    تسجيل الخروج
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;