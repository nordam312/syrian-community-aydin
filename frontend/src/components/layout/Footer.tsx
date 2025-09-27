import { Link } from 'react-router-dom';
import { ContentItem } from '@/pages/Home';
import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Code, Heart, Facebook, Instagram, Send, Github, Linkedin, MessageCircle } from 'lucide-react';

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
                <h2 className="text-3xl font-bold text-white mb-4 flex items-center" dir="auto" style={{ unicodeBidi: 'plaintext' }}>
                  <div className="w-1 h-8 bg-gradient-to-b from-white to-gray-200 rounded-full ml-3"></div>
                  {content?.about_title || 'المجتمع السوري في أيدن'}
                </h2>
                <p className="text-gray-200 leading-relaxed text-base" dir="auto" style={{ unicodeBidi: 'plaintext' }}>
                  {content?.about_content || 'مجتمع داعم ومترابط للسوريين في مدينة أيدن، تركيا. نهدف إلى تقديم الدعم والمساعدة لجميع أفراد الجالية السورية وتعزيز الروابط الاجتماعية والثقافية.'}
                </p>

                {/* شعارات الجامعات */}
                <div className="mt-6 flex items-center gap-4">
                  {/* شعار ISU */}
                  <a
                    href="https://www.instagram.com/iau.isu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block group transition-all duration-300 hover:scale-110"
                    aria-label="ISU Instagram"
                  >
                    <div className="bg-gray-400/20 p-2 rounded-full hover:bg-gray-400/30 transition-colors duration-300">
                      <img
                        src="/ISU_Logo.png"
                        alt="ISU Logo"
                        className="h-10 w-10 object-contain transition-transform duration-300"
                      />
                    </div>
                  </a>

                  {/* شعار IAU */}
                  <a
                    href="https://www.instagram.com/iaukampus/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block group transition-all duration-300 hover:scale-110"
                    aria-label="IAU Instagram"
                  >
                    <div className="bg-gray-400/20 p-2 rounded-full hover:bg-gray-400/30 transition-colors duration-300">
                      <img
                        src="/IAU_Logo.png"
                        alt="IAU Logo"
                        className="h-10 w-10 object-contain transition-transform duration-300"
                      />
                    </div>
                  </a>

                  {/* شعار ISSA */}
                  <a
                    href="https://www.instagram.com/iauissa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block group transition-all duration-300 hover:scale-110"
                    aria-label="ISSA Instagram"
                  >
                    <div className="bg-gray-400/20 p-2 rounded-full hover:bg-gray-400/30 transition-colors duration-300">
                      <img
                        src="/ISSA_Logo.jpg"
                        alt="ISSA Logo"
                        className="h-10 w-10 object-cover rounded-full transition-transform duration-300"
                      />
                    </div>
                  </a>
                </div>
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

              {/* روابط وسائل التواصل الاجتماعي */}
              {(content?.social_facebook || content?.social_instagram || content?.social_telegram) && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-white mb-3">تابعنا على:</h4>
                  <div className="flex items-center space-x-reverse space-x-4">
                    {content?.social_facebook && (
                      <a
                        href={content.social_facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all duration-300 group"
                        aria-label="Facebook"
                      >
                        <MessageCircle className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                      </a>
                    )}
                    {content?.social_instagram && (
                      <a
                        href={content.social_instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all duration-300 group"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                      </a>
                    )}
                    {content?.social_telegram && (
                      <a
                        href={content.social_telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all duration-300 group"
                        aria-label="Telegram"
                      >
                        <Send className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              )}
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
                &copy; {currentYear} اتحاد الطلاب السوريين - جامعة اسطنبول آيدن.
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
                <a
                  href="https://www.linkedin.com/in/muhammednur-damlahi-59044b382/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-white hover:text-gray-300 transition-all duration-300 font-medium relative group"
                >
                  <Code className="h-4 w-4" />
                  <span className="relative">
                    <span className="relative z-10 drop-shadow-lg" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.1)' }}>Mohammed Nour Damlakhi</span>
                  </span>
                </a>
              </div>

              <p className="text-xs text-syria-green-300 mb-2 opacity-75">
                Full Stack Developer
              </p>

              {/* روابط المطور */}
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                <a
                  href="mailto:nordam312@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors duration-300"
                  aria-label="Email"
                >
                  <Mail className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://github.com/mohamednour2019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors duration-300"
                  aria-label="GitHub"
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/muhammednur-damlahi-59044b382/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://www.instagram.com/nor_damlahi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              </div>

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
