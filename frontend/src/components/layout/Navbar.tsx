// import { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Menu, X, User, LogOut } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';
// import axios from 'axios';
// import { API_URL } from '@/config';
// import { useNavigate } from 'react-router-dom';

// const Navbar = () => {
//   const navigate = useNavigate();

//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();
//   const { user, isAuthenticated, logout } = useAuth();

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const closeMenu = () => {
//     setIsOpen(false);
//   };

//   const isActive = (path: string) => {
//     return location.pathname === path;
//   };

//   const handleLogout = async () => {
//     const token = sessionStorage.getItem('userToken');
//     try {
//       await axios.post(
//         `${API_URL}/logout`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );
//     } catch (error) {
//       // يمكنك عرض رسالة خطأ هنا إذا أردت
//     }
//     sessionStorage.removeItem('userData');
//     sessionStorage.removeItem('userToken');
//     logout();
//     closeMenu();
//     getNavLinks();
//     navigate('/');
//   };

//   // روابط مختلفة حسب حالة تسجيل الدخول
//   const getNavLinks = () => {
//     const baseLinks = [
//       { name: 'الرئيسية', path: '/' },
//       { name: 'من نحن', path: '/about' },
//       { name: 'حاسبة المعدل', path: '/gpa-calculator' },
//       { name: 'الانتخابات', path: '/elections' },
//     ];

//     if (isAuthenticated && user?.role === 'admin') {
//       return [
//         ...baseLinks,
//         { name: 'Admin', path: '/Admin' },
//         // { name: 'الملف الشخصي', path: '/profile' },
//       ];
//     } else if (isAuthenticated) {
//       return [
//         ...baseLinks,
//         // { name: 'الملف الشخصي', path: '/profile' },
//       ];
//     } else {
//       return [...baseLinks, { name: 'تسجيل/دخول', path: '/auth' }];
//     }
//   };

//   const navLinks = getNavLinks();

//   return (
//     <nav className="bg-white shadow-sm py-4">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center">
//           <div className="flex-shrink-0">
//             <Link to="/" onClick={closeMenu}>
//               <span className="font-bold text-2xl text-syria-green-600">
//                 Syrian Community
//               </span>
//             </Link>
//           </div>
//           {/* Desktop Navigation */}
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-center space-x-4">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                     isActive(link.path)
//                       ? 'bg-syria-green-100 text-syria-green-600'
//                       : 'text-gray-700 hover:bg-syria-green-50 hover:text-syria-green-600'
//                   }`}
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//               {/* عرض معلومات المستخدم وزر تسجيل الخروج */}
//               {isAuthenticated && (
//                 <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
//                   <div className="flex items-center space-x-2">
//                     <User size={16} className="text-syria-green-600" />
//                     <span className="text-sm text-gray-700">{user?.name}</span>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={handleLogout}
//                     className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                   >
//                     <LogOut size={16} className="mr-1" />
//                     تسجيل الخروج
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//           {/* Mobile Navigation Toggle */}
//           <div className="md:hidden flex items-center">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={toggleMenu}
//               className="text-syria-green-600"
//             >
//               {isOpen ? <X size={24} /> : <Menu size={24} />}
//             </Button>
//           </div>
//         </div>
//         {/* Mobile Navigation Menu */}
//         {isOpen && (
//           <div className="md:hidden animate-fade-in">
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   onClick={closeMenu}
//                   className={`block px-3 py-2 rounded-md text-base font-medium ${
//                     isActive(link.path)
//                       ? 'bg-syria-green-100 text-syria-green-600'
//                       : 'text-gray-700 hover:bg-syria-green-50 hover:text-syria-green-600'
//                   }`}
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//               {/* عرض معلومات المستخدم وزر تسجيل الخروج في النسخة المحمولة */}
//               {isAuthenticated && (
//                 <div className="border-t border-gray-200 mt-3 pt-3">
//                   <div className="flex items-center space-x-2 px-3 py-2">
//                     <User size={16} className="text-syria-green-600" />
//                     <span className="text-sm text-gray-700">{user?.name}</span>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={handleLogout}
//                     className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
//                   >
//                     <LogOut size={16} className="mr-2" />
//                     تسجيل الخروج
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Code } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { API_URL } from '@/config';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

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
    const token = localStorage.getItem('userToken');
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      // يمكنك عرض رسالة خطأ هنا إذا أردت
    }
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    logout();
    closeMenu();
    navigate('/');
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
      { name: 'مطور الصفحة', path: '/developer' },
    ];

    if (isAuthenticated && user?.role === 'admin') {
      return [
        ...baseLinks,
        { name: 'Admin', path: '/Admin' },
      ];
    } else if (isAuthenticated) {
      return baseLinks;
    } else {
      return [...baseLinks, { name: 'تسجيل/دخول', path: '/auth' }];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-white shadow-sm py-4">
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
            <div className="ml-8 flex items-center space-x-2"> {/* غيرنا space-x-4 إلى space-x-2 */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${isActive(link.path)
                    ? 'bg-syria-green-100 text-syria-green-600'
                    : 'text-gray-700 hover:bg-syria-green-50 hover:text-syria-green-600'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              {/* عرض معلومات المستخدم وزر تسجيل الخروج */}
              {isAuthenticated && (
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
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
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                      ? 'bg-syria-green-100 text-syria-green-600'
                      : 'text-gray-700 hover:bg-syria-green-50 hover:text-syria-green-600'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              {/* عرض معلومات المستخدم وزر تسجيل الخروج في النسخة المحمولة */}
              {isAuthenticated && (
                <div className="border-t border-gray-200 mt-3 pt-3">
                  <div className="flex items-center space-x-2 px-3 py-2">
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
