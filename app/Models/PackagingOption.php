<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackagingOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_case_id',
        'label',
        'description',
        'applicable_markets',
        'scores',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'applicable_markets' => 'array',
            'scores' => 'array',
        ];
    }

    public function businessCase(): BelongsTo
    {
        return $this->belongsTo(BusinessCase::class);
    }
}
