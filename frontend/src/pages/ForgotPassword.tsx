import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { API_URL } from '@/config';
import axios from 'axios';
import CsrfService from '@/hooks/Csrf';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        const response = await axios.post(`${API_URL}/forgot-password`, {
          email: email,
        }, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        setIsSubmitted(true);
        toast({
          title: 'تم الإرسال بنجاح',
          description: response.data.message || 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني',
          variant: 'success',
        });
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ في إرسال رابط الاستعادة';
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'warning',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="animate-page-enter min-h-screen flex items-center justify-center bg-gradient-to-br from-syria-green-50 to-syria-red-50 p-4">
        <Card className="animate-page-enter w-full max-w-md border-2 border-syria-green-100">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-syria-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-syria-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-syria-green-600">
              تحقق من بريدك الإلكتروني
            </CardTitle>
            <CardDescription className="text-base mt-2">
              لقد أرسلنا رابط استعادة كلمة المرور إلى
              <br />
              <span className="font-semibold text-syria-green-700">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              يرجى التحقق من صندوق البريد الوارد (وربما مجلد البريد العشوائي) واتباع التعليمات لإعادة تعيين كلمة المرور.
            </p>
            <div className="text-center">
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-syria-green-600 hover:bg-syria-green-600 hover:text-white transition-colors duration-200"
                >
                  <ArrowLeft className="ml-2 h-4 w-4" />
                  العودة إلى تسجيل الدخول
                </Button>
              </Link>
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
            استعادة كلمة المرور
          </CardTitle>
          <CardDescription className="text-center">
            أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10 placeholder:text-gray-400"
                  dir="ltr"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full border-2 border-syria-green-600 hover:bg-syria-green-600 hover:text-white transition-colors duration-200"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  إرسال رابط الاستعادة
                  <Mail className="mr-2 h-4 w-4" />
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

            <Link to="/auth">
              <Button 
                type="button"
                variant="outline" 
                className="w-full border-2 border-gray-300 hover:border-syria-green-600 transition-colors duration-200"
              >
                <ArrowLeft className="ml-2 h-4 w-4" />
                العودة إلى تسجيل الدخول
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;