<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\UserPrize;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserPrizeController extends Controller
{
    /**
     * Register an obtained prize.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'prize_id' => 'required|string',
            'rarity' => 'required|string',
        ]);

        $userPrize = UserPrize::create([
            'user_id' => Auth::id(),
            'prize_id' => $validated['prize_id'],
            'rarity' => $validated['rarity'],
            'obtained_at' => now(),
        ]);

        return response()->json($userPrize, 201);
    }

    /**
     * Get list of owned prizes with counts.
     */
    public function index()
    {
        $userPrizes = UserPrize::where('user_id', Auth::id())
            ->select('prize_id', 'rarity', DB::raw('count(*) as count'))
            ->groupBy('prize_id', 'rarity')
            ->orderByRaw("CASE rarity 
                WHEN 'UR' THEN 1 
                WHEN 'SR' THEN 2 
                WHEN 'R' THEN 3 
                WHEN 'UC' THEN 4 
                WHEN 'C' THEN 5 
                ELSE 6 END")
            ->get();

        return response()->json($userPrizes);
    }
}
