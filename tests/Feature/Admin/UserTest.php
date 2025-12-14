<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_list_can_be_rendered()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)
            ->get('/admin/users');

        $response->assertStatus(200);
        $response->assertInertia(
            fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->has('users.data')
        );
    }

    public function test_user_list_search()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);
        User::factory()->create(['name' => 'Jane Doe', 'email' => 'jane@example.com']);

        $response = $this->actingAs($admin)
            ->get('/admin/users?search=John');

        $response->assertStatus(200);
        $response->assertInertia(
            fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->has('users.data', 1)
                ->where('users.data.0.name', 'John Doe')
        );
    }

    public function test_user_list_pagination()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->count(51)->create();

        $response = $this->actingAs($admin)
            ->get('/admin/users');

        $response->assertStatus(200);
        $response->assertInertia(
            fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->has('users.data', 50)
                ->has('users.links')
        );
    }
}
