<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusinessCase extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'icon',
        'sort_order',
    ];

    public function packagingOptions(): HasMany
    {
        return $this->hasMany(PackagingOption::class)->orderBy('sort_order');
    }
}
