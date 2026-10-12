<?php

namespace App\Services;

use App\Models\PackagingOption;

class PackagingScoringService
{
    /**
     * @var array<int, float> Backend weight suggestion from the proposal: 1st = 40%, 2nd = 35%, 3rd = 25%.
     */
    private const PRIORITY_WEIGHTS = [0.40, 0.35, 0.25];

    /**
     * @var array<string, string> Profile label shown for each top-priority factor.
     */
    private const PROFILE_LABELS = [
        'protection' => 'Quality-First Decision Maker',
        'shelf_life' => 'Reliability-Focused Decision Maker',
        'cost' => 'Cost-Conscious Decision Maker',
        'sustainability' => 'Sustainability-Driven Decision Maker',
        'convenience' => 'Efficiency-Focused Decision Maker',
        'presentation' => 'Brand-Focused Decision Maker',
    ];

    /**
     * @var array<string, string> Strength label shown when a factor scores highest.
     */
    private const STRENGTH_LABELS = [
        'protection' => 'Excellent Product Protection',
        'shelf_life' => 'Long Shelf Life',
        'cost' => 'Strong Cost Efficiency',
        'sustainability' => 'Strong Sustainability Profile',
        'convenience' => 'High Convenience',
        'presentation' => 'Strong Shelf Presentation',
    ];

    /**
     * @var array<string, string> Trade-off label shown when a factor scores lowest.
     */
    private const TRADE_OFF_LABELS = [
        'protection' => 'Limited Protection',
        'shelf_life' => 'Shorter Shelf Life',
        'cost' => 'Higher Cost',
        'sustainability' => 'Limited Sustainability',
        'convenience' => 'Less Convenient',
        'presentation' => 'Simpler Presentation',
    ];

    /**
     * @param  string[]  $priorities  Ordered top-3 priority slugs (1st, 2nd, 3rd).
     * @return array{weighted_score: float, fit_score: int, profile: string, strength: string, trade_off: string}
     */
    public function score(PackagingOption $option, array $priorities): array
    {
        $scores = $option->scores;

        $weightedScore = 0.0;
        foreach ($priorities as $index => $prioritySlug) {
            $weight = self::PRIORITY_WEIGHTS[$index] ?? 0;
            $weightedScore += ($scores[$prioritySlug] ?? 0) * $weight;
        }

        $fitScore = (int) round(($weightedScore / 5) * 100);

        $topPriority = $priorities[0];

        [$strengthFactor, $tradeOffFactor] = $this->strengthAndTradeOffFactors($scores);

        return [
            'weighted_score' => round($weightedScore, 2),
            'fit_score' => $fitScore,
            'profile' => self::PROFILE_LABELS[$topPriority] ?? 'Balanced Decision Maker',
            'strength' => self::STRENGTH_LABELS[$strengthFactor] ?? 'Balanced Performance',
            'trade_off' => self::TRADE_OFF_LABELS[$tradeOffFactor] ?? 'Minor Trade-off',
        ];
    }

    /**
     * @param  array<string, int>  $scores
     * @return array{0: string, 1: string} Highest-scoring and lowest-scoring factor slugs.
     */
    private function strengthAndTradeOffFactors(array $scores): array
    {
        arsort($scores);
        $strengthFactor = array_key_first($scores);

        asort($scores);
        $tradeOffFactor = array_key_first($scores);

        return [$strengthFactor, $tradeOffFactor];
    }
}
