<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packaging_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_case_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            $table->string('description');
            $table->json('applicable_markets')->nullable();
            $table->json('scores');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packaging_options');
    }
};
