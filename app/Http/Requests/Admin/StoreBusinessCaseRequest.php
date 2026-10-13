<?php

namespace App\Http\Requests\Admin;

use App\Models\BusinessCase;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBusinessCaseRequest extends FormRequest
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
        $businessCase = $this->route('businessCase');

        return [
            'slug' => [
                'required', 'string', 'max:255', 'alpha_dash',
                Rule::unique(BusinessCase::class, 'slug')->ignore($businessCase),
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:500'],
            'icon' => ['required', 'string', 'max:50'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ];
    }
}
