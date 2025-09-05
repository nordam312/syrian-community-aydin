import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { STORAGE_URL, API_URL } from '@/config';
import { ContentItem } from '@/pages/Home';
interface BannerItem {
  id: number;
  image: string;
  title: string;
}

interface BannerProps {
  content: ContentItem | null;
}

// لانو عم نستخدم تايبسكريبت لازم نكتب الكود هكذا اذا عم يجنا بروبس وخاصة انو الكومبوننت من const
const Banner: React.FC<BannerProps> = ({ content }) => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBanners = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<BannerItem[]>(`${API_URL}/banners`);
      setBanners(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 bg-gradient-to-br from-syria-green-50 to-syria-green-100">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-syria-green-200 border-t-syria-green-600"></div>
                <div className="absolute inset-0 rounded-full bg-syria-green-100 opacity-20 animate-pulse"></div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-syria-green-800 font-semibold text-lg animate-pulse">
                  جاري تحميل البنرات...
                </p>
                <div className="flex space-x-1 justify-center">
                  <div className="w-2 h-2 bg-syria-green-600 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="w-2 h-2 bg-syria-green-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-syria-green-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={`${STORAGE_URL}/${banner.image}`}
                alt={banner.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
                decoding="async"
                onLoad={(e) => {
                  e.currentTarget.classList.add('animate-fade-in');
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          ))}
        </>
      )}

      <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 text-center">
        <div className="transform transition-all duration-1000 animate-slide-up">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl text-white animate-fade-in leading-tight py-2" style={{textShadow: '0 0 20px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.5)'}}>
            {content?.home_title || (
              <div className="space-y-2">
                <div className="h-8 bg-gradient-to-r from-white/40 via-white/60 to-white/40 rounded animate-shimmer w-64"></div>
                <div className="h-6 bg-gradient-to-r from-white/30 via-white/50 to-white/30 rounded animate-shimmer w-48 mx-auto"></div>
              </div>
            )}
          </h1>
        </div>
        {/* <p
					className="text-lg md:text-xl max-w-2xl drop-shadow-md animate-fade-in"
					style={{ animationDelay: '0.2s' }}
				>
					Building connections, supporting our community, and preserving our
					culture
				</p> */}
      </div>
    </div>
  );
};

export default Banner;
