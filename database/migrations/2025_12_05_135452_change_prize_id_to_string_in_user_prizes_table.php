<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_prizes', function (Blueprint $table) {
            $table->string('prize_id')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_prizes', function (Blueprint $table) {
            // Note: This might fail if there are non-UUID values in the column when rolling back
            $table->uuid('prize_id')->change();
        });
    }
};
