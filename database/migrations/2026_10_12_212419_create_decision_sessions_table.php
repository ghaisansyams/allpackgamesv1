<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('decision_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visitor_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('business_case_id')->nullable()->constrained()->nullOnDelete();
            $table->string('market_slug')->nullable();
            $table->string('priority_1_slug')->nullable();
            $table->string('priority_2_slug')->nullable();
            $table->string('priority_3_slug')->nullable();
            $table->foreignId('packaging_option_id')->nullable()->constrained()->nullOnDelete();
            $table->float('weighted_score')->nullable();
            $table->unsignedInteger('fit_score')->nullable();
            $table->string('profile')->nullable();
            $table->string('strength')->nullable();
            $table->string('trade_off')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('decision_sessions');
    }
};
