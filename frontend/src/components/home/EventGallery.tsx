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
  const visibleCards = 3;
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

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
          className="absolute right-0 z-10 rounded-full border-syria-green-200"
          onClick={next}
        >
          <ChevronRight size={22} className="text-syria-green-700" />
        </Button>
      )}
      <div className="flex gap-6 w-full max-w-5xl px-10 justify-center">
        {displayed.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl shadow-md border border-syria-green-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition duration-300 flex flex-col w-80 flex-shrink-0"
            onClick={() => navigate(`/events/${event.id}`)}
          >
            <div className="relative h-52">
              <img
                src={
                  event.image
                    ? `http://127.0.0.1:8000/storage/${event.image}`
                    : 'https://via.placeholder.com/600x400?text=No+Image'
                }
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 right-3 bg-white/90 rounded-full px-3 py-1 flex items-center gap-2 shadow font-tajawal text-syria-green-800 text-xs">
                <Calendar size={14} className="text-syria-green-700" />
                {formatDate(event.date)}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h4 className="font-bold text-xl mb-2 text-syria-green-700 font-tajawal line-clamp-2">
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
                  className="w-full bg-gradient-to-r from-syria-green-700 to-syria-green-600 hover:from-syria-green-800 hover:to-syria-green-700 text-white rounded-full font-tajawal shadow-md"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  تفاصيل الحدث
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
          className="absolute left-0 z-10 rounded-full border-syria-green-200"
          onClick={prev}
        >
          <ChevronLeft size={22} className="text-syria-green-700" />
        </Button>
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
    <section className="section bg-white pb-20">
      <div className="page-container max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold font-tajawal text-center pb-6 text-syria-green-800">
          الفعاليات
        </h2>
        <div className="mb-14">
          <h3 className="text-2xl font-bold font-tajawal text-syria-green-800 mb-6 text-center">
            الفعاليات القادمة
          </h3>
          <EventCarousel
            events={upcomingEvents}
            loading={loading}
            emptyText="لا يوجد فعاليات قادمة"
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold font-tajawal text-syria-green-800 mb-6 text-center">
            الفعاليات السابقة
          </h3>
          <EventCarousel
            events={previousEvents}
            loading={loading}
            emptyText="لا يوجد فعاليات سابقة"
          />
        </div>
      </div>
    </section>
  );
};

export default EventGallery;
