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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index(); // Full name, indexed for search
            $table->string('email')->unique()->index(); // Email for login, unique
            $table->string('password'); // Hashed password for JWT auth
            $table->string('location')->nullable()->index(); // City/country for talent discovery
            $table->enum('role', ['individual', 'mentor', 'industry', 'admin'])->default('individual')->index(); // User role
            $table->string('github_id')->nullable()->unique()->index(); // GitHub user ID for API integration
            $table->text('bio')->nullable(); // Short bio to showcase expertise
            $table->string('profile_picture')->nullable(); // URL or path to profile image
            $table->rememberToken(); // For "remember me" functionality
            $table->timestamp('email_verified_at')->nullable(); // For email verification
            $table->timestamps(); // Created_at and updated_at
            $table->softDeletes(); // Soft delete for user recovery
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
