import { Link } from 'react-router-dom';
import { ContentItem } from '@/pages/Home';
import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Code, Heart } from 'lucide-react';

interface FooterProps {
  content: ContentItem | null;
}
const Footer: React.FC<FooterProps> = ({ content }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-syria-green-800 via-syria-green-700 to-syria-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* القسم الرئيسي */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* معلومات المجتمع */}
            <div className="lg:col-span-2 space-y-6" dir="rtl">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
                  <div className="w-1 h-8 bg-gradient-to-b from-white to-gray-200 rounded-full ml-3"></div>
                  {content?.about_title || 'المجتمع السوري في أيدن'}
                </h2>
                <p className="text-gray-200 leading-relaxed text-base">
                  {content?.about_content || 'مجتمع داعم ومترابط للسوريين في مدينة أيدن، تركيا. نهدف إلى تقديم الدعم والمساعدة لجميع أفراد الجالية السورية وتعزيز الروابط الاجتماعية والثقافية.'}
                </p>
              </div>
            </div>

            {/* روابط سريعة */}
            <div className="space-y-6" dir="rtl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-white to-gray-200 rounded-full ml-2"></div>
                روابط سريعة
              </h3>
              <ul className="space-y-4 text-gray-200">
                <li>
                  <Link
                    to="/"
                    className="hover:text-white transition-all duration-300 flex items-center text-sm group"
                  >
                    <span className="w-2 h-2 bg-white rounded-full ml-3 group-hover:bg-gray-300 transition-colors"></span>
                    الصفحة الرئيسية
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-all duration-300 flex items-center text-sm group"
                  >
                    <span className="w-2 h-2 bg-white rounded-full ml-3 group-hover:bg-gray-300 transition-colors"></span>
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events"
                    className="hover:text-white transition-all duration-300 flex items-center text-sm group"
                  >
                    <span className="w-2 h-2 bg-white rounded-full ml-3 group-hover:bg-gray-300 transition-colors"></span>
                    الفعاليات
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="hover:text-white transition-all duration-300 flex items-center text-sm group"
                  >
                    <span className="w-2 h-2 bg-white rounded-full ml-3 group-hover:bg-gray-300 transition-colors"></span>
                    الأسئلة الشائعة
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gpa-calculator"
                    className="hover:text-white transition-all duration-300 flex items-center text-sm group"
                  >
                    <span className="w-2 h-2 bg-white rounded-full ml-3 group-hover:bg-gray-300 transition-colors"></span>
                    حاسبة المعدل
                  </Link>
                </li>
              </ul>
            </div>

            {/* معلومات الاتصال */}
            <div className="space-y-6" dir="rtl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-white to-gray-200 rounded-full ml-2"></div>
                تواصل معنا
              </h3>
              <ul className="space-y-4 text-gray-200">
                <li className="flex items-center text-sm hover:text-white transition-colors duration-300 group">
                  <Mail className="h-5 w-5 text-white ml-3 group-hover:text-gray-300 transition-colors" />
                  <span dir="ltr">{content?.contact_email || 'contact@syrianaydin.com'}</span>
                </li>
                <li className="flex items-center text-sm hover:text-white transition-colors duration-300 group">
                  <MapPin className="h-5 w-5 text-white ml-3 group-hover:text-gray-300 transition-colors" />
                  <span>{content?.contact_address || 'أيدن، تركيا'}</span>
                </li>
                {content?.contact_phone && content.contact_phone !== 'N/A' && (
                  <li className="flex items-center text-sm hover:text-white transition-colors duration-300 group">
                    <Phone className="h-5 w-5 text-white ml-3 group-hover:text-gray-300 transition-colors" />
                    <span dir="ltr">{content.contact_phone}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* الخط الفاصل */}
        <div className="border-t border-syria-green-600 opacity-50"></div>

        {/* القسم السفلي */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* حقوق الطبع والنشر */}
            <div className="text-center md:text-right" dir="rtl">
              <p className="text-syria-green-200 text-sm">
                &copy; {currentYear} المجتمع السوري في أيدن. جميع الحقوق محفوظة.
              </p>
            </div>

            {/* حقوق المطور */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-syria-green-200 text-sm mb-3">
                <div className="flex items-center space-x-1">
                  <span>Developed with</span>
                  <Heart className="h-4 w-4 text-red-400 animate-pulse" />
                  <span>by</span>
                </div>
                <Link
                  to="/developer"
                  className="flex items-center space-x-1 text-white hover:text-gray-300 transition-all duration-300 font-medium relative group"
                >
                  <Code className="h-4 w-4" />
                  <span className="relative">
                    <span className="relative z-10 drop-shadow-lg" style={{textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.1)'}}>Mohammed Nour Damlakhi</span>
                  </span>
                </Link>
              </div>
              
              <p className="text-xs text-syria-green-300 mb-1 opacity-75">
                Full Stack Developer
              </p>
              
              {/* النص التحفيزي */}
              <p className="text-xs text-gray-300 italic opacity-80 animate-pulse">
                "Building bridges between ideas and reality through code"
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
