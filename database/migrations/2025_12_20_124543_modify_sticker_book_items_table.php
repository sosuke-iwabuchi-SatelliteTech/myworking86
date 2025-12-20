<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add sticker_book_id nullable first
        Schema::table('sticker_book_items', function (Blueprint $table) {
            $table->foreignUuid('sticker_book_id')->nullable()->after('id')->constrained('sticker_books')->onDelete('cascade');
        });

        // 2. Migrate existing data
        // Find all unique users who have items
        $userIds = DB::table('sticker_book_items')->distinct()->pluck('user_id');

        foreach ($userIds as $userId) {
            // Create a sticker book for this user
            $bookId = Str::uuid();
            DB::table('sticker_books')->insert([
                'id' => $bookId,
                'user_id' => $userId,
                'name' => 'My Sticker Book',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Assign items to this book
            DB::table('sticker_book_items')
                ->where('user_id', $userId)
                ->update(['sticker_book_id' => $bookId]);
        }

        // 3. Enforce not null and drop user_id
        Schema::table('sticker_book_items', function (Blueprint $table) {
            $table->uuid('sticker_book_id')->nullable(false)->change();
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sticker_book_items', function (Blueprint $table) {
            $table->foreignUuid('user_id')->nullable()->after('id')->constrained()->onDelete('cascade');
        });

        // Migrate back
        $items = DB::table('sticker_book_items')
            ->join('sticker_books', 'sticker_book_items.sticker_book_id', '=', 'sticker_books.id')
            ->select('sticker_book_items.id', 'sticker_books.user_id')
            ->get();

        foreach ($items as $item) {
            DB::table('sticker_book_items')
                ->where('id', $item->id)
                ->update(['user_id' => $item->user_id]);
        }

        Schema::table('sticker_book_items', function (Blueprint $table) {
            $table->uuid('user_id')->nullable(false)->change();
            $table->dropForeign(['sticker_book_id']);
            $table->dropColumn('sticker_book_id');
        });
    }
};
