<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MiniGameAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_id',
        'game',
        'won',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'won' => 'boolean',
            'meta' => 'array',
        ];
    }

    public function visitor(): BelongsTo
    {
        return $this->belongsTo(Visitor::class);
    }
}
