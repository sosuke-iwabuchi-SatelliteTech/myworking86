<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Prize;
use App\Models\UserPrize;
use App\Models\StickerBook;
use App\Models\StickerBookItem;
use App\Models\TradeRequest;
use App\Models\TradeRequestItem;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StickerBookTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $prizes;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->prizes = Prize::factory()->count(3)->create();
    }

    public function test_guest_cannot_access_sticker_book()
    {
        $response = $this->getJson('/api/sticker-book');
        $response->assertStatus(401);
    }

    public function test_user_can_get_own_sticker_book_creates_default_if_missing()
    {
        $userPrize = UserPrize::create([
            'user_id' => $this->user->id,
            'prize_id' => $this->prizes[0]->id,
            'rarity' => 'C',
            'obtained_at' => now(),
        ]);

        // Manually create book and item to simulate existing state
        $book = $this->user->stickerBooks()->create(['name' => 'My Sticker Book', 'background_color' => '#ffffff']);

        $item = $book->items()->create([
            'user_prize_id' => $userPrize->id,
            'position_x' => 100,
            'position_y' => 200,
            'scale' => 1.5,
            'rotation' => 45,
            'z_index' => 1,
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/sticker-book');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['position_x' => 100, 'position_y' => 200])
            ->assertJsonPath('meta.sticker_book.background_color', '#ffffff');
    }

    public function test_user_can_save_sticker_book_and_background_color()
    {
        $userPrize1 = UserPrize::create([
            'user_id' => $this->user->id,
            'prize_id' => $this->prizes[0]->id,
            'rarity' => 'C',
            'obtained_at' => now(),
        ]);

        $data = [
            'background_color' => '#e0f2fe',
            'items' => [
                [
                    'user_prize_id' => $userPrize1->id,
                    'position_x' => 10,
                    'position_y' => 20,
                    'scale' => 1.0,
                    'rotation' => 0,
                    'z_index' => 1,
                ]
            ]
        ];

        $response = $this->actingAs($this->user)->postJson('/api/sticker-book', $data);

        $response->assertStatus(200)
            ->assertJsonPath('data.background_color', '#e0f2fe');

        // Check DB
        $book = $this->user->stickerBooks()->first();
        $this->assertNotNull($book);
        $this->assertEquals('#e0f2fe', $book->background_color);

        $this->assertDatabaseHas('sticker_book_items', [
            'sticker_book_id' => $book->id,
            'user_prize_id' => $userPrize1->id,
            'position_x' => 10,
        ]);
    }

    public function test_user_can_update_background_color_only()
    {
        // First create book
        $book = $this->user->stickerBooks()->create(['name' => 'My Sticker Book', 'background_color' => '#ffffff']);

        $data = [
            'background_color' => '#ff0000', // Red
            'items' => [] // Clear items
        ];

        $response = $this->actingAs($this->user)->postJson('/api/sticker-book', $data);

        $response->assertStatus(200);
        $this->assertEquals('#ff0000', $book->refresh()->background_color);
        $this->assertEquals(0, $book->items()->count());
    }

    public function test_user_cannot_save_sticker_book_with_others_prizes()
    {
        $otherUser = User::factory()->create();
        $otherUserPrize = UserPrize::create([
            'user_id' => $otherUser->id,
            'prize_id' => $this->prizes[0]->id,
            'rarity' => 'C',
            'obtained_at' => now(),
        ]);

        $data = [
            'items' => [
                [
                    'user_prize_id' => $otherUserPrize->id,
                    'position_x' => 10,
                    'position_y' => 20,
                    'scale' => 1.0,
                    'rotation' => 0,
                ]
            ]
        ];

        $response = $this->actingAs($this->user)->postJson('/api/sticker-book', $data);

        $response->assertStatus(422);
    }

    public function test_user_cannot_save_sticker_book_with_prizes_in_pending_trade()
    {
        $userPrize = UserPrize::create([
            'user_id' => $this->user->id,
            'prize_id' => $this->prizes[0]->id,
            'rarity' => 'C',
            'obtained_at' => now(),
        ]);

        $otherUser = User::factory()->create();
        $trade = TradeRequest::create([
            'sender_id' => $this->user->id,
            'receiver_id' => $otherUser->id,
            'status' => TradeRequest::STATUS_PENDING,
        ]);

        TradeRequestItem::create([
            'trade_request_id' => $trade->id,
            'user_prize_id' => $userPrize->id,
            'owner_id' => $this->user->id,
            'type' => 'offer',
        ]);

        $data = [
            'items' => [
                [
                    'user_prize_id' => $userPrize->id,
                    'position_x' => 10,
                    'position_y' => 20,
                    'scale' => 1.0,
                    'rotation' => 0,
                ]
            ]
        ];

        $response = $this->actingAs($this->user)->postJson('/api/sticker-book', $data);

        $response->assertStatus(422)
            ->assertJsonFragment(['message' => 'One or more items are currently in a pending trade']);
    }

    public function test_sticker_prizes_are_not_in_tradable_list()
    {
        $userPrize = UserPrize::create([
            'user_id' => $this->user->id,
            'prize_id' => $this->prizes[0]->id,
            'rarity' => 'C',
            'obtained_at' => now(),
        ]);

        // Tradable list should include it initially (raw check since Resource might wrap it)
        $response = $this->actingAs($this->user)->getJson('/api/user/prizes/tradable');
        $response->assertJsonFragment(['id' => $userPrize->id]);

        // Place it in sticker book
        $book = $this->user->stickerBooks()->create(['name' => 'Default']);
        $book->items()->create([
            'user_prize_id' => $userPrize->id,
            'position_x' => 100,
            'position_y' => 200,
            'scale' => 1.0,
            'rotation' => 0,
            'z_index' => 1,
        ]);

        // Tradable list should NOT include it now
        $response = $this->actingAs($this->user)->getJson('/api/user/prizes/tradable');
        $response->assertJsonMissing(['id' => $userPrize->id]);
    }

    public function test_user_can_save_sticker_book_with_z_index_and_retrieves_ordered()
    {
        $userPrize1 = UserPrize::create([
            'user_id' => $this->user->id,
            'prize_id' => $this->prizes[0]->id,
            'rarity' => 'C',
            'obtained_at' => now(),
        ]);

        $userPrize2 = UserPrize::create([
            'user_id' => $this->user->id,
            'prize_id' => $this->prizes[1]->id,
            'rarity' => 'C',
            'obtained_at' => now(),
        ]);

        $data = [
            'items' => [
                [
                    'user_prize_id' => $userPrize1->id,
                    'position_x' => 10,
                    'position_y' => 20,
                    'scale' => 1.0,
                    'rotation' => 0,
                    'z_index' => 10,
                ],
                [
                    'user_prize_id' => $userPrize2->id,
                    'position_x' => 30,
                    'position_y' => 40,
                    'scale' => 1.0,
                    'rotation' => 0,
                    'z_index' => 5,
                ]
            ]
        ];

        // Save
        $this->actingAs($this->user)->postJson('/api/sticker-book', $data)->assertStatus(200);

        // Fetch and verify order (should be sorted by z_index ASC: 5 then 10)
        $response = $this->actingAs($this->user)->getJson('/api/sticker-book');

        $response->assertStatus(200);
        $items = $response->json('data');

        $this->assertCount(2, $items);
        $this->assertEquals($userPrize2->id, $items[0]['user_prize_id']); // z_index 5
        $this->assertEquals(5, $items[0]['z_index']);

        $this->assertEquals($userPrize1->id, $items[1]['user_prize_id']); // z_index 10
        $this->assertEquals(10, $items[1]['z_index']);
    }
}
