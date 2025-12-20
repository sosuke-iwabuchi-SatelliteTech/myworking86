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

        $user = User::where('id', $request->id)->first();

        if ($user && $user->isAdmin()) {
            return response()->json(['message' => '管理者アカウントはこの方法でログインできません。'], 403);
        }

        if (!$user) {
            $user = User::firstOrCreate(
                ['id' => $request->id],
                [
                    'name' => $request->name ?? 'Unknown',
                    'grade' => (int) ($request->grade ?? 1),
                    'email' => $request->id . '@example.com', // Dummy email
                    'password' => bcrypt('password'), // Dummy password
                    'role' => User::ROLE_USER,
                ]
            );
        }

        Auth::login($user);

        $user->update(['last_login_at' => now()]);

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
