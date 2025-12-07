<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create($validated);

        return response()->json([
            'message' => 'ユーザーが正常に登録されました。',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'grade' => $user->grade,
            ],
        ], 201);
    }

    /**
     * Authenticate user by ID.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'id' => 'required|string',
            'name' => 'nullable|string|max:255',
            'grade' => 'nullable|integer',
        ]);

        $user = User::find($request->id);

        if (!$user) {
            $user = User::create([
                'id' => $request->id,
                'name' => $request->name ?? 'Unknown',
                'grade' => (int) ($request->grade ?? 1),
                'email' => $request->id . '@example.com', // Dummy email
                'password' => bcrypt('password'), // Dummy password
            ]);
        }

        Auth::login($user);

        return response()->json([
            'message' => 'ログインしました。',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'grade' => $user->grade,
            ],
        ]);
    }
}
