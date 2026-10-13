<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * `contact` goes back to being the (required) phone number; this adds a separate,
     * optional email field rather than reusing `contact` for it. `contact` stays nullable at
     * the DB level — "required" for it is enforced by validation, not a DB constraint, since
     * some rows already exist without one from the brief window it was optional.
     */
    public function up(): void
    {
        Schema::table('visitors', function (Blueprint $table) {
            $table->string('email')->nullable()->after('contact');
        });
    }

    public function down(): void
    {
        Schema::table('visitors', function (Blueprint $table) {
            $table->dropColumn('email');
        });
    }
};
