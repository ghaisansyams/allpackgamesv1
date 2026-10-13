<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePackagingOptionRequest extends FormRequest
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
        return [
            'business_case_id' => ['required', 'exists:business_cases,id'],
            'label' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:500'],
            'applicable_markets' => ['nullable', 'array'],
            'applicable_markets.*' => ['string', 'exists:markets,slug'],
            'scores' => ['required', 'array'],
            'scores.protection' => ['required', 'integer', 'min:1', 'max:5'],
            'scores.shelf_life' => ['required', 'integer', 'min:1', 'max:5'],
            'scores.cost' => ['required', 'integer', 'min:1', 'max:5'],
            'scores.sustainability' => ['required', 'integer', 'min:1', 'max:5'],
            'scores.convenience' => ['required', 'integer', 'min:1', 'max:5'],
            'scores.presentation' => ['required', 'integer', 'min:1', 'max:5'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ];
    }
}
