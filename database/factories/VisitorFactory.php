<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VisitorFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'company' => $this->faker->company(),
            'job_title' => $this->faker->jobTitle(),
            'contact' => $this->faker->safeEmail(),
            'industry' => $this->faker->randomElement(['Food & Beverage', 'Pharmaceutical', 'Packaging']),
        ];
    }
}
