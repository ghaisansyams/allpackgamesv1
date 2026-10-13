<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * One row per "scan the QR on the booth screen" attempt. The touch screen creates this
     * row and shows `token` as a QR code; the visitor's own phone opens /join/{token} and
     * submits the biodata form there, which claims the session and broadcasts an event the
     * booth screen is listening for — see VisitorJoinedBoothSession.
     */
    public function up(): void
    {
        Schema::create('booth_sessions', function (Blueprint $table) {
            $table->id();
            $table->uuid('token')->unique();
            $table->foreignId('visitor_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status')->default('waiting');
            $table->timestamp('claimed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booth_sessions');
    }
};
