<?php

namespace Tests\Feature;

use App\Models\Market;
use App\Models\User;
use App\Models\WheelSegment;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/admin')->assertRedirect('/login');
        $this->get('/admin/business-cases')->assertRedirect('/login');
    }

    public function test_registration_is_disabled(): void
    {
        $this->get('/register')->assertNotFound();
        $this->post('/register')->assertNotFound();
    }

    public function test_authenticated_user_can_manage_markets(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/markets', [
                'slug' => 'retail-test',
                'title' => 'Retail Test',
                'description' => 'A market for testing',
                'sort_order' => 1,
            ])
            ->assertRedirect();

        $market = Market::where('slug', 'retail-test')->firstOrFail();

        $this->actingAs($user)
            ->put("/admin/markets/{$market->id}", [
                'slug' => 'retail-test',
                'title' => 'Retail Test Updated',
                'description' => 'Updated description',
                'sort_order' => 2,
            ])
            ->assertRedirect();

        $this->assertSame('Retail Test Updated', $market->fresh()->title);

        $this->actingAs($user)
            ->delete("/admin/markets/{$market->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('markets', ['id' => $market->id]);
    }

    public function test_wheel_segment_cannot_have_two_winning_wedges(): void
    {
        $this->seed(ContentSeeder::class);

        $user = User::factory()->create();
        $win = WheelSegment::where('outcome', 'win')->firstOrFail();
        $bomb = WheelSegment::where('outcome', 'bomb')->firstOrFail();

        $this->actingAs($user)
            ->put("/admin/wheel-segments/{$bomb->id}", [
                'outcome' => 'win',
                'reward_label' => 'Second Prize',
                'message' => 'Should be rejected',
            ])
            ->assertSessionHasErrors('outcome');

        $this->assertSame('bomb', $bomb->fresh()->outcome);
        $this->assertSame('win', $win->fresh()->outcome);
    }

    public function test_wheel_segment_can_be_reassigned_as_winner_once_the_old_winner_is_demoted(): void
    {
        $this->seed(ContentSeeder::class);

        $user = User::factory()->create();
        $win = WheelSegment::where('outcome', 'win')->firstOrFail();
        $bomb = WheelSegment::where('outcome', 'bomb')->firstOrFail();

        $this->actingAs($user)->put("/admin/wheel-segments/{$win->id}", [
            'outcome' => 'bomb',
            'message' => 'No longer the winner',
        ])->assertSessionDoesntHaveErrors();

        $this->actingAs($user)->put("/admin/wheel-segments/{$bomb->id}", [
            'outcome' => 'win',
            'reward_label' => 'New Prize',
            'message' => 'Now the winner',
        ])->assertSessionDoesntHaveErrors();

        $this->assertSame('bomb', $win->fresh()->outcome);
        $this->assertSame('win', $bomb->fresh()->outcome);
    }
}
