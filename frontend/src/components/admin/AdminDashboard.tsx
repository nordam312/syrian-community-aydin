import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, Users, Calendar, FileText, MessageSquare, BarChart3, Crown, MessageCircle, HelpCircle, Settings, Eye, Plus, Edit, Trash2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
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
  const userToken = localStorage.getItem('userToken');

  const [siteSettings, setSiteSettings] = useState({
    enable_registration: true,
    email_verification: false,
    maintenance_mode: false,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [userToDeleteName, setUserToDeleteName] = useState<string>('');

  const fetchDashboardData = useCallback(async () => {
    try {
      const statsRes = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
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
  }, [userToken, toast]);

  const fetchSiteSettings = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/settings/site`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      });
      setSiteSettings(response.data);
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
  }, [userToken, toast]);

  const saveSiteSettings = async () => {
    try {
      await axios.put(
        `${API_URL}/settings/site`,
        siteSettings,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            Accept: 'application/json',
          },
        },
      );
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

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` },
        },
      );
      toast({
        title: 'تسجيل الخروج',
        description: response.data.message,
        variant: 'success',
      });
      localStorage.removeItem('userData');
      localStorage.removeItem('userToken');
      navigate('/');
    } catch (error) {
      console.error(error);
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
      const response = await axios.delete(`${API_URL}/users/${userToDelete}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      toast({
        title: 'تم حذف العضو',
        description: response.data.message,
        variant: 'success',
      });
      setRefreshTrigger((prev) => prev + 1);
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
    if (userToken) {
      fetchDashboardData();
      fetchSiteSettings();
    }
  }, [userToken, refreshTrigger, fetchDashboardData, fetchSiteSettings]);

  return (
    <div className="w-full space-y-6 pt-6 pb-10 px-4 md:px-8 lg:px-16 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-syria-green-700">
            لوحة تحكم الإدارة
          </h1>
          <p className="text-gray-600 mt-1">
            مرحباً بك في لوحة تحكم المجتمع السوري في أيدن
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            إدارة الأعضاء
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            الفعاليات
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            المحتوى
          </TabsTrigger>
          <TabsTrigger value="elections" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            الانتخابات
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            الأسئلة
          </TabsTrigger>
          <TabsTrigger value="FAQ" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            الإعدادات
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
              <CardTitle>إدارة الأعضاء</CardTitle>
              <CardDescription>عرض وإدارة جميع أعضاء المجتمع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="البحث عن عضو..."
                    className="max-w-sm pl-10"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>

                <div className="border rounded-lg">
                  <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 font-medium text-sm">
                    <div>الاسم</div>
                    <div>رقم الطالب</div>
                    <div>البريد الإلكتروني</div>
                    <div>التخصص</div>
                    <div>تاريخ الانضمام</div>
                    <div>الإجراءات</div>
                  </div>

                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-6 gap-4 p-4 border-t"
                    >
                      <div className="font-medium">{user.name}</div>
                      <div>{user.studentId}</div>
                      <div className="truncate max-w-[150px]" title={user.email}>
                        {user.email}
                      </div>
                      <div>{user.major}</div>
                      <div>{formatDate(user.joined)}</div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => openDeleteModal(user.id, user.name)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الموقع</CardTitle>
              <CardDescription>تخصيص إعدادات المجتمع والموقع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">إعدادات الأمان</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">تفعيل التسجيل الجديد</p>
                        <p className="text-sm text-gray-600">
                          السماح للمستخدمين الجدد بالتسجيل
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={siteSettings.enable_registration}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              enable_registration: e.target.checked,
                            })
                          }
                          id="enable_registration"
                        />
                        <Label htmlFor="enable_registration">مفعل</Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          التحقق من البريد الإلكتروني
                        </p>
                        <p className="text-sm text-gray-600">
                          طلب تأكيد البريد الإلكتروني
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={siteSettings.email_verification}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              email_verification: e.target.checked,
                            })
                          }
                          id="email_verification"
                        />
                        <Label htmlFor="email_verification">مفعل</Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">وضع الصيانة</p>
                        <p className="text-sm text-gray-600">
                          تفعيل وضع الصيانة للموقع
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={siteSettings.maintenance_mode}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              maintenance_mode: e.target.checked,
                            })
                          }
                          id="maintenance_mode"
                        />
                        <Label htmlFor="maintenance_mode">مفعل</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={saveSiteSettings}
                  className="bg-syria-green-500 text-white hover:bg-syria-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">تأكيد الحذف</h2>
            <p className="mb-4">
              هل أنت متأكد أنك تريد حذف العضو{' '}
              <strong>{userToDeleteName}</strong>؟ هذا الإجراء لا يمكن التراجع
              عنه.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeDeleteModal}
              >
                إلغاء
              </Button>
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-700"
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