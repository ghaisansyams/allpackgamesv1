<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWheelSegmentRequest extends FormRequest
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
            'outcome' => ['required', Rule::in(['win', 'bomb'])],
            'reward_label' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:500'],
        ];
    }
}
