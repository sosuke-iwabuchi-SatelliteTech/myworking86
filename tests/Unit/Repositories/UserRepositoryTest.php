<?php

namespace Tests\Unit\Repositories;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected UserRepository $userRepository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userRepository = new UserRepository();
    }

    public function test_get_paginated_users_returns_all_users()
    {
        User::factory()->count(10)->create();

        $result = $this->userRepository->getPaginatedUsers(null, 'created_at', 'desc', 15);

        $this->assertEquals(10, $result->total());
    }

    public function test_get_paginated_users_filters_by_search_query()
    {
        User::factory()->create(['name' => 'Alice', 'email' => 'alice@example.com']);
        User::factory()->create(['name' => 'Bob', 'email' => 'bob@example.com']);
        User::factory()->create(['name' => 'Charlie', 'email' => 'charlie@example.com']);

        // Search by name
        $result = $this->userRepository->getPaginatedUsers('Alice');
        $this->assertEquals(1, $result->total());
        $this->assertEquals('Alice', $result->items()[0]->name);

        // Search by email
        $result = $this->userRepository->getPaginatedUsers('bob@example.com');
        $this->assertEquals(1, $result->total());
        $this->assertEquals('Bob', $result->items()[0]->name);
    }

    public function test_get_paginated_users_sorts_correctly()
    {
        $user1 = User::factory()->create(['name' => 'A user', 'created_at' => now()->subDays(1)]);
        $user2 = User::factory()->create(['name' => 'B user', 'created_at' => now()]);

        // Sort by name ASC
        $result = $this->userRepository->getPaginatedUsers(null, 'name', 'asc');
        $this->assertEquals('A user', $result->items()[0]->name);

        // Sort by name DESC
        $result = $this->userRepository->getPaginatedUsers(null, 'name', 'desc');
        $this->assertEquals('B user', $result->items()[0]->name);
    }

    public function test_get_paginated_users_respects_per_page()
    {
        User::factory()->count(20)->create();

        $result = $this->userRepository->getPaginatedUsers(null, 'created_at', 'desc', 5);

        $this->assertEquals(5, $result->count());
        $this->assertEquals(20, $result->total());
    }
}
