<?php

namespace App\Services;

use App\Models\WheelSegment;

class WheelSpinService
{
    /**
     * Every wedge is an equally likely physical slot on the wheel (true 1-in-N odds, not a
     * weighted probability), matching a real wheel where one wedge is the prize and the rest
     * are bombs.
     */
    public function spin(): WheelSegment
    {
        return WheelSegment::inRandomOrder()->firstOrFail();
    }
}
