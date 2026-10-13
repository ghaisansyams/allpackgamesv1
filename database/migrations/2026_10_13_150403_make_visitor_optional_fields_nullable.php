<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The join form was simplified to just name + an optional email — company, job title,
     * industry, and contact are no longer collected, so they can't stay required.
     */
    public function up(): void
    {
        Schema::table('visitors', function (Blueprint $table) {
            $table->string('company')->nullable()->change();
            $table->string('job_title')->nullable()->change();
            $table->string('contact')->nullable()->change();
            $table->string('industry')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('visitors', function (Blueprint $table) {
            $table->string('company')->nullable(false)->change();
            $table->string('job_title')->nullable(false)->change();
            $table->string('contact')->nullable(false)->change();
            $table->string('industry')->nullable(false)->change();
        });
    }
};
