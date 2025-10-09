<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            // Track which email reminders have been sent
            $table->boolean('one_day_reminder_sent')->default(false)->after('image');
            $table->boolean('two_hour_reminder_sent')->default(false)->after('one_day_reminder_sent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['one_day_reminder_sent', 'two_hour_reminder_sent']);
        });
    }
};
