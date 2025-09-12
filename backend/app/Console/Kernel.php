<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\Election;
use Illuminate\Support\Facades\DB;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // تحديث حالة الانتخابات المنتهية كل 15 دقيقة
        $schedule->call(function () {
            Election::where('status', 'active')
                ->where('end_date', '<', now())
                ->update(['status' => 'completed']);
        })->everyFifteenMinutes();

        // تنظيف السيشنات المنتهية - مهم جداً!
        // حذف السيشنات الأقدم من SESSION_LIFETIME
        $schedule->call(function () {
            $lifetime = config('session.lifetime', 120); // بالدقائق
            
            DB::table('sessions')
                ->where('last_activity', '<', now()->subMinutes($lifetime))
                ->delete();
                
            \Log::info('تم تنظيف السيشنات المنتهية', [
                'deleted_before' => now()->subMinutes($lifetime),
                'lifetime_minutes' => $lifetime
            ]);
        })->hourly(); // كل ساعة
        
        // تنظيف أعمق مرة يومياً - حذف السيشنات الأقدم من 24 ساعة
        $schedule->call(function () {
            DB::table('sessions')
                ->where('last_activity', '<', now()->subHours(24))
                ->delete();
                
            \Log::info('تنظيف يومي للسيشنات القديمة جداً');
        })->dailyAt('02:00'); // الساعة 2 صباحاً
        
        // تنظيف tokens استعادة كلمة المرور المنتهية (أقدم من 24 ساعة)
        $schedule->call(function () {
            DB::table('password_reset_tokens')
                ->where('created_at', '<', now()->subHours(24))
                ->delete();
                
            \Log::info('تم حذف tokens استعادة كلمة المرور المنتهية');
        })->daily();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}