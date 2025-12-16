<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserPrize;
use App\Models\TradeRequest;
use App\Models\TradeRequestItem;
use App\Models\Prize;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class TradeShowApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_show_trade_returns_correct_structure_and_image_url()
    {
        // Mock Config
        Config::set('gacha.image_host', 'https://example.com/');

        $sender = User::factory()->create();
        $receiver = User::factory()->create();
        $this->actingAs($sender);

        $prize = Prize::create([
            'id' => 'test-prize-1',
            'name' => 'Test Prize',
            'type' => 'figure',
            'rarity' => 'SSR',
            'description' => 'A test prize',
            'image_url' => 'test-image.png'
        ]);
        $userPrize = UserPrize::factory()->create(['user_id' => $sender->id, 'prize_id' => $prize->id]);

        $trade = TradeRequest::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'status' => TradeRequest::STATUS_PENDING,
            'message' => 'Trade Request',
        ]);

        $item = $trade->items()->create([
            'user_prize_id' => $userPrize->id,
            'owner_id' => $sender->id,
            'type' => TradeRequestItem::TYPE_OFFER,
        ]);

        $response = $this->getJson("/api/trades/{$trade->id}");

        $response->assertStatus(200);

        // Verify Structure
        $response->assertJsonStructure([
            'data' => [
                'id',
                'sender_id',
                'receiver_id',
                'status',
                'message',
                'items' => [
                    '*' => [
                        'id',
                        'userPrize' => [
                            'id',
                            'prize' => [
                                'imageUrl' // Key we are testing
                            ]
                        ]
                    ]
                ]
            ]
        ]);

        // Verify Image URL
        $data = $response->json('data');
        $this->assertEquals('https://example.com/test-image.png', $data['items'][0]['userPrize']['prize']['imageUrl']);
    }
}
