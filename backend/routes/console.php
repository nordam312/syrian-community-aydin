<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Models\Election;
use Illuminate\Support\Facades\DB;

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
})->hourly();

// تنظيف أعمق مرة يومياً
Schedule::call(function () {
    DB::table('sessions')
        ->where('last_activity', '<', now()->subHours(24))
        ->delete();
})->dailyAt('02:00');

// تنظيف tokens استعادة كلمة المرور المنتهية
Schedule::call(function () {
    DB::table('password_reset_tokens')
        ->where('created_at', '<', now()->subHours(24))
        ->delete();
})->daily();

// إرسال تذكيرات الفعاليات كل 5 دقائق
Schedule::command('reminders:send')
    ->everyFiveMinutes()
    ->withoutOverlapping();
