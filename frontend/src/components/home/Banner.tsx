
import { useState, useEffect } from 'react';

const bannerImages = [
  {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    alt: 'Syrian Community Event'
  },
  {
    url: 'https://images.unsplash.com/photo-1466442929976-97f336a657be',
    alt: 'Community Gathering'
  },
  {
    url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    alt: 'Cultural Event'
  }
];

const Banner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {bannerImages.map((image, index) => (
        <div 
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={image.url} 
            alt={image.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      ))}
      
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg animate-fade-in">
          Syrian Community in Aydın
        </h1>
        <p className="text-lg md:text-xl max-w-2xl drop-shadow-md animate-fade-in" style={{animationDelay: '0.2s'}}>
          Building connections, supporting our community, and preserving our culture
        </p>
      </div>
    </div>
  );
};

export default Banner;
