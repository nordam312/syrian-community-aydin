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
        Schema::create('email_tracking', function (Blueprint $table) {
            $table->id();
            $table->string('service', 50); // brevo, resend, hostinger
            $table->date('date');
            $table->integer('count')->default(0);
            $table->integer('success_count')->default(0);
            $table->integer('failed_count')->default(0);
            $table->json('hourly_breakdown')->nullable(); // تفصيل لكل ساعة
            $table->timestamps();
            
            $table->unique(['service', 'date']);
            $table->index('date');
        });
        
        // جدول لتتبع كل إيميل
        Schema::create('email_logs', function (Blueprint $table) {
            $table->id();
            $table->string('service', 50);
            $table->string('to_email');
            $table->string('type', 50); // verification, password_reset, notification
            $table->string('status', 20); // sent, failed, pending
            $table->text('error_message')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index(['service', 'created_at']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_logs');
        Schema::dropIfExists('email_tracking');
    }
};