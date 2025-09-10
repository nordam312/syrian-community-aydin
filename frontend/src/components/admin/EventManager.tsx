import { useState, useEffect, useCallback } from 'react';
import { sanitizeInput, sanitizeHTML } from '@/utils/sanitize';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Plus, Edit, Eye, Trash2, Calendar, Users, Printer, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/config';
import CsrfService from '@/hooks/Csrf';

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  max_attendees: number;
  current_attendees: number;
  confirmed_attendees_count: number;

  image_url: string | null;
  created_at: string;
  updated_at: string;
};

type Attendee = {
  id: number;
  name: string;
  email: string;
  student_id: string;
  phone?: string;
  major?: string;
  attended_at?: string;
};

const EventManager = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAttendeesSheet, setShowAttendeesSheet] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [currentEventAttendees, setCurrentEventAttendees] = useState<Attendee[]>([]);
  const [currentEventTitle, setCurrentEventTitle] = useState('');
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    max_attendees: '',
    image: null as File | null,
  });

  const { toast } = useToast();
  // userToken removed - using sessions instead

  // دالة لجلب جميع الأحداث
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/events`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
        },
      });
      setEvents(response.data.data || response.data);
    } catch (error: unknown) {
      let errorMsg = 'حدث خطأ في جلب الأحداث';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast({
        title: 'خطأ في جلب الأحداث',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // دالة لجلب المشتركين في فعالية
  const fetchEventAttendees = async (eventId: number, eventTitle: string) => {
    try {
      const response = await axios.get(`${API_URL}/events/${eventId}/attendees`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
        },
      });
      setCurrentEventAttendees(response.data.data || response.data);
      setCurrentEventTitle(eventTitle);
      setShowAttendeesSheet(true);
    } catch (error: unknown) {
      let errorMsg = 'حدث خطأ في جلب قائمة المشتركين';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast({
        title: 'خطأ في جلب المشتركين',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // دالة حذف حدث
  const handleDeleteEvent = async (eventId: number) => {
    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.delete(`${API_URL}/events/${eventId}`, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            Accept: 'application/json',
          },
        });
      });
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الفعالية بنجاح',
        variant: 'success',
      });
      fetchEvents(); // إعادة تحميل الأحداث بعد الحذف
    } catch (error: unknown) {
      let errorMsg = 'حدث خطأ في حذف الفعالية';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast({
        title: 'خطأ في حذف الفعالية',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openEventForm = () => setShowEventForm(true);

  const handleEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setEventForm({ ...eventForm, [e.target.name]: sanitizedValue });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEventForm({ ...eventForm, image: e.target.files[0] });
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', eventForm.title);
      formData.append('description', eventForm.description);
      formData.append('date', eventForm.date);
      formData.append('location', eventForm.location);
      formData.append('max_attendees', eventForm.max_attendees);
      if (eventForm.image) {
        formData.append('image', eventForm.image);
      }

      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.post(`${API_URL}/events`, formData, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      toast({
        title: 'تم إضافة الفعالية بنجاح',
        description: 'تمت إضافة الفعالية الجديدة إلى النظام',
        variant: 'success'
      });

      setShowEventForm(false);
      setEventForm({
        title: '',
        description: '',
        date: '',
        location: '',
        max_attendees: '',
        image: null,
      });

      fetchEvents(); // إعادة تحميل الأحداث بعد الإضافة
    } catch (error: unknown) {
      let errorMsg = 'حدث خطأ في إضافة الفعالية';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast({
        title: 'خطأ في إضافة الفعالية',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // دالة لتنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // دالة لطباعة قائمة المشتركين
  const printAttendeesList = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>قائمة المشتركين - ${currentEventTitle}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; direction: rtl; }
              .header { text-align: center; margin-bottom: 30px; }
              .header h1 { color: #2d5f2d; margin-bottom: 10px; }
              .header p { color: #666; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: right; }
              th { background-color: #f5f5f5; color: #2d5f2d; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              .footer { margin-top: 30px; text-align: left; font-size: 12px; color: #666; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>قائمة المشتركين في الفعالية</h1>
              <h2>${currentEventTitle}</h2>
              <p>عدد المشتركين: ${currentEventAttendees.length}</p>
              <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>الاسم</th>
                  <th>رقم الطالب</th>
                  <th>البريد الإلكتروني</th>
                  <th>التخصص</th>
                  <th>الهاتف</th>
                </tr>
              </thead>
              <tbody>
                ${currentEventAttendees.map((attendee, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${attendee.name}</td>
                    <td>${attendee.student_id}</td>
                    <td>${attendee.email}</td>
                    <td>${attendee.major || 'غير محدد'}</td>
                    <td>${attendee.phone || 'غير متوفر'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="footer">
              <p>تم الإنشاء بواسطة نظام إدارة المجتمع السوري - جامعة أيدن</p>
            </div>
            <div class="no-print" style="margin-top: 20px; text-align: center;">
              <button onclick="window.print()" style="padding: 10px 20px; background: #2d5f2d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                طباعة
              </button>
              <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                إغلاق
              </button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // دالة لتحميل قائمة المشتركين كملف Excel
  const downloadAttendeesExcel = () => {
    const data = currentEventAttendees.map((attendee, index) => ({
      'م': index + 1,
      'الاسم': attendee.name,
      'رقم الطالب': attendee.student_id,
      'البريد الإلكتروني': attendee.email,
      'التخصص': attendee.major || 'غير محدد',
      'الهاتف': attendee.phone || 'غير متوفر'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'المشتركين');

    // تنسيق العمود العربي
    worksheet['!cols'] = [
      { width: 5 },  // م
      { width: 20 }, // الاسم
      { width: 15 }, // رقم الطالب
      { width: 25 }, // البريد الإلكتروني
      { width: 20 }, // التخصص
      { width: 15 }  // الهاتف
    ];

    XLSX.writeFile(workbook, `مشتركين_${currentEventTitle.replace(/\s+/g, '_')}.xlsx`);
  };

  // فصل الفعاليات إلى قادمة وسابقة
  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) > now);
  const pastEvents = events.filter(event => new Date(event.date) <= now);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-syria-green-600"></div>
            <div className="animate-ping absolute top-0 left-0 h-12 w-12 rounded-full border border-syria-green-400 opacity-75"></div>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-syria-green-700">جاري تحميل الأحداث...</p>
            <p className="text-sm text-gray-600">يرجى الانتظار قليلاً</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // دالة لفتح تفاصيل الحدث
  const handleViewEvent = (event: Event) => {
    setCurrentEvent(event);
    setShowEventDetails(true);
  };

  // دالة لبدء تعديل حدث
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 16), // تحويل التاريخ إلى format datetime-local
      location: event.location,
      max_attendees: event.max_attendees.toString(),
      image: null,
    });
    setShowEventForm(true);
  };

  // دالة لتحديث حدث موجود
  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      const formData = new FormData();
      formData.append('title', eventForm.title);
      formData.append('description', eventForm.description);
      formData.append('date', eventForm.date);
      formData.append('location', eventForm.location);
      formData.append('max_attendees', eventForm.max_attendees);
      if (eventForm.image) {
        formData.append('image', eventForm.image);
      }
      formData.append('_method', 'PUT');

      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.post(`${API_URL}/events/${editingEvent.id}`, formData, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      toast({
        title: 'تم تحديث الفعالية بنجاح',
        description: 'تم حفظ التغييرات على الفعالية',
        variant: 'success'
      });

      setShowEventForm(false);
      setEditingEvent(null);
      setEventForm({
        title: '',
        description: '',
        date: '',
        location: '',
        max_attendees: '',
        image: null,
      });

      fetchEvents(); // إعادة تحميل الأحداث بعد التحديث
    } catch (error: unknown) {
      let errorMsg = 'حدث خطأ في تحديث الفعالية';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast({
        title: 'خطأ في تحديث الفعالية',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  const renderEventCard = (event: Event) => (
    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      {event.image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-start">
          <span>{sanitizeInput(event.title)}</span>
          <Badge variant={new Date(event.date) > now ? "default" : "secondary"}>
            {new Date(event.date) > now ? "قادمة" : "منتهية"}
          </Badge>
        </CardTitle>
        <CardDescription className="space-y-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 ml-1" />
            {formatDate(event.date)}
          </div>
          {event.location && (
            <div className="flex items-center">
              <span className="ml-1">📍</span>
              {sanitizeInput(event.location)}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {sanitizeInput(event.description)}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-syria-green-600 font-medium">
            {event.confirmed_attendees_count} / {event.max_attendees} مشترك
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchEventAttendees(event.id, event.title)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Users className="h-4 w-4 ml-1" />
            عرض المشتركين
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleEditEvent(event)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleViewEvent(event)}
            className="text-green-600 hover:text-green-700"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600"
            onClick={() => handleDeleteEvent(event.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            إدارة الفعاليات
          </CardTitle>
          <CardDescription>إنشاء وتنظيم الأنشطة والفعاليات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              className="bg-syria-green-500 text-white hover:bg-syria-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={openEventForm}
            >
              <Plus className="mr-2 h-4 w-4" />
              إضافة فعالية جديدة
            </Button>

            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">الفعاليات القادمة</TabsTrigger>
                <TabsTrigger value="past">الفعاليات السابقة</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>لا توجد فعاليات قادمة حالياً</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingEvents.map(renderEventCard)}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {pastEvents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>لا توجد فعاليات سابقة</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pastEvents.map(renderEventCard)}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* نموذج إضافة فعالية جديدة */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {editingEvent ? 'تعديل الفعالية' : 'إضافة فعالية جديدة'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editingEvent ? 'قم بتعديل تفاصيل الفعالية وحفظ التغييرات.' : 'قم بملء تفاصيل الفعالية الجديدة وحفظها.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={editingEvent ? handleUpdateEvent : handleEventSubmit} className="space-y-4">
            <div>
              <Label>عنوان الفعالية *</Label>
              <Input
                name="title"
                value={eventForm.title}
                onChange={handleEventChange}
                placeholder="أدخل عنوان الفعالية"
                required
              />
            </div>

            <div>
              <Label>وصف الفعالية *</Label>
              <Textarea
                name="description"
                value={eventForm.description}
                onChange={handleEventChange}
                placeholder="أدخل وصفاً للفعالية"
                required
                rows={3}
              />
            </div>

            <div>
              <Label>التاريخ والوقت *</Label>
              <Input
                name="date"
                type="datetime-local"
                value={eventForm.date}
                onChange={handleEventChange}
                required
              />
            </div>

            <div>
              <Label>الموقع</Label>
              <Input
                name="location"
                value={eventForm.location}
                onChange={handleEventChange}
                placeholder="أدخل موقع الفعالية"
              />
            </div>

            <div>
              <Label>الحد الأقصى للمشاركين</Label>
              <Input
                name="max_attendees"
                type="number"
                value={eventForm.max_attendees}
                onChange={handleEventChange}
                placeholder="عدد المشاركين"
                min={1}
              />
            </div>

            <div>
              <Label>صورة الفعالية</Label>
              <Input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                الصيغ المدعومة: JPG, PNG, GIF. الحجم الأقصى: 5MB
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEventForm(false);
                  setEditingEvent(null);
                  setEventForm({
                    title: '',
                    description: '',
                    date: '',
                    location: '',
                    max_attendees: '',
                    image: null,
                  });
                }}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="bg-syria-green-600 hover:bg-syria-green-700 text-white"
              >
                {editingEvent ? 'حفظ التغييرات' : 'إضافة الفعالية'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sheet لعرض المشتركين */}
      <Sheet open={showAttendeesSheet} onOpenChange={setShowAttendeesSheet}>
        <SheetContent className="overflow-y-auto sm:max-w-2xl bg-white rounded-lg shadow-xl">
          <SheetHeader>
            <SheetTitle>قائمة المشتركين في الفعالية</SheetTitle>
            <SheetDescription>
              {currentEventTitle} - العدد: {currentEventAttendees.length}
            </SheetDescription>
          </SheetHeader>

          <div className="flex gap-2 my-4">
            <Button onClick={printAttendeesList} className="flex items-center">
              <Printer className="h-4 w-4 ml-1" />
              طباعة القائمة
            </Button>
            <Button onClick={downloadAttendeesExcel} variant="outline" className="flex items-center">
              <Download className="h-4 w-4 ml-1" />
              تحميل كملف CSV
            </Button>
          </div>

          <div className="border rounded-lg">
            <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 font-medium text-sm">
              <div>الاسم</div>
              <div>رقم الطالب</div>
              <div>البريد الإلكتروني</div>
              <div>التخصص</div>
              <div>الهاتف</div>
            </div>

            {currentEventAttendees.map((attendee) => (
              <div key={attendee.id} className="grid grid-cols-5 gap-4 p-4 border-t">
                <div className="font-medium">{attendee.name}</div>
                <div>{attendee.student_id}</div>
                <div className="truncate">{attendee.email}</div>
                <div>{attendee.major || 'غير محدد'}</div>
                <div>{attendee.phone || 'غير متوفر'}</div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialog لعرض تفاصيل الفعالية */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="sm:max-w-[600px] bg-white rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              تفاصيل الفعالية
            </DialogTitle>
          </DialogHeader>

          {currentEvent && (
            <div className="space-y-4">
              {currentEvent.image_url && (
                <div className="w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={currentEvent.image_url}
                    alt={currentEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg mb-2">{currentEvent.title}</h3>
                <p className="text-gray-600 leading-relaxed">{currentEvent.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">التاريخ والوقت</Label>
                  <p className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 ml-1 text-syria-green-600" />
                    {formatDate(currentEvent.date)}
                  </p>
                </div>

                {currentEvent.location && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">الموقع</Label>
                    <p className="flex items-center mt-1">
                      <span className="ml-1 text-syria-green-600">📍</span>
                      {currentEvent.location}
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-500">عدد المشتركين</Label>
                  <p className="flex items-center mt-1">
                    <Users className="h-4 w-4 ml-1 text-syria-green-600" />
                    {currentEvent.confirmed_attendees_count} / {currentEvent.max_attendees} مشترك
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">تاريخ الإنشاء</Label>
                  <p className="mt-1">
                    {formatDate(currentEvent.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    setShowEventDetails(false);
                    handleEditEvent(currentEvent);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="h-4 w-4 ml-1" />
                  تعديل الفعالية
                </Button>
                <Button
                  onClick={() => fetchEventAttendees(currentEvent.id, currentEvent.title)}
                  variant="outline"
                >
                  <Users className="h-4 w-4 ml-1" />
                  عرض المشتركين
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEventDetails(false)}
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventManager;