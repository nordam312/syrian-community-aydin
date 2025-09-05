import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { User, Mail, Lock, Phone, GraduationCap, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { API_URL } from '@/config';



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
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showEmailUpdate, setShowEmailUpdate] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [updateEmailLoading, setUpdateEmailLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');

  // متغيرات منفصلة لتسجيل الدخول
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // متغيرات للتحقق من البريد الإلكتروني
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  // التحقق من البريد الإلكتروني عند تحميل الصفحة
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  // جلب البريد الحالي للمستخدمين غير المفعلين
  useEffect(() => {
    if (showVerificationMessage && studentId && !currentEmail && !email.includes('@')) {
      fetchCurrentEmail();
    }
  }, [showVerificationMessage, studentId, currentEmail, email]);

  const verifyEmail = async (token: string) => {
    setIsVerifying(true);
    try {
      const res = await fetch(`${API_URL}/verify-email/${token}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setVerificationResult({
          success: true,
          message: data.message || 'تم تفعيل حسابك بنجاح! يمكنك الآن تسجيل الدخول.'
        });
        toast({
          title: 'تم التفعيل بنجاح!',
          description: 'يمكنك الآن تسجيل الدخول إلى حسابك',
          variant: 'success',
        });
      } else {
        setVerificationResult({
          success: false,
          message: data.message || 'رابط التحقق غير صالح أو منتهي الصلاحية'
        });
        toast({
          title: data.already_verified ? 'حسابك مفعل بالفعل' : 'فشل في التفعيل',
          description: data.message || 'رابط التحقق غير صالح أو منتهي الصلاحية',
          variant: data.already_verified ? 'default' : 'warning',
        });
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setVerificationResult({
        success: false,
        message: 'حدث خطأ في الاتصال'
      });
      toast({
        title: 'خطأ في التحقق',
        description: 'حدث خطأ أثناء التحقق من البريد الإلكتروني',
        variant: 'warning',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toast({
          title: 'خطأ في التسجيل',
          description: data.message || 'حدث خطأ أثناء التسجيل',
          variant: 'warning',
        });
      } else {
        toast({
          title: 'تم إنشاء الحساب بنجاح!',
          description: 'يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب',
          variant: 'success',
        });
        setShowVerificationMessage(true);
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

  const handleResendVerification = async () => {
    setResendLoading(true);
    
    // جلب البريد الحالي أولاً
    if (studentId && !currentEmail) {
      await fetchCurrentEmail();
    }
    
    try {
      const res = await fetch(`${API_URL}/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: currentEmail || email }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast({
          title: 'خطأ',
          description: data.message || 'حدث خطأ أثناء إعادة الإرسال',
          variant: 'warning',
        });
      } else {
        toast({
          title: 'تم الإرسال',
          description: 'تم إعادة إرسال بريد التحقق بنجاح',
          variant: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ غير متوقع',
        variant: 'warning',
      });
    } finally {
      setResendLoading(false);
    }
  };

  const fetchCurrentEmail = async () => {
    try {
      const res = await fetch(`${API_URL}/get-current-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ student_id: studentId }),
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentEmail(data.current_email);
      } else {
        // إذا فشل، استخدم البريد الحالي المحفوظ
        setCurrentEmail(email);
      }
    } catch (error) {
      console.error('Error fetching current email:', error);
      setCurrentEmail(email);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateEmailLoading(true);
    try {
      const res = await fetch(`${API_URL}/update-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ 
          old_email: currentEmail, 
          new_email: newEmail 
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast({
          title: 'خطأ في التحديث',
          description: data.message || 'حدث خطأ أثناء تحديث البريد الإلكتروني',
          variant: 'warning',
        });
      } else {
        toast({
          title: 'تم تحديث البريد الإلكتروني',
          description: data.message,
          variant: 'success',
        });
        setEmail(newEmail);
        setCurrentEmail(newEmail);
        setShowEmailUpdate(false);
        setShowVerificationMessage(true);
        setNewEmail('');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ غير متوقع',
        variant: 'warning',
      });
    } finally {
      setUpdateEmailLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      login: loginEmail,
      password: loginPassword,
    };

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        // إذا كان الخطأ بسبب عدم تفعيل البريد
        if (data.message && data.message.includes('غير مفعل')) {
          // إذا المستخدم دخل رقم الطالب
          if (!loginEmail.includes('@')) {
            setStudentId(loginEmail);
          } else {
            setEmail(loginEmail);
          }
          setShowVerificationMessage(true);
          toast({
            title: 'حسابك غير مفعل',
            description: data.message,
            variant: 'warning',
          });
        } else {
          toast({
            title: 'خطأ في تسجيل الدخول',
            description: data.message || 'بيانات غير صحيحة',
            variant: 'warning',
          });
        }
      } else {
        toast({
          title: 'تم تسجيل الدخول بنجاح!',
          description: data.message,
          variant: 'success',
        });
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        login(data.user, data.token);
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

  // عرض شاشة التحقق من البريد الإلكتروني
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-syria-green-50 to-syria-red-50 flex items-center justify-center p-4">
        <Card className="animate-fade-in w-full max-w-md border-2 border-syria-green-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-syria-green-600">
              جارٍ التحقق...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-syria-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">يرجى الانتظار أثناء التحقق من بريدك الإلكتروني</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // عرض نتيجة التحقق
  if (verificationResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-syria-green-50 to-syria-red-50 flex items-center justify-center p-4">
        <Card className="animate-fade-in w-full max-w-md border-2 border-syria-green-100">
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl font-bold ${verificationResult.success ? 'text-syria-green-600' : 'text-red-600'}`}>
              {verificationResult.success ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-8 w-8" />
                  تم التفعيل بنجاح!
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="h-8 w-8" />
                  فشل في التفعيل
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              {verificationResult.message}
            </p>
            <div className="flex flex-col space-y-2">
              {verificationResult.success ? (
                <Button 
                  onClick={() => {
                    setVerificationResult(null);
                    // إعادة توجيه إلى تسجيل الدخول
                    navigate('/auth?tab=login');
                  }}
                  className="border-2 border-syria-green-600 hover:bg-syria-green-600 hover:text-white"
                >
                  تسجيل الدخول
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => {
                      setVerificationResult(null);
                      setShowVerificationMessage(true);
                    }}
                    variant="outline"
                    className="border-syria-green-600 text-syria-green-600 hover:bg-syria-green-50"
                  >
                    طلب رابط تفعيل جديد
                  </Button>
                  
                  <Button 
                    onClick={async () => {
                      setVerificationResult(null);
                      await fetchCurrentEmail();
                      setShowEmailUpdate(true);
                    }}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    تعديل البريد الإلكتروني
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setVerificationResult(null);
                      navigate('/auth');
                    }}
                    variant="ghost"
                  >
                    العودة للتسجيل
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // عرض نموذج تحديث البريد الإلكتروني
  if (showEmailUpdate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-syria-green-50 to-syria-red-50 flex items-center justify-center p-4">
        <Card className="animate-fade-in w-full max-w-md border-2 border-syria-green-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-syria-green-600">
              تعديل البريد الإلكتروني
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentEmail">البريد الحالي</Label>
                <Input
                  id="currentEmail"
                  type="email"
                  value={currentEmail || email}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newEmail">البريد الجديد</Label>
                <Input
                  id="newEmail"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني الصحيح"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Button
                  type="submit"
                  disabled={updateEmailLoading || !newEmail}
                  className="border-2 border-syria-green-600 hover:bg-syria-green-600 hover:text-white"
                >
                  {updateEmailLoading ? 'جاري التحديث...' : 'تحديث البريد الإلكتروني'}
                </Button>
                
                <Button
                  type="button"
                  onClick={() => setShowEmailUpdate(false)}
                  variant="ghost"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showVerificationMessage) {
    return (
      <div className="  min-h-screen bg-gradient-to-br from-syria-green-50 to-syria-red-50 flex items-center justify-center p-4">
        <Card className=" animate-fade-in w-full max-w-md border-2 border-syria-green-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-syria-green-600">
              تفعيل الحساب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">
              تم إرسال رابط التفعيل إلى بريدك الإلكتروني: <strong>{currentEmail || email}</strong>
            </p>
            <p className="text-center text-sm text-gray-600">
              يرجى النقر على الرابط في البريد الإلكتروني لتفعيل حسابك.
            </p>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={handleResendVerification}
                disabled={resendLoading}
                variant="outline"
                className="border-syria-green-600 text-syria-green-600 hover:bg-syria-green-50"
              >
                {resendLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                إعادة إرسال بريد التفعيل
              </Button>
              
              <Button 
                onClick={async () => {
                  setShowVerificationMessage(false);
                  await fetchCurrentEmail();
                  setShowEmailUpdate(true);
                }}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                تعديل البريد الإلكتروني
              </Button>
              
              <Button 
                onClick={() => setShowVerificationMessage(false)}
                variant="ghost"
              >
                العودة إلى التسجيل
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-gradient-to-br from-syria-green-50 to-syria-red-50 flex items-center justify-center p-4">
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
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
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

            <TabsContent className="animate-fade-in" value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
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
            <TabsContent className="animate-fade-in"  value="signup">
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