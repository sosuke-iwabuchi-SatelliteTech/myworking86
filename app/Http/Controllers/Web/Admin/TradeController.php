<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\TradeRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TradeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = TradeRequest::query()
            ->with(['sender', 'receiver']);

        // Filter by sender name
        if ($request->filled('sender_name')) {
            $query->whereHas('sender', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->sender_name . '%')
                    ->orWhere('id', 'like', '%' . $request->sender_name . '%'); // Optional: Search by ID too
            });
        }

        // Filter by date range (created_at)
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Sort
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');

        // Allow sorting by related fields if needed, but for now basic columns
        if (in_array($sort, ['created_at', 'status', 'id'])) {
            $query->orderBy($sort, $direction);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $trades = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Trades/Index', [
            'trades' => $trades,
            'filters' => $request->only(['sender_name', 'date_from', 'date_to', 'sort', 'direction']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
        $trade = TradeRequest::with([
            'sender',
            'receiver',
            'items.userPrize.prize' // Assuming relationships exist like this
        ])->findOrFail($id);

        return Inertia::render('Admin/Trades/Show', [
            'trade' => $trade,
        ]);
    }
}
