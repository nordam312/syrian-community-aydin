import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/config';
import { useAuth } from '@/contexts/AuthContext';

interface MaintenanceCheckerProps {
  children: React.ReactNode;
}

const MaintenanceChecker = ({ children }: MaintenanceCheckerProps) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        // جلب إعدادات الموقع
        const response = await axios.get(`${API_URL}/settings/public`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
          },
        });

        setIsMaintenanceMode(response.data.maintenance_mode || false);
        setMaintenanceMessage(response.data.maintenance_message || 'الموقع في وضع الصيانة حالياً. يرجى المحاولة لاحقاً.');
      } catch (error) {
        console.error('خطأ في التحقق من وضع الصيانة:', error);
      } finally {
        setLoading(false);
      }
    };

    checkMaintenanceMode();
    
    // فحص دوري كل 30 ثانية
    const interval = setInterval(checkMaintenanceMode, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-syria-green-600 to-syria-green-800">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>جاري تحميل الموقع...</p>
        </div>
      </div>
    );
  }

  // إذا كان المستخدم مدير، يمكنه الوصول حتى في وضع الصيانة
  if (isMaintenanceMode && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-syria-green-600 to-syria-green-800">
        <div className="text-center text-white max-w-md mx-auto p-8">
          <div className="text-8xl mb-6 animate-pulse">🔧</div>
          <h1 className="text-3xl font-bold mb-4">الموقع في وضع الصيانة</h1>
          <p className="text-lg mb-6 opacity-90 leading-relaxed">
            {maintenanceMessage}
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
            <p className="text-sm opacity-75">
              نحن نعمل على تحسين الموقع لتوفير تجربة أفضل لك.<br/>
              سيتم إعادة تحميل الصفحة تلقائياً عند انتهاء الصيانة.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 border border-white/30"
            >
              إعادة المحاولة
            </button>
            
            <div className="text-sm opacity-60">
              للاستفسارات الطارئة، يمكنكم التواصل معنا عبر وسائل التواصل الاجتماعي
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MaintenanceChecker;