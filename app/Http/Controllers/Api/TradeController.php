<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\TradeRequest;
use App\Models\TradeRequestItem;
use App\Models\UserPrize;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class TradeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();
        $query = TradeRequest::with(['sender', 'receiver', 'items.userPrize.prize'])
            ->where(function ($q) use ($userId) {
                $q->where('sender_id', $userId)
                    ->orWhere('receiver_id', $userId);
            });

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $trades = $query->latest()->paginate(20);

        return response()->json($trades);
    }

    /**
     * Get the count of pending trades for the current user (received).
     */
    public function pendingCount()
    {
        $count = TradeRequest::where('receiver_id', Auth::id())
            ->where('status', TradeRequest::STATUS_PENDING)
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'nullable|exists:users,id|different:sender_id', // Allow null for future public trades
            'offered_user_prize_ids' => 'required|array|min:1',
            'offered_user_prize_ids.*' => 'exists:user_prizes,id',
            'requested_user_prize_ids' => 'sometimes|array',
            'requested_user_prize_ids.*' => 'exists:user_prizes,id',
            'message' => 'nullable|string|max:500',
        ]);

        $senderId = Auth::id();
        $receiverId = $request->receiver_id;

        // Verify ownership and availability of offered items
        // Check if any offered item is already in a pending trade
        $offeredLocked = TradeRequestItem::whereIn('user_prize_id', $request->offered_user_prize_ids)
            ->whereHas('tradeRequest', function ($q) {
                $q->where('status', TradeRequest::STATUS_PENDING);
            })->exists();

        if ($offeredLocked) {
            throw ValidationException::withMessages([
                'offered_user_prize_ids' => '一部のアイテムは既に他のトレード申請で使用されています。',
            ]);
        }

        // Verify that sender owns all offered items
        $ownedCount = UserPrize::where('user_id', $senderId)
            ->whereIn('id', $request->offered_user_prize_ids)
            ->count();

        if ($ownedCount !== count($request->offered_user_prize_ids)) {
            throw ValidationException::withMessages([
                'offered_user_prize_ids' => '所有していないアイテムが含まれています。',
            ]);
        }

        // If requested items are specified (Direct Trade), verify they belong to receiver
        if ($receiverId && !empty($request->requested_user_prize_ids)) {
            $receiverOwnedCount = UserPrize::where('user_id', $receiverId)
                ->whereIn('id', $request->requested_user_prize_ids)
                ->count();

            if ($receiverOwnedCount !== count($request->requested_user_prize_ids)) {
                throw ValidationException::withMessages([
                    'requested_user_prize_ids' => '相手が所有していないアイテムが含まれています。',
                ]);
            }

            // Also check if requested items are locked
            $requestedLocked = TradeRequestItem::whereIn('user_prize_id', $request->requested_user_prize_ids)
                ->whereHas('tradeRequest', function ($q) {
                    $q->where('status', TradeRequest::STATUS_PENDING);
                })->exists();

            if ($requestedLocked) {
                throw ValidationException::withMessages([
                    'requested_user_prize_ids' => '相手のアイテムの一部は既に他のトレード申請中です。',
                ]);
            }
        }

        $trade = DB::transaction(function () use ($request, $senderId, $receiverId) {
            $trade = TradeRequest::create([
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
                'status' => TradeRequest::STATUS_PENDING,
                'message' => $request->message,
            ]);

            // Add Offered Items
            foreach ($request->offered_user_prize_ids as $prizeId) {
                $trade->items()->create([
                    'user_prize_id' => $prizeId,
                    'owner_id' => $senderId,
                    'type' => TradeRequestItem::TYPE_OFFER,
                ]);
            }

            // Add Requested Items
            if (!empty($request->requested_user_prize_ids)) {
                foreach ($request->requested_user_prize_ids as $prizeId) {
                    $trade->items()->create([
                        'user_prize_id' => $prizeId,
                        'owner_id' => $receiverId, // Assuming they belong to receiver based on validation
                        'type' => TradeRequestItem::TYPE_REQUEST,
                    ]);
                }
            }

            return $trade;
        });

        return response()->json($trade->load('items'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $userId = Auth::id();
        $trade = TradeRequest::with(['sender', 'receiver', 'items.userPrize.prize', 'items.owner'])
            ->findOrFail($id);

        if ((string) $trade->sender_id !== (string) $userId && (string) $trade->receiver_id !== (string) $userId) {
            abort(403, 'Unauthorized');
        }

        return response()->json($trade);
    }

    /**
     * Accept the trade request.
     */
    public function accept($id)
    {
        $userId = Auth::id();
        $trade = TradeRequest::with('items')->findOrFail($id);

        if ((string) $trade->receiver_id !== (string) $userId) {
            abort(403, 'You are not the receiver of this trade.');
        }

        if ($trade->status !== TradeRequest::STATUS_PENDING) {
            abort(400, 'Trade is not pending.');
        }

        DB::transaction(function () use ($trade, $userId) {
            // 1. Verify all items are still owned by original owners
            foreach ($trade->items as $item) {
                $currentOwner = UserPrize::where('id', $item->user_prize_id)->value('user_id');
                if ($currentOwner !== $item->owner_id) {
                    throw new \Exception("Item ownership has changed. Trade cannot be completed.");
                }
            }

            // 2. Swap ownership
            foreach ($trade->items as $item) {
                $prize = UserPrize::find($item->user_prize_id);

                // Determine new owner
                if ($item->owner_id === $trade->sender_id) {
                    $newOwner = $trade->receiver_id;
                } else {
                    $newOwner = $trade->sender_id;
                }

                $prize->update(['user_id' => $newOwner]);
            }

            // 3. Update status
            $trade->update(['status' => TradeRequest::STATUS_COMPLETED]);

            // 4. Cancel other pending trades involving these items
            $itemIds = $trade->items->pluck('user_prize_id');
            $conflictingTrades = TradeRequest::where('status', TradeRequest::STATUS_PENDING)
                ->whereHas('items', function ($q) use ($itemIds) {
                    $q->whereIn('user_prize_id', $itemIds);
                })
                ->where('id', '!=', $trade->id)
                ->get();

            foreach ($conflictingTrades as $conflict) {
                $conflict->update(['status' => TradeRequest::STATUS_CANCELLED]);
            }
        });

        return response()->json(['message' => 'Trade completed successfully.']);
    }

    /**
     * Reject the trade request.
     */
    public function reject($id)
    {
        $userId = Auth::id();
        $trade = TradeRequest::findOrFail($id);

        if ((string) $trade->receiver_id !== (string) $userId) {
            abort(403, 'You are not the receiver.');
        }

        if ($trade->status !== TradeRequest::STATUS_PENDING) {
            abort(400, 'Trade is not pending.');
        }

        $trade->update(['status' => TradeRequest::STATUS_REJECTED]);

        return response()->json(['message' => 'Trade rejected.']);
    }

    /**
     * Cancel the trade request.
     */
    public function cancel($id)
    {
        $userId = Auth::id();
        $trade = TradeRequest::findOrFail($id);

        if ((string) $trade->sender_id !== (string) $userId) {
            abort(403, 'You are not the sender.');
        }

        if ($trade->status !== TradeRequest::STATUS_PENDING) {
            abort(400, 'Trade is not pending.');
        }

        $trade->update(['status' => TradeRequest::STATUS_CANCELLED]);

        return response()->json(['message' => 'Trade cancelled.']);
    }
}
