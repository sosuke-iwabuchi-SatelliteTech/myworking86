<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

use App\Repositories\UserRepository;

class UserController extends Controller
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Display the user list.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');

        $users = $this->userRepository->getPaginatedUsers($search, $sort, $direction, 50)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }
    public function updatePoints(Request $request, User $user)
    {
        $request->validate([
            'points' => 'required|integer',
            'action' => 'required|in:add,sub,set',
        ]);

        $currentPoints = $user->userPoint ? $user->userPoint->points : 0;
        $newPoints = $currentPoints;

        switch ($request->action) {
            case 'add':
                $newPoints += $request->points;
                break;
            case 'sub':
                $newPoints -= $request->points;
                break;
            case 'set':
                $newPoints = $request->points;
                break;
        }

        // Ensure points don't go below 0 (optional, but good practice)
        $newPoints = max(0, $newPoints);

        if ($user->userPoint) {
            $user->userPoint->update(['points' => $newPoints]);
        } else {
            $user->userPoint()->create(['points' => $newPoints]);
        }

        return back();
    }
}
