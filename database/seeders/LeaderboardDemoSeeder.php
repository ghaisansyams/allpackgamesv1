<?php

namespace Database\Seeders;

use App\Models\MiniGameAttempt;
use App\Models\Visitor;
use App\Models\WheelSegment;
use App\Models\WheelSpin;
use Illuminate\Database\Seeder;

/**
 * Seeds a few impressively-close scores so the idle-screen leaderboard never starts empty —
 * an empty board invites no one to compete, a tight record does. Not run automatically with
 * the rest of the content; run on demand with `--class=LeaderboardDemoSeeder`.
 */
class LeaderboardDemoSeeder extends Seeder
{
    public function run(): void
    {
        $this->stopwatch('Budi Santoso', 9.99);
        $this->movesGame('memory_card', 'Siti Aminah', 8);
        $this->movesGame('puzzle', 'Andi Wijaya', 12);
        $this->recycleRush('Rina Kusuma', 17);
        $this->wheelWin('Joko Prasetyo');
    }

    private function stopwatch(string $name, float $stoppedAt): void
    {
        $visitor = Visitor::firstOrCreate(['name' => $name]);

        MiniGameAttempt::create([
            'visitor_id' => $visitor->id,
            'game' => 'stopwatch',
            'won' => true,
            'meta' => ['stopped_at' => $stoppedAt],
        ]);
    }

    private function movesGame(string $game, string $name, int $moves): void
    {
        $visitor = Visitor::firstOrCreate(['name' => $name]);

        MiniGameAttempt::create([
            'visitor_id' => $visitor->id,
            'game' => $game,
            'won' => true,
            'meta' => ['moves' => $moves, 'seconds' => 30],
        ]);
    }

    private function recycleRush(string $name, int $seconds): void
    {
        $visitor = Visitor::firstOrCreate(['name' => $name]);

        MiniGameAttempt::create([
            'visitor_id' => $visitor->id,
            'game' => 'recycle_rush',
            'won' => true,
            'meta' => ['score' => 6, 'misses' => 0, 'seconds' => $seconds],
        ]);
    }

    private function wheelWin(string $name): void
    {
        $visitor = Visitor::firstOrCreate(['name' => $name]);
        $winSegment = WheelSegment::where('outcome', 'win')->first();

        if (! $winSegment) {
            return;
        }

        WheelSpin::create([
            'visitor_id' => $visitor->id,
            'wheel_segment_id' => $winSegment->id,
        ]);
    }
}
