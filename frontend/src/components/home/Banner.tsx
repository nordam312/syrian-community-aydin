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
        <div className="absolute inset-0 flex items-center justify-center bg-syria-green-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-syria-green-200 border-t-transparent mb-4"></div>
            <p className="text-syria-green-800 font-medium">
              جاري تحميل البنرات...
            </p>
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
                src={`${STORAGE_URL}/${banner.image}`} //http://127.0.0.1:8000/storage/banners/fZu1aheVgIanSgH4K9HxuWuvOIIYkIaRky1C5BoY.jpg
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          ))}
        </>
      )}

      <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg animate-fade-in">
          {content?.home_title || (
            <span className="animate-pulse bg-white/40 rounded px-6 py-2">
              ......
            </span>
          )}
        </h1>
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
