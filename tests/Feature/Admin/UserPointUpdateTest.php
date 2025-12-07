<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\UserPoint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserPointUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_add_points_to_user()
    {
        $admin = User::factory()->create(); // Assuming admin logic or generic auth for now
        // If there's specific admin role/gate, we might need to adjust. 
        // Based on routes, it's just 'auth' and 'verified' and prefix 'admin'.
        // Wait, route middleware is 'auth', 'verified'. Is there an admin gate?
        // Route definition: Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')
        // So any verified user can access admin? That seems to be the current state of codebase based on routes/web.php.

        $user = User::factory()->create();
        UserPoint::create(['user_id' => $user->id, 'points' => 100]);

        $response = $this->actingAs($admin)
            ->put(route('admin.users.updatePoints', $user), [
                'points' => 50,
                'action' => 'add',
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('user_points', [
            'user_id' => $user->id,
            'points' => 150,
        ]);
    }

    public function test_admin_can_subtract_points_from_user()
    {
        $admin = User::factory()->create();
        $user = User::factory()->create();
        UserPoint::create(['user_id' => $user->id, 'points' => 100]);

        $response = $this->actingAs($admin)
            ->put(route('admin.users.updatePoints', $user), [
                'points' => 30,
                'action' => 'sub',
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('user_points', [
            'user_id' => $user->id,
            'points' => 70,
        ]);
    }

    public function test_admin_can_set_points_for_user()
    {
        $admin = User::factory()->create();
        $user = User::factory()->create();
        UserPoint::create(['user_id' => $user->id, 'points' => 100]);

        $response = $this->actingAs($admin)
            ->put(route('admin.users.updatePoints', $user), [
                'points' => 500,
                'action' => 'set',
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('user_points', [
            'user_id' => $user->id,
            'points' => 500,
        ]);
    }

    public function test_points_cannot_be_negative()
    {
        $admin = User::factory()->create();
        $user = User::factory()->create();
        UserPoint::create(['user_id' => $user->id, 'points' => 10]);

        $response = $this->actingAs($admin)
            ->put(route('admin.users.updatePoints', $user), [
                'points' => 50,
                'action' => 'sub',
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('user_points', [
            'user_id' => $user->id,
            'points' => 0,
        ]);
    }
}
