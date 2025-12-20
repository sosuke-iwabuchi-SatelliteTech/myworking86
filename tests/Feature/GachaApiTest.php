<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserPoint;
use App\Models\GachaHistory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class GachaApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_gacha_status_returns_correct_points()
    {
        $user = User::factory()->create();
        UserPoint::create(['user_id' => $user->id, 'points' => 500]);
        $this->actingAs($user);

        $response = $this->getJson('/api/gacha/status');

        $response->assertStatus(200)
            ->assertJson([
                'points' => 500,
                'isFreeAvailable' => true, // Assuming no history today
                'cost' => 300,
            ]);
    }

    public function test_gacha_pull_consumes_points_when_not_free()
    {
        Carbon::setTestNow(Carbon::today());
        $user = User::factory()->create();
        UserPoint::create(['user_id' => $user->id, 'points' => 500]);
        $this->seed(\Database\Seeders\PrizeSeeder::class);

        // Create a history to consume free pull
        GachaHistory::create([
            'user_id' => $user->id,
            'prize_id' => 'dummy',
            'rarity' => 'C',
            'consumed_points' => 0,
            'created_at' => Carbon::now(),
        ]);

        $this->actingAs($user);

        $response = $this->postJson('/api/gacha/pull');

        $response->assertStatus(200);
        $this->assertArrayHasKey('result', $response->json());
        $this->assertEquals(200, $response->json()['points']); // 500 - 300

        $this->assertDatabaseHas('user_points', [
            'user_id' => $user->id,
            'points' => 200,
        ]);
    }

    public function test_gacha_pull_fails_if_not_enough_points()
    {
        Carbon::setTestNow(Carbon::today());
        $user = User::factory()->create();
        UserPoint::create(['user_id' => $user->id, 'points' => 100]); // Less than 300

        // Create a history to consume free pull
        GachaHistory::create([
            'user_id' => $user->id,
            'prize_id' => 'dummy',
            'rarity' => 'C',
            'consumed_points' => 0,
            'created_at' => Carbon::now(),
        ]);

        $this->actingAs($user);

        $response = $this->postJson('/api/gacha/pull');

        $response->assertStatus(400);
        $this->assertEquals('ポイントが足りません', $response->json('message'));
    }

    public function test_gacha_pull_returns_is_new_correctly()
    {
        Carbon::setTestNow(Carbon::today());
        $user = User::factory()->create();
        UserPoint::create(['user_id' => $user->id, 'points' => 300]); // For second pull
        $this->actingAs($user);

        // Mock GachaService to return a fixed item
        $mockItem = [
            'id' => 'prize-123',
            'name' => 'Test Prize',
            'rarity' => 'UR',
            'imageUrl' => '/images/test.png',
        ];

        $this->mock(\App\Services\GachaService::class, function ($mock) use ($mockItem) {
            $mock->shouldReceive('pull')->andReturn($mockItem);
        });

        // First pull (Free)
        $response = $this->postJson('/api/gacha/pull');
        $response->assertStatus(200)
            ->assertJson([
                'result' => $mockItem,
                'isNew' => true,
            ]);

        // Second pull (Points)
        $response = $this->postJson('/api/gacha/pull');
        $response->assertStatus(200)
            ->assertJson([
                'result' => $mockItem,
                'isNew' => false,
            ]);
    }
}
