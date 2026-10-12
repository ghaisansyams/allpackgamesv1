<?php

namespace Tests\Feature;

use App\Models\WheelSegment;
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
        $this->assertDatabaseHas('wheel_spins', ['id' => $spin['id']]);
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
