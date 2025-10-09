<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تذكير بالحدث - الجالية السورية في جامعة أيدن</title>
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
        
        .time-highlight {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            font-weight: bold;
            color: #92400E;
            margin: 25px 0;
            border: 1px solid #FCD34D;
            box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
        }
        
        .event-details {
            background: linear-gradient(135deg, #f0f9f0 0%, #e6f7e6 100%);
            border: 1px solid #bce0bc;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: right;
            box-shadow: 0 4px 12px rgba(46, 113, 46, 0.1);
        }
        
        .event-title {
            font-size: 24px;
            font-weight: bold;
            color: #2e712e;
            margin-bottom: 20px;
            text-align: center;
            border-bottom: 2px solid #bce0bc;
            padding-bottom: 10px;
        }
        
        .detail-row {
            margin: 15px 0;
            color: #265a26;
            font-size: 16px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        
        .detail-label {
            font-weight: bold;
            color: #2e712e;
            min-width: 120px;
        }
        
        .detail-value {
            flex: 1;
            text-align: right;
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
            
            .event-details {
                padding: 20px;
            }
            
            .event-title {
                font-size: 22px;
            }
            
            .detail-row {
                flex-direction: column;
                gap: 5px;
            }
            
            .detail-label {
                min-width: auto;
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
        
        .icon {
            font-size: 18px;
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
            <h1>🔔 تذكير بالحدث</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                مرحباً! 👋
            </div>
            
            @if($reminderType === 'one_day')
                <div class="message">
                    <p>هذا تذكير ودود أن حدثك سيكون <strong>غداً</strong>!</p>
                </div>
                <div class="time-highlight">
                    📅 يبدأ الحدث بعد حوالي 24 ساعة
                </div>
            @else
                <div class="message">
                    <p>هذا تذكيرك الأخير - حدثك سيبدأ <strong>قريباً جداً</strong>!</p>
                </div>
                <div class="time-highlight">
                    ⏰ يبدأ الحدث بعد حوالي ساعتين
                </div>
            @endif

            <div class="event-details">
                <div class="event-title">{{ $event->title }}</div>

                <div class="detail-row">
                    <span class="detail-label"><span class="icon">📝</span> الوصف:</span>
                    <span class="detail-value">{{ $event->description }}</span>
                </div>

                <div class="detail-row">
                    <span class="detail-label"><span class="icon">📅</span> التاريخ والوقت:</span>
                    <span class="detail-value">{{ $event->date->format('l، j F، Y \ع\\ن\\د g:i A') }}</span>
                </div>

                @if($event->location)
                <div class="detail-row">
                    <span class="detail-label"><span class="icon">📍</span> الموقع:</span>
                    <span class="detail-value">{{ $event->location }}</span>
                </div>
                @endif

                @if($event->max_attendees)
                <div class="detail-row">
                    <span class="detail-label"><span class="icon">👥</span> الحضور:</span>
                    <span class="detail-value">{{ $event->confirmed_attendees_count }} / {{ $event->max_attendees }} مؤكد</span>
                </div>
                @endif
            </div>

            <div class="message">
                <p>نتطلع لرؤيتك في الحدث! إذا كان لديك أي أسئلة أو تحتاج إلى إجراء تغييرات على تسجيلك،</p>
                <p>يرجى التواصل معنا في أقرب وقت ممكن.</p>
            </div>

            @if($reminderType === 'one_day')
                <div class="message mt-20">
                    <p style="color: #60ac60; font-size: 14px;">
                        <em>سوف تتلقى تذكيراً آخر قبل ساعتين من بدء الحدث.</em>
                    </p>
                </div>
            @endif
        </div>
        
        <div class="footer">
            <p>هذا تذكير تلقائي من الجالية السورية في جامعة أيدن</p>
            <p>© {{ date('Y') }} الجالية السورية في جامعة أيدن. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</body>
</html>