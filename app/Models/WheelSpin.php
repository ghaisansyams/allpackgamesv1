<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WheelSpin extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_id',
        'wheel_segment_id',
        'handoff_requested_at',
    ];

    protected function casts(): array
    {
        return [
            'handoff_requested_at' => 'datetime',
        ];
    }

    public function visitor(): BelongsTo
    {
        return $this->belongsTo(Visitor::class);
    }

    public function wheelSegment(): BelongsTo
    {
        return $this->belongsTo(WheelSegment::class);
    }
}
