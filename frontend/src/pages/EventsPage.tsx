import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, STORAGE_URL } from '@/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface EventType {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  max_attendees: number;
  status: string;
  image: string | null;
  attendees_count?: number;
}

const EventsPage = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/events`, {
          headers: { Accept: 'application/json' },
        });
        setEvents(res.data.data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: 'خطأ في تحميل الفعاليات',
          description: 'حدث خطأ أثناء جلب بيانات الفعاليات',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [toast]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventStatus = (eventDate: string) => {
    const now = new Date();
    const eventDateObj = new Date(eventDate);
    return eventDateObj >= now ? 'upcoming' : 'past';
  };

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true;
    return getEventStatus(event.date) === filter;
  });

  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) >= now);
  const pastEvents = events.filter(event => new Date(event.date) < now);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="bg-gradient-to-r from-syria-green-400 to-syria-green-500 py-16 text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-4xl font-bold mb-4">الفعاليات</h1>
              <p className="text-xl">جاري تحميل الفعاليات...</p>
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-syria-green-200">
                  <CardContent className="p-6">
                    <Skeleton className="h-48 w-full rounded-lg mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* الهيدر */}
        <div className="bg-gradient-to-r from-syria-green-400 to-syria-green-500 py-16 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">الفعاليات</h1>
            <p className="text-xl">اكتشف الفعاليات والأنشطة القادمة في مجتمعنا</p>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center border-syria-green-200 bg-syria-green-50">
              <CardContent className="p-6">
                <Calendar className="h-12 w-12 text-syria-green-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-syria-green-700 mb-1">{events.length}</h3>
                <p className="text-syria-green-600">إجمالي الفعاليات</p>
              </CardContent>
            </Card>
            <Card className="text-center border-syria-green-200 bg-syria-green-50">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-syria-green-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-syria-green-700 mb-1">{upcomingEvents.length}</h3>
                <p className="text-syria-green-600">فعاليات قادمة</p>
              </CardContent>
            </Card>
            <Card className="text-center border-syria-green-200 bg-syria-green-50">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-syria-green-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-syria-green-700 mb-1">{pastEvents.length}</h3>
                <p className="text-syria-green-600">فعاليات سابقة</p>
              </CardContent>
            </Card>
          </div>

          {/* أزرار التصفية */}
          <div className="flex justify-center gap-4 mb-12">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              className={cn(
                "px-6 py-2 rounded-full transition-all",
                filter === 'all'
                  ? "bg-syria-green-600 hover:bg-syria-green-700 text-white"
                  : "border-syria-green-200 text-syria-green-700 hover:bg-syria-green-50"
              )}
              onClick={() => setFilter('all')}
            >
              جميع الفعاليات
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              className={cn(
                "px-6 py-2 rounded-full transition-all",
                filter === 'upcoming'
                  ? "bg-syria-green-600 hover:bg-syria-green-700 text-white"
                  : "border-syria-green-200 text-syria-green-700 hover:bg-syria-green-50"
              )}
              onClick={() => setFilter('upcoming')}
            >
              الفعاليات القادمة
            </Button>
            <Button
              variant={filter === 'past' ? 'default' : 'outline'}
              className={cn(
                "px-6 py-2 rounded-full transition-all",
                filter === 'past'
                  ? "bg-syria-green-600 hover:bg-syria-green-700 text-white"
                  : "border-syria-green-200 text-syria-green-700 hover:bg-syria-green-50"
              )}
              onClick={() => setFilter('past')}
            >
              الفعاليات السابقة
            </Button>
          </div>

          {/* قائمة الفعاليات */}
          {filteredEvents.length === 0 ? (
            <Card className="text-center border-syria-green-200 bg-syria-green-50">
              <CardContent className="py-16">
                <Calendar className="mx-auto h-16 w-16 text-syria-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-syria-green-700 mb-2">
                  {filter === 'upcoming' ? 'لا توجد فعاليات قادمة' :
                    filter === 'past' ? 'لا توجد فعاليات سابقة' : 'لا توجد فعاليات'}
                </h3>
                <p className="text-syria-green-600">
                  {filter === 'upcoming' ? 'تحقق لاحقاً للاطلاع على الفعاليات القادمة' :
                    'لم يتم تنظيم أي فعاليات حتى الآن'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => {
                const isUpcoming = getEventStatus(event.date) === 'upcoming';

                return (
                  <Card
                    key={event.id}
                    className={cn(
                      "border-syria-green-200 overflow-hidden transition-all duration-300 hover:shadow-lg",
                      isUpcoming ? "bg-white" : "bg-gray-50"
                    )}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          event.image
                            ? `${STORAGE_URL}/${event.image}`
                            : '/images/event-placeholder.jpg'
                        }
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/images/event-placeholder.jpg';
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          isUpcoming
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        )}>
                          {isUpcoming ? 'قادم' : 'منتهي'}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="font-semibold text-white text-lg text-right">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-syria-green-600">
                          <Calendar className="h-4 w-4 ml-2" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center text-sm text-syria-green-600">
                            <MapPin className="h-4 w-4 ml-2" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.max_attendees && (
                          <div className="flex items-center text-sm text-syria-green-600">
                            <Users className="h-4 w-4 ml-2" />
                            <span>
                              {event.attendees_count || 0} / {event.max_attendees} مشترك
                            </span>
                          </div>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-gray-700 text-sm mb-4 text-right line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      <Button
                        className="w-full bg-gradient-to-r from-syria-green-500 to-syria-green-600 hover:from-syria-green-600 hover:to-syria-green-700 text-white"
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        <span>عرض التفاصيل</span>
                        <ArrowRight className="h-4 w-4 mr-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EventsPage;