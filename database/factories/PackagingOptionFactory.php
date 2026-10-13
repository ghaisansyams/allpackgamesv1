<?php

namespace Database\Factories;

use App\Models\BusinessCase;
use Illuminate\Database\Eloquent\Factories\Factory;

class PackagingOptionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'business_case_id' => BusinessCase::factory(),
            'label' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'applicable_markets' => null,
            'scores' => [
                'protection' => 4,
                'shelf_life' => 4,
                'cost' => 3,
                'sustainability' => 3,
                'convenience' => 4,
                'presentation' => 3,
            ],
            'sort_order' => $this->faker->numberBetween(1, 3),
        ];
    }
}
