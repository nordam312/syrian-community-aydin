# نشر المشروع - إعدادات الخادم

## إعداد المهام المجدولة (Cron Jobs)

لضمان تنظيف التوكنات القديمة تلقائياً، يجب إضافة المهمة التالية إلى crontab في الخادم:

```bash
# تشغيل مهام لارافيل المجدولة كل دقيقة
* * * * * cd /path/to/your/project/backend && php artisan schedule:run >> /dev/null 2>&1
```

### خطوات الإعداد:

1. افتح crontab:
```bash
crontab -e
```

2. أضف السطر أعلاه مع تعديل المسار ليطابق مسار مشروعك

3. احفظ واخرج

### التحقق من عمل المهام:

```bash
# عرض المهام المجدولة
php artisan schedule:list

# تشغيل يدوي لتنظيف التوكنات
php artisan tokens:clean
```

## إعداد Gmail للإرسال الحقيقي

### خطوات إعداد Gmail SMTP:

1. **تفعيل 2-Step Verification في حسابك على Gmail:**
   - اذهب إلى [myaccount.google.com](https://myaccount.google.com)
   - اختر "Security" → "2-Step Verification"
   - اتبع الخطوات لتفعيل المصادقة الثنائية

2. **إنشاء App Password:**
   - في نفس صفحة الحماية، اختر "App passwords"
   - اختر "Mail" كنوع التطبيق
   - انسخ كلمة المرور التي ستظهر (16 رقم)

3. **تحديث ملف .env:**
```env
# Gmail SMTP Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_16_digit_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@your-domain.com"
MAIL_FROM_NAME="المجتمع السوري في أيدن"
FRONTEND_URL=http://localhost:8080
```

### لاختبار النظام:
```bash
php artisan tinker
Mail::raw('Test email', function($msg) { $msg->to('test@example.com')->subject('Test'); });
```

## أمان التوكنات

المشروع يطبق الآن:
- ✅ حد أقصى 3 أجهزة لكل مستخدم
- ✅ حذف التوكنات القديمة عند تسجيل الدخول
- ✅ تنظيف تلقائي يومي للتوكنات المنتهية الصلاحية (الساعة 2:00 صباحاً)
- ✅ حذف التوكنات غير المستخدمة لأكثر من 30 يوم
- ✅ حذف التوكنات القديمة جداً (أكثر من 90 يوم)

## إعداد التحقق من البريد الإلكتروني

المشروع يدعم الآن:
- ✅ إرسال بريد تفعيل عند التسجيل
- ✅ رابط التفعيل يعمل مع الفرونت إند (http://localhost:8080/verify-email/token)
- ✅ إعادة إرسال بريد التفعيل
- ✅ واجهة مستخدم جميلة للتحقق
- ✅ التحقق من صحة التوكن