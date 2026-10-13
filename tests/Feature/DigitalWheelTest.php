<?php

namespace Tests\Feature;

use App\Models\Visitor;
use App\Models\WheelSegment;
use App\Models\WheelSpin;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DigitalWheelTest extends TestCase
{
    use RefreshDatabase;

    public function test_wheel_has_exactly_one_winning_wedge_out_of_eight(): void
    {
        $this->seed(ContentSeeder::class);

        $this->assertSame(8, WheelSegment::count());
        $this->assertSame(1, WheelSegment::where('outcome', 'win')->count());
        $this->assertSame(7, WheelSegment::where('outcome', 'bomb')->count());
    }

    public function test_spin_returns_the_resolved_outcome_and_persists_it(): void
    {
        $this->seed(ContentSeeder::class);

        $spin = $this->postJson('/api/wheel/spins', [])->assertCreated()->json('spin');

        $this->assertContains($spin['outcome'], ['win', 'bomb']);
        $this->assertNotEmpty($spin['message']);
        $this->assertIsInt($spin['sort_order']);
        $this->assertDatabaseHas('wheel_spins', ['id' => $spin['id']]);
    }

    public function test_wheel_content_exposes_every_wedge_since_outcomes_are_shown_on_the_wheel_face(): void
    {
        $this->seed(ContentSeeder::class);

        $segments = $this->getJson('/api/content/wheel')->assertOk()->json('segments');

        $this->assertCount(8, $segments);
        $this->assertCount(1, collect($segments)->where('outcome', 'win'));
    }

    public function test_spinning_many_times_can_land_on_both_outcomes(): void
    {
        $this->seed(ContentSeeder::class);

        $outcomes = collect(range(1, 60))
            ->map(fn () => $this->postJson('/api/wheel/spins', [])->assertCreated()->json('spin.outcome'))
            ->unique();

        // With a 1/8 win chance, 60 spins makes it overwhelmingly likely both outcomes appear;
        // this guards against the selection always returning the same row.
        $this->assertTrue($outcomes->contains('win'));
        $this->assertTrue($outcomes->contains('bomb'));
    }

    public function test_spin_is_attributed_to_the_visitor_from_the_booth_session(): void
    {
        $this->seed(ContentSeeder::class);

        $visitor = Visitor::factory()->create();

        $spin = $this->postJson('/api/wheel/spins', ['visitor_id' => $visitor->id])
            ->assertCreated()->json('spin');

        $this->assertDatabaseHas('wheel_spins', ['id' => $spin['id'], 'visitor_id' => $visitor->id]);
    }

    public function test_handoff_marks_that_the_visitor_asked_to_talk_to_the_team(): void
    {
        $this->seed(ContentSeeder::class);

        $visitor = Visitor::factory()->create();
        $spin = $this->postJson('/api/wheel/spins', ['visitor_id' => $visitor->id])
            ->assertCreated()->json('spin');

        $this->postJson("/api/wheel/spins/{$spin['id']}/handoff", ['visitor_id' => $visitor->id])
            ->assertOk();

        $this->assertDatabaseHas('wheel_spins', ['id' => $spin['id'], 'visitor_id' => $visitor->id]);
        $this->assertNotNull(WheelSpin::find($spin['id'])->handoff_requested_at);
    }
}
