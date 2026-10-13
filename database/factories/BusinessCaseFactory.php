<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BusinessCaseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(2),
            'title' => $this->faker->words(2, true),
            'description' => $this->faker->sentence(),
            'icon' => 'coffee',
            'sort_order' => $this->faker->numberBetween(1, 10),
        ];
    }
}
