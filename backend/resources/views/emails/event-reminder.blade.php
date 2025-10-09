<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تذكير بالحدث - الجالية السورية في جامعة أيدن</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; direction: rtl; background-color: #f0f9f0;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f0f9f0" style="border: 0;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 0;">

                    <!-- Header -->
                    <tr>
                        <td bgcolor="#3b8c3b" align="center" style="padding: 30px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">
                                🔔 تذكير بالحدث
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 35px 30px;">

                            <!-- Greeting -->
                            <div style="text-align: center; font-size: 22px; font-weight: bold; color: #3b8c3b; margin-bottom: 20px;">
                                مرحباً! 👋
                            </div>

                            <!-- Message based on reminder type -->
                            @if($reminderType === 'one_day')
                                <div style="text-align: center; font-size: 16px; color: #265a26; line-height: 1.6; margin-bottom: 25px;">
                                    <p style="margin: 0;">هذا تذكير ودود أن حدثك سيكون <strong>غداً</strong>!</p>
                                </div>
                                <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; text-align: center; font-weight: bold; color: #92400E; margin: 25px 0; border: 1px solid #FCD34D;">
                                    📅 يبدأ الحدث بعد حوالي 24 ساعة
                                </div>
                            @else
                                <div style="text-align: center; font-size: 16px; color: #265a26; line-height: 1.6; margin-bottom: 25px;">
                                    <p style="margin: 0;">هذا تذكيرك الأخير - حدثك سيبدأ <strong>قريباً جداً</strong>!</p>
                                </div>
                                <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; text-align: center; font-weight: bold; color: #92400E; margin: 25px 0; border: 1px solid #FCD34D;">
                                    ⏰ يبدأ الحدث بعد حوالي ساعتين
                                </div>
                            @endif

                            <!-- Event Details Box -->
                            <div style="background-color: #f0f9f0; border: 1px solid #bce0bc; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: right;">

                                <!-- Event Title -->
                                <div style="font-size: 22px; font-weight: bold; color: #2e712e; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #bce0bc; padding-bottom: 10px;">
                                    {{ $event->title }}
                                </div>

                                <!-- Description -->
                                <div style="margin: 15px 0;">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 0;">
                                        <tr>
                                            <td style="font-weight: bold; color: #2e712e; font-size: 16px; padding: 5px 10px 5px 0; vertical-align: top; width: 120px;">
                                                📝 الوصف:
                                            </td>
                                            <td style="color: #265a26; font-size: 16px; padding: 5px 0; text-align: right;">
                                                {{ $event->description }}
                                            </td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- Date & Time -->
                                <div style="margin: 15px 0;">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 0;">
                                        <tr>
                                            <td style="font-weight: bold; color: #2e712e; font-size: 16px; padding: 5px 10px 5px 0; vertical-align: top; width: 120px;">
                                                📅 التاريخ والوقت:
                                            </td>
                                            <td style="color: #265a26; font-size: 16px; padding: 5px 0; text-align: right;">
                                                {{ $event->date->format('l، j F، Y \ع\\ن\\د g:i A') }}
                                            </td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- Location (if exists) -->
                                @if($event->location)
                                <div style="margin: 15px 0;">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 0;">
                                        <tr>
                                            <td style="font-weight: bold; color: #2e712e; font-size: 16px; padding: 5px 10px 5px 0; vertical-align: top; width: 120px;">
                                                📍 الموقع:
                                            </td>
                                            <td style="color: #265a26; font-size: 16px; padding: 5px 0; text-align: right;">
                                                {{ $event->location }}
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                @endif

                                <!-- Attendees (if max exists) -->
                                @if($event->max_attendees)
                                <div style="margin: 15px 0;">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 0;">
                                        <tr>
                                            <td style="font-weight: bold; color: #2e712e; font-size: 16px; padding: 5px 10px 5px 0; vertical-align: top; width: 120px;">
                                                👥 الحضور:
                                            </td>
                                            <td style="color: #265a26; font-size: 16px; padding: 5px 0; text-align: right;">
                                                {{ $event->confirmed_attendees_count }} / {{ $event->max_attendees }} مؤكد
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                @endif

                            </div>

                            <!-- Closing Message -->
                            <div style="text-align: center; font-size: 16px; color: #265a26; line-height: 1.6; margin-top: 25px;">
                                <p style="margin: 0 0 10px 0;">نتطلع لرؤيتك في الحدث! إذا كان لديك أي أسئلة أو تحتاج إلى إجراء تغييرات على تسجيلك،</p>
                                <p style="margin: 0;">يرجى التواصل معنا في أقرب وقت ممكن.</p>
                            </div>

                            <!-- Additional Note for one day reminder -->
                            @if($reminderType === 'one_day')
                            <div style="text-align: center; margin-top: 20px;">
                                <p style="margin: 0; color: #60ac60; font-size: 14px; font-style: italic;">
                                    سوف تتلقى تذكيراً آخر قبل ساعتين من بدء الحدث.
                                </p>
                            </div>
                            @endif

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td bgcolor="#f0f9f0" style="padding: 25px 20px; text-align: center; border-top: 1px solid #dcefdc;">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #60ac60;">
                                هذا تذكير تلقائي من الجالية السورية في جامعة أيدن
                            </p>
                            <p style="margin: 0; font-size: 14px; color: #60ac60;">
                                © {{ date('Y') }} الجالية السورية في جامعة أيدن. جميع الحقوق محفوظة.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
