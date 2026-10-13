<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MiniGameAttempt;
use App\Models\WheelSpin;
use Illuminate\Http\JsonResponse;

class LeaderboardController extends Controller
{
    /**
     * One "top score" entry per game, shown on the idle screen so visitors have a concrete
     * record to beat instead of an empty board. Ranking is computed in PHP rather than SQL
     * since `meta` is a JSON column whose shape differs per game, and the row counts here are
     * small enough (booth demo scale) that this isn't a performance concern.
     */
    public function index(): JsonResponse
    {
        $entries = array_filter([
            $this->bestStopwatch(),
            $this->bestByMoves('memory_card', 'Memory Match'),
            $this->bestByMoves('puzzle', 'Packaging Puzzle'),
            $this->bestRecycleRush(),
            $this->latestWheelWin(),
        ]);

        return response()->json(['entries' => array_values($entries)]);
    }

    private function bestStopwatch(): ?array
    {
        $best = MiniGameAttempt::query()
            ->where('game', 'stopwatch')
            ->where('won', true)
            ->whereNotNull('visitor_id')
            ->with('visitor:id,name')
            ->get()
            ->filter(fn (MiniGameAttempt $a) => $a->visitor && isset($a->meta['stopped_at']))
            ->sortBy(fn (MiniGameAttempt $a) => abs($a->meta['stopped_at'] - 10.0))
            ->first();

        return $best ? [
            'game' => 'Stop at 10.00',
            'name' => $best->visitor->name,
            'score' => number_format((float) $best->meta['stopped_at'], 2).'s',
        ] : null;
    }

    private function bestByMoves(string $game, string $label): ?array
    {
        $best = MiniGameAttempt::query()
            ->where('game', $game)
            ->where('won', true)
            ->whereNotNull('visitor_id')
            ->with('visitor:id,name')
            ->get()
            ->filter(fn (MiniGameAttempt $a) => $a->visitor && isset($a->meta['moves']))
            ->sortBy(fn (MiniGameAttempt $a) => $a->meta['moves'])
            ->first();

        return $best ? [
            'game' => $label,
            'name' => $best->visitor->name,
            'score' => $best->meta['moves'].' moves',
        ] : null;
    }

    private function bestRecycleRush(): ?array
    {
        // Every winner finishes at the same score (the round ends the instant it's reached),
        // so time-to-win is the only metric that actually ranks anyone.
        $best = MiniGameAttempt::query()
            ->where('game', 'recycle_rush')
            ->where('won', true)
            ->whereNotNull('visitor_id')
            ->with('visitor:id,name')
            ->get()
            ->filter(fn (MiniGameAttempt $a) => $a->visitor && isset($a->meta['seconds']))
            ->sortBy(fn (MiniGameAttempt $a) => $a->meta['seconds'])
            ->first();

        return $best ? [
            'game' => 'Recycle Rush',
            'name' => $best->visitor->name,
            'score' => $best->meta['seconds'].'s',
        ] : null;
    }

    private function latestWheelWin(): ?array
    {
        // The wheel has no finer-grained score to rank by — win or bomb — so this shows the
        // most recent winner instead of a "best" one.
        $latest = WheelSpin::query()
            ->whereNotNull('visitor_id')
            ->whereHas('wheelSegment', fn ($query) => $query->where('outcome', 'win'))
            ->with('visitor:id,name')
            ->latest()
            ->first();

        return $latest && $latest->visitor ? [
            'game' => 'Spin the Wheel',
            'name' => $latest->visitor->name,
            'score' => 'Won a Prize!',
        ] : null;
    }
}
