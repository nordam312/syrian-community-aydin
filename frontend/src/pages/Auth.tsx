import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

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
import { User, Mail, Lock, Phone, GraduationCap, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { API_URL } from '@/config';
import axios from 'axios';
import CsrfService from '@/hooks/Csrf';


const api = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true,
});


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

  // const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  // التحقق من البريد الإلكتروني عند تحميل الصفحة
  // useEffect(() => {
  //   if (token) {
  //     verifyEmail(token);
  //   }
  // }, [token]);

  // جلب البريد الحالي للمستخدمين غير المفعلين
  useEffect(() => {
    if (showVerificationMessage && studentId && !currentEmail && !email.includes('@')) {
      fetchCurrentEmail();
    }
  }, [showVerificationMessage, studentId, currentEmail, email]);

  // const verifyEmail = async (token: string) => {
  //   setIsVerifying(true);
  //   try {
  //     const res = await fetch(`${API_URL}/verify-email/${token}`, {
  //       method: 'GET',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     const data = await res.json();

  //     if (res.ok && data.success) {
  //       setVerificationResult({
  //         success: true,
  //         message: data.message || 'تم تفعيل حسابك بنجاح! يمكنك الآن تسجيل الدخول.'
  //       });
  //       toast({
  //         title: 'تم التفعيل بنجاح!',
  //         description: 'يمكنك الآن تسجيل الدخول إلى حسابك',
  //         variant: 'success',
  //       });
  //     } else {
  //       setVerificationResult({
  //         success: false,
  //         message: data.message || 'رابط التحقق غير صالح أو منتهي الصلاحية'
  //       });
  //       toast({
  //         title: data.already_verified ? 'حسابك مفعل بالفعل' : 'فشل في التفعيل',
  //         description: data.message || 'رابط التحقق غير صالح أو منتهي الصلاحية',
  //         variant: data.already_verified ? 'default' : 'warning',
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Email verification error:', error);
  //     setVerificationResult({
  //       success: false,
  //       message: 'حدث خطأ في الاتصال'
  //     });
  //     toast({
  //       title: 'خطأ في التحقق',
  //       description: 'حدث خطأ أثناء التحقق من البريد الإلكتروني',
  //       variant: 'warning',
  //     });
  //   } finally {
  //     setIsVerifying(false);
  //   }
  // };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await CsrfService.withCsrf(async(csrfToken) => {
        const response = await axios.post(`${API_URL}/register`, {
          name: fullName,
          email,
          password,
          password_confirmation: passwordConfirmation,
          student_id: studentId,
          phone,
          major,
          academic_year: academicYear,
        }, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json'
          }
        });

        if (response.data) {
          toast({
            title: 'تم إنشاء الحساب بنجاح!',
            description: 'يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب',
            variant: 'success',
          });
          setShowVerificationMessage(true);
        }
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء التسجيل';
      toast({
        title: 'خطأ في التسجيل',
        description: errorMessage,
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
      await CsrfService.withCsrf(async(csrfToken) => {
        const response = await axios.post(`${API_URL}/resend-verification`, {
          email: currentEmail || email
        }, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json'
          }
        });

        if (response.data) {
          toast({
            title: 'تم الإرسال',
            description: 'تم إعادة إرسال بريد التحقق بنجاح',
            variant: 'success',
          });
        }
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء إعادة الإرسال';
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'warning',
      });
    } finally {
      setResendLoading(false);
    }
  };

  const fetchCurrentEmail = async () => {
    try {
      await CsrfService.withCsrf(async(csrfToken) => {
        const response = await axios.post(`${API_URL}/get-current-email`, {
          student_id: studentId
        }, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json'
          }
        });

        if (response.data) {
          setCurrentEmail(response.data.current_email);
        }
      });
    } catch (error) {
      console.error('Error fetching current email:', error);
      // إذا فشل، استخدم البريد الحالي المحفوظ
      setCurrentEmail(email);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateEmailLoading(true);
    
    try {
      await CsrfService.withCsrf(async(csrfToken) => {
        const response = await axios.post(`${API_URL}/update-email`, {
          old_email: currentEmail,
          new_email: newEmail
        }, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json'
          }
        });

        if (response.data) {
          toast({
            title: 'تم تحديث البريد الإلكتروني',
            description: response.data.message,
            variant: 'success',
          });
          setEmail(newEmail);
          setCurrentEmail(newEmail);
          setShowEmailUpdate(false);
          setShowVerificationMessage(true);
          setNewEmail('');
        }
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء تحديث البريد الإلكتروني';
      toast({
        title: 'خطأ في التحديث',
        description: errorMessage,
        variant: 'warning',
      });
    } finally {
      setUpdateEmailLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await CsrfService.withCsrf(async(csrfToken)=>{
        const response = await axios.post(`${API_URL}/login`, {
          login: loginEmail,
          password: loginPassword
        }, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json'
          }
        });
        console.log('Login successful:', response.data);
        // استخدام دالة login من Context
        if (response.data.user) {
          login(response.data.user);
        }
        navigate("/");
      })
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
            <TabsContent className="animate-fade-in" value="signup">
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