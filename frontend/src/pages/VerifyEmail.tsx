import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { API_URL } from '@/config';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await axios.get(`${API_URL}/verify-email/${token}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setStatus('success');
        setMessage(response.data.message || 'تم تفعيل حسابك بنجاح!');
        
        // الانتقال إلى صفحة تسجيل الدخول بعد 3 ثواني
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(response.data.message || 'حدث خطأ في التفعيل');
      }
    } catch (error) {
      setStatus('error');
      const errorMessage = error.response?.data?.message || 'رابط التحقق غير صالح أو منتهي الصلاحية';
      setMessage(errorMessage);
      
      // إذا كان الحساب مفعل بالفعل
      if (error.response?.data?.already_verified) {
        setMessage('حسابك مفعل بالفعل. يمكنك تسجيل الدخول مباشرة.');
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      }
    }
  };

  return (
    <div className="animate-page-enter min-h-screen flex items-center justify-center bg-gradient-to-br from-syria-green-50 to-syria-red-50 p-4">
      <Card className="animate-page-enter w-full max-w-md border-2 border-syria-green-100">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-syria-green-100 rounded-full flex items-center justify-center mb-4">
            {status === 'loading' && <Loader2 className="h-8 w-8 text-syria-green-600 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-8 w-8 text-syria-green-600" />}
            {status === 'error' && <XCircle className="h-8 w-8 text-red-600" />}
          </div>
          
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'جاري التحقق...'}
            {status === 'success' && 'تم التفعيل بنجاح!'}
            {status === 'error' && 'فشل التفعيل'}
          </CardTitle>
          
          <CardDescription className="text-base mt-2">
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {status === 'loading' && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                جاري التحقق من رابط التفعيل...
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-green-600"></div>
              </div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                سيتم توجيهك إلى صفحة تسجيل الدخول تلقائياً...
              </p>
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-green-600"></div>
              </div>
              <Button
                onClick={() => navigate('/auth')}
                className="w-full border-2 border-syria-green-600 hover:bg-syria-green-600 hover:text-white transition-colors duration-200"
              >
                تسجيل الدخول الآن
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center space-y-4">
              <Button
                onClick={() => navigate('/auth')}
                className="w-full border-2 border-syria-green-600 hover:bg-syria-green-600 hover:text-white transition-colors duration-200"
              >
                العودة إلى تسجيل الدخول
              </Button>
              
              <p className="text-xs text-gray-500">
                إذا كنت تواجه مشاكل، يمكنك طلب رابط تفعيل جديد من صفحة تسجيل الدخول
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;