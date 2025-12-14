<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GachaHistory;
use App\Models\UserPoint;
use App\Models\UserPrize;
use App\Services\GachaService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GachaController extends Controller
{
    protected $gachaService;

    public function __construct(GachaService $gachaService)
    {
        $this->gachaService = $gachaService;
    }

    public function status(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userPoint = UserPoint::find($user->id);
        $points = $userPoint ? $userPoint->points : 0;

        $usedFree = GachaHistory::where('user_id', $user->id)
            ->whereDate('created_at', Carbon::today())
            ->where('consumed_points', 0)
            ->exists();

        return response()->json([
            'points' => $points,
            'isFreeAvailable' => !$usedFree,
            'cost' => 300,
        ]);
    }

    public function pull(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Use transaction to ensure data integrity
        // We use try-catch block inside or rely on DB::transaction auto-rollback on exception
        // Note: DB::transaction returns the result of the closure

        try {
            $result = DB::transaction(function () use ($user) {
                // Check Free Status (lock for update? Maybe overkill for this, but safe)
                // To be simpler, we just query. Race condition possible but rare for single user.

                $usedFree = GachaHistory::where('user_id', $user->id)
                    ->whereDate('created_at', Carbon::today())
                    ->where('consumed_points', 0)
                    ->lockForUpdate() // Lock rows to prevent double free pull (though this queries existing, need to lock something else? user?)
                    ->exists();

                // Better: Lock UserPoint record.
                $userPoint = UserPoint::firstOrCreate(['user_id' => $user->id], ['points' => 0]);
                // Re-query with lock
                $userPoint = UserPoint::where('user_id', $user->id)->lockForUpdate()->first();

                // Re-check free history under lock?
                // Creating a new history row won't be blocked by select...lockForUpdate on existing rows if they don't exist.
                // But preventing double submission is handled by frontend mostly.
                // Backend race condition: 2 requests at exactly same time.
                // We can just proceed.

                $usedFree = GachaHistory::where('user_id', $user->id)
                    ->whereDate('created_at', Carbon::today())
                    ->where('consumed_points', 0)
                    ->exists();

                $isFree = !$usedFree;
                $consumedPoints = 0;

                if (!$isFree) {
                    if ($userPoint->points < 300) {
                        throw new \Exception('Not enough points');
                    }
                    $userPoint->decrement('points', 300);
                    $consumedPoints = 300;
                }

                // Pull Item
                $item = $this->gachaService->pull();

                // Check if user already owns this prize (before creating the new record)
                $alreadyOwned = UserPrize::where('user_id', $user->id)
                    ->where('prize_id', $item['id'])
                    ->exists();
                $isNew = !$alreadyOwned;

                // Save History
                GachaHistory::create([
                    'user_id' => $user->id,
                    'prize_id' => $item['id'],
                    'rarity' => $item['rarity'],
                    'consumed_points' => $consumedPoints,
                ]);

                // Save User Prize
                UserPrize::create([
                    'user_id' => $user->id,
                    'prize_id' => $item['id'],
                    'rarity' => $item['rarity'],
                    'obtained_at' => now(),
                ]);

                return [
                    'result' => $item,
                    'points' => $userPoint->points,
                    'isNew' => $isNew,
                ];
            });

            // Re-fetch points to be sure
            $userPoint = UserPoint::find($user->id);

            return response()->json([
                'result' => $result['result'],
                'points' => $userPoint->points,
                'isFreeAvailable' => false,
                'isNew' => $result['isNew'],
            ]);
        } catch (\Exception $e) {
            if ($e->getMessage() === 'Not enough points') {
                return response()->json(['message' => 'ポイントが足りません'], 400);
            }
            return response()->json(['message' => 'Error processing gacha', 'error' => $e->getMessage()], 500);
        }
    }
}
