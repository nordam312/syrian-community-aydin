# API Documentation - المجتمع السوري في أيدن

## نظرة عامة

هذا التوثيق يغطي جميع الـ APIs المتاحة في نظام إدارة المجتمع السوري في أيدن.

## Base URL

```
http://127.0.0.1:8000/api
```

## المصادقة

يستخدم النظام Laravel Sanctum للمصادقة. يجب إرسال التوكن في header:

```
Authorization: Bearer {token}
```

## Endpoints

### 1. المصادقة (Authentication)

#### تسجيل مستخدم جديد

```http
POST /register
Content-Type: application/json

{
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "student_id": "b2180.060001",
    "phone": "+90 555 123 4567",
    "major": "علوم حاسوب",
    "academic_year": "2"
}
```

#### تسجيل الدخول

```http
POST /login
Content-Type: application/json

{
    "login": "ahmed@example.com", // أو رقم الطالب
    "password": "password123"
}
```

#### تسجيل الخروج

```http
POST /logout
Authorization: Bearer {token}
```

#### معلومات المستخدم

```http
GET /user
Authorization: Bearer {token}
```

### 2. إدارة الأعضاء (Users Management) - Admin Only

#### عرض جميع الأعضاء

```http
GET /users?search=ahmed&major=علوم حاسوب&page=1
Authorization: Bearer {admin_token}
```

#### إضافة عضو جديد

```http
POST /users
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "name": "فاطمة علي",
    "email": "fatima@example.com",
    "password": "password123",
    "student_id": "b2180.060002",
    "major": "هندسة مدنية",
    "academic_year": "3",
    "role": "user"
}
```

#### تحديث بيانات العضو

```http
PUT /users/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "name": "فاطمة علي محمد",
    "major": "هندسة معمارية"
}
```

#### حذف العضو

```http
DELETE /users/{id}
Authorization: Bearer {admin_token}
```

#### إحصائيات الأعضاء

```http
GET /users/stats
Authorization: Bearer {admin_token}
```

### 3. إدارة الفعاليات (Events Management) - Admin Only

#### عرض جميع الفعاليات

```http
GET /events?status=active&date_from=2024-01-01
Authorization: Bearer {admin_token}
```

#### إنشاء فعالية جديدة

```http
POST /events
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "title": "لقاء تعريفي",
    "description": "لقاء تعريفي للطلاب الجدد",
    "date": "2024-01-20 14:00:00",
    "location": "قاعة المؤتمرات",
    "max_attendees": 50,
    "status": "active"
}
```

#### تحديث الفعالية

```http
PUT /events/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "title": "لقاء تعريفي محدث",
    "max_attendees": 60
}
```

#### حذف الفعالية

```http
DELETE /events/{id}
Authorization: Bearer {admin_token}
```

#### إضافة مشارك للفعالية

```http
POST /events/{id}/attendees
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "user_id": 1,
    "status": "confirmed",
    "notes": "مشارك نشط"
}
```

#### إلغاء مشاركة المستخدم

```http
DELETE /events/{id}/attendees
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "user_id": 1
}
```

### 4. إدارة المحتوى (Content Management) - Admin Only

#### عرض المحتوى

```http
GET /content
Authorization: Bearer {admin_token}
```

#### تحديث المحتوى

```http
PUT /content
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "home_title": "المجتمع السوري في أيدن",
    "home_description": "وصف المجتمع...",
    "about_title": "من نحن",
    "about_content": "محتوى صفحة من نحن...",
    "contact_email": "info@example.com",
    "contact_phone": "+90 555 123 4567",
    "contact_address": "أيدن، تركيا"
}
```

#### تحديث محتوى الصفحة الرئيسية

```http
PUT /content/home
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "home_title": "عنوان جديد",
    "home_description": "وصف جديد"
}
```

### 5. لوحة التحكم (Dashboard) - Admin Only

#### إحصائيات عامة

```http
GET /dashboard/stats
Authorization: Bearer {admin_token}
```

#### إحصائيات المستخدمين

```http
GET /dashboard/user-stats
Authorization: Bearer {admin_token}
```

#### إحصائيات الفعاليات

```http
GET /dashboard/event-stats
Authorization: Bearer {admin_token}
```

### 6. إدارة الإعدادات (Settings) - Admin Only

#### عرض جميع الإعدادات

```http
GET /settings
Authorization: Bearer {admin_token}
```

#### تحديث الإعدادات

```http
PUT /settings
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "settings": [
        {
            "key": "site_name",
            "value": "المجتمع السوري في أيدن",
            "type": "string",
            "group": "site"
        },
        {
            "key": "enable_registration",
            "value": "true",
            "type": "boolean",
            "group": "security"
        }
    ]
}
```

#### إعدادات الموقع

```http
GET /settings/site
Authorization: Bearer {admin_token}
```

#### تحديث إعدادات الموقع

```http
PUT /settings/site
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "site_name": "المجتمع السوري في أيدن",
    "enable_registration": true,
    "email_verification": false,
    "maintenance_mode": false
}
```

### 7. APIs عامة (لا تحتاج مصادقة)

#### محتوى الموقع العام

```http
GET /content/public
```

#### إعدادات الموقع العامة

```http
GET /settings/public
```

## رموز الاستجابة

-   `200` - نجح الطلب
-   `201` - تم الإنشاء بنجاح
-   `400` - خطأ في البيانات المرسلة
-   `401` - غير مصرح (يحتاج تسجيل دخول)
-   `403` - ممنوع (يحتاج صلاحيات admin)
-   `404` - غير موجود
-   `422` - خطأ في التحقق من البيانات
-   `500` - خطأ في الخادم

## أمثلة الاستجابة

### نجح تسجيل الدخول

```json
{
    "user": {
        "id": 1,
        "name": "أحمد محمد",
        "email": "ahmed@example.com",
        "student_id": "b2180.060001",
        "role": "user"
    },
    "token": "1|abc123...",
    "message": "تم الدخول بنجاح"
}
```

### إحصائيات الداشبورد

```json
{
    "total_users": 156,
    "new_users_this_month": 23,
    "total_events": 8,
    "upcoming_events": 3,
    "total_posts": 45,
    "pending_requests": 5,
    "recent_users": [...],
    "upcoming_events_list": [...]
}
```

## ملاحظات مهمة

1. جميع الـ APIs تحتاج مصادقة ما عدا `/register`, `/login`, `/content/public`, `/settings/public`
2. APIs الإدارة تحتاج صلاحيات admin
3. التوكن صالح لمدة طويلة (يمكن تعديله في الإعدادات)
4. جميع التواريخ بصيغة `Y-m-d H:i:s`
5. جميع الرسائل باللغة العربية

## التثبيت والتشغيل

1. تشغيل الـ migrations:

```bash
php artisan migrate
```

2. تشغيل الـ seeders:

```bash
php artisan db:seed
```

3. تشغيل الخادم:

```bash
php artisan serve
```

## بيانات تسجيل الدخول الافتراضية

### Admin:

-   Email: `admin@syriancommunity.com`
-   Password: `admin123`

### مستخدمين تجريبيين:

-   Email: `ahmed@example.com` / Password: `password`
-   Email: `fatima@example.com` / Password: `password`
-   Email: `mohammed@example.com` / Password: `password`
