<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Sanctum\PersonalAccessToken;

class CleanExpiredTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tokens:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'حذف التوكنات القديمة وغير المستخدمة';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // حذف التوكنات التي لم تُستخدم لأكثر من 30 يوم
        $deletedUnused = PersonalAccessToken::where('last_used_at', '<', now()->subDays(30))
            ->delete();
        
        // حذف التوكنات القديمة جداً (أكثر من 90 يوم من الإنشاء)
        $deletedOld = PersonalAccessToken::where('created_at', '<', now()->subDays(90))
            ->delete();
        
        $total = $deletedUnused + $deletedOld;
        
        $this->info("✅ تم حذف {$total} توكن قديم");
        $this->info("  - {$deletedUnused} توكن غير مستخدم (30 يوم)");
        $this->info("  - {$deletedOld} توكن قديم جداً (90 يوم)");
        
        // تسجيل في ملف السجلات
        \Log::info("Token cleanup: Deleted {$total} expired tokens");
        
        return Command::SUCCESS;
    }
}