<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Prize>
 */
class PrizeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => $this->faker->unique()->slug,
            'name' => $this->faker->words(3, true),
            'type' => $this->faker->randomElement(['toy', 'stationery', 'accessory']),
            'rarity' => $this->faker->randomElement(['UR', 'SR', 'R', 'UC', 'C']),
            'description' => $this->faker->sentence(),
            'image_url' => $this->faker->imageUrl(),
        ];
    }
}
