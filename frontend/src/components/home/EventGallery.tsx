import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL, STORAGE_URL } from '@/config';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type EventType = {
  id: number;
  title: string;
  description?: string;
  date: string;
  location?: string;
  max_attendees?: number;
  status?: string;
  image?: string;
};

const EventCarousel = ({
  events,
  loading,
  emptyText,
}: {
  events: EventType[];
  loading: boolean;
  emptyText: string;
}) => {
  // Responsive visible cards based on screen size
  const [visibleCards, setVisibleCards] = useState(3);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect screen size and adjust visible cards
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2); // Tablet
      } else {
        setVisibleCards(3); // Desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // دالة لإعادة تشغيل الأوتو بلاي
  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (events.length > visibleCards) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + visibleCards) % events.length);
      }, 5000);
    }
  };

  // Auto slide every 3 seconds
  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events.length]);

  const next = () => {
    if (events.length <= visibleCards) return;
    setCurrent((prev) => (prev + visibleCards) % events.length);
    resetInterval();
  };

  const prev = () => {
    if (events.length <= visibleCards) return;
    setCurrent((prev) => (prev - visibleCards + events.length) % events.length);
    console.log(current);
    resetInterval();
  };

  // Touch handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && events.length > visibleCards) {
      next();
    }
    if (isRightSwipe && events.length > visibleCards) {
      prev();
    }
  };

  if (loading) {
    return (
      <div className="flex gap-6">
        {[...Array(visibleCards)].map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse bg-gray-100 h-72 w-80 rounded-2xl"
          ></div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center text-lg font-tajawal text-gray-600 py-10 w-full">
        <Calendar className="mx-auto mb-4 text-syria-green-700" size={36} />
        {emptyText}
      </div>
    );
  }

  // عرض فقط البطاقات من current إلى current+visibleCards (مع loop)
  const displayed = [];
  for (let i = 0; i < Math.min(visibleCards, events.length); i++) {
    displayed.push(events[(current + i) % events.length]);
  }

  return (
    <div className="relative flex items-center justify-center">
      {events.length > visibleCards && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 z-10 rounded-full border-syria-green-200 hidden md:flex"
          onClick={next}
        >
          <ChevronRight size={22} className="text-syria-green-700" />
        </Button>
      )}
      <div
        className="flex gap-4 md:gap-6 w-full max-w-5xl px-4 md:px-10 justify-center overflow-hidden"
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {displayed.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl shadow-xl border border-syria-green-100 overflow-hidden hover:shadow-2xl md:hover:-translate-y-4 transition-all duration-700 flex flex-col w-full sm:w-80 flex-shrink-0 group relative transform md:hover:scale-105 select-none"
          >
            <div
              className="relative h-52 cursor-pointer"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <img
                src={
                  event.image
                    ? `${STORAGE_URL}/${event.image}`
                    : 'https://via.placeholder.com/600x400?text=No+Image'
                }
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2 shadow-lg font-tajawal text-syria-green-800 text-xs border border-syria-green-200/30">
                <Calendar size={14} className="text-syria-green-700" />
                {formatDate(event.date)}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col relative z-10">
              <h4
                className="font-bold text-xl mb-2 text-syria-green-700 font-tajawal line-clamp-2 group-hover:text-syria-green-800 transition-colors duration-300 cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                {event.title}
              </h4>
              {event.location && (
                <div className="flex items-center gap-2 text-syria-green-800 mb-3 font-tajawal text-sm">
                  <MapPin size={16} className="text-syria-green-700" />
                  {event.location}
                </div>
              )}
              {event.description && (
                <p className="text-gray-700 mb-4 font-tajawal line-clamp-2">
                  {event.description}
                </p>
              )}
              <div className="mt-auto">
                <Button
                  className="w-full bg-gradient-to-r from-syria-green-700 to-syria-green-600 hover:from-syria-green-800 hover:to-syria-green-700 text-white rounded-full font-tajawal shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden group/button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/events/${event.id}`);
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Calendar size={16} />
                    تفاصيل الحدث
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-syria-green-800 to-syria-green-700 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {events.length > visibleCards && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 z-10 rounded-full border-syria-green-200 hidden md:flex"
          onClick={prev}
        >
          <ChevronLeft size={22} className="text-syria-green-700" />
        </Button>
      )}

      {/* Dots indicator and swipe hint for mobile */}
      {events.length > visibleCards && (
        <div className="md:hidden">
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: Math.ceil(events.length / visibleCards) }).map((_, idx) => (
              <button
                key={idx}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${Math.floor(current / visibleCards) === idx
                    ? 'bg-syria-green-600 w-6'
                    : 'bg-syria-green-300'
                  }`}
                onClick={() => {
                  setCurrent(idx * visibleCards);
                  resetInterval();
                }}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-syria-green-600 mt-2 animate-pulse">
            ← اسحب للتنقل →
          </p>
        </div>
      )}
    </div>
  );
};

const EventGallery = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/events`, {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
          },
        });
        setEvents(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const now = new Date();
  const upcomingEvents = events.filter((event) => new Date(event.date) >= now);
  const previousEvents = events.filter((event) => new Date(event.date) < now);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-syria-green-50/30 via-transparent to-syria-green-50/30"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-syria-green-100/20 rounded-full -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-syria-green-100/20 rounded-full translate-x-40 translate-y-40"></div>

      <div className="page-container max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-syria-green-600 to-syria-green-500 rounded-full mb-6">
            <div className="bg-white rounded-full px-6 py-3">
              <Calendar className="h-8 w-8 text-syria-green-600 mx-auto" />
            </div>
          </div>
          <h2 className="text-5xl font-bold font-tajawal text-syria-green-800 mb-6">
            فعالياتنا المميزة
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-syria-green-600 rounded-full"></div>
            <div className="w-8 h-1 bg-syria-green-600 rounded-full"></div>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-syria-green-600 rounded-full"></div>
          </div>
          <p className="text-syria-green-700 text-xl max-w-3xl mx-auto leading-relaxed">
            انضم إلى فعالياتنا المتنوعة واستمتع بتجربة رائعة مع مجتمعنا النشط
          </p>
        </div>
        {/* Upcoming Events */}
        <div className="mb-20">
          <div className="relative mb-12">
            <div className="bg-gradient-to-r from-syria-green-600 via-syria-green-500 to-syria-green-600 rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-syria-green-50/50 via-transparent to-syria-green-50/50"></div>
                <h3 className="text-3xl font-bold font-tajawal text-syria-green-800 text-center flex items-center justify-center gap-4 relative z-10">
                  <div className="bg-syria-green-100 p-3 rounded-full">
                    <Calendar className="h-8 w-8 text-syria-green-600" />
                  </div>
                  الفعاليات القادمة
                  <div className="bg-syria-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {upcomingEvents.length}
                  </div>
                </h3>
              </div>
            </div>
          </div>
          <EventCarousel
            events={upcomingEvents}
            loading={loading}
            emptyText="لا يوجد فعاليات قادمة حالياً"
          />
        </div>

        {/* Previous Events */}
        <div>
          <div className="relative mb-12">
            <div className="bg-gradient-to-r from-syria-green-500 via-syria-green-400 to-syria-green-500 rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-syria-green-50/30 via-transparent to-syria-green-50/30"></div>
                <h3 className="text-3xl font-bold font-tajawal text-syria-green-800 text-center flex items-center justify-center gap-4 relative z-10">
                  <div className="bg-syria-green-100 p-3 rounded-full">
                    <Calendar className="h-8 w-8 text-syria-green-600" />
                  </div>
                  الفعاليات السابقة
                  <div className="bg-syria-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {previousEvents.length}
                  </div>
                </h3>
              </div>
            </div>
          </div>
          <EventCarousel
            events={previousEvents}
            loading={loading}
            emptyText="لا توجد فعاليات سابقة لعرضها"
          />
        </div>
      </div>
    </section>
  );
};

export default EventGallery;