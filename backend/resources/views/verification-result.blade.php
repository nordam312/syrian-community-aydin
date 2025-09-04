<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $success ? 'تم التفعيل بنجاح' : 'فشل التفعيل' }} - المجتمع السوري في أيدن</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Tajawal', sans-serif;
            background: linear-gradient(135deg, #f0f9f0 0%, #dcefdc 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            direction: rtl;
            position: relative;
            overflow: hidden;
        }
        
        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath fill='%233b8c3b' fill-opacity='0.03' d='M100,20 C60,20 40,60 40,100 C40,140 60,180 100,180 C140,180 160,140 160,100 C160,60 140,20 100,20 Z'/%3E%3Cpath fill='%233b8c3b' fill-opacity='0.05' d='M100,40 C70,40 50,70 50,100 C50,130 70,160 100,160 C130,160 150,130 150,100 C150,70 130,40 100,40 Z'/%3E%3Cpath fill='%233b8c3b' fill-opacity='0.07' d='M100,60 C80,60 60,80 60,100 C60,120 80,140 100,140 C120,140 140,120 140,100 C140,80 120,60 100,60 Z'/%3E%3C/svg%3E");
            background-size: 300px;
            opacity: 0.4;
            z-index: -1;
        }
        
        .container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 15px 40px rgba(59, 140, 59, 0.15);
            overflow: hidden;
            width: 100%;
            max-width: 500px;
            text-align: center;
            position: relative;
            animation: fadeIn 0.8s ease-out;
            border: 1px solid #bce0bc;
            backdrop-filter: blur(10px);
        }
        
        .header {
            background: linear-gradient(135deg, #3b8c3b 0%, #2e712e 100%);
            padding: 25px 20px;
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M10,10 C40,5 60,15 90,10' stroke='rgba(255,255,255,0.1)' stroke-width='2' fill='none'/%3E%3Cpath d='M10,30 C40,25 60,35 90,30' stroke='rgba(255,255,255,0.1)' stroke-width='2' fill='none'/%3E%3C/svg%3E");
            opacity: 0.3;
            animation: wave 12s linear infinite;
        }
        
        .logo {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 10px;
        }
        
        .logo-icon {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: #3b8c3b;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .header h1 {
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 5px;
            position: relative;
            z-index: 2;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.2);
        }
        
        .header p {
            position: relative;
            z-index: 2;
            opacity: 0.9;
        }
        
        .content {
            padding: 35px 30px;
            position: relative;
        }
        
        .result-icon {
            font-size: 80px;
            margin: 15px 0;
            animation: {{ $success ? 'bounce 1.5s infinite alternate' : 'shake 0.5s ease-in-out' }};
            color: {{ $success ? '#3b8c3b' : '#ce1126' }};
            text-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        
        .title {
            font-size: 28px;
            font-weight: 700;
            color: {{ $success ? '#3b8c3b' : '#ce1126' }};
            margin-bottom: 15px;
            position: relative;
        }
        
        .title::after {
            content: '';
            display: block;
            width: 60px;
            height: 3px;
            background: {{ $success ? '#3b8c3b' : '#ce1126' }};
            margin: 10px auto;
            border-radius: 3px;
        }
        
        .message {
            font-size: 18px;
            color: #265a26;
            line-height: 1.7;
            margin-bottom: 25px;
            padding: 0 10px;
        }
        
        .user-info {
            background: linear-gradient(135deg, #f0f9f0 0%, #dcefdc 100%);
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
            text-align: right;
            border: 1px solid #bce0bc;
            box-shadow: 0 4px 12px rgba(46, 113, 46, 0.1);
        }
        
        .user-info p {
            margin: 10px 0;
            color: #265a26;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .user-info p::before {
            content: '•';
            color: #3b8c3b;
            font-size: 20px;
        }
        
        .button {
            display: inline-block;
            background: linear-gradient(135deg, {{ $success ? '#3b8c3b 0%, #2e712e 100%' : '#ce1126 0%, #e74c3c 100%' }});
            color: white;
            text-decoration: none;
            padding: 15px 35px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 17px;
            transition: all 0.4s ease;
            box-shadow: 0 6px 20px {{ $success ? 'rgba(59, 140, 59, 0.35)' : 'rgba(206, 17, 38, 0.35)' }};
            border: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            margin: 10px;
        }
        
        .button.secondary {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
            box-shadow: 0 6px 20px rgba(108, 117, 125, 0.35);
        }
        
        .button.secondary:hover {
            box-shadow: 0 8px 25px rgba(108, 117, 125, 0.5);
        }
        
        .button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(rgba(255,255,255,0.2), transparent);
            transform: translateY(-100%);
            transition: transform 0.4s ease;
        }
        
        .button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px {{ $success ? 'rgba(59, 140, 59, 0.5)' : 'rgba(206, 17, 38, 0.5)' }};
        }
        
        .button:hover::before {
            transform: translateY(0);
        }
        
        .footer {
            margin-top: 35px;
            color: #60ac60;
            font-size: 15px;
            border-top: 1px solid #dcefdc;
            padding-top: 20px;
        }
        
        .button-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 20px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes bounce {
            from { transform: translateY(0) scale(1); }
            to { transform: translateY(-15px) scale(1.05); }
        }
        
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            50% { transform: translateX(10px); }
            75% { transform: translateX(-10px); }
            100% { transform: translateX(0); }
        }
        
        @keyframes wave {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .syrian-pattern {
            position: absolute;
            bottom: 10px;
            right: 10px;
            opacity: 0.05;
            font-size: 100px;
            transform: rotate(30deg);
            color: #3b8c3b;
        }
        
        .floating-star {
            position: absolute;
            font-size: 24px;
            color: #3b8c3b;
            opacity: 0.5;
            animation: float 6s infinite ease-in-out;
        }
        
        .floating-star:nth-child(1) { top: 10%; left: 8%; animation-delay: 0s; }
        .floating-star:nth-child(2) { top: 25%; right: 12%; animation-delay: 1s; }
        .floating-star:nth-child(3) { bottom: 40%; left: 15%; animation-delay: 2s; }
        .floating-star:nth-child(4) { bottom: 20%; right: 8%; animation-delay: 3s; }
        .floating-star:nth-child(5) { top: 40%; left: 5%; animation-delay: 1.5s; }
        .floating-star:nth-child(6) { bottom: 10%; right: 20%; animation-delay: 2.5s; }
        
        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @media (max-width: 768px) {
            .container {
                margin: 15px;
                max-width: 100%;
            }
            
            .header {
                padding: 20px 15px;
            }
            
            .content {
                padding: 25px 20px;
            }
            
            .result-icon {
                font-size: 70px;
            }
            
            .title {
                font-size: 24px;
            }
            
            .message {
                font-size: 16px;
            }
            
            .logo-icon {
                width: 50px;
                height: 50px;
                font-size: 24px;
            }
            
            .floating-star {
                display: none;
            }
            
            .button-container {
                flex-direction: column;
            }
            
            .button {
                width: 100%;
                margin: 5px 0;
            }
        }
    </style>
</head>
<body>
    <!-- النجوم العائمة -->
    <div class="floating-star">★</div>
    <div class="floating-star">★</div>
    <div class="floating-star">★</div>
    <div class="floating-star">★</div>
    <div class="floating-star">★</div>
    <div class="floating-star">★</div>
    
    <div class="container">
        <div class="header">
            <div class="logo">
                <div class="logo-icon">★</div>
            </div>
            <h1>المجتمع السوري في أيدن</h1>
            <p>نحو مجتمع متكامل ومتعاون</p>
        </div>
        
        <div class="content">
            <div class="result-icon">{{ $success ? '✅' : '❌' }}</div>
            
            <h2 class="title">{{ $title }}</h2>
            
            <p class="message">{{ $message }}</p>
            
            @if(isset($user) && $success)
            <div class="user-info">
                <p><strong>الاسم:</strong> {{ $user->name }}</p>
                <p><strong>رقم الطالب:</strong> {{ $user->student_id }}</p>
                <p><strong>البريد الإلكتروني:</strong> {{ $user->email }}</p>
            </div>
            @endif
            
            <div class="button-container">
                @if($success)
                    <button onclick="redirectToAuth()" class="button">
                        تسجيل الدخول الآن
                    </button>
                @else
                    <button onclick="redirectToAuth()" class="button">
                        الذهاب إلى تسجيل الدخول
                    </button>
                    <button onclick="resendVerification()" class="button secondary">
                        إعادة إرسال البريد الإلكتروني
                    </button>
                @endif
            </div>
            
            <div class="footer">
                <p>© {{ date('Y') }} المجتمع السوري في أيدن. جميع الحقوق محفوظة.</p>
            </div>
            
            <div class="syrian-pattern">★</div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.querySelector('.container');
            container.style.opacity = '0';
            
            setTimeout(() => {
                container.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                container.style.opacity = '1';
            }, 100);
            
            const buttons = document.querySelectorAll('.button');
            buttons.forEach(button => {
                button.addEventListener('mouseover', function() {
                    this.style.transform = 'translateY(-3px)';
                });
                
                button.addEventListener('mouseout', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
            
            // إذا كان التفعيل ناجحاً، توجيه تلقائي بعد 5 ثواني
            @if($success)
            setTimeout(function() {
                redirectToAuth();
            }, 5000);
            @endif
        });

        function redirectToAuth() {
            // التوجيه إلى صفحة Auth في تطبيق React
            window.location.href = "http://localhost:8080/auth";
        }

    async function resendVerification() {
        try {
            const response = await fetch("/api/resend-verification", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: "{{ $user->email ?? '' }}"
                })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            
            const data = await response.json();
            
            if (data.success) {
                alert('تم إرسال بريد التفعيل مرة أخرى بنجاح');
            } else {
                alert('حدث خطأ أثناء إعادة الإرسال: ' + (data.message || 'يرجى المحاولة لاحقاً'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('حدث خطأ في الشبكة، يرجى المحاولة لاحقاً. التفاصيل: ' + error.message);
        }
    }
    </script>
</body>
</html>