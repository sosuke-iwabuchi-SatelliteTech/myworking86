<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StickerBookItem;
use App\Models\UserPrize;
use App\Models\TradeRequest;
use App\Http\Requests\Api\StickerBookStoreRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StickerBookController extends Controller
{
    /**
     * Get the sticker book items for a user.
     */
    public function index($userId = null)
    {
        $id = $userId ?: Auth::id();

        $items = StickerBookItem::where('user_id', $id)
            ->with(['userPrize.prize'])
            ->orderBy('z_index', 'asc') // Render order: low z-index (back) to high (front)
            ->get();

        return \App\Http\Resources\StickerBookItemResource::collection($items);
    }

    /**
     * Store sticker book items for the authenticated user.
     */
    public function store(StickerBookStoreRequest $request)
    {
        $user = Auth::user();
        $validated = $request->validated();

        // 1. Ownership & Trade status validation
        $userPrizeIds = collect($validated['items'])->pluck('user_prize_id')->all();

        // Check if all user_prizes belong to the user
        $prizesCount = UserPrize::where('user_id', $user->id)
            ->whereIn('id', $userPrizeIds)
            ->count();

        if ($prizesCount !== count(array_unique($userPrizeIds))) {
            return response()->json(['message' => 'Invalid user prize selection'], 422);
        }

        // Check if any of the prizes are in a pending trade
        $pendingTradeItems = DB::table('trade_request_items')
            ->join('trade_requests', 'trade_request_items.trade_request_id', '=', 'trade_requests.id')
            ->where('trade_requests.status', TradeRequest::STATUS_PENDING)
            ->whereIn('trade_request_items.user_prize_id', $userPrizeIds)
            ->exists();

        if ($pendingTradeItems) {
            return response()->json(['message' => 'One or more items are currently in a pending trade'], 422);
        }

        return DB::transaction(function () use ($user, $validated) {
            // Delete existing items
            StickerBookItem::where('user_id', $user->id)->delete();

            // Create new items
            $items = collect($validated['items'])->map(function ($item) use ($user) {
                return [
                    'id' => \Illuminate\Support\Str::uuid(),
                    'user_id' => $user->id,
                    'user_prize_id' => $item['user_prize_id'],
                    'position_x' => $item['position_x'],
                    'position_y' => $item['position_y'],
                    'scale' => $item['scale'],
                    'rotation' => $item['rotation'],
                    'z_index' => $item['z_index'] ?? 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->all();

            StickerBookItem::insert($items);

            return response()->json(['message' => 'Sticker book saved successfully'], 201);
        });
    }
}
