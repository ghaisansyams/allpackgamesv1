<?php

namespace Database\Factories;

use App\Models\BusinessCase;
use App\Models\PackagingOption;
use App\Models\Visitor;
use Illuminate\Database\Eloquent\Factories\Factory;

class DecisionSessionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'visitor_id' => Visitor::factory(),
            'business_case_id' => BusinessCase::factory(),
            'market_slug' => 'retail',
            'priority_1_slug' => 'protection',
            'priority_2_slug' => 'shelf_life',
            'priority_3_slug' => 'cost',
            'packaging_option_id' => PackagingOption::factory(),
            'weighted_score' => 4.0,
            'fit_score' => 80,
            'profile' => 'Quality-First Decision Maker',
            'strength' => 'Excellent Product Protection',
            'trade_off' => 'Higher Cost',
            'completed_at' => now(),
        ];
    }
}
