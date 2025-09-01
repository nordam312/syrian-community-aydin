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
    Schema::create('candidates', function (Blueprint $table) {
        $table->id();
        $table->foreignId('election_id')->constrained()->onDelete('cascade');
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('display_name'); // الاسم المستعار
        $table->string('position');
        $table->text('bio')->nullable();
        $table->text('platform')->nullable();
        $table->string('image')->nullable();
        $table->timestamps();
        $table->unique(['election_id', 'user_id']);
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};
