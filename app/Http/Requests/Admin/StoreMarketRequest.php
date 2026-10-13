<?php

namespace App\Http\Requests\Admin;

use App\Models\Market;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMarketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $market = $this->route('market');

        return [
            'slug' => [
                'required', 'string', 'max:255', 'alpha_dash',
                Rule::unique(Market::class, 'slug')->ignore($market),
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:500'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ];
    }
}
