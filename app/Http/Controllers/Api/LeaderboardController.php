<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MiniGameAttempt;
use App\Models\WheelSpin;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

class LeaderboardController extends Controller
{
    private const TOP_COMPACT = 1;

    private const TOP_FULL = 5;

    /**
     * One "top score" entry per game, shown on the idle screen so visitors have a concrete
     * record to beat instead of an empty board. Ranking is computed in PHP rather than SQL
     * since `meta` is a JSON column whose shape differs per game, and the row counts here are
     * small enough (booth demo scale) that this isn't a performance concern.
     */
    public function index(): JsonResponse
    {
        $entries = $this->rankedGames(self::TOP_COMPACT)
            ->map(function (array $game) {
                $first = $game['entries'][0] ?? null;

                return $first ? ['game' => $game['game'], ...$first] : null;
            })
            ->filter()
            ->values();

        return response()->json(['entries' => $entries]);
    }

    /**
     * The "Show More" popup's fuller view — up to 5 ranked entries per game instead of just
     * the single best.
     */
    public function full(): JsonResponse
    {
        return response()->json(['games' => $this->rankedGames(self::TOP_FULL)->values()]);
    }

    /**
     * @return Collection<int, array{game: string, entries: array<int, array{name: string, score: string}>}>
     */
    private function rankedGames(int $limit): Collection
    {
        return collect([
            ['game' => 'Stop at 10.00', 'entries' => $this->rankedStopwatch($limit)],
            ['game' => 'Memory Match', 'entries' => $this->rankedByMoves('memory_card', $limit)],
            ['game' => 'Packaging Puzzle', 'entries' => $this->rankedByMoves('puzzle', $limit)],
            ['game' => 'Recycle Rush', 'entries' => $this->rankedRecycleRush($limit)],
            ['game' => 'Spin the Wheel', 'entries' => $this->recentWheelWins($limit)],
        ])->filter(fn (array $game) => count($game['entries']) > 0);
    }

    private function rankedStopwatch(int $limit): array
    {
        return MiniGameAttempt::query()
            ->where('game', 'stopwatch')
            ->where('won', true)
            ->whereNotNull('visitor_id')
            ->with('visitor:id,name')
            ->get()
            ->filter(fn (MiniGameAttempt $a) => $a->visitor && isset($a->meta['stopped_at']))
            ->sortBy(fn (MiniGameAttempt $a) => abs($a->meta['stopped_at'] - 10.0))
            ->take($limit)
            ->map(fn (MiniGameAttempt $a) => [
                'name' => $a->visitor->name,
                'score' => number_format((float) $a->meta['stopped_at'], 2).'s',
            ])
            ->values()
            ->all();
    }

    private function rankedByMoves(string $game, int $limit): array
    {
        return MiniGameAttempt::query()
            ->where('game', $game)
            ->where('won', true)
            ->whereNotNull('visitor_id')
            ->with('visitor:id,name')
            ->get()
            ->filter(fn (MiniGameAttempt $a) => $a->visitor && isset($a->meta['moves']))
            ->sortBy(fn (MiniGameAttempt $a) => $a->meta['moves'])
            ->take($limit)
            ->map(fn (MiniGameAttempt $a) => [
                'name' => $a->visitor->name,
                'score' => $a->meta['moves'].' moves',
            ])
            ->values()
            ->all();
    }

    private function rankedRecycleRush(int $limit): array
    {
        // Every winner finishes at the same score (the round ends the instant it's reached),
        // so time-to-win is the only metric that actually ranks anyone.
        return MiniGameAttempt::query()
            ->where('game', 'recycle_rush')
            ->where('won', true)
            ->whereNotNull('visitor_id')
            ->with('visitor:id,name')
            ->get()
            ->filter(fn (MiniGameAttempt $a) => $a->visitor && isset($a->meta['seconds']))
            ->sortBy(fn (MiniGameAttempt $a) => $a->meta['seconds'])
            ->take($limit)
            ->map(fn (MiniGameAttempt $a) => [
                'name' => $a->visitor->name,
                'score' => $a->meta['seconds'].'s',
            ])
            ->values()
            ->all();
    }

    private function recentWheelWins(int $limit): array
    {
        // The wheel has no finer-grained score to rank by — win or bomb — so this lists the
        // most recent winners instead of "best" ones.
        return WheelSpin::query()
            ->whereNotNull('visitor_id')
            ->whereHas('wheelSegment', fn ($query) => $query->where('outcome', 'win'))
            ->with('visitor:id,name')
            ->latest()
            ->take($limit)
            ->get()
            ->filter(fn (WheelSpin $s) => $s->visitor !== null)
            ->map(fn (WheelSpin $s) => [
                'name' => $s->visitor->name,
                'score' => 'Won a Prize!',
            ])
            ->values()
            ->all();
    }
}
