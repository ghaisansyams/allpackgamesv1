<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WheelSegment extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'label',
        'weight',
        'reward_label',
        'content',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
        ];
    }
}
