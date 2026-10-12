<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WheelSegment extends Model
{
    use HasFactory;

    protected $fillable = [
        'outcome',
        'reward_label',
        'message',
        'sort_order',
    ];
}
