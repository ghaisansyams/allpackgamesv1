<?php

namespace Tests\Feature;

use App\Events\VisitorJoinedBoothSession;
use App\Models\BoothSession;
use App\Models\Visitor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\TestCase;

class BoothSessionTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_booth_screen_can_create_a_session_to_show_as_a_qr_code(): void
    {
        $response = $this->postJson('/api/booth-sessions')->assertCreated();

        $this->assertDatabaseHas('booth_sessions', [
            'token' => $response->json('token'),
            'status' => 'waiting',
        ]);
    }

    public function test_visitor_can_join_from_their_phone_and_it_broadcasts_to_the_booth(): void
    {
        Event::fake([VisitorJoinedBoothSession::class]);

        $boothSession = BoothSession::create(['token' => (string) Str::uuid()]);

        $this->get("/join/{$boothSession->token}")->assertOk();

        $this->post("/join/{$boothSession->token}", [
            'name' => 'Rina',
            'company' => 'Food Co',
            'job_title' => 'Buyer',
            'contact' => 'rina@foodco.com',
            'industry' => 'Food & Beverage',
        ])->assertRedirect(route('join.thanks', $boothSession->token));

        $boothSession->refresh();
        $this->assertSame('claimed', $boothSession->status);
        $this->assertNotNull($boothSession->visitor_id);
        $this->assertSame('Rina', Visitor::find($boothSession->visitor_id)->name);

        Event::assertDispatched(VisitorJoinedBoothSession::class, fn ($e) => $e->boothSession->id === $boothSession->id);
    }

    public function test_an_already_claimed_session_cannot_be_joined_again(): void
    {
        $visitor = Visitor::factory()->create();
        $boothSession = BoothSession::create([
            'token' => (string) Str::uuid(),
            'visitor_id' => $visitor->id,
            'status' => 'claimed',
            'claimed_at' => now(),
        ]);

        $this->post("/join/{$boothSession->token}", [
            'name' => 'Someone Else',
            'company' => 'Co',
            'job_title' => 'Role',
            'contact' => 'someone@example.com',
            'industry' => 'Packaging',
        ])->assertStatus(422);
    }

    public function test_booth_screen_can_poll_session_status_as_a_fallback(): void
    {
        $boothSession = BoothSession::create(['token' => (string) Str::uuid()]);

        $this->getJson("/api/booth-sessions/{$boothSession->token}")
            ->assertOk()
            ->assertJsonPath('status', 'waiting')
            ->assertJsonPath('visitor_id', null);
    }
}
