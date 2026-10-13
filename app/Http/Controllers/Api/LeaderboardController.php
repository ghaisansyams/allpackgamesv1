<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MiniGameAttempt;
use App\Models\WheelSpin;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class LeaderboardController extends Controller
{
    private const GAME_LABELS = [
        'memory_card' => 'Memory Match',
        'puzzle' => 'Packaging Puzzle',
        'stopwatch' => 'Stop at 10.00',
        'recycle_rush' => 'Recycle Rush',
    ];

    /**
     * Recent winners across every game, shown on the idle screen to draw a crowd while the
     * booth waits for its next visitor. Only attempts tied to a named visitor (i.e. after the
     * QR/phone join) are eligible, so the board never shows a blank name.
     */
    public function index(): JsonResponse
    {
        $miniGameWins = MiniGameAttempt::query()
            ->where('won', true)
            ->whereNotNull('visitor_id')
            ->with('visitor:id,name')
            ->latest()
            ->limit(10)
            ->get()
            ->filter(fn (MiniGameAttempt $attempt) => $attempt->visitor !== null)
            ->map(fn (MiniGameAttempt $attempt) => [
                'name' => $attempt->visitor->name,
                'game' => self::GAME_LABELS[$attempt->game] ?? ucfirst(str_replace('_', ' ', $attempt->game)),
                'created_at' => $attempt->created_at,
            ]);

        $wheelWins = WheelSpin::query()
            ->whereNotNull('visitor_id')
            ->whereHas('wheelSegment', fn ($query) => $query->where('outcome', 'win'))
            ->with('visitor:id,name')
            ->latest()
            ->limit(10)
            ->get()
            ->filter(fn (WheelSpin $spin) => $spin->visitor !== null)
            ->map(fn (WheelSpin $spin) => [
                'name' => $spin->visitor->name,
                'game' => 'Spin the Wheel',
                'created_at' => $spin->created_at,
            ]);

        /** @var Collection<int, array{name: string, game: string, created_at: Carbon}> $entries */
        $entries = $miniGameWins->concat($wheelWins)
            ->sortByDesc('created_at')
            ->take(8)
            ->values()
            ->map(fn (array $entry) => ['name' => $entry['name'], 'game' => $entry['game']]);

        return response()->json(['entries' => $entries]);
    }
}
