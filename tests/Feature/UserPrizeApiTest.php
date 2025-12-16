<?php

use App\Models\User;
use App\Models\UserPrize;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
// use Laravel\Sanctum\Sanctum; // Removed
use Tests\TestCase;

class UserPrizeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_prize()
    {
        $user = User::factory()->create();
        $this->actingAs($user); // Changed from Sanctum::actingAs

        $prizeId = 'ur-a-1'; // String ID
        $rarity = 'SSR';

        $response = $this->postJson('/api/user/prizes', [
            'prize_id' => $prizeId,
            'rarity' => $rarity,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'user_id' => $user->id,
                'prize_id' => $prizeId,
                'rarity' => $rarity,
            ]);

        $this->assertDatabaseHas('user_prizes', [
            'user_id' => $user->id,
            'prize_id' => $prizeId,
            'rarity' => $rarity,
        ]);
    }

    public function test_user_can_get_owned_prizes_with_counts_sorted_by_rarity()
    {
        $user = User::factory()->create();
        $this->actingAs($user); // Changed from Sanctum::actingAs

        // Create prizes with different rarities
        UserPrize::factory()->create(['user_id' => $user->id, 'prize_id' => 'r-1', 'rarity' => 'R']);
        UserPrize::factory()->create(['user_id' => $user->id, 'prize_id' => 'ur-1', 'rarity' => 'UR']);
        UserPrize::factory()->create(['user_id' => $user->id, 'prize_id' => 'c-1', 'rarity' => 'C']);
        UserPrize::factory()->create(['user_id' => $user->id, 'prize_id' => 'sr-1', 'rarity' => 'SR']);
        UserPrize::factory()->create(['user_id' => $user->id, 'prize_id' => 'uc-1', 'rarity' => 'UC']);

        // Duplicate to test count
        UserPrize::factory()->create(['user_id' => $user->id, 'prize_id' => 'ur-1', 'rarity' => 'UR']);

        $response = $this->getJson('/api/user/prizes');

        $response->assertStatus(200);

        $data = $response->json();

        // Verify count
        $this->assertCount(5, $data);

        // Verify Order: UR -> SR -> R -> UC -> C
        $this->assertEquals('UR', $data[0]['rarity']);
        $this->assertEquals('SR', $data[1]['rarity']);
        $this->assertEquals('R', $data[2]['rarity']);
        $this->assertEquals('UC', $data[3]['rarity']);
        $this->assertEquals('C', $data[4]['rarity']);

        // Verify specific item count
        $this->assertEquals('ur-1', $data[0]['prize_id']);
        $this->assertEquals(2, $data[0]['count']);
    }

    public function test_user_can_get_tradable_prizes_of_another_user()
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create(['name' => 'Target User']);
        $this->actingAs($user);

        UserPrize::factory()->create(['user_id' => $targetUser->id, 'prize_id' => 'p-1', 'rarity' => 'C']);

        $response = $this->getJson("/api/users/{$targetUser->id}/prizes/tradable");

        $response->assertStatus(200)
            ->assertJson([
                'user' => [
                    'id' => $targetUser->id,
                    'name' => 'Target User',
                ],
                'data' => [
                    [
                        'prize_id' => 'p-1',
                        'user_id' => $targetUser->id,
                    ]
                ]
            ]);
    }

    public function test_unauthenticated_user_cannot_access_prize_apis()
    {
        // Expect 302 Redirect to login for web auth, NOT 401
        // Or if we request JSON (Ajax), Laravel default is 401.
        // Let's verify standard Laravel behavior for postJson/getJson on web middleware.
        // It usually returns 401 message "Unauthenticated."

        $this->postJson('/api/user/prizes', [
            'prize_id' => (string) Str::uuid(),
            'rarity' => 'N',
        ])->assertStatus(401);

        $this->getJson('/api/user/prizes')->assertStatus(401);
    }
}
