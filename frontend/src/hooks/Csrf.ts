// src/utils/csrf.ts
import axios from 'axios';
import { BASE_URL } from '@/config';

/**
 * خدمة للتعامل مع CSRF protection في Laravel Sanctum
 */
const CsrfService = {
  /**
   * يحصل على CSRF cookie من الخادم
   */
  async getCookie(): Promise<void> {
    try {
      await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Failed to get CSRF cookie:', error);
      throw new Error('تعذر الحصول على CSRF cookie');
    }
  },

  /**
   * يستخرج CSRF token من cookies المتاحة
   */
  getCsrfToken(): string | null {
    try {
      const cookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='));

      if (cookie) {
        const token = cookie.split('=')[1];
        return decodeURIComponent(token); // ✅ فك تشفير URL
      }
      return null;
    } catch (error) {
      console.error('Error extracting CSRF token:', error);
      return null;
    }
  },

  /**
   * يحصل على CSRF token مع ضمان وجود cookie صالحة
   */
  async ensureCsrfToken(forceRefresh: boolean = false): Promise<string> {
    // إذا كان forceRefresh أو لا يوجد token، احصل على cookie جديدة
    let token = this.getCsrfToken();
    
    if (!token || forceRefresh) {
      await this.getCookie();
      token = this.getCsrfToken();
    }

    if (!token) {
      throw new Error('تعذر الحصول على CSRF token');
    }

    return token;
  },

  /**
   * تنفيذ طلب مع CSRF protection مضمونة
   */
  // src/utils/csrf.ts
  async withCsrf<T>(request: (csrfToken: string) => Promise<T>): Promise<T> {
    try {
      // احصل على CSRF token
      const csrfToken = await this.ensureCsrfToken();

      // مرر التوكن للدالة لاستخدامه
      return await request(csrfToken);
    } catch (error) {
      // إذا كان الخطأ 419 (CSRF token mismatch)، احصل على token جديد وأعد المحاولة
      if (axios.isAxiosError(error) && error.response?.status === 419) {
        console.log('CSRF token expired, refreshing...');
        const csrfToken = await this.ensureCsrfToken(true); // force refresh
        return await request(csrfToken);
      }
      throw error;
    }
  },
};

export default CsrfService;
