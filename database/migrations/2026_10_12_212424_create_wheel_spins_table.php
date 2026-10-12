<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wheel_spins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visitor_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('wheel_segment_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_correct')->nullable();
            $table->timestamp('handoff_requested_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wheel_spins');
    }
};
