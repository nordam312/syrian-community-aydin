<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>استعادة كلمة المرور</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #0c6b3d;
            margin-bottom: 30px;
        }
        .logo {
            width: 120px;
            height: auto;
            margin-bottom: 10px;
        }
        h1 {
            color: #0c6b3d;
            margin: 0;
            font-size: 28px;
        }
        .content {
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background-color: #0c6b3d;
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #094a2b;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 10px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .link {
            word-break: break-all;
            color: #0c6b3d;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>المجتمع السوري في أيدن</h1>
            <p style="color: #666; margin: 5px 0;">Syrian Community in Aydın</p>
        </div>
        
        <div class="content">
            <h2>مرحباً {{ $user->name }}،</h2>
            
            <p>لقد تلقينا طلباً لاستعادة كلمة المرور لحسابك في المجتمع السوري في أيدن.</p>
            
            <p>لإعادة تعيين كلمة المرور، يرجى النقر على الزر أدناه:</p>
            
            <div style="text-align: center;">
                <a href="{{ $resetUrl }}" class="button">إعادة تعيين كلمة المرور</a>
            </div>
            
            <div class="warning">
                <strong>تنبيه:</strong> هذا الرابط صالح لمدة 24 ساعة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.
            </div>
            
            <p>إذا كنت تواجه مشكلة في النقر على الزر، يمكنك نسخ الرابط التالي ولصقه في متصفحك:</p>
            <p class="link">{{ $resetUrl }}</p>
            
            <p>مع أطيب التحيات،<br>
            فريق المجتمع السوري في أيدن</p>
        </div>
        
        <div class="footer">
            <p>هذا البريد الإلكتروني تم إرساله تلقائياً، يرجى عدم الرد عليه.</p>
            <p>&copy; 2025 المجتمع السوري في أيدن - جميع الحقوق محفوظة</p>
        </div>
    </div>
</body>
</html>