import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { API_URL } from '@/config';
import axios from 'axios';
import CsrfService from '@/hooks/Csrf';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (!tokenParam || !emailParam) {
      toast({
        title: 'رابط غير صالح',
        description: 'رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية',
        variant: 'warning',
      });
      navigate('/forgot-password');
    } else {
      setToken(tokenParam);
      setEmail(emailParam);
    }
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      toast({
        title: 'خطأ',
        description: 'كلمات المرور غير متطابقة',
        variant: 'warning',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'خطأ',
        description: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        variant: 'warning',
      });
      return;
    }

    setIsLoading(true);

    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        const response = await axios.post(`${API_URL}/reset-password`, {
          token: token,
          email: email,
          password: password,
          password_confirmation: passwordConfirmation,
        }, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        setIsSuccess(true);
        toast({
          title: 'تم بنجاح',
          description: response.data.message || 'تم تغيير كلمة المرور بنجاح',
          variant: 'success',
        });

        // الانتقال إلى صفحة تسجيل الدخول بعد 3 ثواني
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ في إعادة تعيين كلمة المرور';
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'warning',
      });
      
      // إذا كان الرابط منتهي الصلاحية
      if (errorMessage.includes('منتهي') || errorMessage.includes('غير صالح')) {
        setTimeout(() => {
          navigate('/forgot-password');
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="animate-page-enter min-h-screen flex items-center justify-center bg-gradient-to-br from-syria-green-50 to-syria-red-50 p-4">
        <Card className="animate-page-enter w-full max-w-md border-2 border-syria-green-100">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-syria-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-syria-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-syria-green-600">
              تم تغيير كلمة المرور بنجاح
            </CardTitle>
            <CardDescription>
              يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 text-center mb-4">
              سيتم توجيهك إلى صفحة تسجيل الدخول تلقائياً...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-green-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-page-enter min-h-screen flex items-center justify-center bg-gradient-to-br from-syria-green-50 to-syria-red-50 p-4">
      <Card className="animate-page-enter w-full max-w-md border-2 border-syria-green-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-syria-green-600">
            إعادة تعيين كلمة المرور
          </CardTitle>
          <CardDescription className="text-center">
            أدخل كلمة المرور الجديدة لحسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور الجديدة</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="أدخل كلمة المرور الجديدة"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordConfirmation">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="passwordConfirmation"
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full border-2 border-syria-green-600 hover:bg-syria-green-600 hover:text-white transition-colors duration-200"
              disabled={isLoading || !password || !passwordConfirmation}
            >
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري إعادة التعيين...
                </>
              ) : (
                <>
                  <Lock className="ml-2 h-4 w-4" />
                  إعادة تعيين كلمة المرور
                </>
              )}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">أو</span>
              </div>
            </div>
            
            <a href="/auth">
              <Button 
                type="button"
                variant="outline" 
                className="w-full border-2 border-gray-300 hover:border-syria-green-600 transition-colors duration-200"
              >
                العودة إلى تسجيل الدخول
              </Button>
            </a>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;