<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailyPlayCount;
use App\Models\UserPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PointController extends Controller
{
    public function award(Request $request)
    {
        $request->validate([
            'level_id' => 'required|string',
            'score' => 'required|integer|min:0',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $levelId = $request->level_id;
        $score = $request->score;
        $today = Carbon::today();

        DB::beginTransaction();
        try {
            $daily = DailyPlayCount::firstOrCreate(
                ['user_id' => $user->id, 'level_id' => $levelId, 'play_date' => $today],
                ['count' => 0]
            );

            $daily->increment('count');
            $daily->refresh(); // get new count

            // Logic: 1st time (count=1) -> 100%. 2nd (count=2) -> 90%. ... 8th+ -> 30%.
            $multiplier = max(0.3, 1.0 - (0.1 * ($daily->count - 1)));
            $basePoints = $score * 10;
            $earnedPoints = (int) floor($basePoints * $multiplier);

            // Update user points
            $userPoint = UserPoint::firstOrCreate(
                ['user_id' => $user->id],
                ['points' => 0]
            );
            $userPoint->increment('points', $earnedPoints);

            DB::commit();

            return response()->json([
                'earned_points' => $earnedPoints,
                'total_points' => $userPoint->points,
                'multiplier' => $multiplier,
                'play_count' => $daily->count,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['points' => 0]); // Should be protected by middleware anyway
        }
        $userPoint = UserPoint::find($user->id);
        $points = $userPoint ? $userPoint->points : 0;
        return response()->json(['points' => $points]);
    }
}
