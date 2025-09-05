<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>وضع الصيانة - {{ config('app.name', 'المجتمع السوري في أيدن') }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #2d5016 0%, #4a7c2a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            direction: rtl;
        }
        
        .container {
            text-align: center;
            padding: 2rem;
            max-width: 600px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .icon {
            font-size: 5rem;
            margin-bottom: 2rem;
            opacity: 0.8;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        
        .message {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            line-height: 1.6;
            opacity: 0.9;
        }
        
        .back-home {
            display: inline-block;
            padding: 12px 30px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .back-home:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .contact-info {
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .icon {
            animation: pulse 2s ease-in-out infinite;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🔧</div>
        <h1>الموقع في وضع الصيانة</h1>
        <div class="message">
            {{ $message ?? 'نحن نعمل على تحسين الموقع لتوفير تجربة أفضل لك. يرجى المحاولة لاحقاً.' }}
        </div>
        
        <a href="javascript:history.back()" class="back-home">العودة للخلف</a>
        
        <div class="contact-info">
            <strong>للاستفسارات الطارئة:</strong><br>
            يمكنكم التواصل معنا عبر وسائل التواصل الاجتماعي<br>
            أو مراسلة إدارة المجتمع مباشرة
        </div>
    </div>

    <script>
        // تحديث الصفحة كل 30 ثانية للتحقق من انتهاء الصيانة
        setTimeout(function() {
            window.location.reload();
        }, 30000);
    </script>
</body>
</html>