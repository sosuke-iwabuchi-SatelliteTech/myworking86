<?php

namespace Tests\Feature\Trading;

use App\Models\TradeRequest;
use App\Models\User;
use App\Models\UserPrize;
use App\Models\Prize;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TradeFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected $userA;
    protected $userB;
    protected $prizeA;
    protected $prizeB;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userA = User::factory()->create();
        $this->userB = User::factory()->create();

        // Create some prizes manually since PrizeFactory might not exist or be simple
        $prizeData1 = Prize::create([
            'id' => 'prize-1',
            'name' => 'Prize 1',
            'type' => 'figure',
            'rarity' => 'SSR',
            'description' => 'Test Prize 1',
            'image_url' => 'http://example.com/1.jpg'
        ]);
        $prizeData2 = Prize::create([
            'id' => 'prize-2',
            'name' => 'Prize 2',
            'type' => 'figure',
            'rarity' => 'SR',
            'description' => 'Test Prize 2',
            'image_url' => 'http://example.com/2.jpg'
        ]);

        $this->prizeA = UserPrize::factory()->create([
            'user_id' => $this->userA->id,
            'prize_id' => $prizeData1->id,
        ]);

        $this->prizeB = UserPrize::factory()->create([
            'user_id' => $this->userB->id,
            'prize_id' => $prizeData2->id,
        ]);
    }

    public function test_can_create_trade_request()
    {
        $response = $this->actingAs($this->userA)
            ->postJson('/api/trades', [
                'receiver_id' => $this->userB->id,
                'offered_user_prize_ids' => [$this->prizeA->id],
                'requested_user_prize_ids' => [$this->prizeB->id],
                'message' => 'Please trade!',
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('trade_requests', [
            'sender_id' => $this->userA->id,
            'receiver_id' => $this->userB->id,
            'status' => TradeRequest::STATUS_PENDING,
        ]);

        $tradeId = $response->json('id');
        $this->assertDatabaseHas('trade_request_items', [
            'trade_request_id' => $tradeId,
            'user_prize_id' => $this->prizeA->id,
            'owner_id' => $this->userA->id,
            'type' => 'offer',
        ]);
    }

    public function test_cannot_trade_unowned_items()
    {
        $response = $this->actingAs($this->userA)
            ->postJson('/api/trades', [
                'receiver_id' => $this->userB->id,
                'offered_user_prize_ids' => [$this->prizeB->id], // User A does not own this
                'message' => 'Scam attempt',
            ]);

        $response->assertStatus(422);
    }

    public function test_can_accept_trade_request()
    {
        // Setup existing trade
        $trade = TradeRequest::create([
            'sender_id' => $this->userA->id,
            'receiver_id' => $this->userB->id,
            'status' => TradeRequest::STATUS_PENDING,
        ]);

        $trade->items()->create([
            'user_prize_id' => $this->prizeA->id,
            'owner_id' => $this->userA->id,
            'type' => 'offer',
        ]);

        $trade->items()->create([
            'user_prize_id' => $this->prizeB->id,
            'owner_id' => $this->userB->id,
            'type' => 'request',
        ]);

        // User B accepts
        $response = $this->actingAs($this->userB)
            ->putJson("/api/trades/{$trade->id}/accept");

        $response->assertStatus(200);

        // Verify ownership swap
        $this->assertEquals($this->userB->id, $this->prizeA->refresh()->user_id);
        $this->assertEquals($this->userA->id, $this->prizeB->refresh()->user_id);

        $this->assertDatabaseHas('trade_requests', [
            'id' => $trade->id,
            'status' => TradeRequest::STATUS_COMPLETED,
        ]);
    }

    public function test_cannot_double_trade_items()
    {
        // Create trade 1
        $this->actingAs($this->userA)
            ->postJson('/api/trades', [
                'receiver_id' => $this->userB->id,
                'offered_user_prize_ids' => [$this->prizeA->id],
            ]);

        // Try to create trade 2 with same item
        $response = $this->actingAs($this->userA)
            ->postJson('/api/trades', [
                'receiver_id' => $this->userB->id,
                'offered_user_prize_ids' => [$this->prizeA->id],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['offered_user_prize_ids']);
    }

    public function test_accepting_trade_cancels_conflicting_trades()
    {
        // Trade 1: A offers X to B
        $trade1 = TradeRequest::create([
            'sender_id' => $this->userA->id,
            'receiver_id' => $this->userB->id,
            'status' => TradeRequest::STATUS_PENDING,
        ]);
        $trade1->items()->create([
            'user_prize_id' => $this->prizeA->id,
            'owner_id' => $this->userA->id,
            'type' => 'offer',
        ]);

        // Trade 2: A offers X to another user (simulate by manually creating DB records since API blocks it)
        // Actually API blocks creation if pending exists. So we must insert manually to test the 'cleanup' logic 
        // which handles edge cases or race conditions, OR if we relax the creation rule.
        // But our current logic blocks creation. 
        // Let's assume there WAS a way (e.g. concurrent requests passed validation).
        // We manually insert a conflicting trade.

        $userC = User::factory()->create();
        $trade2 = TradeRequest::create([
            'sender_id' => $this->userA->id,
            'receiver_id' => $userC->id,
            'status' => TradeRequest::STATUS_PENDING,
        ]);
        $trade2->items()->create([
            'user_prize_id' => $this->prizeA->id,
            'owner_id' => $this->userA->id,
            'type' => 'offer',
        ]);

        // User B accepts Trade 1
        $this->actingAs($this->userB)
            ->putJson("/api/trades/{$trade1->id}/accept")
            ->assertStatus(200);

        // Trade 1 should be completed
        $this->assertEquals(TradeRequest::STATUS_COMPLETED, $trade1->refresh()->status);

        // Trade 2 should be cancelled because item X is gone
        $this->assertEquals(TradeRequest::STATUS_CANCELLED, $trade2->refresh()->status);
    }
}
