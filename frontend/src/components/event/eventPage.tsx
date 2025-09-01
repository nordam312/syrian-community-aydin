import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { API_URL, STORAGE_URL } from '@/config';

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
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/events/${id}`);
        const eventData = res.data;
        setEvent(eventData);

        const user = JSON.parse(sessionStorage.getItem('userData'));
        setRegistered(
          user?.id ? eventData.attendees.some((a) => a.id === user.id) : false,
        );
      } catch (err) {
        console.error('Error fetching event:', err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    setError(null);
    const user = JSON.parse(sessionStorage.getItem('userData'));
    const token = sessionStorage.getItem('userToken');

    if (!user?.id) {
      setError('يجب تسجيل الدخول أولاً.');
      toast({
        title: 'خطأ في التسجيل',
        description: 'يجب تسجيل الدخول أولاً',
        variant: 'warning',
      });
      setRegistering(false);
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/events/${id}/attendees`,
        { user_id: user.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      toast({
        title: 'تم التسجيل بنجاح!',
        description: res.data.message,
        variant: 'success',
      });
      setRegistered(true);

      setEvent((prev) =>
        prev
          ? {
              ...prev,
              remaining_slots: (prev.remaining_slots || 0) - 1,
            }
          : prev,
      );
    } catch (err) {
      toast({
        title: 'خطأ في التسجيل',
        description: err?.response?.data?.message || 'حدث خطأ أثناء التسجيل',
        variant: 'warning',
      });
      setError(
        err?.response?.data?.message || 'حدث خطأ أثناء التسجيل في الحدث',
      );
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    setRegistering(true);
    setError(null);
    const user = JSON.parse(sessionStorage.getItem('userData'));
    const token = sessionStorage.getItem('userToken');

    if (!user?.id) {
      setError('يجب تسجيل الدخول أولاً.');
      setRegistering(false);
      return;
    }

    try {
      await axios.delete(`${API_URL}/events/${id}/attendees`, {
        data: { user_id: user.id },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      toast({
        title: 'تم إلغاء التسجيل',
        description: 'تم إلغاء التسجيل من الحدث',
        variant: 'warning',
      });
      setRegistered(false);
      setEvent((prev) =>
        prev
          ? { ...prev, remaining_slots: (prev.remaining_slots || 0) + 1 }
          : prev,
      );
    } catch (err) {
      setError(err?.response?.data?.message || 'حدث خطأ أثناء إلغاء التسجيل');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="text-center py-20">جاري التحميل...</div>;
  if (!event) return <div className="text-center py-20">الحدث غير موجود</div>;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-10 animate-fade-in">
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

            {typeof event.remaining_slots === 'number' && (
              <div
                className={`mb-2 font-tajawal text-sm ${
                  event.remaining_slots > 0
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

            {!registered &&
            (event.remaining_slots === undefined ||
              event.remaining_slots > 0) ? (
              <button
                className="mt-4 w-full bg-syria-green-700 hover:bg-syria-green-800 text-white py-2 rounded-full font-tajawal transition"
                onClick={handleRegister}
                disabled={registering}
              >
                {registering ? 'جاري التسجيل...' : 'تسجيل في الحدث'}
              </button>
            ) : registered ? (
              <button
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-full font-tajawal transition"
                onClick={handleUnregister}
                disabled={registering}
              >
                {registering ? 'جاري الإلغاء...' : 'إلغاء التسجيل من الحدث'}
              </button>
            ) : null}

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
