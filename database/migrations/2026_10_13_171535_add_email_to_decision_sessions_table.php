<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The "send result to email" action now captures the address itself (rather than relying
     * on the visitor's contact field, which may not exist at all for anonymous "Skip and
     * play" sessions, or may hold a phone number now that join collects phone separately from
     * email) — the booth team follows up manually rather than an automated send.
     */
    public function up(): void
    {
        Schema::table('decision_sessions', function (Blueprint $table) {
            $table->string('email')->nullable()->after('visitor_id');
            $table->timestamp('email_requested_at')->nullable()->after('completed_at');
        });
    }

    public function down(): void
    {
        Schema::table('decision_sessions', function (Blueprint $table) {
            $table->dropColumn(['email', 'email_requested_at']);
        });
    }
};
