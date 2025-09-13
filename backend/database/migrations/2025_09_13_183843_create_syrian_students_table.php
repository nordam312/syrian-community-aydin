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
        Schema::create('syrian_students', function (Blueprint $table) {
            $table->id();
            $table->string('student_id')->unique(); // رقم الطالب
            $table->string('name')->nullable(); // اسم الطالب (اختياري)
            $table->boolean('is_active')->default(true); // حالة النشاط
            $table->timestamps();

            // فهرس للبحث السريع
            $table->index('student_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('syrian_students');
    }
};
