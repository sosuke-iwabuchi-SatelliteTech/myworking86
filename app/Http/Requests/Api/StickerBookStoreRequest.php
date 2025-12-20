<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StickerBookStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'background_color' => 'nullable|string|max:7', // Hex color #RRGGBB
            'items' => 'present|array',
            'items.*.user_prize_id' => 'required|exists:user_prizes,id',
            'items.*.position_x' => 'required|integer',
            'items.*.position_y' => 'required|integer',
            'items.*.scale' => 'required|numeric|min:0.1|max:5',
            'items.*.rotation' => 'required|numeric|min:-360|max:360',
            'items.*.z_index' => 'sometimes|integer',
        ];
    }
}
