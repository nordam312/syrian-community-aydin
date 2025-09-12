import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Trash2,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';
import axios from 'axios';
import { API_URL } from '@/config';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EmailService {
  sent: number;
  success: number;
  failed: number;
  limit: number;
  remaining: number;
  percentage: number;
  hourly?: Record<string, number>;
}

interface WeekMonthStat {
  service: string;
  total: number;
  success: number;
  failed: number;
}

interface ChartData {
  date: string;
  services: {
    brevo?: {
      sent: number;
      success: number;
      failed: number;
    };
    resend?: {
      sent: number;
      success: number;
      failed: number;
    };
    hostinger?: {
      sent: number;
      success: number;
      failed: number;
    };
  };
}

interface EmailLog {
  id: number;
  service: string;
  to_email: string;
  type: string;
  status: 'sent' | 'failed' | 'pending';
  error_message?: string;
  created_at: string;
}

interface EmailStats {
  today: {
    brevo: EmailService;
    resend: EmailService;
    hostinger: EmailService;
    total: {
      sent: number;
      limit: number;
      remaining: number;
    };
  };
  week: WeekMonthStat[];
  month: WeekMonthStat[];
  chart: ChartData[];
  recent_emails: EmailLog[];
  services_status: {
    brevo: ServiceStatus;
    resend: ServiceStatus;
    hostinger: ServiceStatus;
  };
}

interface ServiceStatus {
  enabled: boolean;
  today_usage: number;
  limit: number;
  status: 'active' | 'warning' | 'exhausted' | 'idle' | 'inactive';
}

const EmailStats: React.FC = () => {
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchEmailStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/email-stats`, {
        withCredentials: true
      });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching email stats:', error);
      toast({
        title: 'خطأ',
        description: 'فشل جلب إحصائيات الإيميلات',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailStats();
    const interval = setInterval(fetchEmailStats, 30000); // تحديث كل 30 ثانية
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEmailStats();
    setRefreshing(false);
    toast({
      title: 'تم التحديث',
      description: 'تم تحديث الإحصائيات بنجاح',
      variant: 'success'
    });
  };

  const handleResendEmail = async (emailLogId: number) => {
    try {
      await axios.post(`${API_URL}/admin/resend-email`, {
        email_log_id: emailLogId
      }, {
        withCredentials: true
      });
      
      toast({
        title: 'تم الإرسال',
        description: 'تم إعادة إرسال الإيميل بنجاح',
        variant: 'success'
      });
      
      fetchEmailStats();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل إعادة إرسال الإيميل',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'exhausted': return 'text-red-600';
      case 'idle': return 'text-gray-400';
      default: return 'text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5" />;
      case 'warning': return <AlertCircle className="h-5 w-5" />;
      case 'exhausted': return <XCircle className="h-5 w-5" />;
      case 'idle': return <Clock className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-syria-green-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          لا توجد بيانات متاحة
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة الإيميلات الذكية</h2>
          <p className="text-sm text-gray-500 mt-1">
            نظام التبديل التلقائي بين 3 خدمات (Brevo, Resend, Hostinger)
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="border-2 border-syria-green-600"
        >
          <RefreshCw className={`h-4 w-4 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {/* إحصائيات اليوم */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* المجموع */}
        <Card className="border-2 border-syria-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-syria-green-600" />
              المجموع اليومي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-syria-green-600">
              {stats.today.total.sent} / {stats.today.total.limit}
            </div>
            <Progress 
              value={(stats.today.total.sent / stats.today.total.limit) * 100} 
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-2">
              متبقي: {stats.today.total.remaining} رسالة
            </p>
          </CardContent>
        </Card>

        {/* Brevo */}
        <Card className={`border-2 ${stats.services_status.brevo.enabled ? 'border-blue-100' : 'border-gray-100'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Brevo</span>
              <span className={getStatusColor(stats.services_status.brevo.status)}>
                {getStatusIcon(stats.services_status.brevo.status)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.today.brevo?.sent || 0} / {stats.today.brevo?.limit || 300}
            </div>
            <Progress 
              value={stats.today.brevo?.percentage || 0} 
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>✓ {stats.today.brevo?.success || 0}</span>
              <span>✗ {stats.today.brevo?.failed || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Resend */}
        <Card className={`border-2 ${stats.services_status.resend.enabled ? 'border-purple-100' : 'border-gray-100'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Resend</span>
              <span className={getStatusColor(stats.services_status.resend.status)}>
                {getStatusIcon(stats.services_status.resend.status)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.today.resend?.sent || 0} / {stats.today.resend?.limit || 100}
            </div>
            <Progress 
              value={stats.today.resend?.percentage || 0} 
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>✓ {stats.today.resend?.success || 0}</span>
              <span>✗ {stats.today.resend?.failed || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Hostinger */}
        <Card className={`border-2 ${stats.services_status.hostinger.enabled ? 'border-orange-100' : 'border-gray-100'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Hostinger</span>
              <span className={getStatusColor(stats.services_status.hostinger.status)}>
                {getStatusIcon(stats.services_status.hostinger.status)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.today.hostinger?.sent || 0} / {stats.today.hostinger?.limit || 100}
            </div>
            <Progress 
              value={stats.today.hostinger?.percentage || 0} 
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>✓ {stats.today.hostinger?.success || 0}</span>
              <span>✗ {stats.today.hostinger?.failed || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs للتفاصيل */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">آخر الإيميلات</TabsTrigger>
          <TabsTrigger value="chart">الرسم البياني</TabsTrigger>
          <TabsTrigger value="hourly">توزيع الساعات</TabsTrigger>
        </TabsList>

        {/* آخر الإيميلات */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>آخر 20 إيميل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {stats.recent_emails.map((email: EmailLog) => (
                  <div 
                    key={email.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      email.status === 'sent' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {email.status === 'sent' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">{email.to_email}</p>
                        <p className="text-sm text-gray-500">
                          {email.type} • {email.service} • {new Date(email.created_at).toLocaleString('ar-SA')}
                        </p>
                      </div>
                    </div>
                    {email.status === 'failed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleResendEmail(email.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* الرسم البياني */}
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات الأسبوع</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.chart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="services.brevo.sent" 
                    stroke="#3B82F6" 
                    name="Brevo"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="services.resend.sent" 
                    stroke="#8B5CF6" 
                    name="Resend"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="services.hostinger.sent" 
                    stroke="#F97316" 
                    name="Hostinger"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* توزيع الساعات */}
        <TabsContent value="hourly">
          <Card>
            <CardHeader>
              <CardTitle>التوزيع حسب الساعة (اليوم)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {['brevo', 'resend', 'hostinger'].map(service => (
                  <div key={service}>
                    <h4 className="font-medium mb-2 capitalize">{service}</h4>
                    <div className="space-y-1">
                      {Object.entries((stats.today[service as keyof typeof stats.today] as EmailService)?.hourly || {}).map(([hour, count]) => (
                        <div key={hour} className="flex justify-between text-sm">
                          <span className="text-gray-500">{hour}:00</span>
                          <span className="font-medium">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* تنبيهات */}
      {stats.today.total.remaining < 50 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            تنبيه: متبقي أقل من 50 رسالة لليوم. قد تحتاج لتفعيل خدمات إضافية.
          </AlertDescription>
        </Alert>
      )}

      {Object.values(stats.services_status).filter(s => s.status === 'exhausted').length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            بعض الخدمات وصلت للحد الأقصى اليومي. النظام سيستخدم الخدمات المتبقية تلقائياً.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EmailStats;