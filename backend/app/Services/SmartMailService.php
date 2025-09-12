<?php

namespace App\Services;

use App\Mail\EmailVerification;
use App\Mail\PasswordResetMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SmartMailService
{
    // حدود الخدمات اليومية
    private const SERVICE_LIMITS = [
        'brevo' => 300,      // Brevo: 300/يوم مجاني
        'resend' => 100,     // Resend: 100/يوم مجاني
        'hostinger' => 100,  // Hostinger: 100/يوم (إذا استخدمته)
    ];
    
    // ترتيب الأولوية
    private const SERVICE_PRIORITY = ['brevo', 'resend', 'hostinger'];
    
    /**
     * إرسال إيميل التحقق بذكاء
     */
    public static function sendVerificationEmail($user, $token)
    {
        return self::sendEmail(
            'verification',
            $user->email,
            function($service) use ($user, $token) {
                if ($service === 'resend') {
                    return self::sendViaResend($user->email, 'verification', [
                        'user' => $user,
                        'token' => $token
                    ]);
                } else {
                    Mail::to($user->email)->send(new EmailVerification($user, $token));
                    return true;
                }
            }
        );
    }
    
    /**
     * إرسال إيميل استعادة كلمة المرور
     */
    public static function sendPasswordResetEmail($user, $token)
    {
        return self::sendEmail(
            'password_reset',
            $user->email,
            function($service) use ($user, $token) {
                if ($service === 'resend') {
                    return self::sendViaResend($user->email, 'password_reset', [
                        'user' => $user,
                        'token' => $token
                    ]);
                } else {
                    Mail::to($user->email)->send(new PasswordResetMail($user, $token));
                    return true;
                }
            }
        );
    }
    
    /**
     * الدالة الرئيسية للإرسال الذكي
     */
    private static function sendEmail($type, $toEmail, $sendCallback)
    {
        $availableService = self::getAvailableService();
        
        if (!$availableService) {
            self::logEmail(null, $toEmail, $type, 'failed', 'جميع الخدمات وصلت للحد الأقصى');
            throw new \Exception('وصلنا للحد الأقصى من الإيميلات اليوم. حاول غداً.');
        }
        
        try {
            // تكوين الخدمة
            self::configureMailer($availableService);
            
            // إرسال الإيميل
            $result = $sendCallback($availableService);
            
            if ($result) {
                self::incrementCounter($availableService, true);
                self::logEmail($availableService, $toEmail, $type, 'sent');
                
                Log::info("Email sent successfully", [
                    'service' => $availableService,
                    'type' => $type,
                    'daily_usage' => self::getTodayCount($availableService) . '/' . self::SERVICE_LIMITS[$availableService]
                ]);
                
                return true;
            }
        } catch (\Exception $e) {
            self::incrementCounter($availableService, false);
            self::logEmail($availableService, $toEmail, $type, 'failed', $e->getMessage());
            
            Log::error("Email sending failed", [
                'service' => $availableService,
                'error' => $e->getMessage()
            ]);
            
            // حاول الخدمة التالية
            return self::tryNextService($type, $toEmail, $sendCallback, $availableService);
        }
        
        return false;
    }
    
    /**
     * الحصول على خدمة متاحة
     */
    private static function getAvailableService()
    {
        foreach (self::SERVICE_PRIORITY as $service) {
            $todayCount = self::getTodayCount($service);
            $limit = self::SERVICE_LIMITS[$service];
            
            if ($todayCount < $limit) {
                return $service;
            }
        }
        
        return null;
    }
    
    /**
     * محاولة الخدمة التالية عند الفشل
     */
    private static function tryNextService($type, $toEmail, $sendCallback, $failedService)
    {
        $remainingServices = array_diff(self::SERVICE_PRIORITY, [$failedService]);
        
        foreach ($remainingServices as $service) {
            if (self::getTodayCount($service) < self::SERVICE_LIMITS[$service]) {
                try {
                    self::configureMailer($service);
                    $result = $sendCallback($service);
                    
                    if ($result) {
                        self::incrementCounter($service, true);
                        self::logEmail($service, $toEmail, $type, 'sent');
                        return true;
                    }
                } catch (\Exception $e) {
                    self::incrementCounter($service, false);
                    self::logEmail($service, $toEmail, $type, 'failed', $e->getMessage());
                    continue;
                }
            }
        }
        
        return false;
    }
    
    /**
     * تكوين الخدمة المختارة
     */
    private static function configureMailer($service)
    {
        switch ($service) {
            case 'brevo':
                config([
                    'mail.mailer' => 'smtp',
                    'mail.host' => env('BREVO_HOST', 'smtp-relay.brevo.com'),
                    'mail.port' => env('BREVO_PORT', 587),
                    'mail.username' => env('BREVO_USERNAME'),
                    'mail.password' => env('BREVO_PASSWORD'),
                    'mail.encryption' => 'tls',
                ]);
                break;
                
            case 'hostinger':
                config([
                    'mail.mailer' => 'smtp',
                    'mail.host' => env('HOSTINGER_MAIL_HOST', 'smtp.hostinger.com'),
                    'mail.port' => env('HOSTINGER_MAIL_PORT', 465),
                    'mail.username' => env('HOSTINGER_MAIL_USERNAME'),
                    'mail.password' => env('HOSTINGER_MAIL_PASSWORD'),
                    'mail.encryption' => 'ssl',
                ]);
                break;
                
            case 'resend':
                // Resend يستخدم API
                break;
        }
    }
    
    /**
     * إرسال عبر Resend API
     */
    private static function sendViaResend($toEmail, $type, $data)
    {
        $subject = $type === 'verification' ? 'تفعيل حسابك' : 'استعادة كلمة المرور';
        $template = $type === 'verification' ? 'verification' : 'password-reset';
        
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('RESEND_API_KEY'),
        ])->post('https://api.resend.com/emails', [
            'from' => env('MAIL_FROM_ADDRESS', 'noreply@your-domain.com'),
            'to' => $toEmail,
            'subject' => $subject,
            'html' => view($template, $data)->render()
        ]);
        
        if (!$response->successful()) {
            throw new \Exception('Resend API failed: ' . $response->body());
        }
        
        return true;
    }
    
    /**
     * الحصول على عدد الإيميلات المرسلة اليوم
     */
    public static function getTodayCount($service)
    {
        return DB::table('email_tracking')
            ->where('service', $service)
            ->whereDate('date', today())
            ->value('count') ?? 0;
    }
    
    /**
     * زيادة العداد
     */
    private static function incrementCounter($service, $success = true)
    {
        $hour = now()->format('H');
        
        // جلب السجل الحالي
        $existing = DB::table('email_tracking')
            ->where('service', $service)
            ->whereDate('date', today())
            ->first();
        
        // تحديث hourly_breakdown
        $hourlyBreakdown = $existing ? json_decode($existing->hourly_breakdown ?? '{}', true) : [];
        $hourlyBreakdown[$hour] = ($hourlyBreakdown[$hour] ?? 0) + 1;
        
        DB::table('email_tracking')->updateOrInsert(
            [
                'service' => $service,
                'date' => today()
            ],
            [
                'count' => DB::raw('COALESCE(count, 0) + 1'),
                'success_count' => $success ? DB::raw('COALESCE(success_count, 0) + 1') : DB::raw('success_count'),
                'failed_count' => !$success ? DB::raw('COALESCE(failed_count, 0) + 1') : DB::raw('failed_count'),
                'hourly_breakdown' => json_encode($hourlyBreakdown),
                'updated_at' => now()
            ]
        );
    }
    
    /**
     * تسجيل الإيميل في السجلات
     */
    private static function logEmail($service, $toEmail, $type, $status, $errorMessage = null)
    {
        DB::table('email_logs')->insert([
            'service' => $service ?? 'none',
            'to_email' => $toEmail,
            'type' => $type,
            'status' => $status,
            'error_message' => $errorMessage,
            'metadata' => json_encode([
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'timestamp' => now()->toIso8601String()
            ]),
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
    
    /**
     * الحصول على إحصائيات اليوم
     */
    public static function getTodayStats()
    {
        $stats = [];
        
        foreach (self::SERVICE_PRIORITY as $service) {
            $data = DB::table('email_tracking')
                ->where('service', $service)
                ->whereDate('date', today())
                ->first();
            
            $stats[$service] = [
                'sent' => $data->count ?? 0,
                'success' => $data->success_count ?? 0,
                'failed' => $data->failed_count ?? 0,
                'limit' => self::SERVICE_LIMITS[$service],
                'remaining' => self::SERVICE_LIMITS[$service] - ($data->count ?? 0),
                'percentage' => round((($data->count ?? 0) / self::SERVICE_LIMITS[$service]) * 100, 1),
                'hourly' => json_decode($data->hourly_breakdown ?? '{}', true)
            ];
        }
        
        // المجموع
        $stats['total'] = [
            'sent' => array_sum(array_column($stats, 'sent')),
            'limit' => array_sum(self::SERVICE_LIMITS),
            'remaining' => array_sum(array_column($stats, 'remaining')),
        ];
        
        return $stats;
    }
    
    /**
     * الحصول على سجل الإيميلات
     */
    public static function getEmailLogs($limit = 50)
    {
        return DB::table('email_logs')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}