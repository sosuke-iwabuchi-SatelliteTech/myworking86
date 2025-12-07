<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LastLoginUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_last_login_at_is_updated_on_login()
    {
        $user = User::factory()->create(['last_login_at' => null]);

        // Using the API login route as defined in routes/web.php or api.php
        // Route::post('/login', [ApiUserController::class, 'login']); is in web.php (odd place but okay)

        $response = $this->postJson('/login', [
            'id' => $user->id,
            'name' => $user->name, // Optional but good practice
            'grade' => $user->grade,
        ]);

        $response->assertStatus(200);

        $user->refresh();
        $this->assertNotNull($user->last_login_at);
        // Ensure it's recent
        $this->assertTrue($user->last_login_at->diffInMinutes(now()) < 1);
    }
}
