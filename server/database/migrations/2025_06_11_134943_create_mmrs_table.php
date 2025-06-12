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
        Schema::create('mmrs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->float('mmr', 12, 2);  //total mmr
            $table->json('categories');
            $table->json('skills');
            $table->float('github', 12, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mmrs');
    }
};
