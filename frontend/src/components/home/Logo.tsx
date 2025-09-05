import { useState, useEffect, useCallback } from 'react';
import { API_URL, STORAGE_URL } from '@/config';
import axios from 'axios';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface Logo {
  id: number;
  name: string;
  image_path: string;
  alt_text: string;
  width: number;
  height: number;
  position: string;
  is_active: boolean;
}

const Logo = () => {
  const [logo, setLogo] = useState<Logo>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogo = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_URL}/logos/active?position=header`,
      );
      setLogo(response.data);
    } catch (error) {
      console.error('Error fetching logo:', error);
      setLogo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchLogo();
  }, [fetchLogo]);
  if (isLoading) {
    return (
      <div className="relative z-20 flex justify-center">
        <div className="absolute -top-16 w-40 h-40 rounded-full bg-gradient-to-br from-syria-green-50 to-syria-green-100 flex items-center justify-center border-4 border-syria-green-200 shadow-lg z-30">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-syria-green-200 via-syria-green-300 to-syria-green-200 rounded-full animate-shimmer"></div>
            <div className="absolute inset-0 w-20 h-20 bg-syria-green-300 rounded-full animate-pulse opacity-50"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-20 flex justify-center">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="absolute -top-16 w-40 h-40 rounded-full bg-syria-green-50 flex items-center justify-center border-4 border-syria-green-200 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer z-30">
            {logo ? (
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={`${STORAGE_URL}/${logo.image_path}`}
                  alt={logo.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : (
              <div className="text-center">
                <div className="text-syria-green-600 font-bold text-4xl">
                  SC
                </div>
                <div className="text-syria-green-500 text-xs mt-1">AYDIN</div>
              </div>
            )}
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="text-center">
            <p className="text-sm font-medium text-syria-green-600">
              Syrian Community in Aydın
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Cultural center for Syrian students
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default Logo;
