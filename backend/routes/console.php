<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Models\Election;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// تحديث حالة الانتخابات المنتهية كل 15 دقيقة
Schedule::call(function () {
    Election::where('status', 'active')
        ->where('end_date', '<', now())
        ->update(['status' => 'completed']);
})->everyFifteenMinutes();

// تنظيف السيشنات المنتهية - مهم جداً!
Schedule::call(function () {
    $lifetime = config('session.lifetime', 120);

    DB::table('sessions')
        ->where('last_activity', '<', now()->subMinutes($lifetime))
        ->delete();

    Log::info('تم تنظيف السيشنات المنتهية', [
        'deleted_before' => now()->subMinutes($lifetime),
        'lifetime_minutes' => $lifetime
    ]);
})->hourly();

// تنظيف أعمق مرة يومياً
Schedule::call(function () {
    DB::table('sessions')
        ->where('last_activity', '<', now()->subHours(24))
        ->delete();

    Log::info('تنظيف يومي للسيشنات القديمة جداً');
})->dailyAt('02:00');

// تنظيف tokens استعادة كلمة المرور المنتهية
Schedule::call(function () {
    DB::table('password_reset_tokens')
        ->where('created_at', '<', now()->subHours(24))
        ->delete();

    Log::info('تم حذف tokens استعادة كلمة المرور المنتهية');
})->daily();

// Log للتأكد من أن الـ scheduler شغال
Schedule::call(function () {
    Log::info('Scheduler is working at: ' . now());
})->everyMinute();

// إرسال تذكيرات الفعاليات كل دقيقة
Schedule::command('reminders:send')
    ->everyMinute()
    ->withoutOverlapping();
