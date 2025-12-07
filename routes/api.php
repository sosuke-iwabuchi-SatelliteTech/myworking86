<?php

use App\Http\Controllers\GachaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserPrizeController;
use Illuminate\Support\Facades\Route;

Route::post('/user', [UserController::class, 'store']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/user/prizes', [UserPrizeController::class, 'store']);
    Route::get('/user/prizes', [UserPrizeController::class, 'index']);

    // Gacha Routes
    Route::get('/gacha/status', [GachaController::class, 'status']);
    Route::post('/gacha/pull', [GachaController::class, 'pull']);
});
