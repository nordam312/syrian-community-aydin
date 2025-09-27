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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('student_id');
            $table->string('name');
            $table->string('role');
            $table->string('department')->nullable();
            $table->string('major')->nullable();
            $table->string('year')->nullable();
            $table->string('instagram')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_leader')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            // Indexes for better performance
            $table->index('student_id');
            $table->index('is_leader');
            $table->index('is_active');
            $table->index('display_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
