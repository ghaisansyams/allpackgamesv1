<?php

namespace Tests\Feature;

use App\Models\WheelSegment;
use App\Models\WheelSpin;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DigitalWheelTest extends TestCase
{
    use RefreshDatabase;

    public function test_spin_never_leaks_the_quiz_answer_before_it_is_submitted(): void
    {
        $this->seed(ContentSeeder::class);

        // Spin repeatedly until we land on the quiz segment, since the segment is weighted-random.
        $spin = null;
        for ($i = 0; $i < 50 && ($spin === null || $spin['category'] !== 'pack_quiz'); $i++) {
            $spin = $this->postJson('/api/wheel/spins', [])->assertCreated()->json('spin');
        }

        $this->assertNotNull($spin);
        $this->assertSame('pack_quiz', $spin['category']);
        $this->assertArrayNotHasKey('correct_index', $spin['content']);
    }

    public function test_answering_a_quiz_reveals_correctness_and_the_insight(): void
    {
        $this->seed(ContentSeeder::class);

        $quizSegment = WheelSegment::where('category', 'pack_quiz')->firstOrFail();
        $correctIndex = $quizSegment->content['correct_index'];

        $spin = $this->postJson('/api/wheel/spins', [])->assertCreated()->json('spin');

        // Force the spin under test onto the quiz segment regardless of what was actually rolled,
        // so the correctness check below is deterministic rather than depending on random luck.
        WheelSpin::where('id', $spin['id'])->update(['wheel_segment_id' => $quizSegment->id]);

        $this->postJson("/api/wheel/spins/{$spin['id']}/answer", ['selected_index' => $correctIndex])
            ->assertOk()
            ->assertJsonPath('is_correct', true)
            ->assertJsonPath('correct_index', $correctIndex);
    }

    public function test_handoff_without_an_existing_visitor_creates_a_lead(): void
    {
        $this->seed(ContentSeeder::class);

        $spin = $this->postJson('/api/wheel/spins', [])->assertCreated()->json('spin');

        $response = $this->postJson("/api/wheel/spins/{$spin['id']}/handoff", [
            'name' => 'Rina',
            'contact' => 'rina@foodco.com',
        ])->assertOk();

        $this->assertNotNull($response->json('visitor_id'));
    }
}
