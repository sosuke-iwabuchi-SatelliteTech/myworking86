<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserPrize>
 */
class UserPrizeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'prize_id' => $this->faker->uuid(),
            'rarity' => $this->faker->randomElement(['N', 'R', 'SR', 'SSR', 'UR']),
            'obtained_at' => now(),
        ];
    }
}
