import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, Users, Calendar, FileText, MessageSquare, BarChart3, Crown, MessageCircle, HelpCircle, Settings, Eye, Plus, Edit, Trash2 } from 'lucide-react';
import CsrfService from '@/hooks/Csrf';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { API_URL } from '@/config';

import QuestionManager from './QuestionManager';
import ContentManager from './ContentManager';
import ElectionManager from './ElectionManager';
import FAQManager from './FAQManager';
import EventManager from './EventManager';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return (
    <>
      {`${year}/${month}/${day}`} <br /> الساعة {hours}:{minutes}
    </>
  );
}

type DashboardStats = {
  totalUsers: number;
  newUsersThisMonth: number;
  totalEvents: number;
  upcomingEvents: number;
  totalPosts: number;
  pendingRequests: number;
};

type RecentUser = {
  id: number;
  name: string;
  email: string;
  studentId: string;
  joined: string;
  major: string;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('adminDashboardActiveTab');
    const validTabs = ['overview', 'users', 'events', 'content', 'elections', 'questions', 'FAQ', 'settings'];
    return savedTab && validTabs.includes(savedTab) ? savedTab : 'overview';
  });

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // userToken removed - using sessions instead

  const [siteSettings, setSiteSettings] = useState({
    maintenance_mode: false,
    maintenance_message: '',
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [userToDeleteName, setUserToDeleteName] = useState<string>('');
  
  // حالات إدارة الأعضاء
  const [allUsers, setAllUsers] = useState<RecentUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const [usersLoading, setUsersLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const statsRes = await axios.get(`${API_URL}/dashboard/stats`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
        },
      });

      setStats({
        totalUsers: statsRes.data.total_users ?? 0,
        newUsersThisMonth: statsRes.data.new_users_this_month ?? 0,
        totalEvents: statsRes.data.total_events ?? 0,
        upcomingEvents: statsRes.data.upcoming_events ?? 0,
        totalPosts: statsRes.data.total_posts ?? 0,
        pendingRequests: statsRes.data.pending_requests ?? 0,
      });

      setRecentUsers(
        (statsRes.data.recent_users || []).map(
          (user: {
            id: number;
            name: string;
            email: string;
            major: string;
            student_id: string;
            created_at: string;
          }) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            studentId: user.student_id,
            joined: user.created_at,
            major: user.major,
          }),
        ),
      );
    } catch (error: unknown) {
      let errorMsg = 'حدث خطأ غير متوقع';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast({
        title: 'خطأ في جلب بيانات الداشبورد',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const fetchSiteSettings = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/settings/site`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
        },
      });
      // فقط الإعدادات المطلوبة لوضع الصيانة
      setSiteSettings({
        maintenance_mode: response.data.maintenance_mode || false,
        maintenance_message: response.data.maintenance_message || '',
      });
    } catch (error: unknown) {
      let errorMsg = 'حدث خطأ في جلب إعدادات الموقع';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast({
        title: 'خطأ في جلب إعدادات الموقع',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const fetchAllUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const response = await axios.get(`${API_URL}/users`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
        },
      });
      
      // التعامل مع هيكل الاستجابة المختلفة
      const usersData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      const users = usersData.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        studentId: user.student_id,
        joined: user.created_at,
        major: user.major || '',
      }));
      
      setAllUsers(users);
    } catch (error: unknown) {
      let errorMsg = 'حدث خطأ في جلب بيانات الأعضاء';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast({
        title: 'خطأ في جلب بيانات الأعضاء',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setUsersLoading(false);
    }
  }, [toast]);

  const saveSiteSettings = async () => {
    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.put(
          `${API_URL}/settings/site`,
          siteSettings,
          {
            withCredentials: true,
            headers: {
              'X-XSRF-TOKEN': csrfToken,
              Accept: 'application/json',
            },
          },
        );
      });
      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ إعدادات الموقع بنجاح',
      });
    } catch (error: unknown) {
      let errorMsg = 'حدث خطأ في حفظ إعدادات الموقع';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast({
        title: 'خطأ في حفظ إعدادات الموقع',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // تحسين البحث مع useMemo
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return allUsers;
    }
    
    const term = searchTerm.toLowerCase();
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.studentId.toLowerCase().includes(term) ||
      (user.major && user.major.toLowerCase().includes(term))
    );
  }, [allUsers, searchTerm]);

  // دالة البحث محسّنة
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  // حساب pagination مع useMemo
  const paginationData = useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    
    return {
      currentUsers,
      totalPages,
      indexOfFirstUser,
      indexOfLastUser,
      hasResults: filteredUsers.length > 0
    };
  }, [filteredUsers, currentPage, usersPerPage]);

  const handleLogout = async () => {
    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        const response = await axios.post(
          `${API_URL}/logout`,
          {},
          {
            withCredentials: true,
            headers: { 
              'X-XSRF-TOKEN': csrfToken,
              'Accept': 'application/json'
            },
          },
        );
        toast({
          title: 'تسجيل الخروج',
          description: response.data.message,
          variant: 'success',
        });
      });
      
      // تنظيف البيانات المحلية
      localStorage.removeItem('userData');
      navigate('/auth');
    } catch (error) {
      console.error(error);
      // حتى لو فشل، نوجه المستخدم للخروج
      navigate('/auth');
    }
  };

  const openDeleteModal = (userId: number, userName: string) => {
    setUserToDelete(userId);
    setUserToDeleteName(userName);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
    setUserToDeleteName('');
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        const response = await axios.delete(`${API_URL}/users/${userToDelete}`, {
          withCredentials: true,
          headers: { 
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json'
          },
        });
        
        toast({
          title: 'تم حذف العضو',
          description: response.data.message,
          variant: 'success',
        });
        
        // إعادة جلب قائمة المستخدمين
        fetchAllUsers();
      });
      closeDeleteModal();
    } catch (error: unknown) {
      let errorMsg = 'حدث خطأ غير متوقع أثناء حذف العضو';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast({
        title: 'خطأ في حذف العضو',
        description: errorMsg,
        variant: 'destructive',
      });
      closeDeleteModal();
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchSiteSettings();
  }, [refreshTrigger, fetchDashboardData, fetchSiteSettings]);

  // جلب جميع المستخدمين عند تفعيل تاب الأعضاء
  useEffect(() => {
    if (activeTab === 'users') {
      fetchAllUsers();
    }
  }, [activeTab, fetchAllUsers]);

  return (
    <div className="w-full space-y-6 pt-6 pb-10 px-4 md:px-8 lg:px-16 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-syria-green-700">
            لوحة تحكم الإدارة
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            مرحباً بك في لوحة تحكم المجتمع السوري في أيدن
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
        >
          <LogOut className="mr-2 h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الأعضاء
            </CardTitle>
            <Users className="h-4 w-4 text-syria-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-syria-green-700">
              {stats?.totalUsers ?? '-'}
            </div>
            <p className="text-xs text-gray-600">
              +{stats?.newUsersThisMonth ?? '-'} هذا الشهر
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الأنشطة والفعاليات
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {stats?.totalEvents ?? '-'}
            </div>
            <p className="text-xs text-gray-600">
              {stats?.upcomingEvents ?? '-'} قادمة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المنشورات</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {stats?.totalPosts ?? '-'}
            </div>
            <p className="text-xs text-gray-600">منشورات نشطة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات معلقة</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {stats?.pendingRequests ?? '-'}
            </div>
            <p className="text-xs text-gray-600">طلبات جديدة</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          localStorage.setItem('adminDashboardActiveTab', value);
        }}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1 h-auto">
          <TabsTrigger value="overview" className="flex flex-col sm:flex-row items-center py-3 text-xs sm:text-sm">
            <BarChart3 className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span className="hidden sm:inline">نظرة عامة</span>
            <span className="sm:hidden">عامة</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex flex-col sm:flex-row items-center py-3 text-xs sm:text-sm">
            <Users className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span className="hidden sm:inline">إدارة الأعضاء</span>
            <span className="sm:hidden">الأعضاء</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex flex-col sm:flex-row items-center py-3 text-xs sm:text-sm">
            <Calendar className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span>الفعاليات</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex flex-col sm:flex-row items-center py-3 text-xs sm:text-sm">
            <FileText className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span>المحتوى</span>
          </TabsTrigger>
          <TabsTrigger value="elections" className="flex flex-col sm:flex-row items-center py-3 text-xs sm:text-sm">
            <Crown className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span>الانتخابات</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex flex-col sm:flex-row items-center py-3 text-xs sm:text-sm">
            <MessageCircle className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span>الأسئلة</span>
          </TabsTrigger>
          <TabsTrigger value="FAQ" className="flex flex-col sm:flex-row items-center py-3 text-xs sm:text-sm">
            <HelpCircle className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span>FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center py-3 text-xs sm:text-sm">
            <Settings className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
            <span>الإعدادات</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  أحدث الأعضاء
                </CardTitle>
                <CardDescription>
                  الأعضاء الجدد الذين انضموا مؤخراً
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">
                          {user.studentId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.joined}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setActiveTab('users')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  عرض جميع الأعضاء
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  إجراءات سريعة
                </CardTitle>
                <CardDescription>
                  الوصول السريع إلى الميزات المهمة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => setActiveTab('events')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    إضافة فعالية جديدة
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => setActiveTab('content')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    تعديل محتوى الموقع
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    الإعدادات العامة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Management Tab */}
        <TabsContent value="users" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>إدارة الأعضاء</span>
                <span className="text-sm text-gray-500">
                  {filteredUsers.length} من {allUsers.length} عضو
                </span>
              </CardTitle>
              <CardDescription>عرض وإدارة جميع أعضاء المجتمع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="البحث عن عضو (الاسم، البريد، رقم الطالب، التخصص)..."
                    className="max-w-md pl-10"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>

                {usersLoading && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-syria-green-600"></div>
                      <div className="animate-ping absolute top-0 left-0 h-12 w-12 rounded-full border border-syria-green-400 opacity-75"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-syria-green-700">جاري تحميل الأعضاء...</p>
                      <p className="text-sm text-gray-600">يرجى الانتظار قليلاً</p>
                    </div>
                  </div>
                )}

                {!usersLoading && (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden lg:block border rounded-lg">
                      <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 font-medium text-sm">
                        <div>الاسم</div>
                        <div>رقم الطالب</div>
                        <div>البريد الإلكتروني</div>
                        <div>التخصص</div>
                        <div>تاريخ الانضمام</div>
                        <div>الإجراءات</div>
                      </div>

                      {paginationData.currentUsers.length > 0 ? paginationData.currentUsers.map((user) => (
                        <div
                          key={user.id}
                          className="grid grid-cols-6 gap-4 p-4 border-t items-center"
                        >
                          <div className="font-medium">{user.name}</div>
                          <div>{user.studentId}</div>
                          <div className="truncate max-w-[200px]" title={user.email}>
                            {user.email}
                          </div>
                          <div>{user.major || '-'}</div>
                          <div className="text-sm">{formatDate(user.joined)}</div>
                          <div>
                            <Button
                              onClick={() => openDeleteModal(user.id, user.name)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span className="mr-1">حذف</span>
                            </Button>
                          </div>
                        </div>
                      )) : (
                        <div className="p-12 text-center">
                          {searchTerm ? (
                            <div className="space-y-4">
                              <div className="text-6xl">🔍</div>
                              <div>
                                <p className="text-lg font-medium text-gray-600">لا توجد نتائج للبحث</p>
                                <p className="text-sm text-gray-500 mt-1">جرب البحث بكلمات أخرى</p>
                              </div>
                              <Button 
                                variant="outline" 
                                onClick={() => handleSearch('')}
                                size="sm"
                              >
                                مسح البحث
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="text-6xl">👥</div>
                              <div>
                                <p className="text-lg font-medium text-gray-600">لا يوجد أعضاء حالياً</p>
                                <p className="text-sm text-gray-500 mt-1">سيظهر الأعضاء هنا بعد انضمامهم</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {!usersLoading && (
                  <>
                    {/* Mobile Cards */}
                    <div className="lg:hidden space-y-4">
                      {paginationData.currentUsers.length > 0 ? paginationData.currentUsers.map((user) => (
                        <div key={user.id} className="border rounded-lg p-4 bg-white shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-medium text-lg">{user.name}</h3>
                              <p className="text-sm text-gray-600">{user.studentId}</p>
                            </div>
                            <Button
                              onClick={() => openDeleteModal(user.id, user.name)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">البريد الإلكتروني: </span>
                              <span className="text-gray-600 break-all">{user.email}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">التخصص: </span>
                              <span className="text-gray-600">{user.major || '-'}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">تاريخ الانضمام: </span>
                              <span className="text-gray-600">{formatDate(user.joined)}</span>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="p-12 text-center">
                          {searchTerm ? (
                            <div className="space-y-4">
                              <div className="text-6xl">🔍</div>
                              <div>
                                <p className="text-lg font-medium text-gray-600">لا توجد نتائج للبحث</p>
                                <p className="text-sm text-gray-500 mt-1">جرب البحث بكلمات أخرى</p>
                              </div>
                              <Button 
                                variant="outline" 
                                onClick={() => handleSearch('')}
                                size="sm"
                              >
                                مسح البحث
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="text-6xl">👥</div>
                              <div>
                                <p className="text-lg font-medium text-gray-600">لا يوجد أعضاء حالياً</p>
                                <p className="text-sm text-gray-500 mt-1">سيظهر الأعضاء هنا بعد انضمامهم</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Pagination */}
                {!usersLoading && filteredUsers.length > usersPerPage && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                    <div className="text-sm text-gray-600">
                      عرض {paginationData.indexOfFirstUser + 1} إلى {Math.min(paginationData.indexOfLastUser, filteredUsers.length)} من {filteredUsers.length} نتيجة
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        السابق
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: paginationData.totalPages }, (_, i) => i + 1)
                          .filter(page => 
                            page === 1 || 
                            page === paginationData.totalPages || 
                            Math.abs(page - currentPage) <= 2
                          )
                          .map((page, index, array) => (
                            <div key={page} className="flex items-center">
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <span className="px-2 text-gray-400">...</span>
                              )}
                              <Button
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={currentPage === page ? "bg-syria-green-600" : ""}
                              >
                                {page}
                              </Button>
                            </div>
                          ))
                        }
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages))}
                        disabled={currentPage === paginationData.totalPages}
                      >
                        التالي
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6 animate-fade-in">
          <EventManager />
        </TabsContent>

        {/* Content Management Tab */}
        <TabsContent value="content" className="space-y-6">
          <ContentManager />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6 animate-fade-in">
          <div className="max-w-2xl mx-auto">
            {/* وضع الصيانة */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <Settings className="mr-2 h-5 w-5" />
                  وضع الصيانة
                </CardTitle>
                <CardDescription>إدارة وضع الصيانة للموقع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border-2 rounded-lg border-orange-200 bg-orange-50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium text-orange-800 text-lg">تفعيل وضع الصيانة</p>
                        <p className="text-sm text-orange-600 mt-1">عند التفعيل، سيظهر للمستخدمين العاديين رسالة الصيانة فقط</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={siteSettings.maintenance_mode}
                          onChange={(e) => setSiteSettings({...siteSettings, maintenance_mode: e.target.checked})}
                          id="maintenance_mode"
                          className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                        />
                        <Label htmlFor="maintenance_mode" className="text-sm font-medium text-orange-800">
                          {siteSettings.maintenance_mode ? 'مفعل' : 'معطل'}
                        </Label>
                      </div>
                    </div>
                    
                    {siteSettings.maintenance_mode && (
                      <div className="border-t border-orange-200 pt-4">
                        <Label className="text-sm font-medium text-orange-800 mb-2 block">رسالة الصيانة</Label>
                        <Input
                          value={siteSettings.maintenance_message}
                          onChange={(e) => setSiteSettings({...siteSettings, maintenance_message: e.target.value})}
                          placeholder="الموقع في وضع الصيانة حالياً. يرجى المحاولة لاحقاً."
                          className="bg-white border-orange-300 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <p className="text-xs text-orange-600 mt-2">هذه الرسالة ستظهر للمستخدمين العاديين أثناء فترة الصيانة</p>
                      </div>
                    )}

                    {!siteSettings.maintenance_mode && (
                      <div className="border-t border-orange-200 pt-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-800 font-medium">✅ الموقع يعمل بشكل طبيعي</p>
                          <p className="text-xs text-green-700 mt-1">جميع المستخدمين يمكنهم الوصول للموقع</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">ملاحظة مهمة:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• المديرون يمكنهم الوصول للموقع حتى أثناء وضع الصيانة</li>
                      <li>• المستخدمون العاديون سيرون رسالة الصيانة فقط</li>
                      <li>• يتم فحص وضع الصيانة كل 30 ثانية تلقائياً</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* زر الحفظ */}
          <div className="flex justify-center">
            <Button
              onClick={saveSiteSettings}
              className="bg-syria-green-500 text-white hover:bg-syria-green-600 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3"
            >
              <Settings className="mr-2 h-4 w-4" />
              حفظ إعدادات الصيانة
            </Button>
          </div>
        </TabsContent>

        {/* Election Management Tab */}
        <TabsContent value="elections" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>إدارة الانتخابات</CardTitle>
              <CardDescription>
                إنشاء وتنظيم الانتخابات داخل المجتمع
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ElectionManager />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Management Tab */}
        <TabsContent value="FAQ" className="space-y-6 animate-fade-in">
          <FAQManager />
        </TabsContent>

        {/* Question Management Tab */}
        <TabsContent value="questions" className="space-y-6 animate-fade-in">
          <QuestionManager />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-red-600">تأكيد الحذف</h2>
            <p className="mb-6 text-sm sm:text-base">
              هل أنت متأكد أنك تريد حذف العضو{' '}
              <strong>{userToDeleteName}</strong>؟ هذا الإجراء لا يمكن التراجع
              عنه.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeDeleteModal}
                className="w-full sm:w-auto"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                onClick={handleDeleteUser}
              >
                نعم، احذف
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;