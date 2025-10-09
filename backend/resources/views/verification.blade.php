<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تفعيل حسابك - الجالية السورية في جامعة اسطنبول أيدن</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #265a26;
            background: linear-gradient(135deg, #f0f9f0 0%, #e6f7e6 100%);
            margin: 0;
            padding: 20px;
            direction: rtl;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #bce0bc;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(46, 113, 46, 0.15);
        }
        
        .header {
            background: linear-gradient(135deg, #3b8c3b 0%, #2e712e 100%);
            padding: 30px 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0,0 L100,100' stroke='rgba(255,255,255,0.1)' stroke-width='2'/%3E%3Cpath d='M100,0 L0,100' stroke='rgba(255,255,255,0.1)' stroke-width='2'/%3E%3C/svg%3E");
            opacity: 0.3;
        }
        
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
            position: relative;
        }
        .content {
            padding: 35px 30px;
            background: #ffffff;
        }
        
        .greeting {
            font-size: 22px;
            font-weight: bold;
            color: #3b8c3b;
            margin-bottom: 20px;
            text-align: center;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .message {
            margin-bottom: 25px;
            font-size: 17px;
            color: #265a26;
            line-height: 1.7;
            text-align: center;
        }
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b8c3b 0%, #2e712e 100%);
            color: white !important;
            text-decoration: none;
            padding: 16px 35px;
            border-radius: 50px;
            font-weight: bold;
            font-size: 17px;
            transition: all 0.4s ease;
            box-shadow: 0 6px 20px rgba(59, 140, 59, 0.35);
            border: none;
            position: relative;
            overflow: hidden;
        }
        
        .verify-button::before {
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
        
        .verify-button:hover {
            background: linear-gradient(135deg, #2e712e 0%, #265a26 100%);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(59, 140, 59, 0.5);
        }
        
        .verify-button:hover::before {
            transform: translateY(0);
        }
        
        .info-box {
            background: linear-gradient(135deg, #f0f9f0 0%, #e6f7e6 100%);
            border: 1px solid #bce0bc;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
            text-align: right;
            box-shadow: 0 4px 12px rgba(46, 113, 46, 0.1);
        }
        
        .info-box p {
            margin: 12px 0;
            color: #265a26;
            font-size: 16px;
            display: flex;
            align-items: center;
        }
        
        .info-box p::before {
            content: '•';
            color: #3b8c3b;
            font-size: 20px;
            margin-left: 10px;
        }
        
        .info-box strong {
            color: #2e712e;
            margin-left: 5px;
        }
        
        .url-box {
            background: #f8f9fa;
            border: 1px solid #dcefdc;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        
        .url-box p {
            font-size: 14px;
            color: #60ac60;
            margin-bottom: 10px;
        }
        
        .url-code {
            word-break: break-all;
            color: #3b8c3b;
            background: #ffffff;
            padding: 12px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 13px;
            border: 1px dashed #bce0bc;
        }
        
        .footer {
            background: linear-gradient(135deg, #f0f9f0 0%, #e6f7e6 100%);
            padding: 25px 20px;
            text-align: center;
            font-size: 14px;
            color: #60ac60;
            border-top: 1px solid #dcefdc;
        }
        
        .footer p {
            margin: 8px 0;
        }
        
        .small {
            font-size: 14px;
            color: #60ac60;
        }
        
        .mt-20 {
            margin-top: 20px;
        }
        
        @media (max-width: 768px) {
            .container {
                margin: 10px;
                border-radius: 12px;
            }
            
            .header {
                padding: 25px 15px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .content {
                padding: 25px 20px;
            }
            
            .greeting {
                font-size: 20px;
            }
            
            .message {
                font-size: 16px;
            }
            
            .verify-button {
                padding: 14px 30px;
                font-size: 16px;
            }
            
            .info-box {
                padding: 15px;
            }
        }
        
        /* نجمة سورية متحركة */
        .floating-star {
            position: absolute;
            font-size: 16px;
            color: #3b8c3b;
            opacity: 0.6;
            animation: float 6s infinite ease-in-out;
        }
        
        .floating-star:nth-child(1) { top: 10%; left: 5%; animation-delay: 0s; }
        .floating-star:nth-child(2) { top: 20%; right: 15%; animation-delay: 1s; }
        .floating-star:nth-child(3) { bottom: 30%; left: 20%; animation-delay: 2s; }
        .floating-star:nth-child(4) { bottom: 15%; right: 5%; animation-delay: 3s; }
        
        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(10deg); }
        }
    </style>
</head>
<body>
    <!-- نجوم عائمة -->
    <div class="floating-star">★</div>
    <div class="floating-star">★</div>
    <div class="floating-star">★</div>
    <div class="floating-star">★</div>
    
    <div class="container">
        <div class="header">
            <h1>
                الجالية السورية في جامعة اسطنبول أيدن
            </h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                مرحباً {{ $user->name }} 👋
            </div>
            
            <div class="message">
                <p>شكراً لانضمامك إلى مجتمعنا السوري في جامعة أيدن!</p>
                <p>لبدء استخدام حسابك والاستفادة من جميع الخدمات، يرجى تأكيد بريدك الإلكتروني بالنقر على الزر أدناه:</p>
            </div>

            <div class="button-container">
                <a href="{{ env('FRONTEND_URL', 'http://localhost:8080') }}/verify-email/{{ $token }}" class="verify-button">
                    🔗 تأكيد البريد الإلكتروني
                </a>
            </div>

            <div class="info-box">
                <p><strong>معلومات حسابك:</strong></p>
                <p><strong>الاسم:</strong> {{ $user->name }}</p>
                <p><strong>رقم الطالب:</strong> {{ $user->student_id }}</p>
                <p><strong>البريد الإلكتروني:</strong> {{ $user->email }}</p>
            </div>

            <div class="url-box">
                <p>إذا واجهتك أي مشكلة في النقر على الزر، يمكنك نسخ الرابط التالي ولصقه في متصفحك:</p>
                <div class="url-code">
                    {{ env('FRONTEND_URL', 'http://localhost:8080') }}/verify-email/{{ $token }}
                </div>
            </div>

            <div class="message mt-20">
                <p>إذا لم تكن أنت من قام بإنشاء هذا الحساب، يمكنك تجاهل هذا البريد بأمان.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} االجالية السورية في جامعة اسطنبول أيدن. جميع الحقوق محفوظة.</p>
            <p class="small">هذا البريد مرسل تلقائياً، يرجى عدم الرد عليه.</p>
        </div>
    </div>
</body>
</html>