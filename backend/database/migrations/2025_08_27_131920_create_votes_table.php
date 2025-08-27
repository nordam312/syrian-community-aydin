<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('votes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('election_id')->constrained()->onDelete('cascade');
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
        $table->timestamps();

        // ضمان أن المستخدم لا يصوت أكثر من مرة في انتخابات واحدة
        $table->unique(['election_id', 'user_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
