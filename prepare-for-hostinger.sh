#!/bin/bash

echo "========================================"
echo "تحضير المشروع للنشر على Hostinger"
echo "========================================"
echo

# إنشاء مجلد للنشر
echo "[1/6] إنشاء مجلد النشر..."
rm -rf hostinger-upload
mkdir -p hostinger-upload/public_html

# بناء Frontend
echo "[2/6] بناء Frontend..."
cd frontend
npm run build
cd ..

# نسخ ملفات Frontend
echo "[3/6] نسخ ملفات Frontend..."
cp -r frontend/dist/* hostinger-upload/public_html/

# نسخ Backend
echo "[4/6] نسخ Backend..."
cp -r backend hostinger-upload/public_html/

# حذف الملفات غير الضرورية
echo "[5/6] تنظيف الملفات..."
rm -f hostinger-upload/public_html/backend/.env
rm -f hostinger-upload/public_html/backend/.env.example
rm -rf hostinger-upload/public_html/backend/node_modules
rm -rf hostinger-upload/public_html/backend/tests
rm -rf hostinger-upload/public_html/backend/.git

# إنشاء .htaccess الرئيسي
echo "[6/6] إنشاء ملفات التكوين..."
cat > hostinger-upload/public_html/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
    
    # API Routes to Laravel
    RewriteCond %{REQUEST_URI} ^/api
    RewriteRule ^api/(.*)$ backend/public/index.php [L]
    
    # Storage files
    RewriteCond %{REQUEST_URI} ^/storage
    RewriteRule ^storage/(.*)$ backend/public/storage/$1 [L]
    
    # Frontend SPA
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api
    RewriteCond %{REQUEST_URI} !^/storage
    RewriteRule . /index.html [L]
</IfModule>

# Security
<FilesMatch "^\.env">
    Order allow,deny
    Deny from all
</FilesMatch>

# Performance
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>

# Cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
</IfModule>
EOF

echo
echo "========================================"
echo "✅ تم التحضير بنجاح!"
echo "========================================"
echo
echo "📁 الملفات جاهزة في: hostinger-upload/public_html"
echo
echo "الخطوات التالية:"
echo "1. ارفع محتويات hostinger-upload/public_html إلى Hostinger"
echo "2. أنشئ قاعدة البيانات في Hostinger"
echo "3. عدّل ملف .env.production وارفعه كـ .env"
echo "4. شغّل الأوامر عبر SSH:"
echo "   - composer install --optimize-autoloader --no-dev"
echo "   - php artisan key:generate"
echo "   - php artisan migrate --force"
echo "   - php artisan optimize"
echo