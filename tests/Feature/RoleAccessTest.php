<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_access_dashboard()
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertStatus(200);
    }

    public function test_user_cannot_access_admin_dashboard()
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get(route('admin.dashboard'));

        // Should be logged out and redirected to login
        $response->assertRedirect(route('login'));
        $this->assertGuest();
    }

    public function test_admin_can_access_admin_dashboard()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertStatus(200);
    }

    public function test_admin_cannot_access_user_dashboard()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get(route('dashboard'));

        // Should be logged out and redirected to home (quiz top)
        $response->assertRedirect('/');
        $this->assertGuest();
    }

    public function test_api_login_allows_user()
    {
        $response = $this->post('/api/user/login', [
            'id' => 'test-user-id',
            'name' => 'Test User',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', ['id' => 'test-user-id', 'role' => 'user']);
    }

    public function test_api_login_denies_existing_admin()
    {
        // First create an admin with that ID (manually, as API would default to user)
        User::create([
            'id' => 'admin-id',
            'name' => 'Admin',
            'role' => 'admin',
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/api/user/login', [
            'id' => 'admin-id',
            'name' => 'Admin',
        ]);

        $response->assertStatus(403);
    }
}
