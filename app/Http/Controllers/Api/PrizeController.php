<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PrizeController extends Controller
{
    public function index()
    {
        $prizes = \App\Models\Prize::all();
        return \App\Http\Resources\PrizeResource::collection($prizes);
    }
}
