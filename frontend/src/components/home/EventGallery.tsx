
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const events = [
  {
    id: 1,
    title: 'Community Gathering',
    date: 'March 15, 2025',
    type: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742',
  },
  {
    id: 2,
    title: 'Cultural Exchange Day',
    date: 'April 5, 2025',
    type: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b',
  },
  {
    id: 3,
    title: 'New Year Celebration',
    date: 'January 1, 2025',
    type: 'previous',
    imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
  },
  {
    id: 4,
    title: 'Student Orientation Day',
    date: 'February 12, 2025',
    type: 'previous',
    imageUrl: 'https://images.unsplash.com/photo-1466442929976-97f336a657be',
  }
];

const EventGallery = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const filteredEvents = events.filter(event => event.type === activeTab);
  const totalEvents = filteredEvents.length;
  const visibleEvents = 1;
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + visibleEvents >= totalEvents ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, totalEvents - visibleEvents) : prevIndex - 1
    );
  };

  return (
    <section className="section bg-white">
      <div className="page-container">
        <h2 className="section-title text-center">Events</h2>
        
        <div className="flex justify-center space-x-4 mb-6">
          <Button 
            variant="ghost" 
            className={`${activeTab === 'upcoming' ? 'bg-syria-green-100 text-syria-green-700' : ''}`}
            onClick={() => { setActiveTab('upcoming'); setCurrentIndex(0); }}
          >
            Upcoming Events
          </Button>
          <Button 
            variant="ghost"
            className={`${activeTab === 'previous' ? 'bg-syria-green-100 text-syria-green-700' : ''}`}
            onClick={() => { setActiveTab('previous'); setCurrentIndex(0); }}
          >
            Previous Events
          </Button>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {filteredEvents.map((event) => (
                <div key={event.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="relative h-64 md:h-80">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-xl mb-1 text-syria-green-700">{event.title}</h3>
                      <p className="text-gray-600 mb-2">{event.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {totalEvents > 1 && (
            <div className="flex justify-center mt-6 space-x-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                onClick={prevSlide}
                disabled={totalEvents <= 1}
              >
                <ChevronLeft size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                onClick={nextSlide}
                disabled={totalEvents <= 1}
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventGallery;
