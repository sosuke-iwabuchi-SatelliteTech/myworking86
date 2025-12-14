<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class TradeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Trade/Index');
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Trade/Create', [
            'initialTargetId' => $request->query('target_id'),
        ]);
    }

    public function show(string $id): Response
    {
        return Inertia::render('Trade/Show', [
            'tradeId' => $id
        ]);
    }
}
