<?php

namespace Tests\Feature\Trading;

use App\Models\TradeRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TradePartnersTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_fetch_past_trade_partners()
    {
        // 1. Setup Users
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $userC = User::factory()->create();

        // 2. Create Completed Trade between A and B
        // A is sender, B is receiver
        TradeRequest::create([
            'sender_id' => $userA->id, // Changed from user_id to sender_id
            'receiver_id' => $userB->id, // Changed from target_user_id to receiver_id
            'status' => TradeRequest::STATUS_COMPLETED,
        ]);

        // 3. Authenticate as A and fetch partners
        $response = $this->actingAs($userA)->getJson('/api/user/trade-partners');

        // 4. Verify B is in the list
        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['id' => $userB->id]);

        // 5. Authenticate as B and fetch partners
        $responseB = $this->actingAs($userB)->getJson('/api/user/trade-partners');

        // 6. Verify A is in the list
        $responseB->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['id' => $userA->id]);

        // 7. Authenticate as C (no trades) and fetch partners
        $responseC = $this->actingAs($userC)->getJson('/api/user/trade-partners');

        // 8. Verify list is empty
        $responseC->assertStatus(200)
            ->assertJsonCount(0);
    }
}
