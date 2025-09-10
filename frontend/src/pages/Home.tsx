import Layout from '@/components/layout/Layout';
import Logo from '@/components/home/Logo';
import Banner from '@/components/home/Banner';
import EventGallery from '@/components/home/EventGallery';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '@/config';

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

  return (
    <Layout>
      <div className="overflow-hidden">
        <div className="animate-fade-in">
          <Banner content={content} />
        </div>
        
        {/* مساحة للشعار */}
        <div className="bg-transparent h-24 relative">
          <div className="animate-slide-down" style={{animationDelay: '0.3s'}}>
            <Logo />
          </div>
        </div>

        <section 
          ref={sectionRef}
          className="section bg-white pt-20 pb-20 opacity-0 transform translate-y-10 transition-all duration-700"
        >
          <div className="page-container text-center">
            {isLoading ? (
              // Enhanced skeleton loading
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer" style={{animationDelay: '0.1s'}}></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer w-3/4" style={{animationDelay: '0.2s'}}></div>
                </div>
                <div className="h-12 bg-gradient-to-r from-syria-green-200 via-syria-green-300 to-syria-green-200 rounded animate-shimmer w-48 mx-auto" style={{animationDelay: '0.3s'}}></div>
              </div>
            ) : (
              <>
                <div className="transform transition-all duration-700 delay-300">
                  <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-6 whitespace-pre-line leading-relaxed">
                    {content?.home_description}
                  </p>
                </div>

                <div className="transform transition-all duration-700 delay-500">
                  <Link to="/about">
                    <Button className="border-2 border-syria-green-900 text-syria-green-900 hover:bg-syria-green-900 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg px-8 py-3 text-lg font-medium">
                      تعرف على المزيد عنا
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
