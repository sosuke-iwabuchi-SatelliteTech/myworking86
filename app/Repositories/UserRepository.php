<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserRepository
{
    /**
     * Get paginated users with search and sort options.
     */
    public function getPaginatedUsers(?string $search = null, string $sort = 'created_at', string $direction = 'desc', int $perPage = 50): LengthAwarePaginator
    {
        $query = User::select('users.*');
        // Note: select users.* to avoid collision if we join, though 'with' usually executes separately.
        // For orderBy on related table, we usually need a join.

        // Filter to show only regular users (exclude admins)
        $query->where('users.role', User::ROLE_USER);

        if ($sort === 'points') {
            $query->leftJoin('user_points', 'users.id', '=', 'user_points.user_id')
                ->select('users.*', 'user_points.points as points_val') // Select points to order by
                ->orderBy('user_points.points', $direction);
        } elseif (in_array($sort, ['name', 'email', 'grade', 'id', 'created_at', 'last_login_at'])) {
            $query->orderBy($sort, $direction);
        }

        // Search logic
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                    ->orWhere('users.email', 'like', "%{$search}%");
            });
        }

        // Eager load relationships after building the query
        $query->with('userPoint');

        return $query->paginate($perPage);
    }
}
