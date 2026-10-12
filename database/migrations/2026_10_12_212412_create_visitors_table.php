<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('company');
            $table->string('job_title');
            $table->string('contact');
            $table->string('industry');
            $table->string('industry_other')->nullable();
            $table->timestamp('email_sent_at')->nullable();
            $table->timestamp('handoff_requested_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitors');
    }
};
