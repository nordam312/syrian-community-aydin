import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Lock, Phone, GraduationCap } from 'lucide-react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [major, setMajor] = useState('');
  const [academicYear, setAcademicYear] = useState('');

  // متغيرات منفصلة لتسجيل الدخول
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // جهز بيانات التسجيل لتتوافق مع الـ API
    const payload = {
      name: fullName,
      email,
      password,
      password_confirmation: passwordConfirmation,
      student_id: studentId,
      phone,
      major,
      academic_year: academicYear,
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        // خطأ من السيرفر
        toast({
          title: 'خطأ في التسجيل',
          description: data.message || 'حدث خطأ أثناء التسجيل',
          variant: 'warning',
        });
      } else {
        toast({
          title: 'تم التسجيل بنجاح!',
          description: 'مرحباً بك في المجتمع السوري في أيدن!',
          variant: 'success',
        });
        login(data.user, data.token);
        // بعد التسجيل الناجح، توجيه المستخدم للصفحة الرئيسية
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ غير متوقع',
        variant: 'warning',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // جهز بيانات تسجيل الدخول لتتوافق مع الـ API
    const payload = {
      login: loginEmail, // يمكن أن يكون بريد إلكتروني أو رقم طالب
      password: loginPassword,
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        // خطأ من السيرفر
        toast({
          title: 'خطأ في تسجيل الدخول',
          description: data.message || 'بيانات غير صحيحة',
          variant: 'warning',
        });
      } else {
        // نجح تسجيل الدخول
        toast({
          title: 'تم تسجيل الدخول بنجاح!',
          description: data.message,
          variant: 'success',
        });
        // حفظ بيانات المستخدم والتوكن في sessionStorage
        sessionStorage.setItem('userToken', data.token);
        sessionStorage.setItem('userData', JSON.stringify(data.user));
        // حفظ بيانات المستخدم والتوكن باستخدام hook المصادقة
        login(data.user, data.token);
        // توجيه المستخدم للصفحة الرئيسية
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ غير متوقع',
        variant: 'warning',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-syria-green-50 to-syria-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-syria-green-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-syria-green-600">
            المجتمع السوري في أيدن
          </CardTitle>
          <CardDescription>
            انضم إلى مجتمعنا واستفد من الخدمات المتاحة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signup" className="w-full ">
            <TabsList className="grid w-full grid-cols-2 ">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:border-b-2 data-[state=active]:border-syria-green-600 data-[state=active]:text-syria-green-600"
              >
                تسجيل الدخول
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:border-b-2 data-[state=active]:border-syria-green-600 data-[state=active]:text-syria-green-600"
              >
                إنشاء حساب
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 ">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail">
                    البريد الإلكتروني أو رقم الطالب
                  </Label>
                  <Input
                    id="loginEmail"
                    type="text"
                    placeholder="أدخل بريدك الإلكتروني أو رقم الطالب"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginPassword">كلمة المرور</Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="placeholder:text-gray-400"
                    minLength={6}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full border-2 border-syria-green-600 hover:bg-syria-green-600 hover:text-white transition-colors duration-200"
                >
                  {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">الاسم الكامل</Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">رقم الطالب</Label>
                  <Input
                    id="studentId"
                    type="text"
                    placeholder="b2180.060001"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="placeholder:text-gray-400"
                    minLength={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordConfirmation">
                    تأكيد كلمة المرور
                  </Label>
                  <Input
                    id="passwordConfirmation"
                    type="password"
                    placeholder="أدخل تأكيد كلمة المرور"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="placeholder:text-gray-400"
                    minLength={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major">التخصص (اختياري)</Label>
                  <Input
                    id="major"
                    type="text"
                    placeholder="التخصص الدراسي"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicYear">السنة الدراسية (اختياري)</Label>
                  <Input
                    id="academicYear"
                    type="number"
                    placeholder="السنة الدراسية"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="placeholder:text-gray-400"
                    min={1}
                    max={6}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full border-2 border-syria-green-600 hover:bg-syria-green-600 hover:text-white transition-colors duration-200"
                >
                  {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
