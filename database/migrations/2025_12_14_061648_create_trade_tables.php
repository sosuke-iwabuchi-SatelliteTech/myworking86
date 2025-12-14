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
        Schema::create('trade_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('sender_id')->constrained('users')->cascadeOnDelete();
            $table->uuid('receiver_id')->nullable(); // Nullable for future public listing, but indexed if needed
            $table->string('status')->index(); // pending, accepted, rejected, cancelled, completed
            $table->text('message')->nullable();
            $table->timestamps();
        });

        Schema::create('trade_request_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('trade_request_id')->constrained('trade_requests')->cascadeOnDelete();
            $table->foreignUuid('user_prize_id')->constrained('user_prizes')->cascadeOnDelete();
            $table->uuid('owner_id'); // Snapshot of who owned it at the time of trade creation/update
            $table->string('type'); // offer, request
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trade_request_items');
        Schema::dropIfExists('trade_requests');
    }
};
