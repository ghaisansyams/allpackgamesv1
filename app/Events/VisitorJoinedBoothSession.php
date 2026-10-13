<?php

namespace App\Events;

use App\Models\BoothSession;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Broadcast (not queued) so the booth touch screen reacts the instant the visitor submits
 * the form on their own phone — the booth has no queue worker running, so a queued broadcast
 * would silently never arrive.
 */
class VisitorJoinedBoothSession implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public BoothSession $boothSession) {}

    public function broadcastOn(): array
    {
        return [new Channel('booth-session.'.$this->boothSession->token)];
    }

    public function broadcastAs(): string
    {
        return 'visitor.joined';
    }

    public function broadcastWith(): array
    {
        return [
            'visitor_id' => $this->boothSession->visitor_id,
            'visitor_name' => $this->boothSession->visitor?->name,
        ];
    }
}
