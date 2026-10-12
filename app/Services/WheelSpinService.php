<?php

namespace App\Services;

use App\Models\WheelSegment;
use Illuminate\Support\Collection;

class WheelSpinService
{
    /**
     * Pick a segment using weighted random selection over all segments' `weight` column.
     */
    public function spin(): WheelSegment
    {
        $segments = WheelSegment::all();

        return $this->pickWeighted($segments);
    }

    private function pickWeighted(Collection $segments): WheelSegment
    {
        $totalWeight = $segments->sum('weight');
        $roll = random_int(1, max($totalWeight, 1));

        $cumulative = 0;
        foreach ($segments as $segment) {
            $cumulative += $segment->weight;
            if ($roll <= $cumulative) {
                return $segment;
            }
        }

        return $segments->last();
    }
}
