<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>استعادة كلمة المرور</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; direction: rtl; background-color: #f4f4f4;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4" style="border: 0;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; overflow: hidden; border: 0;">

                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 30px 20px; border-bottom: 2px solid #0c6b3d;">
                            <h1 style="color: #0c6b3d; margin: 0 0 5px 0; font-size: 28px;">
                                المجتمع السوري في أيدن
                            </h1>
                            <p style="color: #666666; margin: 0; font-size: 14px;">Syrian Community in Aydın</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px;">

                            <h2 style="color: #0c6b3d; margin: 0 0 20px 0; font-size: 22px;">مرحباً {{ $user->name }}،</h2>

                            <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                لقد تلقينا طلباً لاستعادة كلمة المرور لحسابك في المجتمع السوري في أيدن.
                            </p>

                            <p style="margin: 0 0 25px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                لإعادة تعيين كلمة المرور، يرجى النقر على الزر أدناه:
                            </p>

                            <!-- Button -->
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{{ $resetUrl }}"
                                   style="display: inline-block; background-color: #0c6b3d; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; font-size: 16px;">
                                    إعادة تعيين كلمة المرور
                                </a>
                            </div>

                            <!-- Warning Box -->
                            <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p style="margin: 0; color: #856404; font-size: 15px; line-height: 1.6;">
                                    <strong>تنبيه:</strong> هذا الرابط صالح لمدة 24 ساعة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.
                                </p>
                            </div>

                            <p style="margin: 20px 0 10px 0; color: #333333; font-size: 15px; line-height: 1.6;">
                                إذا كنت تواجه مشكلة في النقر على الزر، يمكنك نسخ الرابط التالي ولصقه في متصفحك:
                            </p>

                            <p style="word-break: break-all; color: #0c6b3d; font-size: 13px; background-color: #f8f9fa; padding: 12px; border-radius: 5px; margin: 0 0 25px 0; font-family: monospace;">
                                {{ $resetUrl }}
                            </p>

                            <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                مع أطيب التحيات،<br>
                                فريق المجتمع السوري في أيدن
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px; text-align: center; border-top: 1px solid #dddddd; background-color: #f8f9fa;">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666666;">
                                هذا البريد الإلكتروني تم إرساله تلقائياً، يرجى عدم الرد عليه.
                            </p>
                            <p style="margin: 0; font-size: 14px; color: #666666;">
                                &copy; {{ date('Y') }} المجتمع السوري في أيدن - جميع الحقوق محفوظة
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
