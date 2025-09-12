@echo off
echo ========================================
echo تحضير المشروع للنشر على Hostinger
echo ========================================
echo.

REM إنشاء مجلد للنشر
echo [1/6] إنشاء مجلد النشر...
if exist hostinger-upload rmdir /s /q hostinger-upload
mkdir hostinger-upload
mkdir hostinger-upload\public_html

REM بناء Frontend
echo [2/6] بناء Frontend...
cd frontend
call npm run build
cd ..

REM نسخ ملفات Frontend
echo [3/6] نسخ ملفات Frontend...
xcopy frontend\dist hostinger-upload\public_html /E /I /Y

REM نسخ Backend
echo [4/6] نسخ Backend...
xcopy backend hostinger-upload\public_html\backend /E /I /Y

REM حذف الملفات غير الضرورية
echo [5/6] تنظيف الملفات...
del hostinger-upload\public_html\backend\.env 2>nul
del hostinger-upload\public_html\backend\.env.example 2>nul
rmdir /s /q hostinger-upload\public_html\backend\node_modules 2>nul
rmdir /s /q hostinger-upload\public_html\backend\tests 2>nul
rmdir /s /q hostinger-upload\public_html\backend\.git 2>nul

REM إنشاء .htaccess الرئيسي
echo [6/6] إنشاء ملفات التكوين...
(
echo ^<IfModule mod_rewrite.c^>
echo     RewriteEngine On
echo     
echo     # Force HTTPS
echo     RewriteCond %%{HTTPS} off
echo     RewriteRule ^^(.*)$ https://%%{HTTP_HOST}/$1 [R=301,L]
echo     
echo     # API Routes to Laravel
echo     RewriteCond %%{REQUEST_URI} ^^/api
echo     RewriteRule ^^api/(.*)$ backend/public/index.php [L]
echo     
echo     # Storage files
echo     RewriteCond %%{REQUEST_URI} ^^/storage
echo     RewriteRule ^^storage/(.*)$ backend/public/storage/$1 [L]
echo     
echo     # Frontend SPA
echo     RewriteCond %%{REQUEST_FILENAME} !-f
echo     RewriteCond %%{REQUEST_FILENAME} !-d
echo     RewriteCond %%{REQUEST_URI} !^^/api
echo     RewriteCond %%{REQUEST_URI} !^^/storage
echo     RewriteRule . /index.html [L]
echo ^</IfModule^>
echo.
echo # Security
echo ^<FilesMatch "^^\.env"^>
echo     Order allow,deny
echo     Deny from all
echo ^</FilesMatch^>
echo.
echo # Performance
echo ^<IfModule mod_deflate.c^>
echo     AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
echo ^</IfModule^>
echo.
echo # Cache
echo ^<IfModule mod_expires.c^>
echo     ExpiresActive On
echo     ExpiresByType image/jpg "access plus 1 month"
echo     ExpiresByType image/png "access plus 1 month"
echo     ExpiresByType text/css "access plus 1 week"
echo     ExpiresByType application/javascript "access plus 1 week"
echo ^</IfModule^>
) > hostinger-upload\public_html\.htaccess

echo.
echo ========================================
echo ✅ تم التحضير بنجاح!
echo ========================================
echo.
echo 📁 الملفات جاهزة في: hostinger-upload\public_html
echo.
echo الخطوات التالية:
echo 1. ارفع محتويات hostinger-upload\public_html إلى Hostinger
echo 2. أنشئ قاعدة البيانات في Hostinger
echo 3. عدّل ملف .env.production وارفعه كـ .env
echo 4. شغّل الأوامر عبر SSH:
echo    - composer install --optimize-autoloader --no-dev
echo    - php artisan key:generate
echo    - php artisan migrate --force
echo    - php artisan optimize
echo.
pause