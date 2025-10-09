<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تفعيل حسابك - الجالية السورية في جامعة اسطنبول أيدن</title>
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
                                الجالية السورية في جامعة اسطنبول أيدن
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 35px 30px;">

                            <!-- Greeting -->
                            <div style="text-align: center; font-size: 22px; font-weight: bold; color: #3b8c3b; margin-bottom: 20px;">
                                مرحباً {{ $user->name }} 👋
                            </div>

                            <!-- Message -->
                            <div style="text-align: center; font-size: 16px; color: #265a26; line-height: 1.6; margin-bottom: 25px;">
                                <p style="margin: 0 0 15px 0;">شكراً لانضمامك إلى مجتمعنا السوري في جامعة أيدن!</p>
                                <p style="margin: 0;">لبدء استخدام حسابك والاستفادة من جميع الخدمات، يرجى تأكيد بريدك الإلكتروني بالنقر على الزر أدناه:</p>
                            </div>

                            <!-- Button -->
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{{ env('FRONTEND_URL', 'http://localhost:8080') }}/verify-email/{{ $token }}"
                                   style="display: inline-block; background-color: #3b8c3b; color: #ffffff; text-decoration: none; padding: 16px 35px; border-radius: 25px; font-weight: bold; font-size: 16px;">
                                    🔗 تأكيد البريد الإلكتروني
                                </a>
                            </div>

                            <!-- Info Box -->
                            <div style="background-color: #f0f9f0; border: 1px solid #bce0bc; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: right;">
                                <p style="margin: 0 0 12px 0; color: #265a26; font-size: 16px;">
                                    <strong style="color: #2e712e;">معلومات حسابك:</strong>
                                </p>
                                <p style="margin: 12px 0; color: #265a26; font-size: 16px;">
                                    <strong style="color: #2e712e;">الاسم:</strong> {{ $user->name }}
                                </p>
                                <p style="margin: 12px 0; color: #265a26; font-size: 16px;">
                                    <strong style="color: #2e712e;">رقم الطالب:</strong> {{ $user->student_id }}
                                </p>
                                <p style="margin: 12px 0 0 0; color: #265a26; font-size: 16px;">
                                    <strong style="color: #2e712e;">البريد الإلكتروني:</strong> {{ $user->email }}
                                </p>
                            </div>

                            <!-- URL Box -->
                            <div style="background-color: #f8f9fa; border: 1px solid #dcefdc; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
                                <p style="font-size: 14px; color: #60ac60; margin: 0 0 10px 0;">
                                    إذا واجهتك أي مشكلة في النقر على الزر، يمكنك نسخ الرابط التالي ولصقه في متصفحك:
                                </p>
                                <div style="word-break: break-all; color: #3b8c3b; background-color: #ffffff; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 13px; border: 1px dashed #bce0bc;">
                                    {{ env('FRONTEND_URL', 'http://localhost:8080') }}/verify-email/{{ $token }}
                                </div>
                            </div>

                            <!-- Notice -->
                            <div style="text-align: center; font-size: 16px; color: #265a26; margin-top: 20px;">
                                <p style="margin: 0;">إذا لم تكن أنت من قام بإنشاء هذا الحساب، يمكنك تجاهل هذا البريد بأمان.</p>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td bgcolor="#f0f9f0" style="padding: 25px 20px; text-align: center; border-top: 1px solid #dcefdc;">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #60ac60;">
                                © {{ date('Y') }} الجالية السورية في جامعة اسطنبول أيدن. جميع الحقوق محفوظة.
                            </p>
                            <p style="margin: 0; font-size: 14px; color: #60ac60;">
                                هذا البريد مرسل تلقائياً، يرجى عدم الرد عليه.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>