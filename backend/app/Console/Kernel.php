<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * ملاحظة: في Laravel 11+، الـ schedules منتقلة لملف routes/console.php
     */
    protected function schedule(Schedule $schedule): void
    {
        // الـ schedules موجودة في routes/console.php
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