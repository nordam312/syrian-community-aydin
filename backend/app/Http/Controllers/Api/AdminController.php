<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SmartMailService;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Create a new controller instance.
     * Apply admin middleware to all methods
     */
    public function __construct()
    {
        // This is already handled in routes/api.php with middleware group
        // But adding here for extra security
    }

    public function dashboard()
    {
        return response()->json([
            'message' => 'مرحباً بك في لوحة تحكم الأدمن!',
            'status' => 'success'
        ]);
    }
    
    /**
     * الحصول على إحصائيات الإيميلات
     */
    public function getEmailStats()
    {
        // إحصائيات اليوم
        $todayStats = SmartMailService::getTodayStats();
        
        // إحصائيات الأسبوع
        $weekStats = DB::table('email_tracking')
            ->whereBetween('date', [now()->startOfWeek(), now()->endOfWeek()])
            ->select('service', DB::raw('SUM(count) as total'), DB::raw('SUM(success_count) as success'), DB::raw('SUM(failed_count) as failed'))
            ->groupBy('service')
            ->get();
        
        // إحصائيات الشهر
        $monthStats = DB::table('email_tracking')
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->select('service', DB::raw('SUM(count) as total'), DB::raw('SUM(success_count) as success'), DB::raw('SUM(failed_count) as failed'))
            ->groupBy('service')
            ->get();
        
        // الرسم البياني للأسبوع الماضي
        $chartData = DB::table('email_tracking')
            ->whereBetween('date', [now()->subDays(7), now()])
            ->select('date', 'service', 'count', 'success_count', 'failed_count')
            ->orderBy('date')
            ->get()
            ->groupBy('date')
            ->map(function ($dayData) {
                $services = [];
                foreach ($dayData as $item) {
                    $services[$item->service] = [
                        'sent' => $item->count,
                        'success' => $item->success_count,
                        'failed' => $item->failed_count
                    ];
                }
                return [
                    'date' => $dayData->first()->date,
                    'services' => $services
                ];
            })->values();
        
        // آخر الإيميلات المرسلة
        $recentEmails = SmartMailService::getEmailLogs(20);
        
        // حالة الخدمات
        $servicesStatus = [
            'brevo' => [
                'enabled' => !empty(env('BREVO_USERNAME')),
                'today_usage' => $todayStats['brevo']['sent'] ?? 0,
                'limit' => $todayStats['brevo']['limit'] ?? 300,
                'status' => $this->getServiceStatus('brevo', $todayStats)
            ],
            'resend' => [
                'enabled' => !empty(env('RESEND_API_KEY')),
                'today_usage' => $todayStats['resend']['sent'] ?? 0,
                'limit' => $todayStats['resend']['limit'] ?? 100,
                'status' => $this->getServiceStatus('resend', $todayStats)
            ],
            'hostinger' => [
                'enabled' => !empty(env('HOSTINGER_MAIL_USERNAME')),
                'today_usage' => $todayStats['hostinger']['sent'] ?? 0,
                'limit' => $todayStats['hostinger']['limit'] ?? 100,
                'status' => $this->getServiceStatus('hostinger', $todayStats)
            ]
        ];
        
        return response()->json([
            'today' => $todayStats,
            'week' => $weekStats,
            'month' => $monthStats,
            'chart' => $chartData,
            'recent_emails' => $recentEmails,
            'services_status' => $servicesStatus,
            'timestamp' => now()->toIso8601String()
        ]);
    }
    
    /**
     * إعادة إرسال إيميل فاشل
     */
    public function resendFailedEmail(Request $request)
    {
        $request->validate([
            'email_log_id' => 'required|exists:email_logs,id'
        ]);
        
        $emailLog = DB::table('email_logs')->find($request->email_log_id);
        
        if ($emailLog->status !== 'failed') {
            return response()->json([
                'message' => 'هذا الإيميل ليس فاشلاً'
            ], 400);
        }
        
        // جلب معلومات المستخدم
        $user = \App\Models\User::where('email', $emailLog->to_email)->first();
        
        if (!$user) {
            return response()->json([
                'message' => 'المستخدم غير موجود'
            ], 404);
        }
        
        try {
            if ($emailLog->type === 'verification') {
                SmartMailService::sendVerificationEmail($user, $user->verification_token);
            } else if ($emailLog->type === 'password_reset') {
                // جلب آخر توكن
                $token = DB::table('password_reset_tokens')
                    ->where('email', $user->email)
                    ->orderBy('created_at', 'desc')
                    ->value('token');
                    
                if ($token) {
                    SmartMailService::sendPasswordResetEmail($user, $token);
                }
            }
            
            return response()->json([
                'message' => 'تم إعادة الإرسال بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'فشل إعادة الإرسال: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * مسح السجلات القديمة
     */
    public function clearOldEmailLogs(Request $request)
    {
        $request->validate([
            'days' => 'required|integer|min:7|max:90'
        ]);
        
        $deleted = DB::table('email_logs')
            ->where('created_at', '<', now()->subDays($request->days))
            ->delete();
        
        return response()->json([
            'message' => "تم حذف {$deleted} سجل قديم",
            'deleted_count' => $deleted
        ]);
    }
    
    /**
     * Helper: الحصول على حالة الخدمة
     */
    private function getServiceStatus($service, $todayStats)
    {
        if (!isset($todayStats[$service])) {
            return 'inactive';
        }
        
        $percentage = $todayStats[$service]['percentage'] ?? 0;
        
        if ($percentage >= 100) {
            return 'exhausted';
        } elseif ($percentage >= 80) {
            return 'warning';
        } elseif ($percentage > 0) {
            return 'active';
        } else {
            return 'idle';
        }
    }
}
