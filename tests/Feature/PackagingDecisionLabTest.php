<?php

namespace Tests\Feature;

use App\Models\BusinessCase;
use App\Models\DecisionSession;
use App\Models\PackagingOption;
use App\Models\Visitor;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PackagingDecisionLabTest extends TestCase
{
    use RefreshDatabase;

    public function test_full_session_journey_computes_the_documented_example_score(): void
    {
        $this->seed(ContentSeeder::class);

        $visitor = $this->postJson('/api/visitors', [
            'name' => 'Budi',
            'contact' => '0812-3456-7890',
        ])->assertCreated()->json('visitor');

        $session = $this->postJson('/api/decision-sessions', ['visitor_id' => $visitor['id']])
            ->assertCreated()->json('session');

        $coffeeBusinessCase = BusinessCase::where('slug', 'coffee-powder')->firstOrFail();

        $this->patchJson("/api/decision-sessions/{$session['id']}", [
            'business_case_id' => $coffeeBusinessCase->id,
            'market_slug' => 'retail',
        ])->assertOk();

        $this->patchJson("/api/decision-sessions/{$session['id']}", [
            'priority_1_slug' => 'protection',
            'priority_2_slug' => 'shelf_life',
            'priority_3_slug' => 'sustainability',
        ])->assertOk();

        $options = $this->getJson("/api/decision-sessions/{$session['id']}/options")
            ->assertOk()->json('options');

        $this->assertCount(3, $options);

        $coffeeBag = PackagingOption::where('business_case_id', $coffeeBusinessCase->id)
            ->where('label', 'Coffee Bag — Vertical Pack & Vacuum Sealing')
            ->firstOrFail();

        // This mirrors the worked example from the proposal (slide 10B): Protection 40% +
        // Shelf Life 35% + Sustainability 25% against a 5/5/4 scoring option yields 4.75/5,
        // a 95/100 fit score, "Quality-First Decision Maker", and a "Higher Cost" trade-off.
        $this->postJson("/api/decision-sessions/{$session['id']}/decision", [
            'packaging_option_id' => $coffeeBag->id,
        ])
            ->assertOk()
            ->assertJsonPath('result.fit_score', 95)
            ->assertJsonPath('result.profile', 'Quality-First Decision Maker')
            ->assertJsonPath('result.trade_off', 'Higher Cost');

        $this->postJson("/api/decision-sessions/{$session['id']}/handoff", [
            'type' => 'email',
            'email' => 'budi@abc.com',
        ])->assertOk();

        $decisionSession = DecisionSession::find($session['id']);
        $this->assertSame('budi@abc.com', $decisionSession->email);
        $this->assertNotNull($decisionSession->email_requested_at);
    }

    public function test_email_handoff_works_for_an_anonymous_skip_and_play_session(): void
    {
        $this->seed(ContentSeeder::class);

        // No visitor_id at all — the "Skip and play" path never creates a Visitor record.
        $session = DecisionSession::factory()->create([
            'visitor_id' => null,
            'completed_at' => now(),
            'fit_score' => 80,
        ]);

        $this->postJson("/api/decision-sessions/{$session->id}/handoff", [
            'type' => 'email',
            'email' => 'anon@example.com',
        ])->assertOk();

        $this->assertSame('anon@example.com', $session->fresh()->email);
    }

    public function test_email_handoff_rejects_an_invalid_email_address(): void
    {
        $this->seed(ContentSeeder::class);

        $visitor = Visitor::factory()->create();
        $session = DecisionSession::factory()->create([
            'visitor_id' => $visitor->id,
            'completed_at' => now(),
            'fit_score' => 80,
        ]);

        $this->postJson("/api/decision-sessions/{$session->id}/handoff", [
            'type' => 'email',
            'email' => 'not-an-email',
        ])->assertStatus(422);

        $this->assertNull($session->fresh()->email);
    }

    public function test_email_handoff_is_rejected_before_the_session_has_a_result(): void
    {
        $this->seed(ContentSeeder::class);

        $visitor = Visitor::factory()->create();
        $session = DecisionSession::factory()->create(['visitor_id' => $visitor->id, 'completed_at' => null]);

        $this->postJson("/api/decision-sessions/{$session->id}/handoff", [
            'type' => 'email',
            'email' => 'valid@example.com',
        ])->assertStatus(422);

        $this->assertNull($session->fresh()->email);
    }

    public function test_decision_requires_three_priorities_to_be_set_first(): void
    {
        $this->seed(ContentSeeder::class);

        $businessCase = BusinessCase::first();
        $option = PackagingOption::where('business_case_id', $businessCase->id)->first();

        $session = $this->postJson('/api/decision-sessions', [])->assertCreated()->json('session');

        $this->patchJson("/api/decision-sessions/{$session['id']}", [
            'business_case_id' => $businessCase->id,
            'market_slug' => 'retail',
        ])->assertOk();

        $this->postJson("/api/decision-sessions/{$session['id']}/decision", [
            'packaging_option_id' => $option->id,
        ])->assertStatus(422);
    }
}
