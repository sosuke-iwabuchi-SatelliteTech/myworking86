<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\UserPoint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UserSortTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_sort_users_by_points()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $user1 = User::factory()->create(['name' => 'User Low', 'role' => 'user']);
        UserPoint::create(['user_id' => $user1->id, 'points' => 10]);

        $user2 = User::factory()->create(['name' => 'User High', 'role' => 'user']);
        UserPoint::create(['user_id' => $user2->id, 'points' => 100]);

        $user3 = User::factory()->create(['name' => 'User Zero', 'role' => 'user']);
        // No UserPoint record, implies 0 or null depending on join

        // Ascending
        $responseAsc = $this->actingAs($admin)
            ->get(route('admin.users.index', ['sort' => 'points', 'direction' => 'asc']));

        $responseAsc->assertStatus(200);
        $responseAsc->assertInertia(
            fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->has('users.data', 3) // Only regular users (admin excluded)
            // Logic: user3 (null/0), user1 (10), user2 (100)
            // We just check the order of specific users we know.
        );

        // We can verify the order in the returned data more specifically using ->where or inspecting props
        $dataAsc = $responseAsc->inertiaProps()['users']['data'];
        // Extract IDs or Names to check order

        // Descending
        $responseDesc = $this->actingAs($admin)
            ->get(route('admin.users.index', ['sort' => 'points', 'direction' => 'desc']));

        $responseDesc->assertStatus(200);
        $dataDesc = $responseDesc->inertiaProps()['users']['data'];

        // Check if High is before Low in Desc
        $highIndex = array_search('User High', array_column($dataDesc, 'name'));
        $lowIndex = array_search('User Low', array_column($dataDesc, 'name'));

        $this->assertLessThan($lowIndex, $highIndex, 'High points user should be before Low points user in descending order');
    }

    public function test_admin_can_sort_users_by_last_login_at()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $userOld = User::factory()->create(['name' => 'Old', 'last_login_at' => now()->subDays(10), 'role' => 'user']);
        $userNew = User::factory()->create(['name' => 'New', 'last_login_at' => now()->subMinutes(1), 'role' => 'user']);

        // Descending (Default usually shows newest first)
        $responseDesc = $this->actingAs($admin)
            ->get(route('admin.users.index', ['sort' => 'last_login_at', 'direction' => 'desc']));

        $dataDesc = $responseDesc->inertiaProps()['users']['data'];
        $newIndex = array_search('New', array_column($dataDesc, 'name'));
        $oldIndex = array_search('Old', array_column($dataDesc, 'name'));

        $this->assertLessThan($oldIndex, $newIndex, 'Newer login should be before Older login in descending order');

        // Ascending
        $responseAsc = $this->actingAs($admin)
            ->get(route('admin.users.index', ['sort' => 'last_login_at', 'direction' => 'asc']));

        $dataAsc = $responseAsc->inertiaProps()['users']['data'];
        $newIndexAsc = array_search('New', array_column($dataAsc, 'name'));
        $oldIndexAsc = array_search('Old', array_column($dataAsc, 'name'));

        $this->assertLessThan($newIndexAsc, $oldIndexAsc, 'Older login should be before Newer login in ascending order');
    }

    public function test_default_sort_is_last_login_at_desc()
    {
        $admin = User::factory()->create(['role' => 'admin', 'last_login_at' => now()->subDays(5)]);

        $userOld = User::factory()->create(['name' => 'Old Login', 'last_login_at' => now()->subDays(10), 'role' => 'user']);
        $userNew = User::factory()->create(['name' => 'New Login', 'last_login_at' => now()->subMinutes(1), 'role' => 'user']);
        $userMid = User::factory()->create(['name' => 'Mid Login', 'last_login_at' => now()->subDays(3), 'role' => 'user']);

        // No sort or direction parameters - should use default
        $response = $this->actingAs($admin)
            ->get(route('admin.users.index'));

        $response->assertStatus(200);
        $data = $response->inertiaProps()['users']['data'];

        // Extract names in order
        $names = array_column($data, 'name');

        // Verify order: New Login should come before Mid Login, and Mid Login before Old Login
        $newIndex = array_search('New Login', $names);
        $midIndex = array_search('Mid Login', $names);
        $oldIndex = array_search('Old Login', $names);

        $this->assertLessThan($midIndex, $newIndex, 'New Login should be before Mid Login with default sort');
        $this->assertLessThan($oldIndex, $midIndex, 'Mid Login should be before Old Login with default sort');
    }
}
