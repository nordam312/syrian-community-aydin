
import { useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const Logo = () => {
  const logoImage = localStorage.getItem('logoImage');
  
  return (
    <div className="relative z-10 flex justify-center">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="absolute -top-20 w-40 h-40 rounded-full bg-syria-green-50 flex items-center justify-center border-4 border-syria-green-200 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer">
            {logoImage ? (
              <div className="w-full h-full rounded-full overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="Community Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="text-center">
                <div className="text-syria-green-600 font-bold text-4xl">SC</div>
                <div className="text-syria-green-500 text-xs mt-1">AYDIN</div>
              </div>
            )}
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="text-center">
            <p className="text-sm font-medium text-syria-green-600">Syrian Community in Aydın</p>
            <p className="text-xs text-gray-500 mt-1">Cultural center for Syrian students</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default Logo;
