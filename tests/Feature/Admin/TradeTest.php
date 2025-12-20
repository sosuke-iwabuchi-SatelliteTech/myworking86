<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\TradeRequest;
use App\Models\UserPrize;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TradeTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_trade_list()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get(route('admin.trades.index'));

        $response->assertStatus(200);
    }

    public function test_user_cannot_access_trade_list()
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get(route('admin.trades.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_filter_trades_by_sender_name()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $sender1 = User::factory()->create(['name' => 'Alice']);
        $sender2 = User::factory()->create(['name' => 'Bob']);
        $receiver = User::factory()->create();

        TradeRequest::create([
            'sender_id' => $sender1->id,
            'receiver_id' => $receiver->id,
            'status' => 'pending',
        ]);

        TradeRequest::create([
            'sender_id' => $sender2->id,
            'receiver_id' => $receiver->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.trades.index', ['sender_name' => 'Alice']));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($page) => $page
                ->has('trades.data', 1)
                ->where('trades.data.0.sender.name', 'Alice')
        );
    }

    public function test_admin_can_view_trade_detail()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $sender = User::factory()->create();
        $receiver = User::factory()->create();

        $trade = TradeRequest::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'status' => 'pending',
            'message' => 'Hello',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.trades.show', $trade->id));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($page) => $page
                ->component('Admin/Trades/Show')
                ->where('trade.id', $trade->id)
                ->where('trade.message', 'Hello')
        );
    }
}
