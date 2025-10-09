import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { API_URL, STORAGE_URL } from '@/config';
import { useAuth } from '@/contexts/AuthContext';
import CsrfService from '@/hooks/Csrf';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}/${month}/${day} الساعة ${hours}:${minutes}`;
}

type EventType = {
  id: number;
  title: string;
  description?: string;
  date: string;
  location?: string;
  max_attendees?: number;
  confirmed_attendees_count?: number;
  remaining_slots?: number;
  image?: string;
  attendees: { id: number; name: string }[];
};

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [unregistering, setUnregistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/events/${id}`);
        const eventData = res.data;
        setEvent(eventData);

        setRegistered(
          user?.id ? eventData.attendees.some((a) => a.id === user.id) : false,
        );
      } catch (err) {
        console.error('Error fetching event:', err);
        setEvent(null);
        setError('فشل في تحميل بيانات الحدث');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, user?.id]);

  const handleRegister = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'يجب تسجيل الدخول',
        description: 'يجب تسجيل الدخول للتسجيل في الحدث',
        variant: 'warning',
      });
      return;
    }

    setRegistering(true);
    setError(null);

    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        const response = await axios.post(
          `${API_URL}/events/${id}/attendees`,
          {}, // لا حاجة لإرسال user_id، الخادم يعرفه من الجلسة
          {
            withCredentials: true,
            headers: {
              'X-XSRF-TOKEN': csrfToken,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        // رسائل عشوائية جميلة ومعبرة
        const messages = [
          { title: 'ننتظر حضورك بفارغ الصبر! 🌟', subtitle: 'ستكون الفعالية أجمل بوجودك' },
          { title: 'نلتقي في الفعالية! 🎉', subtitle: 'استعد لتجربة لا تُنسى' },
          { title: 'مكانك محجوز! ✨', subtitle: 'لا تنسَ التاريخ والموعد' },
          { title: 'أهلاً بك في الفعالية! 🎊', subtitle: 'سعداء بانضمامك إلينا' },
          { title: 'تم حجز مقعدك بنجاح! 🪑', subtitle: 'نتطلع لرؤيتك قريباً' }
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        toast({
          description: (
            <div className="text-center">
              <span className="text-syria-green-600 font-bold animate-pulse"
                    style={{
                      textShadow: '0 0 10px rgba(72, 187, 120, 0.5), 0 0 20px rgba(72, 187, 120, 0.3)',
                      display: 'inline-block'
                    }}>
                {randomMessage.title}
              </span>
              <br />
              <span className="text-gray-600 text-sm">{randomMessage.subtitle}</span>
              <br />
              <span className="text-xs text-gray-500 mt-1">📍 {event.title}</span>
            </div>
          ),
          duration: 4000,
          className: 'bg-white',
        });

        setRegistered(true);
        setEvent((prev) =>
          prev
            ? {
              ...prev,
              remaining_slots: (prev.remaining_slots || 0) - 1,
              confirmed_attendees_count: (prev.confirmed_attendees_count || 0) + 1,
            }
            : prev
        );

        return response;
      });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'حدث خطأ أثناء التسجيل';
      setError(errorMessage);
      toast({
        title: 'خطأ في التسجيل',
        description: errorMessage,
        variant: 'warning',
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'يجب تسجيل الدخول',
        description: 'يجب تسجيل الدخول لإلغاء التسجيل',
        variant: 'warning',
      });
      return;
    }

    setUnregistering(true);
    setError(null);

    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.delete(
          `${API_URL}/events/${id}/attendees`,
          {
            withCredentials: true,
            headers: {
              'X-XSRF-TOKEN': csrfToken,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        toast({
          description: (
            <div className="text-center">
              <span className="text-orange-600 font-bold animate-pulse"
                    style={{
                      textShadow: '0 0 10px rgba(251, 146, 60, 0.5), 0 0 20px rgba(251, 146, 60, 0.3)',
                      display: 'inline-block'
                    }}>
                تم إلغاء التسجيل 😔
              </span>
              <br />
              <span className="text-gray-600 text-sm">نأمل أن نراك في فعالية أخرى قريباً</span>
            </div>
          ),
          duration: 3000,
          className: 'bg-white',
        });

        setRegistered(false);
        setEvent((prev) =>
          prev
            ? {
              ...prev,
              remaining_slots: (prev.remaining_slots || 0) + 1,
              confirmed_attendees_count: (prev.confirmed_attendees_count || 0) - 1,
            }
            : prev
        );
      });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'حدث خطأ أثناء إلغاء التسجيل';
      setError(errorMessage);
      toast({
        title: 'خطأ في إلغاء التسجيل',
        description: errorMessage,
        variant: 'warning',
      });
    } finally {
      setUnregistering(false);
    }
  };

  if (loading) return <div className="text-center py-20">جاري التحميل...</div>;
  if (!event) return <div className="text-center py-20">الحدث غير موجود</div>;

  const isEventPast = new Date(event.date) < new Date();
  const canRegister = !registered && !isEventPast && (event.remaining_slots === undefined || event.remaining_slots > 0);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-10 animate-page-enter" dir="rtl">
        <div className="bg-white rounded-2xl shadow-lg border border-syria-green-100 overflow-hidden">
          <div className="relative h-64">
            <img
              src={
                event.image
                  ? `${STORAGE_URL}/${event.image}`
                  : 'https://via.placeholder.com/600x400?text=No+Image'
              }
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 right-3 bg-white/90 rounded-full px-3 py-1 flex items-center gap-2 shadow font-tajawal text-syria-green-800 text-xs">
              <Calendar size={16} className="text-syria-green-700" />
              {formatDate(event.date)}
            </div>
          </div>
          <div className="p-6">
            <h2 className="font-bold text-2xl mb-2 text-syria-green-700 font-tajawal">
              {event.title}
            </h2>

            {typeof event.max_attendees === 'number' && (
              <div className="mb-2 text-syria-green-800 font-tajawal text-sm">
                الحد الأقصى للحضور:{' '}
                <span className="font-bold">{event.max_attendees}</span>
              </div>
            )}

            {typeof event.confirmed_attendees_count === 'number' && (
              <div className="mb-2 text-syria-green-800 font-tajawal text-sm">
                عدد المسجلين:{' '}
                <span className="font-bold">{event.confirmed_attendees_count}</span>
              </div>
            )}

            {typeof event.remaining_slots === 'number' && (
              <div
                className={`mb-2 font-tajawal text-sm ${event.remaining_slots > 0
                    ? 'text-syria-green-700'
                    : 'text-red-600'
                  }`}
              >
                {event.remaining_slots > 0
                  ? `متبقي ${event.remaining_slots} مكان`
                  : 'اكتمل العدد ولا يمكن التسجيل'}
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-2 text-syria-green-800 mb-2 font-tajawal text-sm">
                <MapPin size={16} className="text-syria-green-700" />
                {event.location}
              </div>
            )}

            {event.description && (
              <p className="text-gray-700 mb-4 font-tajawal">
                {event.description}
              </p>
            )}

            {!isAuthenticated ? (
              <div className="text-center text-orange-600 font-tajawal mt-4">
                يجب تسجيل الدخول للتسجيل في الحدث
              </div>
            ) : canRegister ? (
              <button
                className="mt-4 w-full bg-syria-green-700 hover:bg-syria-green-800 text-white py-2 rounded-full font-tajawal transition disabled:opacity-50"
                onClick={handleRegister}
                disabled={registering}
              >
                {registering ? 'جاري التسجيل...' : 'تسجيل في الحدث'}
              </button>
            ) : registered ? (
              !isEventPast ? (
                <button
                  className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-full font-tajawal transition disabled:opacity-50"
                  onClick={handleUnregister}
                  disabled={unregistering}
                >
                  {unregistering ? 'جاري الإلغاء...' : 'إلغاء التسجيل من الحدث'}
                </button>
              ) : (
                <div className="text-center text-gray-600 font-tajawal mt-4">
                  انتهى هذا الحدث - مسجل مسبقاً
                </div>
              )
            ) : isEventPast ? (
              <div className="text-center text-gray-600 font-tajawal mt-4">
                انتهى وقت هذا الحدث ولا يمكن التسجيل
              </div>
            ) : (
              <div className="text-center text-red-600 font-tajawal mt-4">
                اكتمل العدد ولا يمكن التسجيل
              </div>
            )}

            {error && (
              <div className="mt-2 text-center text-red-600 font-tajawal">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventPage;