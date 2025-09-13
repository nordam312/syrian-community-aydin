import Layout from '@/components/layout/Layout';
import Logo from '@/components/home/Logo';
import Banner from '@/components/home/Banner';
import EventGallery from '@/components/home/EventGallery';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '@/config';
import { Users, Calendar, Award, ArrowRight, CheckCircle } from 'lucide-react';

export interface ContentItem {
  id: number;
  home_title: string;
  home_description: string;
  about_title: string;
  about_content: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  social_facebook: string;
  social_instagram: string;
  social_telegram: string;
  created_at: string;
  updated_at: string;
}

const Home = () => {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const GetContent = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/content`, {
        withCredentials: true,
        headers: { Accept: 'application/json' },
      });
      setContent(response.data);

      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Intersection Observer للمؤثرات البصرية عند scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            if (entry.target === sectionRef.current) {
              // تأخير بسيط لبدء العداد بعد ظهور القسم
              setTimeout(() => setStatsVisible(true), 800);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (galleryRef.current) observer.observe(galleryRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      if (galleryRef.current) observer.unobserve(galleryRef.current);
    };
  }, []);

  useEffect(() => {
    GetContent();
  }, [GetContent]);

  // Counter Animation Hook
  const useCountUp = (end: number, start = 0, duration = 2000) => {
    const [count, setCount] = useState(start);
    
    useEffect(() => {
      if (!statsVisible) return;
      
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * (end - start) + start));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [statsVisible, end, start, duration]);
    
    return count;
  };

  const memberCount = useCountUp(1100);
  const eventCount = useCountUp(25);
  const projectCount = useCountUp(5);

  return (
    <Layout>
      <div className="overflow-hidden">
        <div className="animate-fade-in">
          <Banner content={content} />
        </div>
        
        {/* مساحة للشعار */}
        <div className="bg-transparent h-24 relative mb-2">
          <div className="animate-slide-down" style={{animationDelay: '0.3s'}}>
            <Logo />
          </div>
        </div>

        {/* Hero Section محسن */}
        <section 
          ref={sectionRef}
          className="section bg-gradient-to-br from-syria-green-50 via-white to-syria-green-100 pt-20 pb-20 opacity-0 transform translate-y-10 transition-all duration-700 relative overflow-hidden"
        >

          <div className="page-container text-center relative z-10 ">
            {isLoading ? (
              // Enhanced skeleton loading
              <div className="max-w-3xl mx-auto space-y-8 ">
                <div className="space-y-4">
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer"></div>
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer" style={{animationDelay: '0.1s'}}></div>
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer w-3/4 mx-auto" style={{animationDelay: '0.2s'}}></div>
                </div>
                <div className="h-14 bg-gradient-to-r from-syria-green-200 via-syria-green-300 to-syria-green-200 rounded-full animate-shimmer w-60 mx-auto" style={{animationDelay: '0.3s'}}></div>
              </div>
            ) : (
              <>
                {/* Enhanced content with card design */}
                <div className="transform transition-all duration-700 delay-300 ">
                  <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg border border-syria-green-200 hover:shadow-xl transition-all duration-300 ">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-syria-green-800">أهلاً بكم زوارنا الأعزاء</h2>
                    </div>
                    <p className="text-xl text-gray-700 mb-8 whitespace-pre-line leading-relaxed">
                      {content?.home_description}
                    </p>
                    
                    {/* Features list */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="flex items-center justify-center space-x-3 space-x-reverse">
                        <CheckCircle className="h-6 w-6 text-syria-green-600" />
                        <span className="text-syria-green-800 font-medium">مجتمع متحد</span>
                      </div>
                      <div className="flex items-center justify-center space-x-3 space-x-reverse">
                        <CheckCircle className="h-6 w-6 text-syria-green-600" />
                        <span className="text-syria-green-800 font-medium">فعاليات متنوعة</span>
                      </div>
                      <div className="flex items-center justify-center space-x-3 space-x-reverse">
                        <CheckCircle className="h-6 w-6 text-syria-green-600" />
                        <span className="text-syria-green-800 font-medium">دعم مستمر</span>
                      </div>
                    </div>
                    
                    {/* Stats Section - compact version */}
                    <div className="grid grid-cols-3 gap-4 mt-8 animate-page-enter" style={{animationDelay: '0.8s'}}>
                      <div className="text-center p-4 bg-syria-green-50 rounded-xl hover:bg-syria-green-100 transition-colors duration-300">
                        <Users className="h-8 w-8 text-syria-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-syria-green-700">{memberCount}+</div>
                        <div className="text-syria-green-600 text-sm font-medium">عضو</div>
                      </div>
                      
                      <div className="text-center p-4 bg-syria-green-50 rounded-xl hover:bg-syria-green-100 transition-colors duration-300">
                        <Calendar className="h-8 w-8 text-syria-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-syria-green-700">{eventCount}+</div>
                        <div className="text-syria-green-600 text-sm font-medium">فعالية</div>
                      </div>
                      
                      <div className="text-center p-4 bg-syria-green-50 rounded-xl hover:bg-syria-green-100 transition-colors duration-300">
                        <Award className="h-8 w-8 text-syria-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-syria-green-700">{projectCount}+</div>
                        <div className="text-syria-green-600 text-sm font-medium">مشروع</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced CTA */}
                <div className="transform transition-all duration-700 delay-500 mt-8">
                  <Link to="/about">
                    <Button className="group bg-gradient-to-r from-syria-green-600 to-syria-green-700 hover:from-syria-green-700 hover:to-syria-green-800 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl px-12 py-4 text-xl font-medium rounded-full border-2 border-syria-green-600 hover:border-syria-green-700 relative overflow-hidden">
                      <span className="relative z-10 flex items-center">
                        تعرف على المزيد عنا
                        <ArrowRight className="h-6 w-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-syria-green-700 to-syria-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        <div 
          ref={galleryRef}
          className="opacity-0 transform translate-y-10 transition-all duration-700"
        >
          <EventGallery />
        </div>

      </div>
    </Layout>
  );
};

export default Home;
