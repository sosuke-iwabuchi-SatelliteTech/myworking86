<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class PrizeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_fetch_prize_list()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Data is already populated by migration 2025_12_07_092120_insert_initial_prizes_data
        // $this->seed(\Database\Seeders\PrizeSeeder::class);

        $response = $this->getJson('/api/prizes');
        // Since we defined route in 'web.php' under 'api' prefix but 'web.php' usually does NOT have 'api' prefix automatically unless grouped.
        // Wait, 'routes/web.php' has: 
        // Route::middleware('auth')->prefix('api')->group(...)
        // So it IS /api/prizes.
        // My test code used /api/prizes.


        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'type',
                        'rarity',
                        'description',
                        'imageUrl',
                    ]
                ]
            ]);

        // Verify imageUrl format
        $data = $response->json('data');
        $this->assertStringContainsString('/gacha/', $data[0]['imageUrl']);
    }
}
