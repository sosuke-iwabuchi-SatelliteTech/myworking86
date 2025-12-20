<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
            'id' => ['required', 'uuid', 'unique:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'grade' => ['required', 'integer', 'between:1,6'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'id.required' => 'ユーザーIDは必須です。',
            'id.uuid' => 'ユーザーIDはUUID形式である必要があります。',
            'id.unique' => 'このユーザーIDは既に使用されています。',
            'name.required' => '名前は必須です。',
            'name.max' => '名前は255文字以内で入力してください。',
            'grade.required' => '学年は必須です。',
            'grade.integer' => '学年は整数である必要があります。',
            'grade.between' => '学年は1から6の間で入力してください。',
        ];
    }
}
