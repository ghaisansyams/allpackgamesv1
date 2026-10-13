<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Lightweight shared result-tracking for the three new mini games (Memory Match, Packaging
     * Puzzle, Stop at 10.00). Content for these games is hardcoded in the frontend for now —
     * admin management is explicitly out of scope until a later pass — so this table exists
     * only so results still show up in the Leads report.
     */
    public function up(): void
    {
        Schema::create('mini_game_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visitor_id')->nullable()->constrained()->nullOnDelete();
            $table->string('game');
            $table->boolean('won');
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mini_game_attempts');
    }
};
