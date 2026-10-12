<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // One row per physical wedge on the wheel. Every wedge renders identically (a mystery
        // box) on the frontend regardless of `outcome`, so the visitor can never tell which
        // wedge is the prize before spinning. See ContentSeeder for the 1-win / 7-bomb mix.
        Schema::create('wheel_segments', function (Blueprint $table) {
            $table->id();
            $table->enum('outcome', ['win', 'bomb']);
            $table->string('reward_label')->nullable();
            $table->string('message');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wheel_segments');
    }
};
