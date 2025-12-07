<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserRepository
{
    /**
     * Get paginated users with search and sort options.
     *
     * @param string|null $search
     * @param string $sort
     * @param string $direction
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedUsers(?string $search = null, string $sort = 'created_at', string $direction = 'desc', int $perPage = 50): LengthAwarePaginator
    {
        $query = User::select('id', 'name', 'email', 'grade');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (in_array($sort, ['name', 'email', 'grade', 'id', 'created_at'])) {
            $query->orderBy($sort, $direction);
        }

        return $query->paginate($perPage);
    }
}
